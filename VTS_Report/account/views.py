from django.shortcuts import render
# from django.db.models import Count 
import json
from datetime import datetime
from django.contrib.auth import authenticate
from rest_framework.authentication import SessionAuthentication, BasicAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
#from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.status import (
    HTTP_400_BAD_REQUEST,
    HTTP_404_NOT_FOUND,
    HTTP_200_OK,
    HTTP_201_CREATED,
    HTTP_204_NO_CONTENT,
    HTTP_401_UNAUTHORIZED,
)

from django.conf import settings
from account.models import User, SessionYear
from .serializers import UserSerializer, SessionYearListSerializer
from rest_framework.views import APIView
from django.contrib.auth.hashers import check_password
from django.utils.decorators import method_decorator
from .models import UserSessionYear
class UserLogin(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        login_data = request.data  # DRF handles JSON body
        username = login_data.get("username")
        password = login_data.get("password")
        session_year = login_data.get("session_year")  #  New field

        if not username or not password:
            return Response({'status': 'Username & Password required'}, status=HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({'status': 'User not found'}, status=HTTP_404_NOT_FOUND)

        if not user.is_active:
            return Response({'status': 'User Verification is Pending'}, status=HTTP_400_BAD_REQUEST)

        user = authenticate(username=username, password=password)
        if not user:
            return Response({'status': "Invalid Credentials"}, status=HTTP_404_NOT_FOUND)

        #  Generate or get token
        token, _ = Token.objects.get_or_create(user=user)

        #  Save session_year mapping
        if session_year:
            UserSessionYear.objects.update_or_create(
                user=user,
                token=token,
                defaults={"session_year": session_year}
            )

        return self.user_profile(user, token)

    def user_profile(self, user, token):
        user.last_login = datetime.now().strftime("%Y-%m-%dT%H:%M:%SZ")
        user.save()
        result = UserSerializer(user).data

        # fetch latest session_year for this token
        session_obj = UserSessionYear.objects.filter(user=user, token=token).last()
        session_year = session_obj.session_year if session_obj else None

        return Response({
            "msg": "successfully login",
            "Token": token.key,
            "session_year": session_year,
            "user": result
        }, status=HTTP_200_OK)

class IsUserExists(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        payload = json.loads(request.body.decode())
        user_exists = self.username_exists(payload['username'])
        return Response({"user_exists": user_exists}, status=status.HTTP_200_OK)
        
    def username_exists(self, username):
        return User.objects.filter(username=username).exists()

class CreateUser(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        try:
            login_data = json.loads(request.body.decode())
            
            # Check if the username already exists
            if self.username_exists(login_data['username']):
                return Response({"status": "Username already taken"}, status=status.HTTP_400_BAD_REQUEST)
            
        
            
            # # Check if the phone number already exists
            # if User.objects.filter(phone=payload['phone']).exists():
            #     return Response({"status": "Phone number already exists"}, status=status.HTTP_400_BAD_REQUEST)
            
            # Check  length of password
            if len(login_data['password']) <= 8:
                return Response ({"status": "Password length too short, should be greater than 8"}, status=status.HTTP_400_BAD_REQUEST)
            
            if User.objects.filter(phone=login_data['phone']).exists():
                 return Response({"status":"Phone number already exists"}, status=status.HTTP_400_BAD_REQUEST)
            
            
            # Create the user
            user = User(
                first_name=login_data['first_name'],
                last_name=login_data['last_name'],
                email=login_data['email'],
                username=login_data['username'],
                # Assuming phone is a direct field in User
                phone=login_data['phone'],
            )
            user.set_password(login_data['password'])
            user.is_active = login_data['is_active']
            user.save()

            # Serialize the created user
            result = UserSerializer(user).data
            return Response(result, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"errMessage": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    def username_exists(self, username):
        return User.objects.filter(username=username).exists()


# t1=User.objects .values('phone')
# total=t1.count('phone')

# duplicate_phones = (
#     User.objects.values('phone').annotate(total=Count('phone')).filter(total__gt=1)
# )

# duplicate_phones = User.objects.values('phone').annotate(total= note('phone')).filter(total__gt=1)
# print(duplicate_phones)


class ChangePasswordView(APIView):
    authentication_classes=[TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')

        if not check_password(old_password, user.password):
            return Response({'error': 'Invalid old password'}, status=status.HTTP_400_BAD_REQUEST)
        

        try:
            user.set_password(new_password)
            user.save()
            return Response({'message': 'Password changed successfully'}, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)



class WhoAmI(APIView):
    authentication_classes=[TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        token = request.auth  #  current token from request

        # fetch latest session_year for this token
        session_obj = UserSessionYear.objects.filter(user=user, token=token).last()
        session_year = session_obj.session_year if session_obj else None
        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "is_superuser": user.is_superuser,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "session_year": session_year,   
        })
    
    
class SessionYearListView(APIView):
    permission_classes = [AllowAny]  # AllowAny

    def get(self, request, *args, **kwargs):
        session_years = SessionYear.objects.filter(is_active=True).order_by('year')
        serializer = SessionYearListSerializer(session_years, many=True)
        return Response(serializer.data)