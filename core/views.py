import logging, settings

from django.views.generic import TemplateView


class Index(TemplateView):
    template_name = "home.html"

    def get_context_data(self, **kwargs):
    	context = super(Index, self).get_context_data(**kwargs)
    	context.update({
    		'ON_PRODUCTION': settings.APPENGINE_PRODUCTION
    	})

    	return context

index = Index.as_view()
