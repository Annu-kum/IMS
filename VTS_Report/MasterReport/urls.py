from django.urls import path, re_path as url
from rest_framework import routers
from . import views

router=routers.DefaultRouter
urlpatterns = [
    url(r'^mastereport/$',views.MasterReport.as_view(),name='masterreports'),
    # path('reactivationReport/',views.ReactivationReport.as_view(),name='reactivationReport'),
]
