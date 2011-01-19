from django.conf.urls.defaults import *
from piston.resource import Resource
from models import *

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

project_handler = Resource(AuthProjectHandler)
note_handler = Resource(AuthNoteHandler)

urlpatterns = patterns('resources.views',
    (r'^test', 'test'),
    (r'^project/', project_handler),
    (r'^note/$', note_handler),
    (r'^note/(?P<id>\d+)$', note_handler),
)