from django.shortcuts import render
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import filters
from rest_framework import status
from rest_framework.permissions import IsAuthenticated,AllowAny
from .models import MillersEntrymodel
from .serializers import MillerEntrySerializers
from rest_framework.exceptions import NotFound
import pandas as pd
from tablib import Dataset
from import_export.formats.base_formats import XLSX,CSV
from .forms import ImportFileForm
from .resources import MillersEntrymodelResource
from rest_framework.parsers import MultiPartParser,FormParser
from rest_framework.pagination import PageNumberPagination
from account.utility import SessionYearMixin
from account.utility import get_user_session_year
# Create your views here.


class Paginations(PageNumberPagination):
    page_size=25
    page_size_query_param='page_size'
    max_page_size =1000

class GetMillersviewset(SessionYearMixin, generics.ListAPIView):
    queryset = MillersEntrymodel.objects.all().order_by('MILLER_TRANSPORTER_ID')
    serializer_class = MillerEntrySerializers
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['MILLER_NAME']
    lookup_field = 'MILLER_TRANSPORTER_ID'
    pagination_class = Paginations

    def get(self, request, *args, **kwargs):
        MILLER_TRANSPORTER_ID = kwargs.get('MILLER_TRANSPORTER_ID', None)

        if MILLER_TRANSPORTER_ID:
            #  Use session filtered queryset
            instance = self.get_queryset().filter(MILLER_TRANSPORTER_ID=MILLER_TRANSPORTER_ID).first()
            if instance:
                serializer = MillerEntrySerializers(instance)
                return Response(serializer.data, status=200)
            raise NotFound(f'MillersEntrymodel with MILLER_TRANSPORTER_ID {MILLER_TRANSPORTER_ID} does not exist')

        # Also use session filtered queryset here
        queryset = self.get_queryset().order_by('MILLER_TRANSPORTER_ID')
        serializer = MillerEntrySerializers(queryset, many=True)
        return Response(serializer.data, status=200)

class GetAllMillersviewsets(SessionYearMixin,generics.ListAPIView):
    queryset=MillersEntrymodel.objects.all().order_by('MILLER_NAME')
    serializer_class=MillerEntrySerializers
    permission_classes=[IsAuthenticated]
    filter_backends=[filters.SearchFilter]
    search_fields=['MILLER_NAME']
    pagination_class=Paginations
class postMillersviewset(SessionYearMixin,generics.CreateAPIView):
    queryset=MillersEntrymodel.objects.all().order_by('MILLER_NAME')
    serializer_class=MillerEntrySerializers
    permission_classes=[IsAuthenticated]
    filter_backends=[filters.SearchFilter]
    search_fields=['MILLER_NAME']

    def get_queryset(self):
        # SessionYearMixin will apply session_year filter here
        return super().get_queryset().order_by('MILLER_NAME')
      
class DeleteMillersviewsets(generics.DestroyAPIView):
    queryset=MillersEntrymodel.objects.all().order_by('MILLER_NAME')
    serializer_class=MillerEntrySerializers
    permission_classes=[IsAuthenticated]
    filter_backends=[filters.SearchFilter]
    search_fields=['MILLER_NAME']
    lookup_field='MILLER_TRANSPORTER_ID'
    
    def destory(self,request,*args,**kwargs):
        MILLER_TRANSPORTER_ID=kwargs.get('MILLER_TRANSPORTER_ID',None)
        if MILLER_TRANSPORTER_ID:
         try:
                MILLER_TRANSPORTER_ID = MillersEntrymodel.objects.get(MILLER_TRANSPORTER_ID=MILLER_TRANSPORTER_ID)
                MILLER_TRANSPORTER_ID.delete()
                return Response({'message':'Name deleted successfully'},status=status.HTTP_200_OK)
         except MillersEntrymodel.DoesNotExist:
              return Response({'error':'Name does not exist'},status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({'error':'Name parameter is required'},status=status.HTTP_400_BAD_REQUEST) 
        

    
    
        
class updateMillerviewsets(generics.UpdateAPIView):
    queryset=MillersEntrymodel.objects.all().order_by('MILLER_NAME')
    serializer_class=MillerEntrySerializers
    permission_classes=[IsAuthenticated]
    filter_backends=[filters.SearchFilter]
    search_fields=['MILLER_NAME']
    lookup_field='MILLER_TRANSPORTER_ID'


class BulkImportView(generics.ListCreateAPIView):
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        file = request.FILES.get('file')
        if not file:
            return Response({'error': 'No file uploaded'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check the file extension
        if not (file.name.endswith('.xlsx') or file.name.endswith('.xls') or file.name.endswith('.csv')):
            return Response({'error': 'Unsupported file type. Please upload an Excel or CSV file.'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Read the file into a DataFrame
            if file.name.endswith('.csv'):
                df = pd.read_csv(file)
            else:
                df = pd.read_excel(file)

            # Filter only the relevant columns
            df = df[['MILLER_TRANSPORTER_ID', 'MILLER_NAME', 'ContactNo', 'district']]

            # Validate DataFrame columns
            expected_columns = ['MILLER_TRANSPORTER_ID', 'MILLER_NAME', 'ContactNo', 'district']
            if not all(col in df.columns for col in expected_columns):
                return Response({'error': f'Missing one or more required columns: {expected_columns}'}, status=status.HTTP_400_BAD_REQUEST)



            # Replace NaN  values with empty string
            df = df.fillna('')
            session_year = get_user_session_year(request.user)
            if not session_year:
             return Response({"error": "Session year not found for this user."}, status=400)
            # Iterate through the DataFrame and create model instances
            entries = []
            for _, row in df.iterrows():
                entry = MillersEntrymodel(
                    MILLER_TRANSPORTER_ID=row['MILLER_TRANSPORTER_ID'],
                    MILLER_NAME=row['MILLER_NAME'],
                    ContactNo=row['ContactNo'],
                    district=row['district'],
                    session_year=session_year
                )
                entries.append(entry)

            # Bulk create entries
            MillersEntrymodel.objects.bulk_create(entries)

            return Response({'message': 'File processed successfully'}, status=status.HTTP_201_CREATED)
        
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UpdateDistrictView(generics.ListCreateAPIView):
    def put(self, request, *args, **kwargs):
        old_district = request.data.get('old_district', 'strength')
        new_district = request.data.get('new_district', 'SAKTI')
# Perform the update operation
        updated_count = MillersEntrymodel.objects.filter(district=old_district).update(district=new_district)
        if updated_count > 0:
            return Response(
                {"message": f"{updated_count} records updated successfully."},
                status=status.HTTP_200_OK
            )
        else:
            return Response(
                {"message": "No records found to update."},
                status=status.HTTP_404_NOT_FOUND
            )
