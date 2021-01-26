import jwt
import os

def generate_jwt(user):
  encoded_jwt = jwt.encode({
    "id": user["id"],
    "email": user["email"],
    "first_name": user["firstName"],
    "last_name": user["lastName"]
  }, os.environ.get("SECRET_KEY"), algorithm="HS256")

  return encoded_jwt
