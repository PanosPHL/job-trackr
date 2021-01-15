import os
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
  githubClientSecret = graphene.String()

class Query(graphene.ObjectType):
  all_users = graphene.List(OAuthUsersType)
  user = graphene.Field(OAuthUsersType, id=graphene.String(), site=graphene.String())
  all_oauth_keys = graphene.Field(OAuthKeys)

  def resolve_all_users(root, info):
    return OAuthUser.objects.all()

  def resolve_user(root, info, id, site):
    return OAuthUser.objects.get(id=id, site=site)

  def resolve_all_oauth_keys(root, info):
    return {
      "githubClientId": os.environ.get("GITHUB_CLIENT_ID"),
      "githubClientSecret": os.environ.get("GITHUB_CLIENT_SECRET")
    }

schema = graphene.Schema(query=Query)