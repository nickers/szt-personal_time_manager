from django.conf.urls.defaults import *
from django.conf import settings

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Example:
    # (r'^tms/', include('tms.foo.urls')),

    (r'^draft/', include('tms.draft.urls')),
    (r'^resources/', include('tms.resources.urls')),

    (r'^static/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.MEDIA_ROOT, 'show_indexes': True}),
    (r'^sdk/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.MEDIA_ROOT + "/sdk/", 'show_indexes': True}),
    (r'^source/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.MEDIA_ROOT, 'show_indexes': True}),
    
    (r'^files/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.DRAFT_UPLOADED_FILES_DIR, 'show_indexes': True}),


    # Uncomment the admin/doc line below to enable admin documentation:
    # (r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    (r'^admin/', include(admin.site.urls)),
)
