const PRIORITY_LABEL = { HIGH: "High", MEDIUM: "Medium", LOW: "Low" };

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export default function TaskRow({ task, onToggleStatus, onEdit, onDelete }) {
  const isCompleted = task.status === "COMPLETED";

  return (
    <div className={`task-row ${isCompleted ? "task-row--completed" : ""}`}>
      <button
        className="task-row__toggle"
        onClick={() => onToggleStatus(task)}
        aria-label={isCompleted ? "Mark as pending" : "Mark as completed"}
        title={isCompleted ? "Mark as pending" : "Mark as completed"}
      >
        <span className={`checkbox ${isCompleted ? "checkbox--checked" : ""}`}>
          {isCompleted && (
            <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
              <path d="M1 4.5L4 7.5L10 1" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </span>
      </button>

      <div className="task-row__body" onClick={() => onEdit(task)}>
        <div className="task-row__title-line">
          <span className={`priority-dot priority-dot--${task.priority?.toLowerCase()}`}
                title={`${PRIORITY_LABEL[task.priority]} priority`} />
          <span className="task-row__title">{task.title}</span>
        </div>
        {task.description && <p className="task-row__description">{task.description}</p>}
      </div>

      <div className="task-row__meta">
        <span className={`status-chip status-chip--${task.status?.toLowerCase()}`}>
          {isCompleted ? "Completed" : "Pending"}
        </span>
        <span className="task-row__date">{formatDate(task.createdAt)}</span>
      </div>

      <div className="task-row__actions">
        <button className="icon-button" onClick={() => onEdit(task)} aria-label="Edit task" title="Edit">
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
            <path d="M11.5 2.5L13.5 4.5L5 13H3V11L11.5 2.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
          </svg>
        </button>
        <button className="icon-button icon-button--danger" onClick={() => onDelete(task)} aria-label="Delete task" title="Delete">
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
            <path d="M3 4.5H13M6.5 4.5V3C6.5 2.5 7 2 7.5 2H8.5C9 2 9.5 2.5 9.5 3V4.5M11.5 4.5L11 13C11 13.5 10.5 14 10 14H6C5.5 14 5 13.5 5 13L4.5 4.5"
                  stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
