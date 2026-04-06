from django.shortcuts import render
from django.http import HttpResponse


# Create your views here.
def payment(request):
    return HttpResponse("<h1 style='color:red;'>Payment Page</h1>")


def payment_done(request):
    return HttpResponse("Payment Done")
