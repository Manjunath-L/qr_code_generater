from calendar import c

from django.http import HttpResponse
from django.shortcuts import render

# Create your views here.
# def index(request):
#     return render(request,'index.html')


def team(request):
    context = {
        "name": "Manjunath L",
        "place": "Bangalore",
        "para": "This is a simple paragraph.",
        "va": ["a", "b", "c", "d"],
        "emp": {
            "name": "Manjunath L",
            "age": 22,
            "sal": 35000,
        },
    }
    return render(request, "index.html", context)


# def index(request):
#     if request.method == "POST":
#         name = request.POST.get("name")  # get input value

#         context = {"name": name, "place": "Bangalore"}

#         context = {
#             "emp": {"name": "john"},
#             "sentence": "I love django",
#             "word": "madam",
#         }

#         return render(request, "index.html", context)

#     return render(request, "index.html")


# def divisible(request):
#     context = {"num": 10, "word": "Hello World"}
#     return render(request, "sample.html", context)


# def sum_of_two(request, a, b):
#     context = {"a": a, "b": b, "c": a + b}
#     return render(request, "sum")
