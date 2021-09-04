import hashlib
import json
import logging
import os
import traceback
from collections import Counter

from django.db.models import Count
from django.http import HttpResponse

from .fuzzySearch import *
from .models import *


def fuzzy_search_wrapper(query, model, value_list, core, limit=5):
    res = fuzzy_search(query, value_list, core)
    res.sort(key=lambda x: x[1])
    return map(lambda x: model.objects.get(pk=x[0]), res[:limit if len(res) > limit else len(res)])


def main_search(request):
    if request.method == 'POST':
        dt = json.loads(request.body.decode('utf-8'))
        try:
            assert "query" in dt.keys()
            if dt["advance"]:
                ad_form = dt["form"]
                res_list = []
                for key in ad_form:
                    {
                        "comAuthors": lambda x: res_list.append(
                            TJC.objects.filter(journalpaper__com_author__in=map(lambda y: y["pk"], x)).union(
                                TJC.objects.filter(conferencepaper__com_author__in=map(lambda y: y["pk"], x)))
                        ),
                        "date": lambda x: res_list.append(
                            TJC.objects.filter(date__gte=x[0], date__lte=x[1])
                        ),
                        "firstAuthors": lambda x: res_list.append(
                            TJC.objects.filter(authors__author__in=map(lambda y: y["pk"], x), authors__author_order=1)
                        ),
                        "keywords": lambda x: res_list.append(
                            TJC.objects.filter(keyword__in=map(lambda y: y["pk"], x))
                        ),
                        "mentors": lambda x: res_list.append(
                            TJC.objects.filter(authors__author__named_mentor__in=map(lambda y: y["pk"], x)).union(
                                TJC.objects.filter(authors__author__proj_mentor__in=map(lambda y: y["pk"], x)))
                        ),
                        "studentAuthors": lambda x: res_list.append(
                            TJC.objects.filter(authors__author__in=map(lambda y: y["pk"], x),
                                               authors__author__is_student=True)
                        ),
                        "tjc": lambda x: res_list.append(
                            TJC.objects.filter(tjc__in=x)
                        ),
                        "topics": lambda x: res_list.append(
                            TJC.objects.filter(topic__in=map(lambda y: y["pk"], x))
                        )
                    }.get(key, print)(ad_form[key])
                res_list = map(lambda x: list(x.distinct().values_list('pk')), res_list)  # get all's pk
                res_list = Counter([j for k in res_list for i in k for j in i])  # expand and count
                res_list_a = [item[0] for item in res_list.items() if item[1] == len(ad_form.keys())]
                res_list_b = [item[0] for item in res_list.items() if item[1] != len(ad_form.keys())]
                res_a = map(lambda x: TJC.objects.get(pk=x), res_list_a)
                res_b = map(lambda x: TJC.objects.get(pk=x), res_list_b)
            else:
                res_a = TJC.objects.all()
                res_b = []
            jl_a = []
            jl_b = []
            if dt["query"] != '':
                def get_res(res):
                    search_list = []
                    for item in res:
                        tmp_item = [item.pk, item.title, item.intro, item.tjc_id,
                                    list(item.keyword.values_list("name")),
                                    list(item.authors_set.values_list("author__first_name",
                                                                      "author__last_name",
                                                                      "author__alter_first_name",
                                                                      "author__alter_last_name",
                                                                      "author__author_id"))
                                    ]
                        search_list.append(tmp_item)
                    return fuzzy_search_wrapper(dt["query"], TJC, list(search_list), fuzzy_core_tjc)
                res_a = get_res(res_a)
                res_b = get_res(res_b)
            value_list = {
                "tjc": "",
                "title": "",
                "intro": "",
                "is_favor": "",
                "keyword": {
                    "name": "",
                },
                "authors": {
                    "author": {
                        "first_name": "",
                        "last_name": "",
                        "alter_first_name": "",
                        "alter_last_name": ""
                    }
                }
            }
            for item in res_a:
                jl_a.append(item.export_to_json(value=value_list))
            for item in res_b:
                jl_b.append(item.export_to_json(value=value_list))
            jl = json.dumps({"a": jl_a, "b": jl_b})
            return HttpResponse(jl)
        except (AssertionError, ObjectDoesNotExist, MultipleObjectsReturned) as e:
            logging.error(e)
            traceback.print_exc()
            return HttpResponse("Error", status=406)
        except Exception as e:
            traceback.print_exc()
            return HttpResponse("Error", status=500)
    else:
        return HttpResponse("Error", status=405)


