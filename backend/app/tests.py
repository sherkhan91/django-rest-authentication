from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase  # Instead of APIClieant() all time
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token  # for auth, update user purposes.


class CreateUserTest(APITestCase):

    def setUp(self):
        self.data  = {'username': 'testuser', 'first_name': 'test_fname', 'last_name': 'test_lname', 'password': 'Qwerty123?', 'password2': 'Qwerty123?'}

    def test_create_user(self):
        response = self.client.post(reverse('createuser'), self.data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


class UpdateUserTest(APITestCase):
    
    def setUp(self):
        self.user = User.objects.create(username='testuser')
        self.user.set_password('Qwerty123?')
        self.user.save()
        self.token = Token.objects.create(user=self.user)


    def test_update_user(self):
        self.client.force_login(user=self.user)
        response = self.client.patch(reverse('updateuser'), data = {'ufirst_name': 'test_user_fupdate', 'ulast_name': 'test_user_lupdate'},\
        format='json', HTTP_AUTHORIZATION='Token '+self.token.key)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class RemoveUserTest(APITestCase):

    def setUp(self):
        self.user = User.objects.create(username='testuser')
        self.user.set_password('Qwerty123?')
        self.user.save()
        self.token = Token.objects.create(user=self.user)

    def test_remove_user(self):
        response = self.client.delete(reverse('removeuser'), HTTP_AUTHORIZATION='Token '+self.token.key)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
