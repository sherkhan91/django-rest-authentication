from django.contrib.auth.models import User
from rest_framework import serializers

class CreateUserSerializer(serializers.ModelSerializer):
	class Meta:
		model = User
		fields  = ('id', 'username','first_name','last_name', 'password')


	def create(self, validated_data):
		user = User(**validated_data)
		# Hash the user's password.
		user.set_password(validated_data['password'])
		user.save()
		return user


class UserSerializer(serializers.ModelSerializer):
	class Meta:
		model = User
		fields  = ('username','first_name','last_name')
