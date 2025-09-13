from django.urls import path
from rest_framework import routers
from .import views
routers=routers.DefaultRouter()
urlpatterns = [
    path('total-otr',views.OtrDetailsviews.as_view(),name='total-otr'),
    path('total-new-otr/',views.NewOTRCountView.as_view(),name='total-new-otr'),
    path('total-renewal-otr/',views.RenewalOTRCountView.as_view(),name='total-renewal-otr'),
    path('today-otr/',views.TodayOTRCountView.as_view(),name='today-otr'),
    path('today-new-otr/',views.TodayNewOTRCountView.as_view(),name='todays-new-otr/'),
    path('today-renewal-otr/',views.TodayRenewalOTRCountView.as_view(),name='today-renewals-otr/'),
    path('yesterday-otr/',views.YesterdayOTRCountView.as_view(),name='yesterdays-otr/'),
    path('yesterday-new-otr/',views.YesterdayNewOTRCountView.as_view(),name='yesterday-new-otrs/'),
    path('yesterday-renewal-otr/',views.YesterdayRenewalOTRCountView.as_view(),name='yesterday-renewal-otrs/'),
    path('dealerReport/',views.DealerReport.as_view(),name='dealerReport'),
    path('getSum/',views.GetSumofEnteries.as_view(),name='getsumofEntries'),
    path('FetchDealerdata/<str:dealer_name>/',views.FetchDealerData.as_view(),name='fetchdata'),
]
