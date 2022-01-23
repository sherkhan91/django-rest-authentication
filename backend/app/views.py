from django.http import HttpResponse, JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import api_view, permission_classes, authentication_classes,api_view
from rest_framework.permissions import IsAuthenticated
from .serializers import CreateUserSerializer, UserSerializer



def index(request):
	return HttpResponse('Welcome to django')


@api_view(['POST'])
@csrf_exempt
def create_view(request):
	try:
		if request.data['password'] != request.data['password2']:
			return JsonResponse({'message': 'passwords do not match.'}, status=status.HTTP_400_BAD_REQUEST)
	except KeyError:
		return JsonResponse({'message':'Please provide password and password2 fields.'}, status=status.HTTP_400_BAD_REQUEST)
	serializer =  CreateUserSerializer(data=request.data)
	
	if serializer.is_valid():
		serializer.save()
		message =''.join(['user is created: ',serializer.data['username']])
		return JsonResponse({'message': message}, status=status.HTTP_201_CREATED)
	else: 
		return JsonResponse({'message': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@csrf_exempt
def login_view(request):
	try:
		uname = request.data['username']
		passw = request.data['password']
	except KeyError:
		return JsonResponse({'message':'username/password is not provided '}, status=status.HTTP_400_BAD_REQUEST)
	
	if not User.objects.filter(username=uname).exists():
		return JsonResponse({'message':'Could not find user in record, please register.'}, status=status.HTTP_404_NOT_FOUND)

	user = authenticate(username=uname, password=passw)
	if user is not None:
		login(request,user)
		token =  Token.objects.get_or_create(user=user)  # Create token for update and delete.
		return JsonResponse({'message':'successfully logged in', 'token':str(token[0])},  status=status.HTTP_200_OK)  # May be use JWT later on.

	return JsonResponse({'message':'Please check your username and password.'}, status=status.HTTP_400_BAD_REQUEST)


@authentication_classes((TokenAuthentication,))
@permission_classes((IsAuthenticated,))
class Logout(APIView):
	def get(self,request):
		# simply to delete token to force an authentication
		request.user.auth_token.delete()
		return JsonResponse({'message':'Successfully logged out'}, status=status.HTTP_200_OK)


@api_view(['PATCH'])
@authentication_classes((TokenAuthentication,))
@permission_classes((IsAuthenticated,))
def update_view(request):
	# don't allow the user to change basic username, keep it simple
	user_instance = request.user
	user =  User.objects.get(username__exact=user_instance.username)
	try:
		user.first_name = request.data['ufirst_name']
		user.last_name = request.data['ulast_name']
	except KeyError:
		return JsonResponse({'error': 'blank fields, please fill in first, last name'}, status=status.HTTP_400_BAD_REQUEST)
	
	user.save()
	return JsonResponse({'message':'User details has been updated successfully.'}, status=status.HTTP_200_OK)


@api_view(['DELETE'])
@authentication_classes((TokenAuthentication,))
@permission_classes((IsAuthenticated,))
def remove_view(request):
	request.user.auth_token.delete()  # Delete token to avoid token being left later.
	try:
		user = User.objects.get(username = request.user)
		user.delete()
		return JsonResponse({'message':'The user has been removed.'}, status=status.HTTP_200_OK)            
	except Exception as e: 
		return JsonResponse({'error': e.message}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@authentication_classes((TokenAuthentication,))
@permission_classes((IsAuthenticated,))
def get_view(request):
	user = User.objects.get(username = request.user)
	serializer  = UserSerializer(user)
	return JsonResponse({'data': serializer.data}, status=status.HTTP_200_OK)
