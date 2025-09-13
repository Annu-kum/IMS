from django.shortcuts import render
from rest_framework import generics
from .models import LogModel
from .serializers import LogSerializers
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated

class Paginations(PageNumberPagination):
    page_size = 10
    page_query_param = 'page_size'
    max_page_size = 2
class LogViewSet(generics.ListAPIView):
    queryset = LogModel.objects.all()
    serializer_class = LogSerializers
    permission_classes = [IsAuthenticated]
    pagination_class = Paginations