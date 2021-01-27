import json
from django.shortcuts import render
from django.http import HttpResponse
from django.middleware.csrf import get_token
from .auth import generate_jwt

# Create your views here.
def csrf_token(request):
  response = HttpResponse('csrf_token')
  get_token(request)
  return response

def get_jwt(request):
  response = HttpResponse('TOKEN')
  json_data = json.loads(request.body)
  response.set_cookie('TOKEN', generate_jwt(json_data["user"]))
  return response