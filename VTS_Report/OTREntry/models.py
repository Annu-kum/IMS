from django.db import models
from logmodels.models import LogModel
from django.contrib.contenttypes.models import ContentType
from django.utils import timezone

# Create your models here.
class OTRData(models.Model):
        id=models.AutoField(primary_key=True)
        MILLER_TRANSPORTER_ID=models.CharField(max_length=15,blank=True)
        MILLER_NAME=models.CharField(max_length=150,blank=True)
        district=models.CharField(max_length=200,blank=True)
        MillerContactNo=models.CharField(max_length=15,blank=True)
        Dealer_Name=models.CharField(max_length=150,blank=True)
        Entity_id=models.CharField(max_length=15,blank=True)
        GPS_IMEI_NO=models.CharField(max_length=20,blank=True)
        SIM_NO=models.CharField(max_length=20,blank=True)
        Device_Name=models.CharField(max_length=150,blank=True)
        NewRenewal=models.CharField(max_length=50,blank=True)
        OTR=models.CharField(max_length=10,blank=True)
        vehicle1=models.CharField(max_length=150,blank=True)
        vehicle2=models.CharField(max_length=150,blank=True)
        vehicle3=models.CharField(max_length=150,blank=True)
        InstallationDate=models.DateField(null=True,blank=True)
        Employee_Name=models.CharField(max_length=150,blank=True)
        Device_Fault=models.CharField(max_length=150,blank=True)
        Fault_Reason=models.CharField(max_length=200,blank=True)
        Replace_DeviceIMEI_NO=models.CharField(max_length=20,blank=True)
        ExpiryDate=models.DateField(null=True,blank=True)
        extendedMonth=models.CharField(max_length=10,blank=True)
        nextExpirydate=models.DateField(null=True,blank=True)
        

        def save(self, *args, **kwargs):
         action = "Created" if self._state.adding else "Updated"
         super(OTRData, self).save(*args, **kwargs)
        
        # Log the save action
         content_type = ContentType.objects.get_for_model(self)
         LogModel.objects.create(
            content_type=content_type,
            object_id=self.id,
            action=action,
            timestamp=timezone.now(),
            description=f"OTR Data {action}: {self.MILLER_TRANSPORTER_ID} - {self.MILLER_NAME}",
            logged_data={
               'MILLER_NAME': self.MILLER_NAME,
                'vehicle1':self.vehicle1,
                'vehicle1':self.vehicle2,
                'vehicle1':self.vehicle3,
                'ExpiryDate':self.ExpiryDate.strftime('%Y-%m-%d') if self.ExpiryDate else None,
                'extendedMonth':self.extendedMonth,
                'nextExpirydate':self.nextExpirydate.strftime('%Y-%m-%d') if self.nextExpirydate else None,
                'InstallationDate':self.InstallationDate.strftime('%Y-%m-%d') if self.InstallationDate else None,
                'Employee_Name':self.Employee_Name,
                'OTR':self.OTR,
                'GPS_IMEI_NO':self.GPS_IMEI_NO,
                'district':self.district,
            }
        )

        
