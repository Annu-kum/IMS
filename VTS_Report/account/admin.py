
# Register your models here.
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext as _

from .models import SessionYear, User, UserSessionYear


class UserAdmin(BaseUserAdmin):
    ordering = ['id','username']
    list_display = ['username','createdBy','session_year']
    list_per_page = 20
    list_max_show_all =50
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        (_('Personal Info'), {'fields': ('first_name','last_name','email','phone','createdBy','session_year')}),
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
    # def get_form(self, request, obj=None, **kwargs):
    #     """
    #      Override form to make session_year a dropdown
    #     populated dynamically from SessionYear model.
    #     """
    #     form = super().get_form(request, obj, **kwargs)
    #     session_field = form.base_fields.get('session_year')
    #     if session_field:
    #         session_field.widget.choices = [
    #             (s.year, s.year)
    #             for s in SessionYear.objects.filter(is_active=True)
    #         ]
    #         session_field.required = False
    #     return form

admin.site.register(User, UserAdmin)

@admin.register(SessionYear)
class SessionYearListAdmin(admin.ModelAdmin):
    list_display = ['year', 'is_active']
    list_filter = ['is_active']
    search_fields = ['year']
    ordering = ['-year']
    list_per_page = 20
    list_max_show_all =50

@admin.register(UserSessionYear)
class UserSessionYearAdmin(admin.ModelAdmin):
    list_display = ['user', 'session_year', 'token']
    search_fields = ['user__username', 'session_year__year']




