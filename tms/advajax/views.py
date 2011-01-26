from models import *
from django.http import HttpResponse

def test(request):
    model = AuthProject(request.user)
    return HttpResponse("Hello world " + unicode(model))