from django.urls import path
from . import views
from .views import create_preference

app_name = 'brosback'

urlpatterns = [
    path('', views.index, name='index'),
    path('create_preference/', create_preference, name='create_preference'),
]



