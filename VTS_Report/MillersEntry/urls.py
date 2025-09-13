from django.urls import path, re_path as url
from rest_framework import routers
from . import views
router = routers.DefaultRouter
urlpatterns = [
    # path(r'^getmillers/$', views.GetMillersviewset, name='getmiller') ,     
    path('getmillers/<str:MILLER_TRANSPORTER_ID>/',views.GetMillersviewset.as_view(),name='getmiller'),
    path('getmillerss/',views.GetAllMillersviewsets.as_view(),name='getmiller_all_value'),
    path('postmiller/',views.postMillersviewset.as_view(),name='postmiller'),
    path('deletemiller/<str:MILLER_TRANSPORTER_ID>/',views.DeleteMillersviewsets.as_view(),name='deletemillers'),
    path('updatemillers/<str:MILLER_TRANSPORTER_ID>/',views.updateMillerviewsets.as_view(),name='updatemillers'),
    path('import/', views.BulkImportView.as_view(), name='import_millers'),
    path('updatedistrict/', views.UpdateDistrictView.as_view(), name='update_district'),

]

























# from import_export import resources
# from .models import MillersEntrymodel

# class MillersEntrymodelResource(resources.ModelResource):
#     class Meta:
#         model = MillersEntrymodel
#         import_id_fields = ['MILLER_TRANSPORTER_ID']
#         fields = ('MILLER_TRANSPORTER_ID', 'MILLER_NAME', 'MA_Code', 'district')
# ```

# ### Step 2: Create a Form for File Upload
# Create a `forms.py` file for the file upload form.

# ```python
# from django import forms

# class ImportFileForm(forms.Form):
#     file = forms.FileField()
# ```

# ### Step 3: Update `views.py` to Handle File Upload and Data Import

# Update your `views.py` to include a view for handling the file upload and import process.

# ```python
# from django.shortcuts import render
# from rest_framework import generics, status
# from rest_framework.response import Response
# from rest_framework.permissions import AllowAny
# from rest_framework.parsers import MultiPartParser, FormParser
# from .models import MillersEntrymodel
# from .serializers import MillerEntrySerializers
# from .resources import MillersEntrymodelResource
# from .forms import ImportFileForm
# from tablib import Dataset
# from import_export.formats.base_formats import XLSX, CSV

# class GetMillersviewset(generics.ListAPIView):
#     queryset = MillersEntrymodel.objects.all().order_by('MILLER_TRANSPORTER_ID')
#     serializer_class = MillerEntrySerializers
#     permission_classes = [AllowAny]
#     filter_backends = [filters.SearchFilter]
#     search_fields = ['MILLER_NAME']
#     lookup_field = 'MILLER_TRANSPORTER_ID'
    
#     def get(self, request, *args, **kwargs):
#         MILLER_TRANSPORTER_ID = kwargs.get('MILLER_TRANSPORTER_ID', None)
        
#         if MILLER_TRANSPORTER_ID:
#             try:
#                 MILLERID = MillersEntrymodel.objects.get(MILLER_TRANSPORTER_ID=MILLER_TRANSPORTER_ID)
#                 serializer = MillerEntrySerializers(MILLERID)
#                 return Response(serializer.data, status=200)
#             except MillersEntrymodel.DoesNotExist:
#                 raise NotFound(f'MillersEntrymodel with MILLER_TRANSPORTER_ID {MILLER_TRANSPORTER_ID} does not exist')
        
#         result = MillersEntrymodel.objects.all().order_by('MILLER_TRANSPORTER_ID')
#         serializer = MillerEntrySerializers(result, many=True)
#         return Response(serializer.data, status=200)

# class GetAllMillersviewsets(generics.ListAPIView):
#     queryset = MillersEntrymodel.objects.all().order_by('MILLER_NAME')
#     serializer_class = MillerEntrySerializers
#     permission_classes = [AllowAny]
#     filter_backends = [filters.SearchFilter]
#     search_fields = ['MILLER_NAME']

# class postMillersviewset(generics.CreateAPIView):
#     queryset = MillersEntrymodel.objects.all().order_by('MILLER_NAME')
#     serializer_class = MillerEntrySerializers
#     permission_classes = [AllowAny]
#     filter_backends = [filters.SearchFilter]
#     search_fields = ['MILLER_NAME']

