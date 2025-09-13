from django.urls import path, re_path as url
from . import views
from rest_framework import routers

router = routers.DefaultRouter()
urlpatterns = [
     path('getdealer/',views.GetDealerViewset.as_view(),name='getdealer'),
     path('Dealersbyid/<int:id>',views.Getdealersviewset.as_view(),name='dealerid'),
     path('postdealer/',views.PostDealer.as_view(),name='postdealer'),
     path('dealerdelete/<int:id>',views.deleteDealer.as_view(),name='deletedealer'),
     path('dealerupdate/<int:id>/',views.updatedealerviews.as_view(),name='updatedealer'),
     path('bulkupload',views.BulkImportDealersView.as_view(),name='bulkupload'),
]
