# utils.py
from .models import UserSessionYear

def get_user_session_year(user):
    try:
        token = user.auth_token
        session_obj = UserSessionYear.objects.get(user=user, token=token)
        return session_obj.session_year
    except UserSessionYear.DoesNotExist:
        return None
    
class SessionYearMixin:
    def get_queryset(self):
        queryset = super().get_queryset()
        session_year = get_user_session_year(self.request.user)
        if session_year:
            return queryset.filter(session_year=session_year)
        return queryset.none()
