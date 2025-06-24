from django.contrib import admin
from .models import Task


# PUBLIC_INTERFACE
@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    """Admin interface for the Task model."""
    list_display = ("id", "title", "is_completed", "created_at", "updated_at")
    list_filter = ("is_completed", "created_at")
    search_fields = ("title", "description")
    ordering = ("-created_at",)
