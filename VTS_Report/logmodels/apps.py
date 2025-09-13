from django.apps import AppConfig


class LogmodelsConfig(AppConfig):
    # default_auto_field = 'django.db.models.BigAutoField'
    name = 'logmodels'
    

    def ready(self):
      import logmodels.signals 