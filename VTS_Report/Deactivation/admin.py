from django.contrib import admin
from .models import DeactivationModels
from django.utils.html import format_html
# Register your models here.

@admin.register(DeactivationModels)
class DeactivationAdmin(admin.ModelAdmin):
    list_display=('id','MILLER_TRANSPORTER_ID','MILLER_NAME','Device_Name','district','MillerContactNo','Dealer_Name','Entity_id','GPS_IMEI_NO',
                  'SIM_NO','NewRenewal','OTR','vehicle1','vehicle2','vehicle3',
                  'DeactivationDate','Employee_Name',
                  'Device_Fault','Fault_Reason','Replace_DeviceIMEI_NO','Remark1','Remark2','Remark3','Deactivation_letterHead_link')
    list_per_page= 100
    list_max_show_all = 200

    search_fields=('id','MILLER_TRANSPORTER_ID','MILLER_NAME','Device_Name','district','MillerContactNo','Dealer_Name','Entity_id','GPS_IMEI_NO',
                  'SIM_NO','NewRenewal','OTR','vehicle1','vehicle2','vehicle3',
                  'millerContactno','DeactivationDate','Employee_Name',
                  'Device_Fault','Fault_Reason','Replace_DeviceIMEI_NO','Remark1','Remark2','Remark3','Deactivation_letterHead')

    list_filter=('MILLER_TRANSPORTER_ID','Device_Name','Entity_id','GPS_IMEI_NO')
    def Deactivation_letterHead_link(self, obj):
        if obj.Deactivation_letterHead:
            return format_html('<a href="{}" target="_blank">View File</a>', obj.get_absolute_url())
        return "No file"
    Deactivation_letterHead_link.short_description = 'Deactivation Letter Head'