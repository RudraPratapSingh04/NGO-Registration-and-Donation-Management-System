from django.urls import path,include
from . import views

urlpatterns = [
    path("api/create-donation/", views.create_donation),
path("api/capture-donation/<str:order_id>/", views.capture_donation),

]


