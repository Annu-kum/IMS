from django.urls import path
from django.urls import include,re_path as url
from account import manage_user
from . import views



urlpatterns = [
    path('by/id/<int:id>',manage_user.GetUserById.as_view(),name="get_user_by_id"),
    path('all/',manage_user.GetTokenUsers.as_view(),name="get_all_user"),
    # path('create/',manage_user.CreateUsersss.as_view(),name="create_user"),
    path('update/<str:username>',manage_user.UpdateUser.as_view(),name="update_user"),
    path('delete/<int:id>',manage_user.DeleteUser.as_view(),name="delete_user"),
    path('allusers/',manage_user.GetAllUsers.as_view(),name='getallusers')
]



