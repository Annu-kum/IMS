from django.contrib import admin
from Installation.models import InstallatonModels
from django.utils.html import format_html
# Register your models here.

@admin.register(InstallatonModels)
class InstallationAdmin(admin.ModelAdmin):
    list_display=('id','MILLER_TRANSPORTER_ID','MILLER_NAME','Device_Name','district','MillerContactNo','Dealer_Name','Entity_id','GPS_IMEI_NO',
                  'SIM_NO','NewRenewal','OTR','vehicle1','vehicle2','vehicle3',
                'InstallationDate','Employee_Name',
                  'Device_Fault','Fault_Reason','Replace_DeviceIMEI_NO','Remark1','Remark2','Remark3','Installation_letterHead_link')

   
   
    search_fields=('id','MILLER_TRANSPORTER_ID','MILLER_NAME','Device_Name','district','Dealer_Name__Dealer_Name','GPS_IMEI_NO',
                  'SIM_NO','NewRenewal','OTR','vehicle1','vehicle2','vehicle3',
                  'InstallationDate','Employee_Name',
                  'Device_Fault','Fault_Reason','Replace_DeviceIMEI_NO','Remark1','Remark2','Remark3','Installation_letterHead')

    list_filter=('MILLER_TRANSPORTER_ID','Device_Name','GPS_IMEI_NO')
    def Installation_letterHead_link(self, obj):
        if obj.Installation_letterHead:
            return format_html('<a href="{}" target="_blank">View File</a>', obj.get_absolute_url())
        return "No file"
    Installation_letterHead_link.short_description = 'Installation Letter Head'

