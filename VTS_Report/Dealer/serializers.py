from rest_framework import serializers
from .models import Dealersmodel
from account.serializers import SessionYearSerializer

class DealerSerializers(SessionYearSerializer):
    class Meta:
        model = Dealersmodel
        fields = ['id','Dealer_Name','contactno1','contactno2','companyName','Remark']