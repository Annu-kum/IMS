from rest_framework import serializers
from .models import DeactivationModels
from datetime import datetime
from Dealer.models import Dealersmodel
from account.serializers import SessionYearSerializer


class DeactivateSerializers(serializers.ModelSerializer):

    DeactivationDate = serializers.DateField(format='%Y-%m-%d',input_formats=['%d-%m-%Y'], required=False, allow_null=True)
    Deactivation_letterHead = serializers.SerializerMethodField()
    DeactivationDate = serializers.SerializerMethodField()
    class Meta:
        model = DeactivationModels
        fields = ['id','MILLER_TRANSPORTER_ID','MILLER_NAME','Device_Name','district','MillerContactNo','Dealer_Name','Entity_id','GPS_IMEI_NO',
                  'SIM_NO','NewRenewal','OTR','vehicle1','vehicle2','vehicle3',
                'DeactivationDate','Employee_Name',
                  'Device_Fault','Fault_Reason','Replace_DeviceIMEI_NO','Remark1','Remark2','Remark3','Deactivation_letterHead']

    def get_Deactivation_letterHead(self, obj):
        request = self.context.get('request')
        if obj.Deactivation_letterHead and hasattr(obj.Deactivation_letterHead, 'url'):
            return request.build_absolute_uri(obj.Deactivation_letterHead.url)
        return None

    def validate_Deactivation_letterHead(self, value):
        if value and not value.name.endswith(('.jpg', '.jpeg', '.png', '.pdf')):
            raise serializers.ValidationError("Only .jpg, .jpeg, .png, .pdf files are allowed.")
        return value
    
    def get_DeactivationDate(self, obj):
        if obj.DeactivationDate:
            return obj.DeactivationDate.strftime('%d-%m-%Y')
        return None

    def to_internal_value(self, data):
        if 'DeactivationDate' in data and isinstance(data['DeactivationDate'], datetime):
            try:
                data['DeactivationDate'] = datetime.strptime(data['DeactivationDate'], '%d-%m-%Y').date()
            except ValueError:
                raise serializers.ValidationError({"DeactivationDate": "Date has wrong format. Use one of these formats instead: DD-MM-YYYY."})
        return super().to_internal_value(data)

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.DeactivationDate:
            representation['DeactivationDate'] = instance.DeactivationDate.strftime('%d-%m-%Y')
        representation['Deactivation_letterHead'] = self.get_Deactivation_letterHead(instance)
        return representation

    

   


class DeactivatepostSerializers(SessionYearSerializer,serializers.ModelSerializer):
    DeactivationDate = serializers.DateField(required=False, allow_null=True)
    Deactivation_letterHead = serializers.FileField(write_only=True)
    # Installation_letterHead_url = serializers.SerializerMethodField()
    
    class Meta:
        model = DeactivationModels
        fields = ['id','MILLER_TRANSPORTER_ID','MILLER_NAME','Device_Name','district','MillerContactNo','Dealer_Name','Entity_id','GPS_IMEI_NO',
                  'SIM_NO','NewRenewal','OTR','vehicle1','vehicle2','vehicle3',
                  'DeactivationDate','Employee_Name',
                  'Device_Fault','Fault_Reason','Replace_DeviceIMEI_NO','Remark1','Remark2','Remark3','Deactivation_letterHead']


    def get_Deactivation_letterHead(self, obj):
        request = self.context.get('request')
        if obj.Deactivation_letterHead and hasattr(obj.Deactivation_letterHead, 'url'):
            return request.build_absolute_uri(obj.Deactivation_letterHead.url)
        return None

    def get_Deactivation_letterHead_url(self, obj):
        request = self.context.get('request')
        if obj.Deactivation_letterHead and hasattr(obj.Deactivation_letterHead, 'url'):
            return request.build_absolute_uri(obj.Deactivation_letterHead.url)
        return None
    def get_DeactivationDate(self, obj):
        request = self.context.get('request')
        if obj.DeactivationDate and hasattr(obj.DeactivationDate, 'url'):
            return request.build_absolute_uri(obj.DeactivationDate.url)
        return None

    def validate_Deactivation_letterHead(self, value):
        if value and not value.name.endswith(('.jpg', '.jpeg', '.png', '.pdf')):
            raise serializers.ValidationError("Only .jpg, .jpeg, .png, .pdf files are allowed.")
        return value
         
    def to_internal_value(self, data):
        if 'DeactivationDate' in data and isinstance(data['DeactivationDate'], datetime):
            try:
                data['DeactivationDate'] = datetime.strptime(data['DeactivationDate'], '%d-%m-%Y').date()
            except ValueError:
                raise serializers.ValidationError({"DeactivationDate": "Date has wrong format. Use one of these formats instead: DD-MM-YYYY."})
        return super().to_internal_value(data)

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.DeactivationDate:
            representation['DeactivationDate'] = instance.DeactivationDate.strftime('%d-%m-%Y')
        representation['Deactivation_letterHead'] = self.get_Deactivation_letterHead(instance)
        representation['Deactivation_letterHead_url'] = self.get_Deactivation_letterHead_url(instance)
        return representation








class DeactivateUpdatesSerializers(SessionYearSerializer,serializers.ModelSerializer):

    DeactivationDate = serializers.DateField( required=False, allow_null=True)
    Deactivation_letterHead = serializers.SerializerMethodField()
    class Meta:
        model = DeactivationModels
        fields = ['id','MILLER_TRANSPORTER_ID','MILLER_NAME','Device_Name','district','MillerContactNo','Dealer_Name','Entity_id','GPS_IMEI_NO',
                  'SIM_NO','NewRenewal','OTR','vehicle1','vehicle2','vehicle3',
                'DeactivationDate','Employee_Name',
                  'Device_Fault','Fault_Reason','Replace_DeviceIMEI_NO','Remark1','Remark2','Remark3','Deactivation_letterHead']

    def get_Deactivation_letterHead(self, obj):
        request = self.context.get('request')
        if obj.Deactivation_letterHead and hasattr(obj.Deactivation_letterHead, 'url'):
            return request.build_absolute_uri(obj.Deactivation_letterHead.url)
        return None

    def validate_Deactivation_letterHead(self, value):
        if value and not value.name.endswith(('.jpg', '.jpeg', '.png', '.pdf')):
            raise serializers.ValidationError("Only .jpg, .jpeg, .png, .pdf files are allowed.")
        return value
    
    def get_DeactivationDate(self, obj):
        if obj.DeactivationDate:
            return obj.DeactivationDate.strftime('%d-%m-%Y')
        return None

    def to_internal_value(self, data):
        if 'DeactivationDate' in data and isinstance(data['DeactivationDate'], datetime):
            try:
                data['DeactivationDate'] = datetime.strptime(data['DeactivationDate'], '%d-%m-%Y').date()
            except ValueError:
                raise serializers.ValidationError({"DeactivationDate": "Date has wrong format. Use one of these formats instead: DD-MM-YYYY."})
        return super().to_internal_value(data)

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.DeactivationDate:
            representation['DeactivationDate'] = instance.DeactivationDate.strftime('%d-%m-%Y')
        representation['Deactivation_letterHead'] = self.get_Deactivation_letterHead(instance)
        return representation
