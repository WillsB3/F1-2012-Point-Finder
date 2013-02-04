from django.conf.urls.defaults import url, patterns, include

urlpatterns = patterns(
    'core.views',
    url(r'.*$', 'index', {}, name='index'),
)
