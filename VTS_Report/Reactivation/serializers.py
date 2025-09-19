from rest_framework import serializers
from .models import ReactivationModels
from datetime import datetime
from Dealer.models import Dealersmodel
from account.serializers import SessionYearSerializer

class ReactivateSerializers(serializers.ModelSerializer):
    ReactivationDate = serializers.DateField(format='%Y-%m-%d',input_formats=["%d-%m-%Y"], required=False, allow_null=True)
    Reactivation_letterHead = serializers.SerializerMethodField()
    ReactivationDate = serializers.SerializerMethodField()
    class Meta:
        model = ReactivationModels
        fields = ['id','MILLER_TRANSPORTER_ID','MILLER_NAME','Device_Name','district','MillerContactNo','Dealer_Name','Entity_id','GPS_IMEI_NO',
                  'SIM_NO','NewRenewal','OTR','vehicle1','vehicle2','vehicle3',
                  'ReactivationDate','Employee_Name',
                  'Device_Fault','Fault_Reason','Replace_DeviceIMEI_NO','Remark1','Remark2','Remark3','Reactivation_letterHead']

    def get_Reactivation_letterHead(self, obj):
        request = self.context.get('request')
        if obj.Reactivation_letterHead and hasattr(obj.Reactivation_letterHead, 'url'):
            return request.build_absolute_uri(obj.Reactivation_letterHead.url)
        return None

    def validate_Reactivation_letterHead(self, value):
        if value and not value.name.endswith(('.jpg', '.jpeg', '.png', '.pdf')):
            raise serializers.ValidationError("Only .jpg, .jpeg, .png, .pdf files are allowed.")
        return value
    
    def get_ReactivationDate(self, obj):
        request = self.context.get('request')
        if obj.ReactivationDate:
            return obj.ReactivationDate.strftime('%d-%m-%Y')
        return None

    def to_internal_value(self, data):
        if 'ReactivationDate' in data and isinstance(data['ReactivationDate'], datetime):
            try:
                data['ReactivationDate'] = datetime.strptime(data['ReactivationDate'], '%d-%m-%Y').date()
            except ValueError:
                raise serializers.ValidationError({"ReactivationDate": "Date has wrong format. Use one of these formats instead: DD-MM-YYYY."})
        return super().to_internal_value(data)

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.ReactivationDate:
            representation['ReactivationDate'] = instance.ReactivationDate.strftime('%d-%m-%Y')
        representation['Reactivation_letterHead'] = self.get_Reactivation_letterHead(instance)
        return representation

   

    

    


class ReactivatepostSerializers(SessionYearSerializer,serializers.ModelSerializer):
    ReactivationDate = serializers.DateField(required=False, allow_null=True)
    Reactivation_letterHead = serializers.FileField(write_only=True)
    # Reactivation_letterHead_url = serializers.SerializerMethodField()
   
    class Meta:
        model = ReactivationModels
        fields = ['id','MILLER_TRANSPORTER_ID','MILLER_NAME','Device_Name','district','MillerContactNo','Dealer_Name','Entity_id','GPS_IMEI_NO',
                  'SIM_NO','NewRenewal','OTR','vehicle1','vehicle2','vehicle3',
                  'ReactivationDate','Employee_Name',
                  'Device_Fault','Fault_Reason','Replace_DeviceIMEI_NO','Remark1','Remark2','Remark3','Reactivation_letterHead'


]


    def get_Reactivation_letterHead(self, obj):
        request = self.context.get('request')
        if obj.Reactivation_letterHead and hasattr(obj.Reactivation_letterHead, 'url'):
            return request.build_absolute_uri(obj.Reactivation_letterHead.url)
        return None

    def get_Reactivation_letterHead_url(self, obj):
        request = self.context.get('request')
        if obj.Reactivation_letterHead and hasattr(obj.Reactivation_letterHead, 'url'):
            return request.build_absolute_uri(obj.Reactivation_letterHead.url)
        return None
    def get_ReactivationDate(self, obj):
        request = self.context.get('request')
        if obj.ReactivationDate and hasattr(obj.ReactivationDate, 'url'):
            return request.build_absolute_uri(obj.ReactivationDate.url)
        return None

    def validate_Reactivation_letterHead(self, value):
        if value and not value.name.endswith(('.jpg', '.jpeg', '.png', '.pdf')):
            raise serializers.ValidationError("Only .jpg, .jpeg, .png, .pdf files are allowed.")
        return value
         
    def to_internal_value(self, data):
        if 'ReactivationDate' in data and isinstance(data['ReactivationDate'], datetime):
            try:
                data['ReactivationDate'] = datetime.strptime(data['ReactivationDate'], '%d-%m-%Y').date()
            except ValueError:
                raise serializers.ValidationError({"ReactivationDate": "Date has wrong format. Use one of these formats instead: DD-MM-YYYY."})
        return super().to_internal_value(data)

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.ReactivationDate:
            representation['ReactivationDate'] = instance.ReactivationDate.strftime('%d-%m-%Y')
        representation['Reactivation_letterHead'] = self.get_Reactivation_letterHead(instance)
        representation['Reactivation_letterHead_url'] = self.get_Reactivation_letterHead_url(instance)
        return representation





