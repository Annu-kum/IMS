from django.db import models
from django.utils import timezone
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey
from account.models import User
# Create your models here.


class LogModel(models.Model):
    # Fields to track the related model (any of the 4 models)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    username = models.CharField(max_length=150, null=True, blank=True)
    content_type = models.ForeignKey(ContentType,
        on_delete=models.SET_NULL,  # Set to NULL when miller entry is deleted
        null=True,  # Allow NULL values
        blank=True)  # Track the model type
    object_id = models.PositiveIntegerField()  # Track the primary key of the related object
    content_object = GenericForeignKey('content_type', 'object_id')  # Generic relation to any model
    
    action = models.CharField(max_length=50)  # e.g., "Created", "Updated", "Deleted"
    timestamp = models.DateTimeField(auto_now_add=True)
    description = models.TextField()
    logged_data = models.JSONField(null=True, blank=True)  # Store instance data as JSON (optional)

    def __str__(self):
        user_name = self.user.username if self.user else self.username
        return f"Log: {self.action} by {user_name} on {self.content_object} at {self.timestamp}"