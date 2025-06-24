from django.db import models


# PUBLIC_INTERFACE
class Task(models.Model):
    """
    Task model representing a single to-do item.
    """
    title = models.CharField(
        max_length=255,
        help_text="Title of the task"
    )
    description = models.TextField(
        blank=True,
        null=True,
        help_text="Optional description of the task"
    )
    is_completed = models.BooleanField(
        default=False,
        help_text="Task completion status"
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="Timestamp when the task was created"
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="Timestamp when the task was last updated"
    )

    def __str__(self):
        """
        Return a human-readable representation of the task.
        """
        return self.title
