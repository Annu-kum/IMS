from rest_framework import serializers

from rest_framework import request
from rest_framework import serializers
from .models import OTRData
from datetime import datetime

class OtrgetSerializers(serializers.ModelSerializer):
    ExpiryDate = serializers.DateField(format='%d-%m-%Y', input_formats=['%d-%m-%Y'], required=False, allow_null=True)
    nextExpirydate = serializers.DateField(format='%d-%m-%Y', input_formats=['%d-%m-%Y'], required=False, allow_null=True)
    InstallationDate= serializers.DateField(format='%d-%m-%Y', input_formats=['%d-%m-%Y'], required=False, allow_null=True)
    InstallationDate = serializers.SerializerMethodField()
    class Meta:
        model = OTRData
        fields = [
            'id', 'MILLER_TRANSPORTER_ID', 'MILLER_NAME', 'district', 'MillerContactNo', 'Dealer_Name',
            'Entity_id', 'GPS_IMEI_NO', 'SIM_NO', 'Device_Name', 'NewRenewal', 'OTR', 'vehicle1', 'vehicle2',
            'vehicle3', 'InstallationDate', 'Employee_Name', 'Device_Fault', 'Fault_Reason',
            'Replace_DeviceIMEI_NO', 'ExpiryDate', 'extendedMonth', 'nextExpirydate'
        ]
    
    def get_InstallationDate(self, obj):
        if obj.InstallationDate:
            return obj.InstallationDate.strftime('%d-%m-%Y')
        return None

    def get_nextExpirydate(self, obj):
        if obj.nextExpirydate:
            return obj.nextExpirydate.strftime('%d-%m-%Y')
        return None

    def get_ExpiryDate(self, obj):
        if obj.ExpiryDate:
            return obj.ExpiryDate.strftime('%d-%m-%Y')
        return None

    def to_internal_value(self, data):
        if 'nextExpirydate' in data and isinstance(data['nextExpirydate'], str):
            try:
                data['nextExpirydate'] = datetime.strptime(data['nextExpirydate'], '%d-%m-%Y').date()
            except ValueError:
                raise serializers.ValidationError({"nextExpirydate": "Date has wrong format. Use DD-MM-YYYY."})
        return super().to_internal_value(data)

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.nextExpirydate:
            representation['nextExpirydate'] = instance.nextExpirydate.strftime('%d-%m-%Y')
        if instance.ExpiryDate:
            representation['ExpiryDate'] = instance.ExpiryDate.strftime('%d-%m-%Y')
        if instance.InstallationDate:
            representation['InstallationDate'] = instance.InstallationDate.strftime('%d-%m-%Y')
        return representation

    

class otrdataserializes(serializers.ModelSerializer):
   
    
    class Meta:
        model = OTRData
        fields = ['id','MILLER_TRANSPORTER_ID',
        'MILLER_NAME',
        'district',
        'MillerContactNo',
        'Dealer_Name',
        'Entity_id',
        'GPS_IMEI_NO',
        'SIM_NO',
        'Device_Name',
        'NewRenewal',
        'OTR',
        'vehicle1',
        'vehicle2',
        'vehicle3',
        'InstallationDate',
        'Employee_Name',
        'Device_Fault',
        'Fault_Reason',
        'Replace_DeviceIMEI_NO',
        'ExpiryDate',
        'extendedMonth',
        'nextExpirydate']

   