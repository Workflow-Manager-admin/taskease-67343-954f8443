import React, { useState, useEffect, useRef } from 'react';
import './App.css';

/**
 * PUBLIC_INTERFACE
 * ThemeToggle Component
 * 
 * A button allowing users to switch between light and dark mode.
 * Includes animated sun/moon SVG with accessible labeling.
 */
function ThemeToggle({ theme, setTheme }) {
  const isDark = theme === 'dark';
  return (
    <button
      className="theme-toggle"
      aria-pressed={isDark}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      tabIndex={0}
      title={`Switch to ${isDark ? 'light' : 'dark'} theme`}
    >
      {isDark ? (
        // Moon SVG
        <svg width="25" height="25" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="10" fill="#111726" />
          <path d="M18 12A6 6 0 0 1 12 6c0-2.2 0.9-3.7 2.2-4.7A10 10 0 1 0 22 16.2 6.44 6.44 0 0 1 18 12z" fill="#f2eada" />
        </svg>
      ) : (
        // Sun SVG
        <svg width="25" height="25" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="6" fill="#ffecb3" />
          <g stroke="#fbc02d" strokeWidth="1.8">
            <line x1="12" y1="2" x2="12" y2="4" />
            <line x1="12" y1="20" x2="12" y2="22" />
            <line x1="2" y1="12" x2="4" y2="12" />
            <line x1="20" y1="12" x2="22" y2="12" />
            <line x1="5" y1="5" x2="6.6" y2="6.6" />
            <line x1="18" y1="18" x2="19.6" y2="19.6" />
            <line x1="5" y1="19" x2="6.6" y2="17.4" />
            <line x1="18" y1="6" x2="19.6" y2="7.6" />
          </g>
        </svg>
      )}
    </button>
  );
}
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
  // Improve a11y: Keyboard, aria, ripple, icons
  const cardRef = useRef();
  const handleKey = e => {
    if (e.key === "Enter") onEdit(task);
    else if (e.key === "Delete" || e.key === "Backspace") onDelete(task.id);
    else if (e.key === " ") onToggleComplete(task.id);
  };

  // Simple ripple effect on click (for micro-animation)
  const ripple = e => {
    const button = e.currentTarget;
    const circle = document.createElement('span');
    circle.className = 'ripple';
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.nativeEvent.offsetX - diameter / 2}px`;
    circle.style.top = `${e.nativeEvent.offsetY - diameter / 2}px`;
    button.appendChild(circle);
    setTimeout(() => circle.remove(), 540);
  };

  return (
    <div
      className={`task-card${task.completed ? ' completed' : ''}`}
      tabIndex={0}
      aria-label={`${task.completed ? 'Completed' : 'Incomplete'} task: ${task.title}`}
      style={{
        animation: 'fadeInUp 0.42s cubic-bezier(.3,.81,.52,1.02)',
        boxShadow: task.completed
          ? '0 2px 12px 0px rgba(120,140,120,0.05)'
          : '0 4px 24px 0px rgba(36,114,57,0.11),0 1.9px 4px 0px rgba(23,23,34,0.10)'
      }}
      ref={cardRef}
      onKeyDown={handleKey}
    >
      <div className="task-main">
        <label className="checkbox-custom">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggleComplete(task.id)}
            aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
            tabIndex={0}
          />
          <span />
        </label>
        <span className="task-title">{task.title}</span>
      </div>
      <div className="task-actions">
        <button
          className="btn btn-secondary btn-anim icon-btn"
          title="Edit Task"
          aria-label="Edit Task"
          tabIndex={0}
          onClick={e => { ripple(e); onEdit(task); }}
        >
          {/* Modern Pencil SVG */}
          <svg viewBox="0 0 20 20" width={20} height={20} fill="none" aria-hidden="true">
            <path d="M13.7 3.3a1.3 1.3 0 0 1 1.84 0l1.16 1.16a1.3 1.3 0 0 1 0 1.84l-7.76 7.75-3.03.37a.7.7 0 0 1-.78-.78l.37-3.03 7.76-7.76zM15.88 6.12l-1.99-1.99" stroke="#58A342" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
        </button>
        <button
          className="btn btn-danger btn-anim icon-btn"
          title="Delete Task"
          aria-label="Delete Task"
          tabIndex={0}
          onClick={e => { ripple(e); onDelete(task.id); }}
        >
          {/* Modern Trash SVG */}
          <svg viewBox="0 0 20 20" width={20} height={20} aria-hidden="true">
            <rect x="5.3" y="7.3" width="9.4" height="8.2" rx="1.2" fill="none" stroke="#C43C39" strokeWidth="1.3"/>
            <rect x="8.2" y="9.2" width="1.1" height="4.1" rx=".5" fill="#C43C39" />
            <rect x="10.7" y="9.2" width="1.1" height="4.1" rx=".5" fill="#C43C39" />
            <path d="M8.6 5.7V4.5a1 1 0 0 1 1-1h.8a1 1 0 0 1 1 1v1.2M4.3 7.2h11.4" stroke="#C43C39" strokeWidth="1.2"/>
          </svg>
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

  // Theme state/persistence
  const [theme, setTheme] = useState(() => {
    const saved = window.localStorage.getItem('tfe_theme_mode');
    if (saved) return saved;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    return 'dark';
  });

  useEffect(() => {
    document.body.classList.toggle('theme-light', theme === 'light');
    document.body.classList.toggle('theme-dark', theme === 'dark');
    window.localStorage.setItem('tfe_theme_mode', theme);
  }, [theme]);

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

  // Modern gradient, animated background with theme classes
  return (
    <div className={`app app-gradient theme-${theme}`}>
      <nav className="navbar glassy" tabIndex={-1}>
        <div className="container navbar-row">
          <span className="logo" tabIndex={0} aria-label="TaskEase Logo">
            <span className="logo-symbol">★</span> TaskEase
          </span>
          <div className="navbar-right" style={{display:"flex", alignItems:"center", gap:"14px"}}>
            <span style={{fontWeight:500}}>Modern To-Do List App</span>
            <ThemeToggle theme={theme} setTheme={setTheme} />
          </div>
        </div>
      </nav>
      <main className="main-content" tabIndex={-1}>
        <div className="container task-container">
          <div className="section">
            <h1 className="title shrinkin" tabIndex={0}>
              {editingTask ? "Edit Task" : "Add a Task"}
            </h1>
            <TaskForm
              onSubmit={handleAddOrEdit}
              editingTask={editingTask}
              onCancel={handleCancelEdit}
            />
          </div>
          <div className="section">
            <h2 className="subtitle fadein-delay" style={{ marginTop: 32, marginBottom: 12 }} tabIndex={0}>
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
