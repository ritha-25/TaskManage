import { useEffect, useState } from "react";

const EMPTY = { title: "", description: "", priority: "MEDIUM", status: "PENDING" };

export default function TaskPanel({ open, task, onClose, onSubmit, errors, submitting }) {
  const [form, setForm] = useState(EMPTY);

  useEffect(() => {
    if (open) {
      setForm(task ? { ...task } : EMPTY);
    }
  }, [open, task]);

  if (!open) return null;

  const isEdit = Boolean(task);

  function handleChange(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <div className="panel-overlay" onClick={onClose}>
      <div className="panel" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="panel__header">
          <h2>{isEdit ? "Edit task" : "New task"}</h2>
          <button className="icon-button" onClick={onClose} aria-label="Close">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <form className="panel__form" onSubmit={handleSubmit}>
          <label className="field">
            <span className="field__label">Title</span>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="What needs to be done?"
              autoFocus
            />
            {errors?.title && <span className="field__error">{errors.title}</span>}
          </label>

          <label className="field">
            <span className="field__label">Description</span>
            <textarea
              value={form.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Add more detail (optional)"
              rows={4}
            />
          </label>

          <div className="field-row">
            <label className="field">
              <span className="field__label">Priority</span>
              <select
                value={form.priority}
                onChange={(e) => handleChange("priority", e.target.value)}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </label>

            <label className="field">
              <span className="field__label">Status</span>
              <select
                value={form.status}
                onChange={(e) => handleChange("status", e.target.value)}
              >
                <option value="PENDING">Pending</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </label>
          </div>

          <div className="panel__footer">
            <button type="button" className="button button--ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="button button--primary" disabled={submitting}>
              {submitting ? "Saving…" : isEdit ? "Save changes" : "Add task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
