from django.shortcuts import render
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
# Create your views here.
from rest_framework import filters
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Dealersmodel
from rest_framework.pagination import PageNumberPagination
from .serializers import DealerSerializers
from rest_framework.exceptions import NotFound
from rest_framework.parsers import MultiPartParser,FileUploadParser,FormParser
import pandas as pd
from rest_framework.views import APIView

class Paginations(PageNumberPagination):
    page_size = 25
    page_size_query_param = 'page_size'
    max_page_size = 1000


class Getdealersviewset(generics.ListAPIView):
    queryset = Dealersmodel.objects.all().order_by('id')
    serializer_class = DealerSerializers
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter]
    search_fields = ['Dealer_Name']
    pagination_class= Paginations
    lookup_field = 'id'
    
    def get(self, request, *args, **kwargs):
        id = kwargs.get('id', None)
        
        if id:
            try:
                Id = Dealersmodel.objects.get(id=id)
                serializer = DealerSerializers(Id)
                return Response(serializer.data, status=200)
            except Dealersmodel.DoesNotExist:
                raise NotFound(f'Dealermodel with id {id} does not exist')
        
        result = Dealersmodel.objects.all().order_by('id')
        serializer = DealerSerializers(result, many=True)
        return Response(serializer.data, status=200)
class GetDealerViewset(generics.ListAPIView):
    queryset=Dealersmodel.objects.all().order_by('Dealer_Name')
    serializer_class=DealerSerializers
    permission_classes=[AllowAny]
    filter_backends=[filters.SearchFilter]
    search_fields=['Dealer_Name']

class PostDealer(generics.CreateAPIView):
    queryset=Dealersmodel.objects.all().order_by('Dealer_Name')
    serializer_class=DealerSerializers
    permission_classes=[AllowAny]
    filter_backends=[filters.SearchFilter]
    search_field=['Dealer_Name']

class deleteDealer(generics.DestroyAPIView,generics.ListAPIView):
    queryset=Dealersmodel.objects.all().order_by('Dealer_Name')
    serializer_class=DealerSerializers
    permission_classes=[AllowAny]
    filter_backends=[filters.SearchFilter]
    search_field=['Dealer_Name']

    def destroy(self,request,*args,**kwargs):
        id=kwargs.get('id',None)
        if id:
          try:
                id = Dealersmodel.objects.get(id=id)
                id.delete()
                return Response({'message': 'Name deleted successfully'}, status=status.HTTP_200_OK)
          except Dealersmodel.DoesNotExist:
                return Response({'error': 'Name not found'}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({'error': 'Name parameter is required'}, status=status.HTTP_400_BAD_REQUEST)  


class updatedealerviews(generics.UpdateAPIView,generics.ListAPIView):
    #Get and update the contact...
    queryset = Dealersmodel.objects.all().order_by('Dealer_Name')
    serializer_class = DealerSerializers
    permission_classes=[AllowAny]
    filter_backends = [filters.SearchFilter] #for search Through Name 
    search_fields = ['Dealer_Name']
    lookup_field = 'id'  # Specify the field to use for lookup






class BulkImportDealersView(APIView):
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
            df = df[['Dealer_Name', 'contactno1', 'contactno2', 'companyName', 'Remark']]

            # Validate DataFrame columns
            expected_columns = ['Dealer_Name', 'contactno1', 'contactno2', 'companyName', 'Remark']
            if not all(col in df.columns for col in expected_columns):
                return Response({'error': f'Missing one or more required columns: {expected_columns}'}, status=status.HTTP_400_BAD_REQUEST)

            # Replace NaN values with empty strings
            df = df.fillna('')

            # Iterate through the DataFrame and create model instances
            entries = []
            for _, row in df.iterrows():
                entry = Dealersmodel(
                    Dealer_Name=row['Dealer_Name'],
                    contactno1=row['contactno1'],
                    contactno2=row['contactno2'],
                    companyName=row['companyName'],
                    Remark=row['Remark']
                )
                entries.append(entry)

            # Bulk create entries
            Dealersmodel.objects.bulk_create(entries)

            return Response({'message': 'File processed successfully'}, status=status.HTTP_201_CREATED)
        
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
