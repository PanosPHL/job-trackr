import graphene
from graphene_django import DjangoObjectType
from .models import OAuthUser

class OAuthUsersType(DjangoObjectType):
  class Meta:
    model = OAuthUser
    fields = ("id", "first_name", "last_name", "email", "site")

class Query(graphene.ObjectType):
  all_users = graphene.List(OAuthUsersType)

  def resolve_all_users(root, info):
    return OAuthUser.objects.all()

schema = graphene.Schema(query=Query)