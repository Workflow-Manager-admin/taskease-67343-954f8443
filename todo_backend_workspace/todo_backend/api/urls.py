from django.urls import path
from .views import (
    health,
    task_list_create,
    task_detail,
    task_mark_complete,
)

urlpatterns = [
    path('health/', health, name='Health'),
    path('tasks/', task_list_create, name='task-list-create'),
    path('tasks/<int:pk>/', task_detail, name='task-detail'),
    path('tasks/<int:pk>/complete/', task_mark_complete, name='task-mark-complete'),
]
