import React, { useState } from 'react';
import './App.css';

/*
PUBLIC_INTERFACE
TaskItem Component

A modern, minimalistic card for an individual task, with animated check toggle, refined icons, and subtle effects.
Props:
- task: Object (task data)
- onEdit: function(task) => void
- onDelete: function(task.id) => void
- onToggleComplete: function(task.id) => void
*/
function TaskItem({ task, onEdit, onDelete, onToggleComplete }) {
  return (
    <div
      className={`task-card${task.completed ? ' completed' : ''}`}
      tabIndex={0}
      aria-label={`${task.completed ? 'Completed' : 'Incomplete'} task: ${task.title}`}
      style={{ animation: 'fadeInUp 0.42s cubic-bezier(.3,.81,.52,1.02)' }}
    >
      <div className="task-main">
        <label className="checkbox-custom">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggleComplete(task.id)}
            aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
          />
          <span />
        </label>
        <span className="task-title">{task.title}</span>
      </div>
      <div className="task-actions">
        <button
          className="btn btn-secondary btn-anim"
          title="Edit Task"
          aria-label="Edit Task"
          onClick={() => onEdit(task)}
        >
          <span role="img" aria-label="Edit">✏️</span>
        </button>
        <button
          className="btn btn-danger btn-anim"
          title="Delete Task"
          aria-label="Delete Task"
          onClick={() => onDelete(task.id)}
        >
          <span role="img" aria-label="Delete">🗑️</span>
        </button>
      </div>
    </div>
  );
}

/*
PUBLIC_INTERFACE
TaskForm Component

Enhanced modern To Do input form with floating label and built-in animation cues.
Props:
- onSubmit: function({title, id?}) => void
- editingTask: object (current task to edit) or null
- onCancel: function() => void
*/
function TaskForm({ onSubmit, editingTask, onCancel }) {
  const [title, setTitle] = useState(editingTask ? editingTask.title : '');
  const [inputFocused, setInputFocused] = useState(false);

  // Reset input when editingTask changes
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
    <form
      className="task-form"
      onSubmit={handleSubmit}
      autoComplete="off"
      style={{ animation: 'fadeInDown 0.40s cubic-bezier(.44,.89,.63,1.15)' }}
    >
      <div className={`input-wrapper${inputFocused || title ? ' focus' : ''}`}>
        <input
          className="task-input"
          type="text"
          placeholder=" "
          maxLength={120}
          value={title}
          onChange={e => setTitle(e.target.value)}
          aria-label="Task title"
          onFocus={() => setInputFocused(true)}
          onBlur={() => setInputFocused(false)}
          autoFocus
        />
        <span className="floating-label">
          {editingTask ? "Edit your task" : "Add a new task"}
        </span>
      </div>
      <button className="btn btn-primary" type="submit" aria-label={editingTask ? "Update Task" : "Add Task"}>
        {editingTask ? "Update" : "Add"}
      </button>
      {editingTask && (
        <button
          className="btn btn-secondary"
          type="button"
          style={{ marginLeft: 4 }}
          aria-label="Cancel Edit"
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

Lists tasks in animated cards, showing empty state when needed.
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
      <div className="empty-state fadein-delay">
        <span>📝 No tasks yet. <span className="empty-highlight">Add your first task above!</span></span>
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
  - Responsive single-page layout
  - Minimal, modern dark design
  - Subtle animations for improved experience
  - All CRUD and UI-state logic is retained
*/
function App() {
  // Demo tasks for initial render
  const initialTasks = [
    { id: 1, title: 'Read a book 📖', completed: false },
    { id: 2, title: 'Create a To Do app ✔️', completed: true },
  ];
  const [tasks, setTasks] = useState(initialTasks);
  const [editingTask, setEditingTask] = useState(null);

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
      <nav className="navbar glassy">
        <div className="container navbar-row">
          <span className="logo" tabIndex={0} aria-label="TaskEase Logo">
            <span className="logo-symbol">*</span> TaskEase
          </span>
          <span className="navbar-right">Modern To-Do List App</span>
        </div>
      </nav>
      <main className="main-content">
        <div className="container task-container">
          <div className="section">
            <h1 className="title shrinkin">
              {editingTask ? "Edit Task" : "Add a Task"}
            </h1>
            <TaskForm
              onSubmit={handleAddOrEdit}
              editingTask={editingTask}
              onCancel={handleCancelEdit}
            />
          </div>
          <div className="section">
            <h2 className="subtitle fadein-delay" style={{ marginTop: 32, marginBottom: 12 }}>
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
        <div className="container"
          style={{
            padding: '16px',
            textAlign: 'center',
            color: 'var(--text-secondary)',
            fontSize: 13
          }}
        >
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
