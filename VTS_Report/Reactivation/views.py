from django.shortcuts import render
from rest_framework import generics, status, filters
from rest_framework.response import Response
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser,FileUploadParser
from .models import ReactivationModels
from .serializers import ReactivatepostSerializers,ReactivateSerializers,ReactivateUpdateSerializers
from django.http import JsonResponse,HttpResponse
from django.shortcuts import get_object_or_404
from datetime import timedelta,datetime
from django.utils import timezone
from rest_framework.pagination import PageNumberPagination
from Dealer.models import Dealersmodel
import pandas as pd 
from rest_framework.exceptions import NotFound
from account.utility import get_user_session_year,SessionYearMixin
from django.core.files.base import ContentFile

class Paginations(PageNumberPagination):
    page_size = 25
    page_size_query_param = 'page_size'
    max_page_size = 1000



import logging

logger = logging.getLogger(__name__)

class GetReactivateviewset(SessionYearMixin,generics.ListAPIView):
    queryset = ReactivationModels.objects.all().order_by('MILLER_NAME')
    serializer_class = ReactivateSerializers
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    search_fields = ['MILLER_TRANSPORTER_ID','MILLER_NAME','Device_Name','GPS_IMEI_NO','SIM_NO','NewRenewal','OTR','vehicle1','Employee_Name',]
    pagination_class = Paginations
    lookup_field = 'MILLER_TRANSPORTER_ID'

    def get_serializer_context(self):
        return {'request': self.request}

    def get_queryset(self):
        queryset = super().get_queryset().order_by('-id')
        start_date = self.request.query_params.get('start_date', None)
        end_date = self.request.query_params.get('end_date', None)
        
        if start_date and end_date:
            try:
                start_date = datetime.strptime(start_date, '%d-%m-%Y').date() + timedelta(days=0)
                end_date = datetime.strptime(end_date, '%d-%m-%Y').date() + timedelta(days=0)
                logger.debug(f"Filtering from {start_date} to {end_date}")
                queryset = queryset.filter(ReactivationDate__range=(start_date, end_date))
            except ValueError as e:
                logger.error(f"Date parsing error: {e}")
                pass  # Handle the error as needed
        for backend in list(self.filter_backends):
            queryset = backend().filter_queryset(self.request, queryset, self)

        return queryset

    def get(self, request, *args, **kwargs):
        export=request.query_params.get('export',None)
        MILLER_TRANSPORTER_ID = kwargs.get('MILLER_TRANSPORTER_ID', None)
        if MILLER_TRANSPORTER_ID:
            
                miller_instance = super().get_queryset().filter(MILLER_TRANSPORTER_ID=MILLER_TRANSPORTER_ID)
                if miller_instance.exists():
                  serializer = self.get_serializer(miller_instance,many=True)
                  return Response(serializer.data, status=status.HTTP_200_OK)
                else:
                  return Response({'error': 'Miller not found'}, status=status.HTTP_404_NOT_FOUND)

        queryset = self.get_queryset()
        #Logic for export
        if export=='true':
            serializer=self.get_serializer(queryset,many=True)
            return Response(serializer.data,status=status.HTTP_200_OK)

        page = self.paginate_queryset(queryset)

        if page is not None:
          serializer = self.get_serializer(page, many=True)
          return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class GetReactiveurlviewset(generics.ListAPIView):
    queryset = ReactivationModels.objects.all().order_by('id')
    serializer_class = ReactivateSerializers
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    search_fields = ['id']
    pagination_class = Paginations
    lookup_field = 'id'

    def get(self, request, *args, **kwargs):
        id = kwargs.get('id', None)
        
        # If 'id' is specified in the URL, retrieve a single instance
        if id:
            try:
                installation = ReactivationModels.objects.get(id=id)
                serializer = ReactivateSerializers(installation, context={'request': request})  # Add request to context
                return Response(serializer.data, status=200)
            except ReactivationModels.DoesNotExist:
                raise NotFound(f'Data with id {id} does not exist')

        # Return all installations with pagination
        return super().get(request, *args, **kwargs) 


class postReactivateviewset(generics.CreateAPIView):
    queryset = ReactivationModels.objects.all()
    serializer_class = ReactivatepostSerializers
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_serializer_context(self):
        return {'request': self.request}

    def post(self, request, *args, **kwargs):
        serializer = ReactivatepostSerializers(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DeleteReactivateviewsets(generics.DestroyAPIView):
    queryset = ReactivationModels.objects.all().order_by('id')
    serializer_class = ReactivateSerializers
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser,JSONParser ]
    filter_backends = [filters.SearchFilter]
    search_fields = ['MILLER_NAME', 'MILLER_TRANSPORTER_ID']
    lookup_field = 'id'

    def get_serializer_context(self):
        return {'request': self.request}

    def destroy(self, request, *args, **kwargs):
        id = kwargs.get('id', None)
        if id:
            try:
                instance = ReactivationModels.objects.get(id=id)
                instance.delete()
                return Response({'message': 'Record deleted successfully'}, status=status.HTTP_200_OK)
            except ReactivationModels.DoesNotExist:
                return Response({'error': 'Record does not exist'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'error': 'ID parameter is required'}, status=status.HTTP_400_BAD_REQUEST)

