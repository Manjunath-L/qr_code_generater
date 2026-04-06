from django.shortcuts import render
from django.http import HttpResponse


# Create your views here.
def payment(request):
    return HttpResponse("Payment Page")


def payment_done(request):
    return HttpResponse("Payment Done")
