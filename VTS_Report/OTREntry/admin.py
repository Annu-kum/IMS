from django.contrib import admin

# Register your models here.
from .models import OTRData
from django.utils.html import format_html
# Register your models here.

@admin.register(OTRData)
class InstallationAdmin(admin.ModelAdmin):
    list_display=('id', 'MILLER_TRANSPORTER_ID', 'MILLER_NAME', 'district', 'MillerContactNo', 'Dealer_Name',
            'Entity_id', 'GPS_IMEI_NO', 'SIM_NO', 'Device_Name', 'NewRenewal', 'OTR', 'vehicle1', 'vehicle2',
            'vehicle3', 'InstallationDate', 'Employee_Name', 'Device_Fault', 'Fault_Reason',
            'Replace_DeviceIMEI_NO', 'ExpiryDate', 'extendedMonth', 'nextExpirydate')
   
   
    search_fields=('id', 'MILLER_TRANSPORTER_ID', 'MILLER_NAME', 'district', 'MillerContactNo', 'Dealer_Name',
            'Entity_id', 'GPS_IMEI_NO', 'SIM_NO', 'Device_Name', 'NewRenewal', 'OTR', 'vehicle1', 'vehicle2',
            'vehicle3', 'InstallationDate', 'Employee_Name', 'Device_Fault', 'Fault_Reason',
            'Replace_DeviceIMEI_NO', 'ExpiryDate', 'extendedMonth', 'nextExpirydate')

    