class updateReactivateviewsets(generics.UpdateAPIView):
    queryset = ReactivationModels.objects.all().order_by('MILLER_NAME')
    serializer_class = ReactivateUpdateSerializers
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser,FileUploadParser]
    filter_backends = [filters.SearchFilter]
    search_fields = ['MILLER_NAME']
    lookup_field = 'id'

    def post_serializer_context(self):
        return {'request': self.request}
    

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, *args, **kwargs):
        return self.update(request, *args, partial=True)

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, partial=False)

class UpdatereactivateLetterHeadViewSets(generics.UpdateAPIView):
    queryset = ReactivationModels.objects.all().order_by('MILLER_NAME')
    serializer_class = ReactivateSerializers
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser, JSONParser, FileUploadParser]
    lookup_field = 'id'

    def patch(self, request, *args, **kwargs):
        id = kwargs.get(self.lookup_field)
        if not id:
            return Response({'error': 'Transporter ID not provided'}, status=status.HTTP_400_BAD_REQUEST)

        reactivations = ReactivationModels.objects.filter(id=id)
        if not reactivations.exists():
            return Response({'error': 'Reactivation not found'}, status=status.HTTP_404_NOT_FOUND)

        if reactivations.count() > 1:
         
            for reactivation in reactivations:
                serializer = self.get_serializer(reactivation, data=request.data, partial=True)
                if serializer.is_valid():  
                    if 'Reactivation_letterHead' in request.data:
                        serializer.validated_data['Reactivation_letterHead'] = request.data['Reactivation_letterHead']
                        try:
                            serializer.save()
                        except Exception as e:
                            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            return Response({'message': 'All reactivation with MILLER_TRANSPORTER_ID updated successfully'}, status=status.HTTP_200_OK)
        reactivation = reactivations.first()
        # Only update the Installation_letterHead field
        serializer = self.get_serializer(reactivation, data=request.data, partial=True)
        if serializer.is_valid():  # Call is_valid() first
            if 'Reactivation_letterHead' in request.data:
                serializer.validated_data['Reactivation_letterHead'] = request.data['Reactivation_letterHead']
                try:
                    serializer.save()
                except Exception as e:
                    return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def get_file_url(request, id):
    installer = get_object_or_404(ReactivationModels, id=id)
    if installer.Reactivation_letterHead:
        file = installer.Reactivation_letterHead
        response = HttpResponse(file, content_type='application/octet-stream')
        response['Content-Disposition'] = f'attachment; filename="{file.name}"'
        return response
    else:
        return JsonResponse({'error': 'File not found'}, status=404)

