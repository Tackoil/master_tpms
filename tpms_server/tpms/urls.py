from django.conf.urls import url
from django.urls import path
from django.views.static import serve

from . import views

urlpatterns = [
    path('search/', views.main_search),
    path('jc_save/', views.jc_save),
    path('jc_list_get/', views.jc_list_get),
    path('jc_get/', views.jc_get),
    path('jc_delete/', views.jc_delete),
    path('rate_list_get/', views.rate_list_get),
    path('type_list_get/', views.type_list_get),
    path('tjc_save/', views.tjc_save),
    path('tjc_get/', views.tjc_get),
    path('author_list_get/', views.author_list_get),
    path('topic_list_get/', views.topic_list_get),
    path('keyword_list_get/', views.keyword_list_get),
    path('project_list_get/', views.project_list_get),
    path('history_list_get/', views.history_list_get),
    path('pic_post/', views.pic_post),
    path('file_post/', views.file_post),
    url(r'up_image/(?P<path>.*)', serve, {'document_root': 'up_image'}),
    url(r'up_file/(?P<path>.*)', serve, {'document_root': 'up_file'})
]