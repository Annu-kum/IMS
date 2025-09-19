from rest_framework import serializers
from .models import User, SessionYear
# core/serializers.py
from account.utility import get_user_session_year

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"




class SessionYearSerializer(serializers.ModelSerializer):
    """Base serializer that auto-handles session_year field"""

    class Meta:
        fields = '__all__'
        extra_kwargs = {
            "session_year": {"write_only": True}  #hide from frontend
        }

    def create(self, validated_data):
        request = self.context.get("request")
        session_year = get_user_session_year(request.user)
        validated_data["session_year"] = session_year
        return super().create(validated_data)

    def update(self, instance, validated_data):
        validated_data.pop("session_year", None)  # prevent overriding
        return super().update(instance, validated_data)


class SessionYearListSerializer(serializers.ModelSerializer):
    class Meta:
        model = SessionYear
        fields = ['id', 'year', 'is_active']