class BaseCountView(SessionYearMixin, generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = ReactivateSerializers  # Specify a serializer if needed 
    queryset = ReactivationModels.objects.all()  # Base queryset

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        return Response({'count': queryset.count()}, status=status.HTTP_200_OK)


class ReactivationCountView(BaseCountView):
    
    def list(self, request, *args, **kwargs):
        count = self.get_queryset().count()
        return Response({'count': count}, status=status.HTTP_200_OK)


class NewReactiveCountView(BaseCountView):
    
        def list(self, request, *args, **kwargs):
            new_count = self.get_queryset().filter(NewRenewal__iexact='New').count()
            return Response({'count': new_count}, status=status.HTTP_200_OK)
    
class RenewalReactivationCountView(BaseCountView):
    
    def list(self, request, *args, **kwargs):
        new_count = self.get_queryset().filter(NewRenewal__iexact='Renewal').count()
        return Response({'count': new_count}, status=status.HTTP_200_OK)



class TodayReactiveCountView(BaseCountView):
    
    def list(self, request, *args, **kwargs):
        today = timezone.now().date()
        tomorrow = today + timedelta(days=1)
        new_count = self.get_queryset().filter(
            ReactivationDate__gte=today,
            ReactivationDate__lt=tomorrow,
            ).count()
        return Response({'count': new_count}, status=status.HTTP_200_OK)



class TodayNewInstallCountView(BaseCountView):

    def list(self, request, *args, **kwargs):
        today = timezone.now().date()
        tomorrow = today + timedelta(days=1)
        new_count = self.get_queryset().filter(
            ReactivationDate__gte=today,
            ReactivationDate__lt=tomorrow,
            NewRenewal__iexact='New'
        ).count()
        return Response({'count': new_count}, status=status.HTTP_200_OK)
    

class TodayRenewalReactiveCountView(BaseCountView):
    
    def list(self, request, *args, **kwargs):
        today = timezone.now().date()
        tomorrow = today + timedelta(days=1)
        new_count = self.get_queryset().filter(
            ReactivationDate__gte=today,
            ReactivationDate__lt=tomorrow,
            NewRenewal__iexact='Renewal'
        ).count()
        return Response({'count': new_count}, status=status.HTTP_200_OK)

class YesterdayReactiveCountView(BaseCountView):
       def list(self, request, *args, **kwargs):
        today = timezone.now().date()
        yesterday = today - timedelta(days=1)
        yesterday_count = self.get_queryset().filter(ReactivationDate=yesterday).count()
        return Response({'count': yesterday_count}, status=status.HTTP_200_OK)



class YesterdayNewReactivateCountView(BaseCountView):
    
    def list(self, request, *args, **kwargs):
        today = timezone.now().date()
        yesterday = today - timedelta(days=1)
        new_count = self.get_queryset().filter(
            ReactivationDate=yesterday,
            NewRenewal__iexact='New'
        ).count()
        return Response({'count': new_count}, status=status.HTTP_200_OK)

class YesterdayRenewalReactivationCountView(BaseCountView):
    
    def list(self, request, *args, **kwargs):

        today=timezone.now().date()
        yesterday = today - timedelta(days=1)
        renewal_count = self.get_queryset().filter(
            ReactivationDate=yesterday,
            NewRenewal__iexact='Renewal'
        ).count()
        return Response({'count':renewal_count},status=status.HTTP_200_OK)


class BulkImportView(generics.ListCreateAPIView):
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        excel_file = request.FILES.get("file")
        letterhead_file = request.FILES.get("letterhead")

        if not excel_file or not letterhead_file:
            return Response({"error": "Excel file and letterhead are required."}, status=400)

        # Validate file type
        if not excel_file.name.endswith(('.xlsx', '.xls', '.csv')):
            return Response({"error": "Invalid file type. Upload an Excel or CSV file."}, status=400)
        
        try:
            # Read the file into a DataFrame
            if excel_file.name.endswith('.csv'):
                df = pd.read_csv(excel_file)
            else:
                df = pd.read_excel(excel_file)
        except Exception as e:
            return Response({"error": f"Error reading file: {str(e)}"}, status=400)
            # Filter only the relevant columns
        required_columns = ['MILLER_TRANSPORTER_ID','MILLER_NAME','district','MillerContactNo','Dealer_Name','Entity_id','GPS_IMEI_NO',
                  'SIM_NO','Device_Name','NewRenewal','OTR','vehicle1','vehicle2','vehicle3',
                'ReactivationDate','Employee_Name',
                  'Device_Fault','Fault_Reason','Replace_DeviceIMEI_NO','Remark1','Remark2','Remark3']

           
        if not all(col in df.columns for col in required_columns):
                missing_cols = list(set(required_columns)-set(df.columns))
                return Response({'error': f'Missing columns: {missing_cols}'}, status=status.HTTP_400_BAD_REQUEST)


            # Replace NaN values with empty string
        df = df.fillna('')
        session_year = get_user_session_year(request.user)
        if not session_year:
            return Response({"error": "Session year not found for this user."}, status=400)
            # Prepare a list to collect the new entries
        entries = []

            # Iterate through the DataFrame and create model instances
        for _, row in df.iterrows():
               try:
                    reactivation_date_str = str(row["ReactivationDate"]).strip().replace("“", "").replace("”", "")
                    try:
                        reactivation_date = datetime.strptime(reactivation_date_str, "%d-%m-%Y").date()
                    except ValueError:
                        try:
                            reactivation_date = datetime.strptime(reactivation_date_str, "%Y-%m-%d").date()
                        except ValueError:
                            return Response({"error": f"Error processing row: InstallationDate '{reactivation_date_str}' is not in a recognized format (expected DD-MM-YYYY or YYYY-MM-DD)."}, status=400)
                    entry = ReactivationModels(
                        MILLER_TRANSPORTER_ID=row['MILLER_TRANSPORTER_ID'],
                        MILLER_NAME=row['MILLER_NAME'],
                        district=row['district'],
                        MillerContactNo=row['MillerContactNo'],
                        Dealer_Name = row['Dealer_Name'],
                        Entity_id = row['Entity_id'],
                        GPS_IMEI_NO= row['GPS_IMEI_NO'],
                        SIM_NO = row['SIM_NO'],
                        Device_Name=row['Device_Name'],
                        NewRenewal=row['NewRenewal'],
                        OTR = row['OTR'],
                        vehicle1=row['vehicle1'],
                        vehicle2=row['vehicle2'],
                        vehicle3=row['vehicle3'],
                        ReactivationDate = reactivation_date,
                        Employee_Name= row['Employee_Name'],
                        Device_Fault=row['Device_Fault'],
                        Fault_Reason=row['Fault_Reason'],
                        Replace_DeviceIMEI_NO=row['Replace_DeviceIMEI_NO'],
                        Remark1=row['Remark1'],
                        Remark2=row['Remark2'],
                        Remark3=row['Remark3'],
                        session_year=session_year, 
                    )
                    entry.save()
                    letterhead_file.open()
                    entry.Reactivation_letterHead.save(letterhead_file.name, ContentFile(letterhead_file.read()))
               except Exception as e:
                    return Response({"error": f"Error processing row with ID {row.get('MILLER_TRANSPORTER_ID', '')}: {str(e)}"}, status=400)

            # Bulk create entries
        ReactivationModels.objects.bulk_create(entries)

        return Response({'message': 'File processed successfully'}, status=status.HTTP_201_CREATED)
