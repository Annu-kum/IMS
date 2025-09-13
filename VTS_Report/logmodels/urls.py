from django.urls import path, re_path as url
from rest_framework import routers
from . import views
router = routers.DefaultRouter
urlpatterns = [
    path('Commonlogfile/', views.LogViewSet.as_view(), name='commonlogfiles'),
]