# class DeleteMillersviewsets(generics.DestroyAPIView):
#     queryset = MillersEntrymodel.objects.all().order_by('MILLER_NAME')
#     serializer_class = MillerEntrySerializers
#     permission_classes = [AllowAny]
#     filter_backends = [filters.SearchFilter]
#     search_fields = ['MILLER_NAME']
#     lookup_field = 'MILLER_NAME'
    
#     def destroy(self, request, *args, **kwargs):
#         MILLER_NAME = kwargs.get('MILLER_NAME', None)
#         if MILLER_NAME:
#             try:
#                 MILLERNAME = MillersEntrymodel.objects.get(MILLER_NAME=MILLER_NAME)
#                 MILLERNAME.delete()
#                 return Response({'message': 'Name deleted successfully'}, status=status.HTTP_200_OK)
#             except MillersEntrymodel.DoesNotExist:
#                 return Response({'error': 'Name does not exist'}, status=status.HTTP_404_NOT_FOUND)
#         else:
#             return Response({'error': 'Name parameter is required'}, status=status.HTTP_400_BAD_REQUEST) 
        
# class updateMillerviewsets(generics.UpdateAPIView):
#     queryset = MillersEntrymodel.objects.all().order_by('MILLER_NAME')
#     serializer_class = MillerEntrySerializers
#     permission_classes = [AllowAny]
#     filter_backends = [filters.SearchFilter]
#     search_fields = ['MILLER_NAME']
#     lookup_field = 'MILLER_TRANSPORTER_ID'

# class ImportMillersView(generics.GenericAPIView):
#     parser_classes = [MultiPartParser, FormParser]
#     permission_classes = [AllowAny]

#     def post(self, request, *args, **kwargs):
#         import_file_form = ImportFileForm(request.POST, request.FILES)
#         if import_file_form.is_valid():
#             input_format = request.data.get('format', 'xlsx')
#             file = request.FILES['file']
#             dataset = Dataset()
#             if input_format == 'xlsx':
#                 imported_data = dataset.load(file.read(), format='xlsx')
#             else:
#                 imported_data = dataset.load(file.read(), format='csv')

#             resource = MillersEntrymodelResource()
#             result = resource.import_data(dataset, dry_run=True)  # Check data import
#             if not result.has_errors():
#                 resource.import_data(dataset, dry_run=False)  # Actually import now
#                 return Response({'status': 'success'}, status=status.HTTP_201_CREATED)
#             else:
#                 return Response({'status': 'error', 'errors': result.row_errors()}, status=status.HTTP_400_BAD_REQUEST)
#         return Response({'status': 'error', 'errors': import_file_form.errors}, status=status.HTTP_400_BAD_REQUEST)
# ```

# ### Step 4: Update `urls.py`

# Add a URL pattern for the file upload view in your `urls.py`.

# ```python
# from django.urls import path
# from .views import GetMillersviewset, GetAllMillersviewsets, postMillersviewset, DeleteMillersviewsets, updateMillerviewsets, ImportMillersView

# urlpatterns = [
#     path('millers/', GetMillersviewset.as_view(), name='get_millers'),
#     path('millers/all/', GetAllMillersviewsets.as_view(), name='get_all_millers'),
#     path('millers/create/', postMillersviewset.as_view(), name='create_millers'),
#     path('millers/delete/<str:MILLER_NAME>/', DeleteMillersviewsets.as_view(), name='delete_millers'),
#     path('millers/update/<str:MILLER_TRANSPORTER_ID>/', updateMillerviewsets.as_view(), name='update_millers'),
#     path('millers/import/', ImportMillersView.as_view(), name='import_millers'),
# ]
# ```

# ### Step 5: Test the Implementation

# You can now test the bulk import functionality by sending a POST request to `/millers/import/` with a CSV or Excel file. The file should contain the columns matching your `MillersEntrymodel` fields.

# This setup allows you to handle file uploads and import data into your Django models, leveraging the django-import-export library for smooth and efficient data handling.



















