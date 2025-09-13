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
# Create your views here.

class Paginations(PageNumberPagination):
    page_size =25
    page_size_query_param = 'page_size'
    max_page_size = 1000


class MasterReport(generics.ListCreateAPIView):
   permission_classes = [AllowAny]
   serializer_class = InstallSerializers  # Replace with your serializer class
   pagination_class = Paginations
   filter_backends = [filters.SearchFilter]
   search_fields = ['MILLER_TRANSPORTER_ID','MILLER_NAME','Device_Name','GPS_IMEI_NO','SIM_NO','NewRenewal','OTR','vehicle1','Employee_Name',]

   def format_date(self, date_obj):
        return date_obj.strftime('%d-%m-%Y') if date_obj else None

   def get_queryset(self):
        # Step 1: Fetch all elements from InstallationModels
        installations = InstallatonModels.objects.all()

        # Step 2: Exclude elements that are present in DeactivationModels
        deactivations = DeactivationModels.objects.values_list('GPS_IMEI_NO', flat=True)
        installations = installations.exclude(GPS_IMEI_NO__in=deactivations)

        # Step 3: Ensure elements that are in ReactivationModels are included
        reactivations = ReactivationModels.objects.values_list('GPS_IMEI_NO', flat=True)
        reactivated_installations = InstallatonModels.objects.filter(GPS_IMEI_NO__in=reactivations)

        # Step 4: Combine the query sets
        final_queryset = installations | reactivated_installations

        # Step 5: Filter by date range if provided in the query parameters
        start_date_str = self.request.query_params.get('start_date')
        end_date_str = self.request.query_params.get('end_date')

        if start_date_str and end_date_str:
            try:
                start_date = datetime.strptime(start_date_str, '%d-%m-%Y').date()
                end_date = datetime.strptime(end_date_str, '%d-%m-%Y').date()
                final_queryset = final_queryset.filter(InstallationDate__range=(start_date, end_date))
            except ValueError:
                raise ValueError('Invalid date format. Use YYYY-MM-DD.')
        for backend in list(self.filter_backends):
            final_queryset = backend().filter_queryset(self.request, final_queryset, self)
        final_queryset = final_queryset.order_by('-InstallationDate')  # Add this line
        return final_queryset

   def list(self, request, *args, **kwargs):
        export = request.query_params.get('export', None)
        queryset = self.get_queryset()

        #Logic for export
        if export == 'true':
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        page = self.paginate_queryset(queryset)

        if page is not None:
          serializer = self.get_serializer(page, many=True)
          return self.get_paginated_response(serializer.data)
        serializer = self.serializer_class(queryset, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)
   




