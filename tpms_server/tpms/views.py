import json
import logging

from django.http import HttpResponse
from .models import Journal
from django.core import serializers


def index(request):
    return HttpResponse("Hello World.")


def main_search(request):
    return HttpResponse("Main Search.")


def fuzzy_match(request):
    return HttpResponse("fuzzy_match")


def journal_save(request):
    if request.method == 'POST':
        dt = json.loads(request.body.decode('utf-8'))
        print(dt)
        if 'uid' in dt.keys():
            j = Journal.objects.get(id=int(dt['uid']))
        else:
            j = Journal()
        for key in j.all_field:
            setattr(j, key, dt.get(key))
        j.save()
        return HttpResponse("ok")
    else:
        return HttpResponse("Error")


def journal_list_get(request):
    if request.method == 'GET':
        query = request.GET.get('q', '')
        print(query)
        jl = serializers.serialize("json", Journal.objects.all())
        return HttpResponse(jl)
    else:
        return HttpResponse("Error")
