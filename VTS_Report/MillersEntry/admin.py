from django.contrib import admin
from MillersEntry.models import MillersEntrymodel
from import_export.admin import ImportExportModelAdmin
from .resources import MillersEntrymodelResource


@admin.register(MillersEntrymodel)
class DealerAdmin(ImportExportModelAdmin,admin.ModelAdmin):
    resource_class=MillersEntrymodelResource
    list_display=[field.name for field in MillersEntrymodel._meta.fields]
    search_fields=('MILLER_TRANSPORTER_ID','MILLER_NAME','ContactNo','district',)
    list_filter=('MILLER_TRANSPORTER_ID','MILLER_NAME','ContactNo','district',)
