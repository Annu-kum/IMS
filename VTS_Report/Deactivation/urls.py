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
   path('import',views.BulkImportView.as_view(),name='bulkimport'),
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


