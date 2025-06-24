from rest_framework import serializers
from .models import Task


# PUBLIC_INTERFACE
class TaskSerializer(serializers.ModelSerializer):
    """
    Serializer for the Task model, handles validation and representation.
    """
    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'is_completed', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
