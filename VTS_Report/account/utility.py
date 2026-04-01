from .models import UserSessionYear
from rest_framework.authtoken.models import Token
from django.db.models import Q

def get_user_session_year(user, request=None):
    try:
        token = None
        if request and hasattr(request, "auth") and request.auth:
            token = request.auth
        elif hasattr(user, "auth_token"):
            token = user.auth_token
        if not token:
            return None

        session_obj = UserSessionYear.objects.filter(user=user, token=token).last()
        return session_obj.session_year if session_obj else None
    except Exception as e:
        print(f"[get_user_session_year] Error: {e}")
        return None


class SessionYearMixin:
    def get_queryset(self):
        queryset = super().get_queryset()
        request = self.request
        user = getattr(request, "user", None)
        token = getattr(request, "auth", None)

        session_year = None
        if user and token:
            session_year = get_user_session_year(user, request)
        elif token:
            session_year = get_user_session_year(token.user, request)

        if session_year:
            model_name = queryset.model.__name__
            if model_name in ["MillersEntrymodel","Dealersmodel"]:
                return queryset.filter(Q(session_year=session_year) | Q(session_year__isnull=True))
            return queryset.filter(session_year=session_year)

        return queryset.none()
# restrict users for different fields
def get_filtered_queryset(queryset, user):

    if user.is_restricted:
        return queryset.exclude(
            Q(MILLER_TRANSPORTER_ID="TR00000") |
            Q(district="ANY")
        )

    return queryset


# def get_user_session_year(user, request=None):
#     """
#     Safely fetch the session_year for the logged-in user.
#     Works with both authenticated requests and direct token lookups.
#     """
#     try:
#         token = None

#         # Priority 1: Request.auth (used by DRF)
#         if request and hasattr(request, "auth") and request.auth:
#             token = request.auth
#         #  Priority 2: user.auth_token (for directly authenticated user)
#         elif hasattr(user, "auth_token"):
#             token = user.auth_token

#         if not token:
#             return None

#         session_obj = (
#             UserSessionYear.objects.filter(user=user, token=token).last()
#         )
#         return session_obj.session_year if session_obj else None

#     except Exception as e:
#         print(f"[get_user_session_year] Error: {e}")
#         return None


# class SessionYearMixin:
#     """
#     Automatically filters queryset based on the logged-in user's active session_year.
#     Supports models inheriting from SessionYearBase.
#     """

#     def get_queryset(self):
#         queryset = super().get_queryset()
#         request = getattr(self, "request", None)
#         user = getattr(request, "user", None)
#         token = getattr(request, "auth", None)

#         session_year = None

#         # Safely determine session_year
#         if user and user.is_authenticated:
#             session_year = get_user_session_year(user, request)
#         elif token:
#             try:
#                 token_obj = Token.objects.get(key=token)
#                 session_year = get_user_session_year(token_obj.user)
#             except Token.DoesNotExist:
#                 pass

#         if session_year:
#             model_name = queryset.model.__name__

#             # Some models allow null session_year (e.g. master data)
#             if model_name in ["MillersEntrymodel"]:
#                 return queryset.filter(Q(session_year=session_year) | Q(session_year__isnull=True))

#             #  Strict filter for all session-based models
#             return queryset.filter(session_year=session_year)

#         # Return empty queryset if no session context available
#         return queryset.none()