class ReactivateUpdateSerializers(SessionYearSerializer,serializers.ModelSerializer):
    ReactivationDate = serializers.DateField(required=False, allow_null=True)
    Reactivation_letterHead = serializers.SerializerMethodField()
    # Reactivation_letterHead_url = serializers.SerializerMethodField()

    class Meta:
        model = ReactivationModels
        fields = ['id','MILLER_TRANSPORTER_ID','MILLER_NAME','Device_Name','district','MillerContactNo','Dealer_Name','Entity_id','GPS_IMEI_NO',
                  'SIM_NO','NewRenewal','OTR','vehicle1','vehicle2','vehicle3',
                  'ReactivationDate','Employee_Name',
                  'Device_Fault','Fault_Reason','Replace_DeviceIMEI_NO','Remark1','Remark2','Remark3','Reactivation_letterHead'

]


    def get_Reactivation_letterHead(self, obj):
        request = self.context.get('request')
        if obj.Reactivation_letterHead and hasattr(obj.Reactivation_letterHead, 'url'):
            return request.build_absolute_uri(obj.Reactivation_letterHead.url)
        return None

    def get_Reactivation_letterHead_url(self, obj):
        request = self.context.get('request')
        if obj.Reactivation_letterHead and hasattr(obj.Reactivation_letterHead, 'url'):
            return request.build_absolute_uri(obj.Reactivation_letterHead.url)
        return None
    def get_ReactivationDate(self, obj):
        request = self.context.get('request')
        if obj.ReactivationDate and hasattr(obj.ReactivationDate, 'url'):
            return request.build_absolute_uri(obj.ReactivationDate.url)
        return None

    def validate_Reactivation_letterHead(self, value):
        if value and not value.name.endswith(('.jpg', '.jpeg', '.png', '.pdf')):
            raise serializers.ValidationError("Only .jpg, .jpeg, .png, .pdf files are allowed.")
        return value
         
    def to_internal_value(self, data):
        if 'ReactivationDate' in data and isinstance(data['ReactivationDate'], datetime):
            try:
                data['ReactivationDate'] = datetime.strptime(data['ReactivationDate'], '%d-%m-%Y').date()
            except ValueError:
                raise serializers.ValidationError({"ReactivationDate": "Date has wrong format. Use one of these formats instead: DD-MM-YYYY."})
        return super().to_internal_value(data)

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.ReactivationDate:
            representation['ReactivationDate'] = instance.ReactivationDate.strftime('%d-%m-%Y')
        representation['Reactivation_letterHead'] = self.get_Reactivation_letterHead(instance)
        representation['Reactivation_letterHead_url'] = self.get_Reactivation_letterHead_url(instance)
        return representation
