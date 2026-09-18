import TaskRow from "./TaskRow.jsx";

export default function TaskList({ tasks, loading, onToggleStatus, onEdit, onDelete }) {
  if (loading) {
    return <div className="empty-state">Loading tasks…</div>;
  }

  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty-state__title">No tasks here</p>
        <p className="empty-state__body">Add a task .</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskRow
          key={task.id}
          task={task}
          onToggleStatus={onToggleStatus}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
