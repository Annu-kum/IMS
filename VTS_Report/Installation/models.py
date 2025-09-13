from django.db import models
from django.core.validators import RegexValidator
from django.core.exceptions import ValidationError
from Dealer.models import Dealersmodel
from django.conf import settings
from logmodels.models import LogModel
from django.contrib.contenttypes.models import ContentType
from django.utils import timezone
# # Create your models here.

# # https://github.com/MoTechStore/Django-4-and-React-JS-18-File-Upload-and-Download/tree/main

# #https://www.dhiwise.com/post/integrating-react-with-django-made-easy

# #https://stackoverflow.com/questions/70051244/how-to-serve-static-files-like-images-in-a-combined-django-react-application




def validate_file_extension(value):
    valid_extensions = ['.jpg', '.jpeg', '.png', '.pdf']
    if not any([value.name.endswith(ext) for ext in valid_extensions]):
        raise ValidationError(f'Unsupported file extension. Supported extensions are: {", ".join(valid_extensions)}')


class InstallatonModels(models.Model):
    id = models.AutoField(primary_key=True)
    MILLER_TRANSPORTER_ID = models.CharField(max_length=15,blank=True)
    MILLER_NAME = models.CharField(max_length=200,blank=True)
    district = models.CharField(max_length=200,blank=True)
    MillerContactNo = models.CharField(max_length=15,blank=True)
    Dealer_Name = models.ForeignKey(Dealersmodel,on_delete = models.CASCADE)
    Entity_id = models.CharField(max_length=15, blank=True, )
    GPS_IMEI_NO = models.CharField(max_length=20,blank=True)
    SIM_NO = models.CharField(max_length=15,blank=True)
    Device_Name = models.CharField(max_length=150,blank=True)
    NewRenewal = models.CharField(max_length=8,blank=True)
    OTR = models.CharField(max_length=5,blank=True)
    vehicle1 = models.CharField(max_length=300,blank=True)
    vehicle2 = models.CharField(max_length=300,blank=True)
    vehicle3 = models.CharField(max_length=300,blank=True)
    InstallationDate = models.DateField(null=True,blank=True)
    Employee_Name = models.CharField(max_length=100,blank=True)
    Device_Fault = models.CharField(max_length=200,blank=True)
    Fault_Reason = models.CharField(max_length=300,blank=True)
    Replace_DeviceIMEI_NO = models.CharField(max_length=20,blank=True) 
    Remark1 = models.CharField(max_length=350,blank=True)
    Remark2 = models.CharField(max_length=350,blank=True)
    Remark3 = models.CharField(max_length=350,blank=True)
    Installation_letterHead = models.FileField(upload_to='installation_letterheads/',validators=[validate_file_extension],null=True,blank=True,default='')
    flag=models.CharField(max_length=15,null=True,default='old')
    

    
    # def __str__(self):
    #     return f'{self.MILLER_NAME} - {self.GPS_IMEI_NO}'
    def get_absolute_url(self):
        if self.Installation_letterHead:
            return f"{settings.MEDIA_URL}{self.Installation_letterHead}"
        return ''

    class Meta:
        verbose_name = "Installation Model"
        verbose_name_plural = "Installation Models"
    def save(self, *args, **kwargs):
        action = "Created" if self._state.adding else "Updated"
        super(InstallatonModels, self).save(*args, **kwargs)
        # Log the save action
        content_type = ContentType.objects.get_for_model(self)

        
        LogModel.objects.create(
            content_type=content_type,
            object_id=self.id,
            action=action,
            timestamp=timezone.now(),
            description=f"Installation {action}: {self.MILLER_TRANSPORTER_ID} - {self.MILLER_NAME}",
            logged_data={
                'MILLER_NAME': self.MILLER_NAME,
                'vehicle1':self.vehicle1,
                'vehicle1':self.vehicle2,
                'vehicle1':self.vehicle3,
                'InstallationDate':self.InstallationDate.strftime('%Y-%m-%d') if self.InstallationDate else None,
                'Employee_Name':self.Employee_Name,
                'NewRenewal':self.NewRenewal,
                'GPS_IMEI_NO':self.GPS_IMEI_NO,
                'district':self.district,
                'Installation_letterHead':self.Installation_letterHead.url if self.Installation_letterHead else None,  
            }
        )


# https://github.com/MoTechStore/Django-4-and-React-JS-18-File-Upload-and-Download/blob/main/reactjs_django/src/components/UploadFile.js
