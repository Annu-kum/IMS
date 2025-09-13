from django.urls import path,re_path as url
from rest_framework import routers
from . import views
from django.conf.urls.static import static
from VTS_Report import settings
router = routers.DefaultRouter

urlpatterns = [

    path('getinstaller/<str:MILLER_TRANSPORTER_ID>/',views.GetInstallviewset.as_view(),name='getinstalldata'),
    path('getinstallerdetai/',views.GetInstallviewset.as_view(),name='getinstall'),
    path('geturl/<int:id>',views.GetInstallurlviewset.as_view(),name='geturls'),
    path('postinstaller/',views.postInstallviewset.as_view(),name='postinstall'),
    path('deleteinstaller/<int:id>/',views.DeleteInstallviewsets.as_view(),name='deleteinstall'),
    path('updateinstaller/<int:id>/',views.updateInstallviewsets.as_view(),name='updateinstall'),
    path('update-installation/<int:id>/', views.UpdateLetterHeadViewSets.as_view(), name='update-installation'),
    path('get_file_url/<int:id>/', views.get_file_url, name='get_file_url'), 
    path('total/count/', views.InstallCountView.as_view(), name='installations-count'),
    path('total/new-count/', views.NewInstallCountView.as_view(), name='installations-new-count'),
    path('total/renewal-count/',views.RenewalInstallCountView.as_view(),name='installation-renewal-count'),
    path('date/today-count/', views.TodayInstallCountView.as_view(), name='installations-today-count'),
    path('today-new-count/', views.TodayNewInstallCountView.as_view(), name='installations-today-new-count'),
    path('today-renewal-count/', views.TodayRenewalInstallCountView.as_view(), name='installations-today-renewal-count'),
    path('yesterday-count/', views.YesterdayInstallCountView.as_view(), name='installations-yesterday-count'),
    path('yesterday-new-count/', views.YesterdayNewInstallCountView.as_view(), name='installations-yesterday-new-count'),
    path('yesterday-renewal-count/',views.YesterdayRenewalInstallCountView.as_view(),name='installations-yesterday-renewal-count'),
    path('import/',views.BulkImportView.as_view(),name='bulk-upload'),
    path('updateexcelLetterhead/',views.BulkUpdateLetterHeadView.as_view(),name='updateexcel'),

]
