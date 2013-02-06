import logging

from django.views.generic import TemplateView


class Index(TemplateView):
    template_name = "home.html"

index = Index.as_view()
