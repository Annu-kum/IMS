from rest_framework import serializers
from .models import LogModel




class LogSerializers(serializers.ModelSerializer):
    class Meta:
        model=LogModel
        fields= ['content_type','object_id','action','timestamp','description','logged_data',]