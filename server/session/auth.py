import jwt
import os

def generate_jwt(user):
  encoded_jwt = jwt.encode(user, os.environ.get("SECRET_KEY"), algorithm="HS256")
  return encoded_jwt
