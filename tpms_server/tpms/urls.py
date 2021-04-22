from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('search/', views.main_search),
    path('journal_save/', views.journal_save),
    path('journal_list_get/', views.journal_list_get),
    path('rate_list_get/', views.rate_list_get)
]