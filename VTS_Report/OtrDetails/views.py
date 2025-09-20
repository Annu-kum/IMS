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
    permission_classes = [AllowAny]
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


class NewOTRCountView(SessionYearMixin,generics.ListAPIView):
    permission_classes=[AllowAny]
    queryset = InstallatonModels.objects.all()  # Base queryset required
    def list(self, request, *args,**kwargs):
        # Count Renewal entries with OTR in InstallationModels
        installation_new_count = super().get_queryset().filter(
            Q(NewRenewal='New') & ~Q(OTR='')
        ).count()

        # Count Renewal entries with OTR in DeactivationModels
        deactivation_new_count = DeactivationModels.objects.filter(
           ( Q(NewRenewal='New') & ~Q(OTR='')),
            session_year__in=super().get_queryset().values_list("session_year", flat=True)
        ).count()

        # Count Renewal entries with OTR in ReactivationModels
        reactivation_new_count = ReactivationModels.objects.filter(
            (Q(NewRenewal='New') & ~Q(OTR='')),
            session_year__in=super().get_queryset().values_list("session_year", flat=True)
        ).count()

        # Total count from all models
        total_new_count = installation_new_count + deactivation_new_count + reactivation_new_count
        return Response({'count':total_new_count},status=status.HTTP_200_OK)


class RenewalOTRCountView(SessionYearMixin,generics.ListAPIView):
        permission_classes=[AllowAny]
        queryset = InstallatonModels.objects.all()  # Base queryset required
        def list(self, request, *args,**kwargs):
            # Count Renewal entries with OTR in InstallationModels
            installation_renewal_count = super().get_queryset().filter(
                Q(NewRenewal='Renewal') & ~Q(OTR='')
            ).count()

            # Count Renewal entries with OTR in DeactivationModels
            deactivation_renewal_count = DeactivationModels.objects.filter(
                (Q(NewRenewal='Renewal') & ~Q(OTR='')),
            session_year__in=super().get_queryset().values_list("session_year", flat=True)
            ).count()

            # Count Renewal entries with OTR in ReactivationModels
            reactivation_renewal_count = ReactivationModels.objects.filter(
                (Q(NewRenewal='Renewal') & ~Q(OTR='')),
            session_year__in=super().get_queryset().values_list("session_year", flat=True)
            ).count()

            # Total count from all models
            total_renewal_count = installation_renewal_count + deactivation_renewal_count + reactivation_renewal_count
            return Response({'count':total_renewal_count},status=status.HTTP_200_OK)


class TodayOTRCountView(SessionYearMixin,generics.ListAPIView):
   permission_classes = [AllowAny]
   queryset = InstallatonModels.objects.all()  # Base queryset required

   def list(self, request, *args, **kwargs):
        today = timezone.now().date()

        installation_otr_count = super().get_queryset().filter(Q(InstallationDate=today)  & ~Q(OTR='')).count()
        deactivation_otr_count = DeactivationModels.objects.filter((Q(DeactivationDate=today) &  ~Q(OTR='')),
            session_year__in=super().get_queryset().values_list("session_year", flat=True)).count()
        reactivation_otr_count = ReactivationModels.objects.filter((Q(ReactivationDate=today) &  ~Q(OTR='')),
            session_year__in=super().get_queryset().values_list("session_year", flat=True)).count()

        today_otr_count = installation_otr_count + deactivation_otr_count + reactivation_otr_count
        return Response({'count':today_otr_count},status=status.HTTP_200_OK)

class TodayNewOTRCountView(SessionYearMixin,generics.ListAPIView):
   permission_classes = [AllowAny]
   queryset = InstallatonModels.objects.all()  # Base queryset required

   def list(self, request, *args, **kwargs):
        today = timezone.now().date()

        installation_otr_count = super().get_queryset().filter(Q(InstallationDate=today) & Q(NewRenewal='New') & ~Q(OTR='')).count()
        deactivation_otr_count = DeactivationModels.objects.filter((Q(DeactivationDate=today) & Q(NewRenewal='New') & ~Q(OTR='')),
            session_year__in=super().get_queryset().values_list("session_year", flat=True)).count()
        reactivation_otr_count = ReactivationModels.objects.filter((Q(ReactivationDate=today) & Q(NewRenewal='New') & ~Q(OTR='')),
            session_year__in=super().get_queryset().values_list("session_year", flat=True)).count()

        today_otr_count = installation_otr_count + deactivation_otr_count + reactivation_otr_count
        return Response({'count':today_otr_count},status=status.HTTP_200_OK)
