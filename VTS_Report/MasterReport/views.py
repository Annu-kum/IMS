from django.shortcuts import render
from Installation.models import InstallatonModels
from Deactivation.models import DeactivationModels
from Reactivation.models import ReactivationModels 
from rest_framework import generics
from rest_framework import status,filters
from rest_framework.permissions import AllowAny,IsAuthenticated
from django.db.models import Subquery, OuterRef
from rest_framework.response import Response
from rest_framework import status
from Installation.serializers import InstallSerializers
from Reactivation.serializers import ReactivateSerializers
from django.db.models import Q
from datetime import datetime
from rest_framework.pagination import PageNumberPagination
from account.utility import SessionYearMixin
from account.utility import get_user_session_year
# Create your views here.

class Paginations(PageNumberPagination):
    page_size =25
    page_size_query_param = 'page_size'
    max_page_size = 1000


class MasterReport(generics.ListCreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = InstallSerializers
    pagination_class = Paginations
    filter_backends = [filters.SearchFilter]
    search_fields = [
        'MILLER_TRANSPORTER_ID', 'MILLER_NAME', 'Device_Name',
        'GPS_IMEI_NO', 'SIM_NO', 'NewRenewal', 'OTR',
        'vehicle1', 'Employee_Name',
    ]

    def format_date(self, date_obj):
        return date_obj.strftime('%d-%m-%Y') if date_obj else None

    def get_queryset(self):
        # 🔹 Step 1: Get session year for logged-in user
        session_year = get_user_session_year(self.request.user)
        if not session_year:
            return InstallatonModels.objects.none()

        # 🔹 Step 2: Apply session year filter to all models
        installations = InstallatonModels.objects.filter(session_year=session_year)
        deactivations = DeactivationModels.objects.filter(session_year=session_year).values_list('GPS_IMEI_NO', flat=True)
        reactivations = ReactivationModels.objects.filter(session_year=session_year).values_list('GPS_IMEI_NO', flat=True)

        # 🔹 Step 3: Exclude deactivations & include reactivations
        installations = installations.exclude(GPS_IMEI_NO__in=deactivations)
        reactivated_installations = InstallatonModels.objects.filter(
            GPS_IMEI_NO__in=reactivations, session_year=session_year
        )

        # 🔹 Step 4: Combine both
        final_queryset = installations | reactivated_installations

        # 🔹 Step 5: Apply date filter if present
        start_date_str = self.request.query_params.get('start_date')
        end_date_str = self.request.query_params.get('end_date')

        if start_date_str and end_date_str:
            try:
                start_date = datetime.strptime(start_date_str, '%d-%m-%Y').date()
                end_date = datetime.strptime(end_date_str, '%d-%m-%Y').date()
                final_queryset = final_queryset.filter(InstallationDate__range=(start_date, end_date))
            except ValueError:
                raise ValueError('Invalid date format. Use DD-MM-YYYY.')

        # 🔹 Step 6: Apply search filters
        for backend in list(self.filter_backends):
            final_queryset = backend().filter_queryset(self.request, final_queryset, self)

        return final_queryset.order_by('-InstallationDate')

    def list(self, request, *args, **kwargs):
        export = request.query_params.get('export', None)
        queryset = self.get_queryset()

        if export == 'true':
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.serializer_class(queryset, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)
