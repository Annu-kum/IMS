from django.shortcuts import render
from Installation.models import InstallatonModels
from Deactivation.models import DeactivationModels
from Reactivation.models import ReactivationModels 
from rest_framework import generics
from rest_framework import status
from django.db.models import Sum
from datetime import date
from rest_framework.response import Response
from django.db.models import Count, Q
from rest_framework.permissions import AllowAny,IsAuthenticated
from django.utils import timezone
from datetime import timedelta,datetime
from Dealer.models import Dealersmodel
from Dealer.serializers import DealerSerializers
from rest_framework.pagination import PageNumberPagination
from account.utility import SessionYearMixin
from account.utility import get_user_session_year
# Create your views here.

class Paginations(PageNumberPagination):
    page_size = 10
    page_query_param = 'page_size'
    max_page_size = 100


class OtrDetailsviews(SessionYearMixin, generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    queryset = InstallatonModels.objects.all()  # Base queryset required

    def list(self, request, *args, **kwargs):
        # Apply session-year filter using SessionYearMixin
        installation_count = super().get_queryset().filter(~Q(OTR='')).count()
        deactivation_count = DeactivationModels.objects.filter(
            ~Q(OTR=''),
            session_year__in=super().get_queryset().values_list("session_year", flat=True)
        ).count()
        reactivation_count = ReactivationModels.objects.filter(
            ~Q(OTR=''),
            session_year__in=super().get_queryset().values_list("session_year", flat=True)
        ).count()

        total_count = installation_count + deactivation_count + reactivation_count
        return Response({'count': total_count}, status=status.HTTP_200_OK)

# count dealer wise report
class DealerReport(SessionYearMixin, generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    queryset = InstallatonModels.objects.all()   # Base queryset needed for SessionYearMixin

    def get(self, request, *args, **kwargs):
        # Start with session-year filtered queryset
        queryset = self.get_queryset()

        # Retrieve date filters from query parameters
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')

        if start_date:
            start_date = datetime.strptime(start_date, '%d-%m-%Y').date()
            queryset = queryset.filter(InstallationDate__gte=start_date)
        if end_date:
            end_date = datetime.strptime(end_date, '%d-%m-%Y').date()
            queryset = queryset.filter(InstallationDate__lte=end_date)

        # Group by Dealer and aggregate counts
        installation_counts = queryset.values('Dealer_Name__Dealer_Name').annotate(
            total_installations=Count('id'),
            total_new_installations=Count('id', filter=Q(NewRenewal='New')),
            total_renewal_installations=Count('id', filter=Q(NewRenewal='Renewal')),
            total_otr_installations=Count('id', filter=~Q(OTR='')),  # OTR not empty
        )

        # Combine results into dict
        result = {}
        for item in installation_counts:
            dealer = item['Dealer_Name__Dealer_Name']
            result[dealer] = {
                'total_count': item['total_installations'],
                'total_new': item['total_new_installations'],
                'total_renewal': item['total_renewal_installations'],
                'total_otr': item['total_otr_installations'],
            }

        return Response(result, status=status.HTTP_200_OK)


    
# Geting total sum of enteries by dealer
class GetSumofEnteries(SessionYearMixin,generics.ListAPIView):

    permission_classes = [IsAuthenticated]
    queryset = InstallatonModels.objects.all()   #  Base queryset needed for SessionYearMixin

    def get(self, request, *args, **kwargs):
        # Aggregating counts for Installations
        installation_counts = super().get_queryset().values('Dealer_Name__Dealer_Name').annotate(
            total_installations=Count('id'),
            total_new_installations=Count('id', filter=Q(NewRenewal='New')),
            total_renewal_installations=Count('id', filter=Q(NewRenewal='Renewal')),
            total_otr_installations=Count('id', filter=Q(OTR='OTR')),
        )     
        result = {}
        overall_totals = {
            'total_count': 0,
            'total_new': 0,
            'total_renewal': 0,
            'total_otr': 0
        }

        # Add installation counts to result
        for item in installation_counts:
            dealer = item['Dealer_Name__Dealer_Name']
            if dealer not in result:
                result[dealer] = {
                    'total_count': item['total_installations'],
                    'total_new': item['total_new_installations'],
                    'total_renewal': item['total_renewal_installations'],
                    'total_otr': item['total_otr_installations'],
                }
            else:
                result[dealer]['total_count'] += item['total_installations']
                result[dealer]['total_new'] += item['total_new_installations']
                result[dealer]['total_renewal'] += item['total_renewal_installations']
                result[dealer]['total_otr'] += item['total_otr_installations']
            
            overall_totals['total_count'] += item['total_installations']
            overall_totals['total_new'] += item['total_new_installations']
            overall_totals['total_renewal'] += item['total_renewal_installations']
            overall_totals['total_otr'] += item['total_otr_installations']

   
        # Include overall totals in the result
        result['overall_totals'] = overall_totals

        return Response(result)


# Fetch dealer wise data after hovering on dealer name
class FetchDealerData(SessionYearMixin, generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    queryset = InstallatonModels.objects.all()

    def get(self, request, *args, **kwargs):
        dealer = request.query_params.get("dealer")
        type_filter = request.query_params.get("type", "all")
        start_date = request.query_params.get("start_date")
        end_date = request.query_params.get("end_date")

        # Start with session-year filtered queryset
        qs = self.get_queryset()

        # Filter by dealer
        qs = qs.filter(Dealer_Name__Dealer_Name=dealer)

        # Apply DATE FILTERS (Fix!)
        if start_date:
            start_date = datetime.strptime(start_date, "%d-%m-%Y").date()
            qs = qs.filter(InstallationDate__gte=start_date)

        if end_date:
            end_date = datetime.strptime(end_date, "%d-%m-%Y").date()
            qs = qs.filter(InstallationDate__lte=end_date)

        # Type-based filtering
        if type_filter == "new":
            qs = qs.filter(NewRenewal="New")

        elif type_filter == "renewal":
            qs = qs.filter(NewRenewal="Renewal")

        elif type_filter == "otr":
            qs = qs.exclude(OTR="")

        return Response(list(qs.values()), status=200)
