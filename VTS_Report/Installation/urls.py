from django.urls import path,re_path as url
from rest_framework import routers
from . import views,dashboard
from django.conf.urls.static import static
from VTS_Report import settings
router = routers.DefaultRouter()

urlpatterns = [

    path('getinstaller/<str:MILLER_TRANSPORTER_ID>/',views.GetInstallviewset.as_view(),name='getinstalldata'),
    path('getinstallerdetai/',views.GetInstallviewset.as_view(),name='getinstall'),
    path('geturl/<int:id>',views.GetInstallurlviewset.as_view(),name='geturls'),
    path('postinstaller/',views.postInstallviewset.as_view(),name='postinstall'),
    path('deleteinstaller/<int:id>/',views.DeleteInstallviewsets.as_view(),name='deleteinstall'),
    path('updateinstaller/<int:id>/',views.updateInstallviewsets.as_view(),name='updateinstall'),
    path('update-installation/<int:id>/', views.UpdateLetterHeadViewSets.as_view(), name='update-installation'),
    path('get_file_url/<int:id>/', views.get_file_url, name='get_file_url'), 
    path('import/',views.BulkImportView.as_view(),name='bulk-upload'),
    path('updateexcelLetterhead/',views.BulkUpdateLetterHeadView.as_view(),name='updateexcel'),
    path('dashboard/summary/', dashboard.DashboardSummaryView.as_view(), name='dashboard-summary'),
]
