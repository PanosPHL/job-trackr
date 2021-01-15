from django.shortcuts import render
from django.http import HttpResponse
from django.middleware.csrf import get_token

# Create your views here.
def csrf_token(request):
  response = HttpResponse('csrf_token')
  get_token(request)
  return response