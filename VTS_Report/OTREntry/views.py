from django.shortcuts import render

# Create your views here.

from rest_framework import generics
from rest_framework.response import Response
from rest_framework import filters
from rest_framework import status
from rest_framework.permissions import IsAuthenticated,AllowAny
from Installation.models import InstallatonModels 
from Installation.serializers import  InstallSerializers
from rest_framework.exceptions import NotFound
import pandas as pd
from tablib import Dataset
from import_export.formats.base_formats import XLSX,CSV
from rest_framework.parsers import MultiPartParser,FormParser,JSONParser
from rest_framework.pagination import PageNumberPagination
# Create your views here.
from django.db.models import Q
from .models import OTRData
from .serializers import otrdataserializes,OtrgetSerializers
from datetime import timedelta,datetime
import logging

logger = logging.getLogger(__name__)
class Paginations(PageNumberPagination):
    page_size=10
    page_query_param='page_size'
    max_page_size =100


        


class GetOtrviewset(generics.ListAPIView):
    queryset = OTRData.objects.all().order_by('MILLER_NAME')
    serializer_class =  OtrgetSerializers
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    search_fields = ['MILLER_TRANSPORTER_ID']
    lookup_field = 'id'
    pagination_class=Paginations
    def get_serializer_context(self):
        return {'request': self.request}

    def get_queryset(self):
        queryset = OTRData.objects.all().order_by('-id')
        start_date = self.request.query_params.get('start_date', None)
        end_date = self.request.query_params.get('end_date', None)
        
        if start_date and end_date:
            try:
                start_date = datetime.strptime(start_date, '%d-%m-%Y').date() + timedelta(days=0)
                end_date = datetime.strptime(end_date, '%d-%m-%Y').date() + timedelta(days=0)
                logger.debug(f"Filtering from {start_date} to {end_date}")
                queryset = queryset.filter(InstallationDate__range=(start_date, end_date))
            except ValueError as e:
                logger.error(f"Date parsing error: {e}")
                pass  # Handle the error as needed

        return queryset
    def get(self, request, *args, **kwargs):
        GPS_IMEI_NO = kwargs.get('GPS_IMEI_NO', None)
        if GPS_IMEI_NO:
            try:
                GPS_IMEI_NO = OTRData.objects.get(GPS_IMEI_NO=GPS_IMEI_NO)
                serializer = self.get_serializer(GPS_IMEI_NO)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except OTRData.DoesNotExist:
                return Response({'error': 'Miller not found'}, status=status.HTTP_404_NOT_FOUND)

        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
class GetOTRGPSIMEINOviewset(generics.ListAPIView):
    queryset = OTRData.objects.all().order_by('MILLER_TRANSPORTER_ID')
    serializer_class = OtrgetSerializers
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter]
    search_fields = ['MILLER_NAME']
    lookup_field = 'id'
    pagination_class = Paginations
    
    def get(self, request, *args, **kwargs):
        id = kwargs.get('id', None)
        
        if id:
            try:
                instance = OTRData.objects.get(id=id)
                serializer = OtrgetSerializers(instance, context={'request': request})
                return Response(serializer.data, status=200)
            except OTRData.DoesNotExist:
                raise NotFound(f'InstallationModel with GPS_IMEI_NO {id} does not exist')
        
        # If no specific GPS_IMEI_NO is provided, use the default queryset
        queryset = self.get_queryset()
        serializer = OtrgetSerializers(queryset, many=True)
        return Response(serializer.data, status=200)
    
class postOtrviewset(generics.CreateAPIView):
    queryset = OTRData.objects.all()
    serializer_class = otrdataserializes
    permission_classes = [AllowAny]
    
    def post(self, request, *args, **kwargs):
        serializer = otrdataserializes(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DeleteOTRviewsets(generics.DestroyAPIView):
    queryset = OTRData.objects.all().order_by('id')
    serializer_class = OtrgetSerializers
    permission_classes = [AllowAny]
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
                instance = OTRData.objects.get(id=id)
                instance.delete()
                return Response({'message': 'Record deleted successfully'}, status=status.HTTP_200_OK)
            except OTRData.DoesNotExist:
                return Response({'error': 'Record does not exist'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'error': 'ID parameter is required'}, status=status.HTTP_400_BAD_REQUEST)

class updateOTRviewsets(generics.UpdateAPIView):
    queryset = OTRData.objects.all().order_by('MILLER_NAME')
    serializer_class = otrdataserializes
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser, JSONParser,]
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

class GetGPSIMEINOviewset(generics.ListAPIView):
    queryset = InstallatonModels.objects.all().order_by('MILLER_TRANSPORTER_ID')
    serializer_class = InstallSerializers
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter]
    search_fields = ['MILLER_NAME']
    lookup_field = 'GPS_IMEI_NO'
    pagination_class = Paginations
    
    def get(self, request, *args, **kwargs):
        GPS_IMEI_NO = kwargs.get('GPS_IMEI_NO', None)
        
        if GPS_IMEI_NO:
            try:
                instance = InstallatonModels.objects.get(GPS_IMEI_NO=GPS_IMEI_NO)
                serializer = InstallSerializers(instance, context={'request': request})
                return Response(serializer.data, status=200)
            except InstallatonModels.DoesNotExist:
                raise NotFound(f'InstallationModel with GPS_IMEI_NO {GPS_IMEI_NO} does not exist')
        
        # If no specific GPS_IMEI_NO is provided, use the default queryset
        queryset = self.get_queryset()
        serializer = InstallSerializers(queryset, many=True)
        return Response(serializer.data, status=200)

class getOTRdata(generics.ListAPIView):
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        queryset = InstallatonModels.objects.all().order_by('-id')
        start_date = request.query_params.get('start_date', None)
        end_date = request.query_params.get('end_date', None)

        if start_date and end_date:
            try:
                start_date = datetime.strptime(start_date, '%d-%m-%Y').date()
                end_date = datetime.strptime(end_date, '%d-%m-%Y').date()
                queryset = queryset.filter(InstallationDate__range=(start_date, end_date))
            except ValueError as e:
                logger.error(f"Date parsing error: {e}")

        # Filter for non-empty OTR and format InstallationDate
        otr_data = queryset.filter(~Q(OTR='')).values()

        # Format InstallationDate to dd-mm-yyyy
        formatted_data = []
        for item in otr_data:
            if item.get('InstallationDate'):
                item['InstallationDate'] = item['InstallationDate'].strftime('%d-%m-%Y')
            formatted_data.append(item)

        return Response(formatted_data, status=200)    


