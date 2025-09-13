"""
URL configuration for VTS_Report project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
# from django.contrib import admin
# from django.urls import path,include
# from django.urls import re_path
# from rest_framework.authtoken import views 
# from django.conf.urls.static import static
# from . import settings
# from . import views
# from django.views.generic import TemplateView
# # from django.views.generic import TemplateView
# from .views import index
# urlpatterns = [
    
    
#     path('admin/', admin.site.urls),
#     # path('.*',TemplateView.as_view(template_name='index.html')),
#     # re_path(r'.*',index,name='font'),
#     # url(".* ",TemplateView.as_view(template_name="index.html")),
#     #path('api-token-auth/', views.obtain_auth_token, name='api-tokn-auth'),
#     path('auth/', include('djoser.urls')),
#     path('auth/', include('djoser.urls.authtoken')),
#     #url(r'^auth/', include('djoser.urls.jwt')),
#     path('accounts/',include('account.urls')),
#     path('manage_userss/',include('account.user')),
#     path('dealer/',include('Dealer.urls')),
#     path('millers/',include('MillersEntry.urls')),
#     path('installation/',include('Installation.urls')),
#     path('deactivation/',include('Deactivation.urls')),
#     path('reactivation/',include('Reactivation.urls')),
#     # re_path(r'^.*$', index, name='index'),
# ]+ static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
# # +static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)



# if settings.DEBUG:
#     urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)








from django.contrib import admin
from django.urls import path, include, re_path
from django.conf.urls.static import static
from django.conf import settings
from django.views.generic import TemplateView
# from .views import index
from django.views.static import serve

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.authtoken')),
    path('accounts/', include('account.urls')),
    path('manage_users/', include('account.user')),  # Fixed typo from manage_userss to manage_users
    path('dealer/', include('Dealer.urls')),
    path('millers/', include('MillersEntry.urls')),
    path('installation/', include('Installation.urls')),
    path('deactivation/', include('Deactivation.urls')),
    path('reactivation/', include('Reactivation.urls')),
    path('otrdetails/',include('OtrDetails.urls')),
    path('masterReport/',include('MasterReport.urls')),
    path('otrentries/',include('OTREntry.urls')),
    path('logfiles/',include('logmodels.urls')),
    re_path(r'^static/(?P<path>.*)$',serve,{'document_root':settings.STATIC_ROOT}),
    re_path(r'^media/(?P<path>.*)$',serve,{'document_root':settings.MEDIA_ROOT}),
    # path('', index, name='index'),  # Serve the React app for the root URL
    # re_path(r'^.*$', index, name='index'),  # Serve the React app for all other URLs
    
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
   
