from django.apps import AppConfig


class BattlesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'battles'
    def ready(self):
        import battles.signals  # noqa