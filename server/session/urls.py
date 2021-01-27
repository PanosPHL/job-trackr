from django.urls import path
from . import views

urlpatterns = [
  path("csrf/", views.csrf_token),
  path("jwt/", views.get_jwt)
]