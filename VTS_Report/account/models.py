from django.db import models
from django.contrib.auth.models import AbstractBaseUser
from django.contrib.auth.models import BaseUserManager
from django.contrib.auth.models import PermissionsMixin
from django.contrib.auth.models import Group
from django.conf import settings
from django.contrib.auth.hashers import check_password
from django.contrib.auth import password_validation
# Create your models here.

class UserManager(BaseUserManager):

    def create_user(self, username, password=None, **extra_fields):
        """Create and saves a new user """
        if not username:
            raise ValueError('user name must be non empty')
        user = self.model(username=username.lower(), **extra_fields)
        user.set_password(password)
        user.save(using=self._db)


        return user

    def create_superuser(self, username, password):
        """ Create and saves super user """
        user = self.create_user(username, password)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)

        return user


class User(AbstractBaseUser, PermissionsMixin):
    """ Custom user model that supports using username """
    username = models.CharField(max_length=255, unique=True)
    first_name = models.CharField(max_length=30, blank=True)
    last_name = models.CharField(max_length=30, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    email = models.EmailField(max_length = 254,blank=True)
    phone = models.CharField(max_length=10, unique=True, blank=True)
    groups = models.ManyToManyField(Group,blank=True)
    # districtId = models.ForeignKey(DistrictModel, on_delete=models.CASCADE, blank=True, null=True)
    createdBy = models.ForeignKey(settings.AUTH_USER_MODEL,related_name='created', on_delete=models.CASCADE,null=True, blank=True)
    objects = UserManager()

    USERNAME_FIELD = 'username'
    class Meta:
        ordering = ['username']
    def change_password(self, old_password, new_password):
        """
        Change user's password.
        """
        if not check_password(old_password,self.password):
            raise ValueError('Invalid old password')
        
        # Validate new password
        #password_validation.validate_password(new_password, self)

        # Set and save new password
        self.set_password(new_password)
        self.save()

        return True