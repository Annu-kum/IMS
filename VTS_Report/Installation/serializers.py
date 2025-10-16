from rest_framework import serializers
from .models import InstallatonModels, InstallationExtraLetterHead
from rest_framework import request
from rest_framework import serializers
from .models import InstallatonModels
from datetime import datetime
from Dealer.models import Dealersmodel
from account.serializers import SessionYearSerializer


class InstallSerializers(serializers.ModelSerializer):

    InstallationDate = serializers.DateField(format='%Y-%m-%d',input_formats=['%d-%m-%Y'], required=False, allow_null=True)
    Installation_letterHead = serializers.SerializerMethodField()
    Dealer_Name = serializers.SlugRelatedField(slug_field='Dealer_Name', queryset=Dealersmodel.objects.all())
    InstallationDate = serializers.SerializerMethodField()
    extra_letterheads = serializers.SerializerMethodField()
    class Meta:
        model = InstallatonModels
        fields = ['id','MILLER_TRANSPORTER_ID','MILLER_NAME','Device_Name','district','MillerContactNo','Dealer_Name','Entity_id','GPS_IMEI_NO',
                  'SIM_NO','NewRenewal','OTR','otrMonth','vehicle1','vehicle2','vehicle3',
                'InstallationDate','Employee_Name',
                  'Device_Fault','Fault_Reason','Replace_DeviceIMEI_NO','Remark1','Remark2','Remark3','Installation_letterHead','extra_letterheads']


    def get_Installation_letterHead(self, obj):
        request = self.context.get('request')
        if obj.Installation_letterHead and hasattr(obj.Installation_letterHead, 'url'):
            return request.build_absolute_uri(obj.Installation_letterHead.url)
        return None
    
    def get_extra_letterheads(self, obj):
        request = self.context.get("request")
        return [
            request.build_absolute_uri(extra.file.url)
            for extra in obj.extra_letterheads.all()
        ]

    def validate_Installation_letterHead(self, value):
        if value and not value.name.endswith(('.jpg', '.jpeg', '.png', '.pdf')):
            raise serializers.ValidationError("Only .jpg, .jpeg, .png, .pdf files are allowed.")
        return value
    
    def get_InstallationDate(self, obj):
        if obj.InstallationDate:
            return obj.InstallationDate.strftime('%d-%m-%Y')
        return None

    def to_internal_value(self, data):
        if 'InstallationDate' in data and isinstance(data['InstallationDate'], datetime):
            try:
                data['InstallationDate'] = datetime.strptime(data['InstallationDate'], '%d-%m-%Y').date()
            except ValueError:
                raise serializers.ValidationError({"InstallationDate": "Date has wrong format. Use one of these formats instead: DD-MM-YYYY."})
        return super().to_internal_value(data)

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.InstallationDate:
            representation['InstallationDate'] = instance.InstallationDate.strftime('%d-%m-%Y')
        representation['Installation_letterHead'] = self.get_Installation_letterHead(instance)
        return representation

    def update(self, instance, validated_data):
        dealer_name = validated_data.pop('Dealer_Name', None)
        if dealer_name:
            instance.Dealer_Name = Dealersmodel.objects.get(Dealer_Name=dealer_name)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        instance.save()
        return instance

