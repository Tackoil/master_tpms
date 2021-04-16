from django.http import HttpResponse


def index(request):
    return HttpResponse("Hello World.")


def main_search(request):
    return HttpResponse("Main Search.")


def fuzzy_match(request):
    return HttpResponse("fuzzy_match")

