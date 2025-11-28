from django.urls import path
from rest_framework import routers
from .import views
routers=routers.DefaultRouter()
urlpatterns = [
    path('total-otr',views.OtrDetailsviews.as_view(),name='total-otr'),
    path('dealerReport/',views.DealerReport.as_view(),name='dealerReport'),
    path('getSum/',views.GetSumofEnteries.as_view(),name='getsumofEntries'),
    path('FetchDealerdata/<str:dealer_name>/',views.FetchDealerData.as_view(),name='fetchdata'),
]
