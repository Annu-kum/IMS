import json
from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Q,Count
from django.contrib.auth import authenticate, login, logout
from rest_framework.views import APIView
from rest_framework.authentication import SessionAuthentication, BasicAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status,generics,filters
#from rest_framework.authtoken.models import Token
from rest_framework.pagination import PageNumberPagination
from .models import User
from .serializers import UserSerializer
from .CONSTANTS import PAGE_SIZE
from .CONSTANTS import ROLE, GROUP
from .commonMethod import isUserAdmin
from rest_framework.generics import RetrieveAPIView,UpdateAPIView,ListAPIView
from rest_framework.exceptions import NotFound
class GetUserById(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    authentication_classes = [SessionAuthentication, TokenAuthentication, BasicAuthentication]
    permission_classes = [AllowAny]
    lookup_field = 'id'

    def get(self, request, *args, **kwargs):
        id = kwargs.get('id', None)
        
        if id:
            try:
                id = User.objects.get(id=id)
                serializer = UserSerializer(id)
                return Response(serializer.data, status=200)
            except User.DoesNotExist:
                raise NotFound(f'id {id} does not exist')
        
        result = User.objects.all().order_by('id')
        serializer = UserSerializer(result, many=True)
        return Response(serializer.data, status=200)
class GetTokenUsers(generics.ListAPIView):
    #authentication_classes = [SessionAuthentication, TokenAuthentication, BasicAuthentication]
    permission_classes = [AllowAny]
    def get(self, request):
        user = User.objects.get(username=request.user.username)
        users = User.objects.none()
        if isUserAdmin(user):
            users = User.objects.all()
        else:
            users = User.objects.filter(createdBy=user)
        search_key = request.GET.get('search_key')
        if search_key:
            users = users.filter(Q(username__icontains=search_key) | Q(first_name__icontains=search_key))
        else:
            users = users.all()
        users |= User.objects.filter(username=user.username)
        users = users.order_by("username")
        paginator = PageNumberPagination()
        paginator.page_size = PAGE_SIZE
        result_page = paginator.paginate_queryset(users, request)
        serializer = UserSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)
    
class GetAllUsers(generics.ListAPIView):
    #authentication_classes = [SessionAuthentication, TokenAuthentication, BasicAuthentication]
    permission_classes = [AllowAny]
    queryset = User.objects.all().order_by('id')
    serializer_class=UserSerializer
    lookup_field = 'id' 

    


class CreateUsersss(generics.CreateAPIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        try:
            payload = json.loads(request.body.decode())
            
            # Check if the username already exists
            if User.objects.filter(username=payload['username']).exists():
                return Response({"status": "Username already taken"}, status=status.HTTP_400_BAD_REQUEST)
            
            # Check if the password length is greater than 8
            if len(payload['password']) <= 8:
                return Response({"status": "Password length too short, should be greater than 8"}, status=status.HTTP_400_BAD_REQUEST)
            
            # Check if the phone number already exists
            if User.objects.filter(phone=payload['phone']).exists():
                return Response({"status": "Phone number already exists"}, status=status.HTTP_400_BAD_REQUEST)
            
            # Create the user
            user = User(
                username=payload['username'],
                email=payload['email'],
                first_name=payload['first_name'],
                last_name=payload['last_name'],
                phone=payload['phone'],
            )
            user.set_password(payload['password'])
            user.is_active = False
            user.save()

            # Serialize the created user
            result = UserSerializer(user).data
            return Response({"status": "User has been registered successfully and is pending verification"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"errorMessage": str(e)}, status=status.HTTP_400_BAD_REQUEST)
class UpdateUser(UpdateAPIView):
    # authentication_classes = [SessionAuthentication, TokenAuthentication, BasicAuthentication]
    permission_classes = [AllowAny]
    queryset=User.objects.all().order_by('username')
    serializer_class=UserSerializer
    lookup_field='username'
    # def put(self, request):
    #     try:
    #         username = request.user.username
    #         user = User.objects.get(username=username)
    #         payload = json.loads(request.body.decode())
    #         #stationId = self.get_reference_model_object(payload, user)
    #         self.clean_user_payload_data(payload)
    #         r_o_username = payload['username']
    #         if 'username' in payload:
    #             del payload['username']
    #         # User.objects.filter(id=payload['id']).update(stationId=stationId, **payload)
    #         user = User.objects.get(username=r_o_username)
    #         result = UserSerializer(User.objects.get(username=r_o_username)).data
    #         return Response(result, status=status.HTTP_200_OK)
    #     except Exception as e:
    #         return Response({"errorMessage": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    # def clean_user_payload_data(self, payload):
    #     # if "stationId" in payload:
    #     #     del payload['stationId']
    #     # if "thanaId" in payload:
    #     #     del payload['thanaId']
    #     # if "districtId" in payload:
    #     #     del payload['districtId']
    #     if "group" in payload:
    #         del payload['group']

    # def get_reference_model_object(self, payload, user):
    #     if "stationId" in payload:
    #         if payload['stationId'] is not None:
    #             stationId = PoliceStationModel.objects.get(id=payload['stationId'])
    #         else:
    #             stationId = None
    #     return stationId


class DeleteUser(generics.DestroyAPIView):
    queryset = User.objects.all().order_by('id')
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter]
    lookup_field = 'id'

    

    def destroy(self, request, *args, **kwargs):
        id = kwargs.get('id', None)
        if id:
            try:
                instance = User.objects.get(id=id)
                instance.delete()
                return Response({'message': 'Record deleted successfully'}, status=status.HTTP_200_OK)
            except User.DoesNotExist:
                return Response({'error': 'Record does not exist'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'error': 'ID parameter is required'}, status=status.HTTP_400_BAD_REQUEST)