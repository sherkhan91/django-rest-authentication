from django.urls import path
from . import views
from django.views.decorators.csrf import csrf_exempt

urlpatterns = [
    path('', views.index, name='index'),
    path('create', views.create_view, name='createuser'),
	path('login',csrf_exempt(views.login_view), name='loginuser'),
    path('update', views.update_view, name='updateuser'),
    path('remove', views.remove_view, name='removeuser'),
    path('get', views.get_view, name='getuser'),
	path('logout', views.Logout.as_view(), name='logoutuser'),
]