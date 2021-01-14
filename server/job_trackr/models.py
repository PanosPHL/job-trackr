from django.db import models

class OAuthUser(models.Model):
  id = models.CharField(primary_key=True, max_length=256)
  site = models.CharField(max_length=24, choices=[
    ('Google', 'Google'),
    ('GitHub', 'GitHub'),
    ('LinkedIn', 'LinkedIn'),
    ('Indeed', 'Indeed')
    ])
  first_name = models.CharField(max_length=64, null=True)
  last_name = models.CharField(max_length=64, null=True)
  email = models.CharField(max_length=128, null=True)

  class Meta:
    db_table = "users"

  def __str__(self):
    return f"""
    name: {self.first_name} {self.last_name}
    email: {self.email}
    site: {self.site}
    """
