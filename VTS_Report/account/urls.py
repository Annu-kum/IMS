from django.urls import path
from django.urls import include,re_path as url
from . import views
from rest_framework import routers


urlpatterns = [
    path('createuser/',views.CreateUser.as_view(),name="createuser"),
    path('userlogin/',views.UserLogin.as_view(),name="user_login"),
    path('checkexist/',views.IsUserExists.as_view(),name="checkexistance"),
    path('changepswd/',views.ChangePasswordView.as_view(),name="change_password"),
    path('whoiam/',views.WhoAmI.as_view(),name="whoiam")    
    
]