class TodayRenewalOTRCountView(SessionYearMixin,generics.ListAPIView):
    permission_classes=[AllowAny]
    queryset = InstallatonModels.objects.all()  # Base queryset required
    def list(self,request, *args, **kwargs):
        today = timezone.now().date()

        installation_otr_count = super().get_queryset().filter(Q(InstallationDate=today) & Q(NewRenewal='Renewal') & ~Q(OTR='')).count()
        deactivation_otr_count = DeactivationModels.objects.filter((Q(DeactivationDate=today) & Q(NewRenewal='Renewal') & ~Q(OTR='')),
            session_year__in=super().get_queryset().values_list("session_year", flat=True)).count()
        reactivation_otr_count = ReactivationModels.objects.filter((Q(ReactivationDate=today) & Q(NewRenewal='Renewal') & ~Q(OTR='')),
            session_year__in=super().get_queryset().values_list("session_year", flat=True)).count()

        today_otr_count = installation_otr_count + deactivation_otr_count + reactivation_otr_count
        return Response({'count':today_otr_count},status=status.HTTP_200_OK)
    

class YesterdayOTRCountView(SessionYearMixin,generics.ListAPIView):
    permission_classes=[AllowAny]
    queryset = InstallatonModels.objects.all()  # Base queryset required
    def list(self,request, *args, **kwargs):
        current_date = date.today()
        yesterday= current_date - timedelta(days=1)

        installation_otr_count = super().get_queryset().filter(Q(InstallationDate=yesterday) &  ~Q(OTR='')).count()
        deactivation_otr_count = DeactivationModels.objects.filter((Q(DeactivationDate=yesterday) & ~Q(OTR='')),
            session_year__in=super().get_queryset().values_list("session_year", flat=True)).count()
        reactivation_otr_count = ReactivationModels.objects.filter((Q(ReactivationDate=yesterday) & ~Q(OTR='')),
            session_year__in=super().get_queryset().values_list("session_year", flat=True)).count()

        today_otr_count = installation_otr_count + deactivation_otr_count + reactivation_otr_count
        return Response({'count':today_otr_count},status=status.HTTP_200_OK)





class YesterdayNewOTRCountView(SessionYearMixin,generics.ListAPIView):
   permission_classes = [AllowAny]
   queryset = InstallatonModels.objects.all()  # Base queryset required

   def list(self, request, *args, **kwargs):
        today = timezone.now().date()
        yesterday= today - timedelta(days=1)
        installation_otr_count = super().get_queryset().filter(Q(InstallationDate=yesterday) & Q(NewRenewal='New') & ~Q(OTR='')).count()
        deactivation_otr_count = DeactivationModels.objects.filter((Q(DeactivationDate=yesterday) & Q(NewRenewal='New') & ~Q(OTR='')),
            session_year__in=super().get_queryset().values_list("session_year", flat=True)).count()
        reactivation_otr_count = ReactivationModels.objects.filter((Q(ReactivationDate=yesterday) & Q(NewRenewal='New') & ~Q(OTR='')),
            session_year__in=super().get_queryset().values_list("session_year", flat=True)).count()

        today_otr_count = installation_otr_count + deactivation_otr_count + reactivation_otr_count
        return Response({'count':today_otr_count},status=status.HTTP_200_OK)



class YesterdayRenewalOTRCountView(SessionYearMixin,generics.ListAPIView):
    permission_classes=[AllowAny]
    queryset = InstallatonModels.objects.all()  # Base queryset required
    def list(self,request, *args, **kwargs):
        today = timezone.now().date()
        yesterday= today - timedelta(days=1)
        installation_otr_count = super().get_queryset().filter(Q(InstallationDate=yesterday) & Q(NewRenewal='Renewal') & ~Q(OTR='')).count()
        deactivation_otr_count = DeactivationModels.objects.filter((Q(DeactivationDate=yesterday) & Q(NewRenewal='Renewal') & ~Q(OTR='')),
            session_year__in=super().get_queryset().values_list("session_year", flat=True)).count()
        reactivation_otr_count = ReactivationModels.objects.filter((Q(ReactivationDate=yesterday) & Q(NewRenewal='Renewal') & ~Q(OTR='')),
            session_year__in=super().get_queryset().values_list("session_year", flat=True)).count()

        today_otr_count = installation_otr_count + deactivation_otr_count + reactivation_otr_count
        return Response({'count':today_otr_count},status=status.HTTP_200_OK)
    



class DealerReport(SessionYearMixin, generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    queryset = InstallatonModels.objects.all()   # ✅ Base queryset needed for SessionYearMixin

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



class FetchDealerData(SessionYearMixin, generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    pagination_class = Paginations

    def get(self, request, dealer_name, *args, **kwargs):
        session_year = get_user_session_year(request.user)

        installation_data = InstallatonModels.objects.filter(
            Dealer_Name__Dealer_Name=dealer_name
        )
        deactivation_data = DeactivationModels.objects.filter(
            Dealer_Name=dealer_name
        )
        reactivation_data = ReactivationModels.objects.filter(
            Dealer_Name=dealer_name
        )

        #  Apply session filter if available
        if session_year:
            installation_data = installation_data.filter(session_year=session_year)
            deactivation_data = deactivation_data.filter(session_year=session_year)
            reactivation_data = reactivation_data.filter(session_year=session_year)

        context = {
            'dealer_name': dealer_name,
            'installation_data': installation_data.values(),
            'deactivation_data': deactivation_data.values(),
            'reactivation_data': reactivation_data.values(),
        }

        return Response(context)