class InstallpostSerializers(SessionYearSerializer):
    Dealer_Name = serializers.PrimaryKeyRelatedField(queryset=Dealersmodel.objects.all())

    InstallationDate = serializers.DateField(required=False, allow_null=True)
    Installation_letterHead = serializers.FileField(write_only=True)
    # Installation_letterHead_url = serializers.SerializerMethodField()
     # accept multiple files 
    Installation_letterHead = serializers.ListField(
        child=serializers.FileField(),
        write_only=True,
        required=False
    )
    # extra files  list read-only
    extra_letterheads = serializers.SerializerMethodField()
    
    class Meta:
        model = InstallatonModels
        fields = ['id','MILLER_TRANSPORTER_ID','MILLER_NAME','Device_Name','district','MillerContactNo','Dealer_Name','Entity_id','GPS_IMEI_NO',
                  'SIM_NO','NewRenewal','OTR','otrMonth','vehicle1','vehicle2','vehicle3',
                  'InstallationDate','Employee_Name',
                  'Device_Fault','Fault_Reason','Replace_DeviceIMEI_NO','Remark1','Remark2','Remark3','Installation_letterHead','extra_letterheads']
    def create(self, validated_data):
        files = validated_data.pop("Installation_letterHead", [])
        installation = super().create(validated_data)
        
        if files:
            # first file as main file
            installation.Installation_letterHead = files[0]
            installation.save()

            # rest file in extra model
            for f in files[1:]:
                InstallationExtraLetterHead.objects.create(installation=installation, file=f)

        return installation

    def get_extra_letterheads(self, obj):
        request = self.context.get("request")
        return [
            request.build_absolute_uri(extra.file.url)
            for extra in obj.extra_letterheads.all()
        ]    


    def get_Installation_letterHead(self, obj):
        request = self.context.get('request')
        if obj.Installation_letterHead and hasattr(obj.Installation_letterHead, 'url'):
            return request.build_absolute_uri(obj.Installation_letterHead.url)
        return None

    def get_Installation_letterHead_url(self, obj):
        request = self.context.get('request')
        if obj.Installation_letterHead and hasattr(obj.Installation_letterHead, 'url'):
            return request.build_absolute_uri(obj.Installation_letterHead.url)
        return None
    def get_InstallationDate(self, obj):
        request = self.context.get('request')
        if obj.InstallationDate and hasattr(obj.InstallationDate, 'url'):
            return request.build_absolute_uri(obj.InstallationDate.url)
        return None

    def validate_Installation_letterHead(self, value):
        for f in value:
            if not f.name.endswith(('.jpg', '.jpeg', '.png', '.pdf')):
                raise serializers.ValidationError("Only .jpg, .jpeg, .png, .pdf files are allowed.")
        return value
         
    def to_internal_value(self, data):
        if 'InstallationDate' in data and isinstance(data['InstallationDate'], datetime):
            try:
                data['InstallationDate'] = datetime.strptime(data['InstallationDate'], '%d-%m-%Y').date()
            except ValueError:
                raise serializers.ValidationError({"InstallationDate": "Date has wrong format. Use one of these formats instead: DD-MM-YYYY."})
        return super().to_internal_value(data)

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.InstallationDate:
            representation['InstallationDate'] = instance.InstallationDate.strftime('%d-%m-%Y')
        # main file url
        if instance.Installation_letterHead and hasattr(instance.Installation_letterHead, 'url'):
            request = self.context.get('request')
            representation['Installation_letterHead'] = request.build_absolute_uri(instance.Installation_letterHead.url)
        else:
            representation['Installation_letterHead'] = None    
        # representation['Installation_letterHead'] = self.get_Installation_letterHead(instance)
        return representation


class InstallupdatesSerializers(SessionYearSerializer):
    Installation_letterHead = serializers.SerializerMethodField()
    Dealer_Name = serializers.SlugRelatedField(slug_field='Dealer_Name', queryset=Dealersmodel.objects.all())
    # Installation_letterHead_url = serializers.SerializerMethodField()
    InstallationDate = serializers.DateField(required=False, allow_null=True)
    
    class Meta:
        model = InstallatonModels
        fields = ['id','MILLER_TRANSPORTER_ID','MILLER_NAME','Device_Name','district','MillerContactNo','Dealer_Name','Entity_id','GPS_IMEI_NO',
                  'SIM_NO','NewRenewal','OTR','otrMonth','vehicle1','vehicle2','vehicle3',
                  'InstallationDate','Employee_Name',
                  'Device_Fault','Fault_Reason','Replace_DeviceIMEI_NO','Remark1','Remark2','Remark3','Installation_letterHead']



    def get_Installation_letterHead(self, obj):
        request = self.context.get('request')
        if obj.Installation_letterHead and hasattr(obj.Installation_letterHead, 'url'):
            return request.build_absolute_uri(obj.Installation_letterHead.url)
        return None

  
    def get_InstallationDate(self, obj):
        request = self.context.get('request')
        if obj.InstallationDate and hasattr(obj.InstallationDate, 'url'):
            return request.build_absolute_uri(obj.InstallationDate.url)
        return None

    def validate_Installation_letterHead(self, value):
        if value and not value.name.endswith(('.jpg', '.jpeg', '.png', '.pdf')):
            raise serializers.ValidationError("Only .jpg, .jpeg, .png, .pdf files are allowed.")
        return value
         
    def to_internal_value(self, data):
        if 'InstallationDate' in data and isinstance(data['InstallationDate'], datetime):
            try:
                data['InstallationDate'] = datetime.strptime(data['InstallationDate'], '%d-%m-%Y').date()
            except ValueError:
                raise serializers.ValidationError({"InstallationDate": "Date has wrong format. Use one of these formats instead: DD-MM-YYYY."})
        return super().to_internal_value(data)

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.InstallationDate:
            representation['InstallationDate'] = instance.InstallationDate.strftime('%d-%m-%Y')
        representation['Installation_letterHead'] = self.get_Installation_letterHead(instance)
        return representation
    
    def update(self, instance, validated_data):
        dealer_name = validated_data.pop('Dealer_Name', None)
        if dealer_name:
            instance.Dealer_Name = Dealersmodel.objects.get(Dealer_Name=dealer_name)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        instance.save()
        return instance
