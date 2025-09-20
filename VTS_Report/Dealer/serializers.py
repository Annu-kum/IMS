from rest_framework import serializers
from .models import Dealersmodel
from account.serializers import SessionYearSerializer

class DealerSerializers(SessionYearSerializer,serializers.ModelSerializer):
    class Meta:
        model = Dealersmodel
        fields = ['id','Dealer_Name','contactno1','contactno2','companyName','Remark']