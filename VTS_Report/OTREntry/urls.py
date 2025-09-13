from django.urls import path
from rest_framework import routers
from .import views
routers=routers.DefaultRouter()
urlpatterns = [
  path('gpsno/<str:GPS_IMEI_NO>',views.GetGPSIMEINOviewset.as_view(),name='gpsno'),
  path('getotrdata',views.getOTRdata.as_view(),name='getotr'),
  path('postotrdata',views.postOtrviewset.as_view(),name='postotr'),
  path('getallotr',views.GetOtrviewset.as_view(),name='getallotrs'),
  path('deletebyid/<int:id>',views.DeleteOTRviewsets.as_view(),name='deletebyid'),
  path('updatebyid/<int:id>',views.updateOTRviewsets.as_view(),name='update'),
  path('getbygpsno/<int:id>',views.GetOTRGPSIMEINOviewset.as_view(),name='getbygps'),
  path('getOTRinstall',views.getOTRdata.as_view(),name='otrinstallationdata'),
]
