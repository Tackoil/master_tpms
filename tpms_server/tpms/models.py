from django.db import models


# Create your models here.
class Journal(models.Model):
    name = models.CharField(max_length=100, blank=True, null=True)
    ename = models.CharField(max_length=100, blank=True, null=True)
    shortname = models.CharField(max_length=20, blank=True, null=True)
    deadline = models.BigIntegerField(blank=True, null=True)
    publish = models.BigIntegerField(blank=True, null=True)



