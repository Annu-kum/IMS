from rest_framework import serializers
from .models import User, SessionYear
# core/serializers.py
from account.utility import get_user_session_year

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"




class SessionYearSerializer(serializers.ModelSerializer):
    """
    Base serializer that automatically injects session_year 
    (based on user’s active session) during create().
    """

    class Meta:
        fields = "__all__"
        extra_kwargs = {
            "session_year": {"write_only": True}  # hide from frontend
        }

    def create(self, validated_data):
        request = self.context.get("request")

        #  Defensive check
        if not request:
            raise serializers.ValidationError("Request context missing in serializer.")

        #  Pass user and request (for token-based session detection)
        session_year = get_user_session_year(request.user)
        if not session_year:
            raise serializers.ValidationError("Session year not found for this user.")

        validated_data["session_year"] = session_year
        return super().create(validated_data)

    def update(self, instance, validated_data):
        #  Never allow manual override of session_year
        validated_data.pop("session_year", None)
        return super().update(instance, validated_data)



class SessionYearListSerializer(serializers.ModelSerializer):
    class Meta:
        model = SessionYear
        fields = ['id', 'year', 'is_active']