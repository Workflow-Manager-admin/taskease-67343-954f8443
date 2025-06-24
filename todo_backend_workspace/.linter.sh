#!/bin/bash
cd /home/kavia/workspace/code-generation/taskease-67343-954f8443/todo_backend_workspace/todo_backend
source venv/bin/activate
flake8 .
LINT_EXIT_CODE=$?
if [ $LINT_EXIT_CODE -ne 0 ]; then
  exit 1
fi

