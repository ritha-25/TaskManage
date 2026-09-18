import { useEffect, useMemo, useState, useCallback } from "react";
import "./App.css";
import FilterTabs from "./components/FilterTabs.jsx";
import TaskList from "./components/TaskList.jsx";
import TaskPanel from "./components/TaskPanel.jsx";
import * as api from "./api.js";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const [panelOpen, setPanelOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formErrors, setFormErrors] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await api.fetchTasks();
      setTasks(data);
    } catch (err) {
      setLoadError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const visibleTasks = useMemo(() => {
    if (!filter) return tasks;
    return tasks.filter((t) => t.status === filter);
  }, [tasks, filter]);

  const counts = useMemo(() => {
    const c = { ALL: tasks.length, PENDING: 0, COMPLETED: 0 };
    for (const t of tasks) c[t.status] = (c[t.status] || 0) + 1;
    return c;
  }, [tasks]);

  function openCreatePanel() {
    setEditingTask(null);
    setFormErrors(null);
    setPanelOpen(true);
  }

  function openEditPanel(task) {
    setEditingTask(task);
    setFormErrors(null);
    setPanelOpen(true);
  }

  function closePanel() {
    setPanelOpen(false);
    setEditingTask(null);
    setFormErrors(null);
  }

  async function handleSubmit(form) {
    setSubmitting(true);
    setFormErrors(null);
    try {
      if (editingTask) {
        const updated = await api.updateTask(editingTask.id, form);
        setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      } else {
        const created = await api.createTask(form);
        setTasks((prev) => [created, ...prev]);
      }
      closePanel();
    } catch (err) {
      setFormErrors(err.fieldErrors || { title: err.message });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleToggleStatus(task) {
    const nextStatus = task.status === "COMPLETED" ? "PENDING" : "COMPLETED";
    // optimistic update
    setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, status: nextStatus } : t)));
    try {
      const updated = await api.updateTask(task.id, { ...task, status: nextStatus });
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    } catch (err) {
      // revert on failure
      setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)));
      alert(`Couldn't update task: ${err.message}`);
    }
  }

  async function handleDelete(task) {
    if (!confirm(`Delete "${task.title}"? This can't be undone.`)) return;
    const previous = tasks;
    setTasks((prev) => prev.filter((t) => t.id !== task.id));
    try {
      await api.deleteTask(task.id);
    } catch (err) {
      setTasks(previous);
      alert(`Couldn't delete task: ${err.message}`);
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header__titles">
          <h1>Tasks</h1>
          <p>{counts.ALL} total · {counts.PENDING || 0} pending</p>
        </div>
        <button className="button button--primary" onClick={openCreatePanel}>
          New task
        </button>
      </header>

      <FilterTabs active={filter} onChange={setFilter} counts={counts} />

      {loadError ? (
        <div className="empty-state">
          <p className="empty-state__title">Couldn't load tasks</p>
          <p className="empty-state__body">{loadError}. Is the backend running on localhost:8080?</p>
          <button className="button button--ghost" onClick={loadTasks}>Retry</button>
        </div>
      ) : (
        <TaskList
          tasks={visibleTasks}
          loading={loading}
          onToggleStatus={handleToggleStatus}
          onEdit={openEditPanel}
          onDelete={handleDelete}
        />
      )}

      <TaskPanel
        open={panelOpen}
        task={editingTask}
        onClose={closePanel}
        onSubmit={handleSubmit}
        errors={formErrors}
        submitting={submitting}
      />
    </div>
  );
}
