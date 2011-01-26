from django.conf.urls.defaults import *
from models import *

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()


urlpatterns = patterns('advajax.views',
    (r'^', 'test'),
)
