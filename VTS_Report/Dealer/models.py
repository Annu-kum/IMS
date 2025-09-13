from django.db import models
from django.core.validators import RegexValidator
from django.core.exceptions import ValidationError

# Create your models here.

class Dealersmodel(models.Model):
    id=models.AutoField(primary_key=True)
    Dealer_Name=models.CharField(max_length=200)
    contactno1=models.CharField(max_length=12,validators=[RegexValidator(r'^\d{10}$', message="Phone number must be 10 digits")],blank=True,)
    contactno2=models.CharField(max_length=12,validators=[RegexValidator(r'^\d{10}$', message="Phone number must be 10 digits")],blank=True,)
    companyName=models.CharField(max_length=200,blank=True)
    Remark=models.CharField(max_length=250,blank=True)
    

    class Meta:
        ordering=['id','Dealer_Name','contactno1','contactno2','companyName','Remark']
    
    def __str__(self):
        return self.Dealer_Name
