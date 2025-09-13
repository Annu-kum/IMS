from account.models import User
from .CONSTANTS import ROLE 


def isUserAdmin(user):
    if User.objects.filter(username=user.username, groups__name=ROLE['admin']).exists():
        return True
    return False