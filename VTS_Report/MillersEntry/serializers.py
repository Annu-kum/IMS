from rest_framework import serializers
from .models import MillersEntrymodel

class MillerEntrySerializers(serializers.ModelSerializer):
    class Meta:
        model=MillersEntrymodel
        fields= ['MILLER_TRANSPORTER_ID','MILLER_NAME','ContactNo','district',]