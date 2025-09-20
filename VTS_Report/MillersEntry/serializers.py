from rest_framework import serializers
from .models import MillersEntrymodel
from account.serializers import SessionYearSerializer
class MillerEntrySerializers(SessionYearSerializer,serializers.ModelSerializer):
    class Meta:
        model=MillersEntrymodel
        fields= ['MILLER_TRANSPORTER_ID','MILLER_NAME','ContactNo','district',]