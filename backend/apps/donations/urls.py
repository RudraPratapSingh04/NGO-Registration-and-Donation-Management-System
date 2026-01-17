from django.urls import path,include
from . import views

urlpatterns = [
    path('api/make_donation/' , views.make_donation, name='make_donation'),
]

