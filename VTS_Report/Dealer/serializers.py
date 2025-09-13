from rest_framework import serializers
from .models import Dealersmodel


class DealerSerializers(serializers.ModelSerializer):
    class Meta:
        model = Dealersmodel
        fields = ['id','Dealer_Name','contactno1','contactno2','companyName','Remark']