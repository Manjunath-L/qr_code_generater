from django.urls import path
from . import views

urlpatterns = [
    # path('', views.home,name='index'),
    path("index/", views.team, name="index_page"),
    # path("sample/", views.divisible, name="sample_page"),
    # path("sun_of_two/<int:a>/<int:b>", views.sum_of_two, name="sum_of_two"),
]
