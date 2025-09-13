from django.contrib import admin
from .models import ReactivationModels
from django.utils.html import format_html
# Register your models here.

@admin.register(ReactivationModels)
class InstallationAdmin(admin.ModelAdmin):
    list_display=('id','MILLER_TRANSPORTER_ID','MILLER_NAME','Device_Name','district','MillerContactNo','Dealer_Name','Entity_id','GPS_IMEI_NO',
                  'SIM_NO','NewRenewal','OTR','vehicle1','vehicle2','vehicle3',
                 'ReactivationDate','Employee_Name',
                  'Device_Fault','Fault_Reason','Replace_DeviceIMEI_NO','Remark1','Remark2','Remark3','Reactivation_letterHead_link')


    list_per_page=100
    list_max_show_all=200
    search_fields=('id','MILLER_TRANSPORTER_ID','MILLER_NAME','Device_Name','district','MillerContactNo','Dealer_Name','Entity_id','GPS_IMEI_NO',
                  'SIM_NO','NewRenewal','OTR','vehicle1','vehicle2','vehicle3',
                  'ReactivationDate','Employee_Name',
                  'Device_Fault','Fault_Reason','Replace_DeviceIMEI_NO','Remark1','Remark2','Remark3','Reactivation_letterHead')

    list_filter=('MILLER_TRANSPORTER_ID','Device_Name','Entity_id','GPS_IMEI_NO')
    def Reactivation_letterHead_link(self, obj):
        if obj.Reactivation_letterHead:
            return format_html('<a href="{}" target="_blank">View File</a>', obj.get_absolute_url())
        return "No file"
    Reactivation_letterHead_link.short_description = 'Reactivation Letter Head'
