from django.shortcuts import render
from rest_framework import generics, status, filters
from rest_framework.response import Response
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser,FileUploadParser
from .models import DeactivationModels
from .serializers import DeactivateSerializers,DeactivatepostSerializers,DeactivateUpdatesSerializers
from django.http import JsonResponse,HttpResponse
from django.shortcuts import get_object_or_404
from django.utils import timezone
from datetime import timedelta,datetime
from django.db.models import Count
from rest_framework.pagination import PageNumberPagination
import logging
import pandas as pd
from Dealer.models import Dealersmodel
from rest_framework.exceptions import NotFound
from django.core.files.base import ContentFile
from account.utility import get_user_session_year
from account.utility import SessionYearMixin
logger = logging.getLogger(__name__)


class Paginations(PageNumberPagination):
    page_size = 25
    page_size_query_param = 'page_size'
    max_page_size = 1000

class GetDeactiveviewset(SessionYearMixin,generics.ListAPIView):
    queryset = DeactivationModels.objects.all().order_by('MILLER_NAME')
    serializer_class = DeactivateSerializers
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    search_fields = ['MILLER_TRANSPORTER_ID','MILLER_NAME','Device_Name','GPS_IMEI_NO','SIM_NO','NewRenewal','OTR','vehicle1','Employee_Name',]
    lookup_field = 'MILLER_TRANSPORTER_ID'
    pagination_class = Paginations

    def get_serializer_context(self):
        return {'request': self.request}

    def get_queryset(self):
        queryset = super().get_queryset().order_by('-id')
        start_date = self.request.query_params.get('start_date', None)
        end_date = self.request.query_params.get('end_date', None)
        
        if start_date and end_date:
            try:
                start_date = datetime.strptime(start_date, '%d-%m-%Y').date()
                end_date = datetime.strptime(end_date, '%d-%m-%Y').date()
                queryset = queryset.filter(DeactivationDate__range=(start_date, end_date))
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
            # Use filter instead of get
            miller_instances = super().get_queryset().filter(MILLER_TRANSPORTER_ID=MILLER_TRANSPORTER_ID)
            if miller_instances.exists():
                serializer = self.get_serializer(miller_instances, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Miller not found'}, status=status.HTTP_404_NOT_FOUND)

        # Fallback to the default queryset if MILLER_TRANSPORTER_ID is not provided
        queryset = self.get_queryset()

        #Logic for export without pagination
        if export == 'true':
            serializer=self.get_serializer(queryset,many=True)
            return Response(serializer.data,status=status.HTTP_200_OK)
        page=self.paginate_queryset(queryset)

        if page is not None:
            serializer=self.get_serializer(page,many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class Getdeactivurlviewset(generics.ListAPIView):
    queryset = DeactivationModels.objects.all().order_by('id')
    serializer_class = DeactivateSerializers
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
                deactivation = DeactivationModels.objects.get(id=id)
                serializer = DeactivateSerializers(deactivation, context={'request': request})  # Add request to context
                return Response(serializer.data, status=200)
            except DeactivationModels.DoesNotExist:
                raise NotFound(f'Data with id {id} does not exist')

        # Return all installations with pagination
        return super().get(request, *args, **kwargs) 







class postDeactivateviewset(generics.CreateAPIView):
    queryset = DeactivationModels.objects.all()
    serializer_class = DeactivatepostSerializers
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_serializer_context(self):
        return {'request': self.request}

    def post(self, request, *args, **kwargs):
        serializer = DeactivatepostSerializers(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DeleteDeactivateviewsets(generics.DestroyAPIView):
    queryset = DeactivationModels.objects.all().order_by('id')
    serializer_class = DeactivateSerializers
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
                instance = DeactivationModels.objects.get(id=id)
                instance.delete()
                return Response({'message': 'Record deleted successfully'}, status=status.HTTP_200_OK)
            except DeactivationModels.DoesNotExist:
                return Response({'error': 'Record does not exist'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'error': 'ID parameter is required'}, status=status.HTTP_400_BAD_REQUEST)

class updateDeactivateviewsets(generics.UpdateAPIView):
    queryset = DeactivationModels.objects.all().order_by('MILLER_NAME')
    serializer_class = DeactivateUpdatesSerializers
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser,JSONParser,FileUploadParser]
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

class UpdatedeactivateLetterHeadViewSets(SessionYearMixin,generics.UpdateAPIView):
    queryset = DeactivationModels.objects.all().order_by('MILLER_NAME')
    serializer_class = DeactivateSerializers
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser, JSONParser, FileUploadParser]
    lookup_field = 'id'

    def patch(self, request, *args, **kwargs):
        id = kwargs.get(self.lookup_field)
        if not id:
            return Response({'error': 'Transporter ID not provided'}, status=status.HTTP_400_BAD_REQUEST)

        deactivations = DeactivationModels.objects.filter(id=id)
        if not deactivations.exists():
            return Response({'error': 'Deactivation not found'}, status=status.HTTP_404_NOT_FOUND)

        if deactivations.count() > 1:
            # Update all installations with the same MILLER_TRANSPORTER_ID
            for deactivation in deactivations:
                serializer = self.get_serializer(deactivation, data=request.data, partial=True)
                if serializer.is_valid():  # Call is_valid() first
                    if 'Deactivation_letterHead' in request.data:
                        serializer.validated_data['Deactivation_letterHead'] = request.data['Deactivation_letterHead']
                        try:
                            serializer.save()
                        except Exception as e:
                            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            return Response({'message': 'All deactivation with MILLER_TRANSPORTER_ID updated successfully'}, status=status.HTTP_200_OK)
        deactivation = deactivations.first()
        # Only update the Installation_letterHead field
        serializer = self.get_serializer(deactivation, data=request.data, partial=True)
        if serializer.is_valid():  # Call is_valid() first
            if 'Deactivation_letterHead' in request.data:
                serializer.validated_data['Deactivation_letterHead'] = request.data['Deactivation_letterHead']
                try:
                    serializer.save()
                except Exception as e:
                    return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def get_file_url(request, id):
    installer = get_object_or_404(DeactivationModels, id=id)
    if installer.Deactivation_letterHead:
        file = installer.Deactivation_letterHead
        response = HttpResponse(file, content_type='application/octet-stream')
        response['Content-Disposition'] = f'attachment; filename="{file.name}"'
        return response
    else:
        return JsonResponse({'error': 'File not found'}, status=404)
class BaseCountView(SessionYearMixin, generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = DeactivateSerializers  # DRF ke liye zaroori
    queryset = DeactivationModels.objects.all()  # Base queryset

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        return Response({'count': queryset.count()}, status=status.HTTP_200_OK)

class DeactivationcountView(BaseCountView):
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()   #  SessionYearMixin filter apply karega
        count = queryset.count()
        return Response({'count': count}, status=status.HTTP_200_OK)


class NewDeactivateCountView(BaseCountView):

    def list(self,request,*args, **kwargs):
        new_count = self.get_queryset().filter(NewRenewal__iexact='New').count()
        return Response({'count':new_count},status=status.HTTP_200_OK)
    
class RenewalDeactivationCountView(BaseCountView):
    
    def list(self,request,*args,**kwargs):
        renewal_count = self.get_queryset().filter(NewRenewal__iexact='Renewal').count()
        return Response({'count':renewal_count},status=status.HTTP_200_OK)
    

class TodaydeactivateCountview(BaseCountView):
    
    def list(self,request,*args,**kwargs):
        today=timezone.now().date()
        tomorrow = today + timedelta(days=1)
        new_count = self.get_queryset().filter(
            DeactivationDate__gte=today, 
            DeactivationDate__lt=tomorrow
            ).count()
                     
        return Response({'count':new_count},status=status.HTTP_200_OK)

class TodayNewDeactivationCountView(BaseCountView):
    
    def list(self,request,*args,**kwargs):
        today=timezone.now().date()
        tomorrow=today + timedelta(days=1)
        new_count=self.get_queryset().filter(
                               DeactivationDate__gte=today,
                               DeactivationDate__lt=tomorrow,
                               NewRenewal__iexact='New'
                            ).count()
        return Response({'count':new_count},status=status.HTTP_200_OK)


class TodayRenewalDeactivationCountView(BaseCountView):

    def list(self,request,*args,**kwargs):
        today=timezone.now().date()
        tomorrow=today + timedelta(days=1)

        renewal_count=self.get_queryset().filter(
            DeactivationDate__gte=today,
            DeactivationDate__lt=tomorrow,
            NewRenewal__iexact='Renewal').count()
        return Response({'count':renewal_count},status=status.HTTP_200_OK)

class YesterdayDeactivateCountViews(BaseCountView):

    def list(self,request,*args,**kwargs):
        today=timezone.now().date()
        yesterday= today - timedelta(days=1)
        yesterday_count=self.get_queryset().filter(DeactivationDate=yesterday).count()
        return Response({'count':yesterday_count},status=status.HTTP_200_OK)

class YesterdayNewDeactivationContViews(BaseCountView):
    
    def list(self,request,*args,**kwargs):
        today=timezone.now().date()
        yesterday=today - timedelta(days=1)

        new_count=self.get_queryset().filter(
            DeactivationDate=yesterday,
            NewRenewal__iexact='New'
        ).count()
        return Response({'count':new_count},status=status.HTTP_200_OK)

class YesterdayRenewalDeactivationCountViews(BaseCountView):
 
   def list(self, request, *args, **kwargs):
            today=timezone.now().date()
            yesterday=today - timedelta(days=1)

            renewal_count=self.get_queryset().filter(
                DeactivationDate=yesterday,
                NewRenewal__iexact='Renewal').count()
            return Response({'count':renewal_count},status=status.HTTP_200_OK)

class BulkImportView(generics.ListCreateAPIView):
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [AllowAny]

    def post(self, request):
        excel_file = request.FILES.get("file")
        letterhead_file = request.FILES.get("letterhead")

        if not excel_file or not letterhead_file:
            return Response({"error": "Excel file and letterhead are required."}, status=400)

        # Validate file type
        if not excel_file.name.endswith(('.xlsx', '.xls', '.csv')):
            return Response({"error": "Invalid file type. Upload an Excel or CSV file."}, status=400)

        # Read the Excel or CSV
        try:
            if excel_file.name.endswith(".csv"):
                df = pd.read_csv(excel_file)
            else:
                df = pd.read_excel(excel_file)
        except Exception as e:
            return Response({"error": f"Error reading file: {str(e)}"}, status=400)

        # Required columns
        required_columns = [
            'MILLER_TRANSPORTER_ID', 'MILLER_NAME', 'district', 'MillerContactNo',
            'Dealer_Name', 'Entity_id', 'GPS_IMEI_NO', 'SIM_NO', 'Device_Name',
            'NewRenewal', 'OTR', 'vehicle1', 'vehicle2', 'vehicle3',
            'DeactivationDate', 'Employee_Name', 'Device_Fault', 'Fault_Reason',
            'Replace_DeviceIMEI_NO', 'Remark1', 'Remark2', 'Remark3'
        ]

        if not all(col in df.columns for col in required_columns):
            missing_cols = list(set(required_columns) - set(df.columns))
            return Response({"error": f"Missing columns: {missing_cols}"}, status=400)

        df = df.fillna("")
        session_year = get_user_session_year(request.user)
        if not session_year:
            return Response({"error": "Session year not found for this user."}, status=400)
        # Process each row
        entries=[]
        for _, row in df.iterrows():
            try:
                deactivation_date_str = str(row["DeactivationDate"]).strip().replace("“", "").replace("”", "")
                try:
                    deactivation_date = datetime.strptime(deactivation_date_str, "%d-%m-%Y").date()
                except ValueError:
                    try:
                        deactivation_date = datetime.strptime(deactivation_date_str, "%Y-%m-%d").date()
                    except ValueError:
                        return Response({"error": f"Error processing row: InstallationDate '{deactivation_date_str}' is not in a recognized format (expected DD-MM-YYYY or YYYY-MM-DD)."}, status=400)

                # if not DeactivationModels.objects.filter(MILLER_TRANSPORTER_ID=row['MILLER_TRANSPORTER_ID']).exists():
                    entry = DeactivationModels(
                        MILLER_TRANSPORTER_ID=row['MILLER_TRANSPORTER_ID'],
                        MILLER_NAME=row['MILLER_NAME'],
                        district=row['district'],
                        MillerContactNo=row['MillerContactNo'],
                        Dealer_Name=row['Dealer_Name'],
                        Entity_id=row['Entity_id'],
                        GPS_IMEI_NO=row['GPS_IMEI_NO'],
                        SIM_NO=row['SIM_NO'],                                      
                        Device_Name=row['Device_Name'],
                        NewRenewal=row['NewRenewal'],
                        OTR=row['OTR'],
                        vehicle1=row['vehicle1'],
                        vehicle2=row['vehicle2'],
                        vehicle3=row['vehicle3'],
                        DeactivationDate=deactivation_date,
                        Employee_Name=row['Employee_Name'],
                        Device_Fault=row['Device_Fault'],
                        Fault_Reason=row['Fault_Reason'],
                        Replace_DeviceIMEI_NO=row['Replace_DeviceIMEI_NO'],
                        Remark1=row['Remark1'],
                        Remark2=row['Remark2'],
                        Remark3=row['Remark3'],
                        session_year=session_year  # Set session_year if needed
                    )
                    entry.save()

                    # Reset letterhead pointer and save the file to entry
                    letterhead_file.open()
                    entry.Deactivation_letterHead.save(letterhead_file.name, ContentFile(letterhead_file.read()))
                   
            
            except Exception as e:
                return Response({"error": f"Error processing row with ID {row.get('MILLER_TRANSPORTER_ID', '')}: {str(e)}"}, status=400)
        # Bulk create all entries
        DeactivationModels.objects.bulk_create(entries)
        return Response({"message": "Bulk upload successful."}, status=201)



