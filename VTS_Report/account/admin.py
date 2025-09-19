
# Register your models here.
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext as _

from account import models


class UserAdmin(BaseUserAdmin):
    ordering = ['id','username']
    list_display = ['username','createdBy']
    list_per_page = 20
    list_max_show_all =50
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        (_('Personal Info'), {'fields': ('first_name','last_name','email','phone','createdBy')}),
        (
            _('Permissions'),
            {
                'fields': (
                    'is_active',
                    'is_staff',
                    'is_superuser',
                    'groups',
                )
            }
        ),
        (_('Important dates'), {'fields': ('last_login',)}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'password1', 'password2','phone')
            }),
        )

admin.site.register(models.User, UserAdmin)

@admin.register(models.SessionYear)
class SessionYearListAdmin(admin.ModelAdmin):
    list_display = ['year', 'is_active']
    list_filter = ['is_active']
    search_fields = ['year']
    ordering = ['-year']
    list_per_page = 20
    list_max_show_all =50