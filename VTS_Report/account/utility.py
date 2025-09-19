from .models import UserSessionYear
from rest_framework.authtoken.models import Token

def get_user_session_year(user):
    """
    Logged-in user ke current token ke basis par session_year return karega.
    Agar mapping nahi mili to None return karega.
    """
    try:
        token = user.auth_token  # DRF resolve automatically token for authenticated user 
        session_obj = UserSessionYear.objects.filter(user=user, token=token).last()
        return session_obj.session_year if session_obj else None
    except Exception:
        return None
    


class SessionYearMixin:
    def get_queryset(self):
        queryset = super().get_queryset()
        user = self.request.user

        # if user is authenticated, get session_year from user
        if user.is_authenticated:
            session_year = get_user_session_year(user)
        else:
            # otherwise, try to get session_year from token in request headers
            auth_header = self.request.headers.get("Authorization")
            session_year = None
            if auth_header and auth_header.startswith("Token "):
                token_key = auth_header.split(" ")[1]
                try:
                    token = Token.objects.get(key=token_key)
                    session_year = get_user_session_year(token.user)
                except Token.DoesNotExist:
                    pass
        if session_year:
            return queryset.filter(session_year=session_year)
        return queryset.none()

