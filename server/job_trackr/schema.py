import os
import requests
import graphene
from graphene_django import DjangoObjectType
from .models import OAuthUser

class OAuthUsersType(DjangoObjectType):
  class Meta:
    model = OAuthUser
    fields = ("id", "first_name", "last_name", "email", "site")

class OAuthKeys(graphene.ObjectType):
  class Meta:
    description = "OAuth Keys"

  githubClientId = graphene.String()

class LoginGithubUser(graphene.Mutation):
  class Arguments:
    code = graphene.String()

  user_id = graphene.Int()

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

    print(user_r.content)

class Mutations(graphene.ObjectType):
  login_github_user = LoginGithubUser.Field()


class Query(graphene.ObjectType):
  all_users = graphene.List(OAuthUsersType)
  user = graphene.Field(OAuthUsersType, id=graphene.String(), site=graphene.String())

  all_oauth_keys = graphene.Field(OAuthKeys)

  login_github_user = graphene.Field(OAuthUsersType, code=graphene.String())

  def resolve_all_users(root, info):
    return OAuthUser.objects.all()

  def resolve_user(root, info, id, site):
    return OAuthUser.objects.get(id=id, site=site)

  def resolve_all_oauth_keys(root, info):
    return {
      "githubClientId": os.environ.get("GITHUB_CLIENT_ID")
    }

schema = graphene.Schema(query=Query, mutation=Mutations)