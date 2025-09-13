from django.urls import path,re_path as url
from rest_framework import routers
from . import views
from django.conf.urls.static import static
from VTS_Report import settings
router = routers.DefaultRouter

urlpatterns = [

    path('getReactivate/<str:MILLER_TRANSPORTER_ID>/',views.GetReactivateviewset.as_view(),name='getreactivate'),
    path('getReactivatedetai/',views.GetReactivateviewset.as_view(),name='getreactive'),
    path('reactivegeturl/<int:id>',views.GetReactiveurlviewset.as_view(),name='geturls'),
    path('postReactivate/',views.postReactivateviewset.as_view(),name='postreactive'),
    path('deleteReactivate/<int:id>/',views.DeleteReactivateviewsets.as_view(),name='deletereactive'),
    path('updateReactivate/<int:id>/',views.updateReactivateviewsets.as_view(),name='updatereactive'),
    path('update-reactivation/<int:id>/', views.UpdatereactivateLetterHeadViewSets.as_view(), name='update-reactivation'),
    path('get_file_url/<int:id>/', views.get_file_url, name='get_file_url'), 
    path('total/count/', views.ReactivationCountView.as_view(), name='Reactivation-count'),
    path('total/new-count/', views.NewReactiveCountView.as_view(), name='Reactivation-new-count'),
    path('total/renewal-count/',views.RenewalReactivationCountView.as_view(),name='Reactivation-renewal-count'),
    path('date/today-count/', views.TodayReactiveCountView.as_view(), name='Reactivation-today-count'),
    path('today-new-count/', views.TodayNewInstallCountView.as_view(), name='Reactivation-today-new-count'),
    path('today-renewal-count/', views.TodayRenewalReactiveCountView.as_view(), name='Reactivation-today-renewal-count'),
    path('yesterday-count/', views.YesterdayReactiveCountView.as_view(), name='Reactivation-yesterday-count'),
    path('yesterday-new-count/', views.YesterdayNewReactivateCountView.as_view(), name='Reactivation-yesterday-new-count'),
    path('yesterday-renewal-count/',views.YesterdayRenewalReactivationCountView.as_view(),name='Reactivation-yesterday-renewal-count'),
    path('import',views.BulkImportView.as_view(),name='bulkupload')
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


