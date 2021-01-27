import os
import requests
import graphene
import json
import jwt
from graphene_django import DjangoObjectType
from django.db.models import Q
from base64 import b64decode
from .models import OAuthUser

class OAuthUsersType(DjangoObjectType):
  class Meta:
    model = OAuthUser
    fields = ("id", "first_name", "last_name", "email", "site", "avatar")

class OAuthKeys(graphene.ObjectType):
  class Meta:
    description = "OAuth Keys"

  githubClientId = graphene.String()
  googleClientId = graphene.String()
  linkedInClientId = graphene.String()

class LoginUser(graphene.Mutation):
  class Arguments:
    code = graphene.String()

  user = graphene.Field(OAuthUsersType)

  def mutate(root, info):
    pass


class LoginGithubUser(LoginUser):
  def mutate(root, info, code):
    r = requests.post("https://github.com/login/oauth/access_token", params={
      "client_id": os.environ.get("GITHUB_CLIENT_ID"),
      "client_secret": os.environ.get("GITHUB_CLIENT_SECRET"),
      "code": f"{code}"
    }, headers={
      "Accept": "application/json"
    })

    access_token_string = "token " + r.json()['access_token']
    user_r = requests.get("https://api.github.com/user", headers={
      "Authorization": access_token_string
    })

    user_info = user_r.json()
    first_name, last_name = user_info["name"].split()

    try:
      user = OAuthUser.objects.get(id=user_info["id"], site="GitHub")
    except:
      user = OAuthUser(id=user_info["id"], site="GitHub", first_name=first_name, last_name=last_name, email=(user_info["email"] or f"{first_name}_{last_name}_{user_info['id']}@job-trackr.com"), avatar=user_info["avatar_url"])
      user.set_unusable_password()
    finally:
      info.context.user = user
      return { "user": user }

class LoginGoogleUser(LoginUser):
  def mutate(root, info, code):
    r = requests.post("https://oauth2.googleapis.com/token", params={
      "client_id": os.environ.get("GOOGLE_CLIENT_ID"),
      "client_secret": os.environ.get("GOOGLE_CLIENT_SECRET"),
      "code": code,
      "redirect_uri": "http://localhost:3000/login",
      "grant_type": "authorization_code"
    })

    id_token = r.json()["id_token"].split('.')[1]

    while len(id_token) % 4 != 0:
      id_token += '='

    user_info = json.loads(b64decode(id_token))
    first_name, last_name = user_info["name"].split(" ")

    try:
      user = OAuthUser.objects.get(id=user_info["email"], site="GOOGLE")
    except:
      user = OAuthUser(id=user_info["email"], site="GOOGLE", first_name=first_name, last_name=last_name, email=(user_info["email"] or f"{first_name}_{last_name}_{user_info['id']}@job-trackr.com"), avatar=user_info["picture"])
      user.set_unusable_password()
    finally:
      info.context.user = user
      return { "user": user }

class LoginLinkedInUser(LoginUser):
  def mutate(root, info, code):
    r = requests.get("https://www.linkedin.com/oauth/v2/accessToken", params={
      "grant_type": "authorization_code",
      "code": code,
      "redirect_uri": "http://localhost:3000/login",
      "client_id": os.environ.get("LINKEDIN_CLIENT_ID"),
      "client_secret": os.environ.get("LINKEDIN_CLIENT_SECRET")
    })

    access_token = f'Bearer {r.json()["access_token"]}'

    prof_r = requests.get("https://api.linkedin.com/v2/me", headers={
      "Authorization": access_token
    })

    prof_info = prof_r.json()

    email_r = requests.get("https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))", headers={
      "Authorization": access_token
    })

    email_info = email_r.json()

    pic_r = requests.get("https://api.linkedin.com/v2/me?projection=(id,firstName,lastName,profilePicture(displayImage~:playableStreams))", headers={
      "Authorization": access_token
    })

    pic_info = pic_r.json()

    pic_link = pic_info["profilePicture"]["displayImage~"]["elements"][-1]["identifiers"][0]["identifier"]

    try:
      user = OAuthUser.objects.get(id=prof_info["id"], site="LINKEDIN")
    except:
      user = OAuthUser(id=prof_info["id"], site="LINKEDIN", first_name=prof_info["localizedFirstName"], last_name=prof_info["localizedLastName"], email=(email_info["elements"][0]["handle~"]["emailAddress"] or f"{first_name}_{last_name}_{user_info['id']}@job-trackr.com"), avatar=pic_link)
      user.set_unusable_password()
    finally:
      info.context.user = user
      return { "user": user }


class Mutations(graphene.ObjectType):
  login_github_user = LoginGithubUser.Field()
  login_google_user = LoginGoogleUser.Field()
  login_linkedin_user = LoginLinkedInUser.Field()


class UserQueries(graphene.ObjectType):
  all_users = graphene.List(OAuthUsersType)
  user = graphene.Field(OAuthUsersType, id=graphene.String(), site=graphene.String())

  def resolve_all_users(root, info):
    return OAuthUser.objects.all()

  def resolve_user(root, info, id, site):
    return OAuthUser.objects.get(id=id, site=site)

class OAuthKeyQueries(graphene.ObjectType):
  all_oauth_keys = graphene.Field(OAuthKeys)

  def resolve_all_oauth_keys(root, info):
    return {
      "githubClientId": os.environ.get("GITHUB_CLIENT_ID"),
      "googleClientId": os.environ.get("GOOGLE_CLIENT_ID"),
      "linkedInClientId": os.environ.get("LINKEDIN_CLIENT_ID")
    }

class Query(UserQueries, OAuthKeyQueries):
  pass

schema = graphene.Schema(query=Query, mutation=Mutations)