def jc_save(request):
    if request.method == "POST":
        dt = json.loads(request.body.decode('utf-8'))
        try:
            assert isinstance(dt, dict), "不允许多个JC"
            assert dt.get("type") in ['j', 'c'], "请正确定义类型"
            jc, _ = JC.load_from_json(dt)
        except (AssertionError, ObjectDoesNotExist, MultipleObjectsReturned) as e:
            logging.error(e)
            traceback.print_exc()
            return HttpResponse("Error", status=406)
        except Exception as e:
            traceback.print_exc()
            return HttpResponse("Error", status=500)
        if "pk" not in dt.keys():
            return HttpResponse(jc.pk)
        else:
            return HttpResponse("ok")
    else:
        return HttpResponse("Error", status=405)


def jc_list_get(request):
    if request.method == 'GET':
        query = request.GET.get('q', '')
        option = request.GET.get('option', 'a')
        try:
            assert option in ['a', 'j', 'c']
            if option == 'a':
                res = JC.objects.all()
            else:
                res = JC.objects.filter(**{"type": option})
            if query != '':
                search_list = res.values_list('pk', 'name', 'ename', 'shortname')
                res = fuzzy_search_wrapper(query, JC, list(search_list), fuzzy_core_journal)
            jl = []
            value_list = {
                "name": "",
                "ename": "",
                "shortname": "",
                "type": "",
                "rate": {
                    "name": "",
                    "rate": ""
                },
                "history": {}
            }
            for item in res:
                jl.append(item.export_to_json(value=value_list))
            jl = json.dumps(jl)
            return HttpResponse(jl)
        except (AssertionError, ObjectDoesNotExist, MultipleObjectsReturned) as e:
            logging.error(e)
            traceback.print_exc()
            return HttpResponse("Error", status=406)
        except Exception as e:
            traceback.print_exc()
            return HttpResponse("Error", status=500)
    else:
        return HttpResponse("Error", status=405)


def jc_get(request):
    if request.method == 'GET':
        pk = request.GET.get('pk')
        assert pk
        item = JC.objects.get(pk=pk)
        jc = item.export_to_json()
        jc = json.dumps(jc)
        return HttpResponse(jc)
    else:
        return HttpResponse("Error", status=405)


def jc_delete(request):
    if request.method == 'GET':
        pk = request.GET.get('pk')
        assert pk
        item = JC.objects.get(pk=pk)
        item.delete()
        return HttpResponse("ok")
    else:
        return HttpResponse("Error", status=405)


def rate_list_get(request):
    if request.method == 'GET':
        qs = Rating.objects.all()
        res = list(map(lambda x: x.export_to_json(), qs))
        res = json.dumps(res)
        return HttpResponse(res)
    else:
        return HttpResponse("Error", status=405)


def type_list_get(request):
    if request.method == 'GET':
        qs = ThesisType.objects.all()
        res = list(map(lambda x: x.export_to_json(), qs))
        res = json.dumps(res)
        return HttpResponse(res)
    else:
        return HttpResponse("Error", status=405)


def topic_list_get(request):
    if request.method == 'GET':
        query = request.GET.get('q', '')
        if query == '':
            res = Topic.objects.all()
        else:
            search_list = Topic.objects.all().values_list('pk', 'name')
            res = fuzzy_search_wrapper(query, Topic, list(search_list), fuzzy_core_short)
        res = list(map(lambda x: x.export_to_json(), res))
        res = json.dumps(res)
        return HttpResponse(res)
    else:
        return HttpResponse("Error", status=405)


