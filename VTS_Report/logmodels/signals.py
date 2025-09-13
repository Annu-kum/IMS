from django.db.models.signals import post_save, pre_delete,pre_save
from django.dispatch import receiver
from Installation.models import InstallatonModels
from django.utils import timezone
from logmodels.models import LogModel
from django.contrib.contenttypes.models import ContentType
from Deactivation.models import DeactivationModels
from Reactivation.models import ReactivationModels
from OTREntry.models import OTRData


#Deactivation...
@receiver(pre_delete, sender=DeactivationModels)
def delete(sender,instance, **kwargs):
        
        content_type = ContentType.objects.get_for_model(instance)
        
        # Log the delete action before deletion
        LogModel.objects.create(
            content_type=content_type,
            object_id=instance.id,
            action="Deleted",
            timestamp=timezone.now(),
            description=f"Deactivation Deleted: {instance.MILLER_TRANSPORTER_ID} - {instance.MILLER_NAME}",
            logged_data={
                'MILLER_NAME': instance.MILLER_NAME,
                'vehicle1':instance.vehicle1,
                'vehicle1':instance.vehicle2,
                'vehicle1':instance.vehicle3,
                'DeactivationDate':instance.DeactivationDate.strftime('%Y-%m-%d') if instance.DeactivationDate else None,
                'Employee_Name':instance.Employee_Name,
                'NewRenewal':instance.NewRenewal,
                'GPS_IMEI_NO':instance.GPS_IMEI_NO,
                'district':instance.district,
                'Deactivation_letterHead':instance.Deactivation_letterHead.url if instance.Deactivation_letterHead else None,
            }
        )

#installation...
# Pre-delete signal to handle deletion
@receiver(pre_delete, sender=InstallatonModels)
def log_installation_delete(sender, instance, **kwargs):
          
        content_type = ContentType.objects.get_for_model(instance)
        
        # Log the delete action before deletion
        LogModel.objects.create(
            content_type=content_type,
            object_id=instance.id,
            action="Deleted",
            timestamp=timezone.now(),
            description=f"Installation Deleted: {instance.MILLER_TRANSPORTER_ID} - {instance.MILLER_NAME}",
            logged_data={
                 'MILLER_NAME': instance.MILLER_NAME,
                'vehicle1':instance.vehicle1,
                'vehicle1':instance.vehicle2,
                'vehicle1':instance.vehicle3,
                'InstallationDate':instance.InstallationDate.strftime('%Y-%m-%d') if instance.InstallationDate else None,
                'Employee_Name':instance.Employee_Name,
                'NewRenewal':instance.NewRenewal,
                'GPS_IMEI_NO':instance.GPS_IMEI_NO,
                'district':instance.district,
                'Installation_letterHead':instance.Installation_letterHead.url if instance.Installation_letterHead else None,
            }
        )

#Reactivation...
@receiver(pre_delete, sender=ReactivationModels)
def log_reactivation_delete(sender, instance, **kwargs):
          
        content_type = ContentType.objects.get_for_model(instance)
        
        # Log the delete action before deletion
        LogModel.objects.create(
            content_type=content_type,
            object_id=instance.id,
            action="Deleted",
            timestamp=timezone.now(),
            description=f"Reactivation Deleted: {instance.MILLER_TRANSPORTER_ID} - {instance.MILLER_NAME}",
            logged_data={
                 'MILLER_NAME': instance.MILLER_NAME,
                'vehicle1':instance.vehicle1,
                'vehicle1':instance.vehicle2,
                'vehicle1':instance.vehicle3,
                'ReactivationDate':instance.ReactivationDate.strftime('%Y-%m-%d') if instance.ReactivationDate else None,
                'Employee_Name':instance.Employee_Name,
                'NewRenewal':instance.NewRenewal,
                'GPS_IMEI_NO':instance.GPS_IMEI_NO,
                'district':instance.district,
                'Reactivation_letterHead':instance.Reactivation_letterHead.url if instance.Reactivation_letterHead else None,  
            }
        )

#OTR....
@receiver(pre_delete, sender=OTRData)
def log_otr_delete(sender, instance, **kwargs):
          
        content_type = ContentType.objects.get_for_model(instance)
        
        # Log the delete action before deletion
        LogModel.objects.create(
            content_type=content_type,
            object_id=instance.id,
            action="Deleted",
            timestamp=timezone.now(),
            description=f"Reactivation Deleted: {instance.MILLER_TRANSPORTER_ID} - {instance.MILLER_NAME}",
            logged_data={
                'MILLER_NAME': instance.MILLER_NAME,
                'vehicle1':instance.vehicle1,
                'vehicle1':instance.vehicle2,
                'vehicle1':instance.vehicle3,
                'ExpiryDate':instance.ExpiryDate.strftime('%Y-%m-%d') if instance.ExpiryDate else None,
                'extendedMonth':instance.extendedMonth,
                'nextExpirydate':instance.nextExpirydate.strftime('%Y-%m-%d') if instance.nextExpirydate else None,
                'InstallationDate':instance.InstallationDate.strftime('%Y-%m-%d') if instance.InstallationDate else None,
                'Employee_Name':instance.Employee_Name,
                'OTR':instance.OTR,
                'GPS_IMEI_NO':instance.GPS_IMEI_NO,
                'district':instance.district,
                
            }
        )
