from django.contrib import admin

# Register your models here.
from .models import LogModel



@admin.register(LogModel)
class LogModels(admin.ModelAdmin):
    list_display=['content_type','object_id','action','timestamp','description','logged_data',]
    list_per_page=100
    list_max_show_all=200
    search_fields=('content_type','object_id','action','timestamp','description',)
    list_filter=('content_type','object_id','action',)