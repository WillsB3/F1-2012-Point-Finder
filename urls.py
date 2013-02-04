from django.conf.urls.defaults import url, patterns, include

urlpatterns = patterns(
    (r'', include('core.urls')),
)
