import React, { useState } from 'react';
import './App.css';

/*
PUBLIC_INTERFACE
TaskItem Component

Renders an individual task, including its details and action buttons for editing, deleting, and completion status.
Props:
- task: Object (task data)
- onEdit: function(task) => void
- onDelete: function(task.id) => void
- onToggleComplete: function(task.id) => void
*/
function TaskItem({ task, onEdit, onDelete, onToggleComplete }) {
  return (
    <div className={`task-card${task.completed ? ' completed' : ''}`}>
      <div className="task-main">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggleComplete(task.id)}
          aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
        />
        <span className="task-title">{task.title}</span>
      </div>
      <div className="task-actions">
        <button
          className="btn btn-secondary"
          title="Edit Task"
          onClick={() => onEdit(task)}
        >
          ✏️
        </button>
        <button
          className="btn btn-danger"
          title="Delete Task"
          onClick={() => onDelete(task.id)}
        >
          🗑️
        </button>
      </div>
    </div>
  );
}

/*
PUBLIC_INTERFACE
TaskForm Component

Displays a form for adding a new task or editing an existing one.
Props:
- onSubmit: function({title, id?}) => void
- editingTask: object (current task to edit) or null
- onCancel: function() => void
*/
function TaskForm({ onSubmit, editingTask, onCancel }) {
  const [title, setTitle] = useState(editingTask ? editingTask.title : '');

  // If editingTask changes, reset input to match task title
  React.useEffect(() => {
    setTitle(editingTask ? editingTask.title : '');
  }, [editingTask]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() === '') return;
    onSubmit({ title: title.trim(), id: editingTask ? editingTask.id : undefined });
    setTitle('');
  };

  return (
    <form className="task-form" onSubmit={handleSubmit} autoComplete="off">
      <input
        className="task-input"
        type="text"
        placeholder={editingTask ? "Edit task" : "What needs to be done?"}
        maxLength={120}
        value={title}
        onChange={e => setTitle(e.target.value)}
        aria-label="Task title"
        autoFocus
      />
      <button className="btn btn-primary" type="submit">
        {editingTask ? "Update" : "Add"}
      </button>
      {editingTask && (
        <button
          className="btn btn-secondary"
          type="button"
          onClick={onCancel}
        >
          Cancel
        </button>
      )}
    </form>
  );
}

/*
PUBLIC_INTERFACE
TaskList Component

Displays the list of tasks in cards, sorted with incomplete tasks on top.
Props:
- tasks: array of task objects
- onEdit, onDelete, onToggleComplete: handlers passed to TaskItem
*/
function TaskList({ tasks, onEdit, onDelete, onToggleComplete }) {
  const sortedTasks = [...tasks].sort(
    (a, b) => Number(a.completed) - Number(b.completed)
  );
  if (sortedTasks.length === 0) {
    return (
      <div className="empty-state">
        <span>📝 No tasks yet. Add your first task above!</span>
      </div>
    );
  }

  return (
    <div className="task-list">
      {sortedTasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleComplete={onToggleComplete}
        />
      ))}
    </div>
  );
}

/*
App Component
- Layout: fixed header, centered list and form.
- Minimal, modern dark design using CSS variables and classes from App.css.
- All components are ready for API integration but use in-memory mock state for now.
*/
function App() {
  // Example tasks for demonstration before API integration:
  const initialTasks = [
    { id: 1, title: 'Read a book 📖', completed: false },
    { id: 2, title: 'Create a To Do app ✔️', completed: true },
  ];
  const [tasks, setTasks] = useState(initialTasks);
  const [editingTask, setEditingTask] = useState(null);

  // Simulating add/edit:
  const handleAddOrEdit = ({ title, id }) => {
    if (id) {
      setTasks(tasks =>
        tasks.map(t => (t.id === id ? { ...t, title } : t))
      );
      setEditingTask(null);
    } else {
      const nextId = tasks.length ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
      setTasks(tasks => [{ id: nextId, title, completed: false }, ...tasks]);
    }
  };
  const handleEdit = (task) => setEditingTask(task);
  const handleCancelEdit = () => setEditingTask(null);
  const handleDelete = (id) => setTasks(tasks => tasks.filter(t => t.id !== id));
  const handleToggleComplete = (id) =>
    setTasks(tasks =>
      tasks.map(t =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );

  return (
    <div className="app">
      <nav className="navbar">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div className="logo">
              <span className="logo-symbol">*</span> TaskEase
            </div>
            <span className="navbar-right">Modern To-Do List App</span>
          </div>
        </div>
      </nav>
      <main className="main-content">
        <div className="container task-container">
          <div className="section">
            <h1 className="title" style={{ fontSize: '2.2rem', marginTop: 26 }}>
              {editingTask ? "Edit Task" : "Add a Task"}
            </h1>
            <TaskForm
              onSubmit={handleAddOrEdit}
              editingTask={editingTask}
              onCancel={handleCancelEdit}
            />
          </div>
          <div className="section">
            <h2 className="subtitle" style={{ marginTop: 32, marginBottom: 12 }}>
              Your Tasks
            </h2>
            <TaskList
              tasks={tasks}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleComplete={handleToggleComplete}
            />
          </div>
        </div>
      </main>
      <footer className="footer">
        <div className="container" style={{ padding: '16px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: 13 }}>
          © {new Date().getFullYear()} TaskEase &mdash; Modern To-Do App UI
        </div>
      </footer>
    </div>
  );
}

export default App;

/* --- CSS class guide for editing App.css to match this UI ---
.task-container {
  padding-top: 120px;
  max-width: 520px;
  margin: 0 auto;
}
.task-form {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
.task-input {
  flex: 1;
  padding: 11px 14px;
  background: #24243a;
  border: 1px solid var(--border-color);
  color: var(--text-color);
  border-radius: 4px;
  font-size: 1.05rem;
}
.btn-primary {
  background: var(--base-light);
  color: #000;
}
.btn-secondary {
  background: #313160;
  color: var(--text-color);
}
.btn-danger {
  background: #c43c39;
  color: #fff;
}
.task-card {
  background: #212139;
  padding: 16px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  border-radius: 6px;
  border: 1px solid var(--border-color);
  transition: background 0.13s;
}
.task-card.completed .task-title {
  text-decoration: line-through;
  color: var(--text-secondary);
  opacity: 0.7;
}
.task-main {
  display: flex;
  align-items: center;
  gap: 11px;
}
.task-actions button {
  margin-left: 5px;
}
.empty-state {
  color: var(--text-secondary);
  padding: 32px 0 24px;
  text-align: center;
  font-size: 1.08rem;
}
@media (max-width: 540px) {
  .task-container {
    max-width: 100%;
    padding-left: 8px;
    padding-right: 8px;
  }
}
-------------------------------------------------------------- */
