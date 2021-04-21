import json
import logging

from django.http import HttpResponse
from .models import Journal
from django.core import serializers


def index(request):
    return HttpResponse("Hello World.")


def main_search(request):
    return HttpResponse("Main Search.")


def journal_save(request):
    if request.method == 'POST':
        dt = json.loads(request.body.decode('utf-8'))
        Journal.load_from_json(dt)
        return HttpResponse("ok")
    else:
        return HttpResponse("Error")


def journal_list_get(request):
    if request.method == 'GET':
        query = request.GET.get('q', '')
        print(query)
        jl = []
        for item in Journal.objects.all():
            jl.append(item.export_to_json())
        jl = json.dumps(jl)
        return HttpResponse(jl)
    else:
        return HttpResponse("Error")