def keyword_list_get(request):
    if request.method == 'GET':
        query = request.GET.get('q', '')
        if query == '':
            res = Keyword.objects.all()
        else:
            search_list = Keyword.objects.all().values_list('pk', 'name')
            res = fuzzy_search_wrapper(query, Keyword, list(search_list), fuzzy_core_short)
        res = list(map(lambda x: x.export_to_json(), res))
        res = json.dumps(res)
        return HttpResponse(res)
    else:
        return HttpResponse("Error", status=405)


def project_list_get(request):
    if request.method == 'GET':
        query = request.GET.get('q', '')
        if query == '':
            res = Project.objects.all()
        else:
            search_list = Project.objects.all().values_list('pk', 'name')
            res = fuzzy_search_wrapper(query, Project, list(search_list), fuzzy_core_long)
        res = list(map(lambda x: x.export_to_json(), res))
        res = json.dumps(res)
        return HttpResponse(res)
    else:
        return HttpResponse("Error", status=405)


def author_list_get(request):
    if request.method == 'GET':
        query = request.GET.get('q', '')
        option = request.GET.get('option', '')
        if option:
            assert option in ['stu', 'men']
            res = Author.objects.filter(**{"is_student": {'stu': True, 'men': False}[option]})
        else:
            res = Author.objects.all()
        if query:
            search_list = res.values_list('pk', 'first_name', 'last_name', 'alter_first_name', 'alter_last_name',
                                          'author_id')
            res = fuzzy_search_wrapper(query, Author, list(search_list), fuzzy_core_author)
        res = list(map(lambda x: x.export_to_json(), res))
        res = json.dumps(res)
        return HttpResponse(res)
    else:
        return HttpResponse("Error", status=405)


def tjc_save(request):
    if request.method == "POST":
        dt = json.loads(request.body.decode('utf-8'))
        try:
            assert isinstance(dt, dict), "不允许多个tjc"
            assert dt.get("tjc") in ['t', 'j', 'c'], "请正确定义类型"
            tjc, _ = TJC.load_from_json(dt)
        except (AssertionError, ObjectDoesNotExist, MultipleObjectsReturned) as e:
            logging.error(e)
            return HttpResponse("Error", status=406)
        except Exception as e:
            traceback.print_exc()
            return HttpResponse("Error", status=500)
        if "pk" in dt.keys():
            return HttpResponse(tjc.pk)
        return HttpResponse("ok")
    else:
        return HttpResponse("Error", status=405)


def tjc_get(request):
    if request.method == 'GET':
        pk = request.GET.get('pk')
        assert pk
        item = json.dumps(TJC.objects.get(pk=pk).export_to_json())
        return HttpResponse(item)
    else:
        return HttpResponse("Error", status=405)


def history_list_get(request):
    if request.method == 'GET':
        pk = request.GET.get('pk', '')
        option = request.GET.get('option', '')
        assert pk
        assert option in ['j', 'c']
        res = {'j': JournalHistory, 'c': ConferenceHistory}[option].objects.filter(whose___id=pk)
        res = list(map(lambda x: x.export_to_json(), res))
        res = json.dumps(res)
        return HttpResponse(res)
    else:
        return HttpResponse("Error", status=405)


def pic_post(request):
    if request.method == "POST":
        img = request.FILES.get("file", None)
        if img:
            new_name = hashlib.new('md5', img.read()).hexdigest() + os.path.splitext(img.name)[-1]
            if not os.path.exists('up_image'):
                os.makedirs('up_image')
            save_path = 'up_image/{}'.format(new_name)
            with open(save_path, 'wb') as f:
                for content in img.chunks():
                    f.write(content)
            return HttpResponse(new_name)
        else:
            return HttpResponse("Error", status=405)
    else:
        return HttpResponse("Error", status=405)


def file_post(request):
    if request.method == "POST":
        file = request.FILES.get("file", None)
        if file:
            new_name = file.name
            if not os.path.exists('up_file'):
                os.makedirs('up_file')
            save_path = 'up_file/{}'.format(new_name)
            with open(save_path, 'wb') as f:
                for content in file.chunks():
                    f.write(content)
            return HttpResponse(new_name)
        else:
            return HttpResponse("Error", status=405)
