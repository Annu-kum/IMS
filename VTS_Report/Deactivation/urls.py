from django.urls import path, re_path as url
from rest_framework import routers
from . import views
from django.conf.urls.static import static
from VTS_Report import settings
router = routers.DefaultRouter

urlpatterns = [

    path('getdeactivate/<str:MILLER_TRANSPORTER_ID>/',views.GetDeactiveviewset.as_view(),name='getdeactivatedata'),
    path('getdeactivatedetai/',views.GetDeactiveviewset.as_view(),name='getdeactivate'),
    path('getdeactiveurl/<int:id>',views.Getdeactivurlviewset.as_view(),name='geturls'),
    path('postdeactivate/',views.postDeactivateviewset.as_view(),name='postdeactivate'),
    path('deletedeactivate/<int:id>/',views.DeleteDeactivateviewsets.as_view(),name='deletedeactivate'),
    path('updatedeactivate/<int:id>/',views.updateDeactivateviewsets.as_view(),name='updatedeactivate'),
    path('update-deactivation/<int:id>/', views.UpdatedeactivateLetterHeadViewSets.as_view(), name='update-deactivation'),
    path('get_file_url/<int:id>/', views.get_file_url, name='get_file_url'), 
    path('total/count/',views.DeactivationcountView.as_view(),name='total-count'),
    path('total/new-count/', views.NewDeactivateCountView.as_view(), name='deactivation-new-count'),
    path('total/renewal-count/',views.RenewalDeactivationCountView.as_view(),name='deactivation-renewal-count'),
    path('date/today-count/', views.TodaydeactivateCountview.as_view(), name='deactivation-today-count'),
    path('today-new-count/', views.TodayNewDeactivationCountView.as_view(), name='deactivation-today-new-count'),
    path('today-renewal-count/', views.TodayRenewalDeactivationCountView.as_view(), name='deactivation-today-renewal-count'),
    path('yesterday-count/', views.YesterdayDeactivateCountViews.as_view(), name='deactivation-yesterday-count'),
    path('yesterday-new-count/', views.YesterdayNewDeactivationContViews.as_view(), name='deactivation-yesterday-new-count'),
    path('yesterday-renewal-count/',views.YesterdayRenewalDeactivationCountViews.as_view(),name='deactivation-yesterday-renewal-count'),
    path('import',views.BulkImportView.as_view(),name='bulkimport'),
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


