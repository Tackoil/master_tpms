import json

from django.http import HttpResponse

from .fuzzySearch import *
from .models import *


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
        if query == '':
            res = Journal.objects.all()
        else:
            search_list = Journal.objects.all().values_list('pk', 'name', 'ename', 'shortname')
            res = fuzzy_search(query, list(search_list), fuzzy_core_journal)
            res.sort(key=lambda x: x[1])
            res = map(lambda x: Journal.objects.get(pk=x[0]), res[:5 if len(res) > 5 else len(res)])
        jl = []
        for item in res:
            jl.append(item.export_to_json())
        jl = json.dumps(jl)
        return HttpResponse(jl)
    else:
        return HttpResponse("Error")


def rate_list_get(request):
    if request.method == 'GET':
        jl = []
        for item in JournalRating.objects.all():
            jl.append(item.export_to_json())
        jl = json.dumps(jl)
        return HttpResponse(jl)
    else:
        return HttpResponse("Error")
