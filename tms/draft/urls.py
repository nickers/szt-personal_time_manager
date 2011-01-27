from django.conf.urls.defaults import *
from piston.resource import Resource
from models import *
from views import *

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('draft.views',
    (r'^bilans/(?P<project>[a-zA-Z0-9_.-]+)$', bilans),
)
