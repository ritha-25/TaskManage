const FILTERS = [
  { label: "All", value: null },
  { label: "Pending", value: "PENDING" },
  { label: "Completed", value: "COMPLETED" },
];

export default function FilterTabs({ active, onChange, counts }) {
  return (
    <div className="filter-tabs" role="tablist" aria-label="Filter tasks by status">
      {FILTERS.map((f) => (
        <button
          key={f.label}
          role="tab"
          aria-selected={active === f.value}
          className={`filter-tab ${active === f.value ? "filter-tab--active" : ""}`}
          onClick={() => onChange(f.value)}
        >
          {f.label}
          <span className="filter-tab__count">{counts[f.value ?? "ALL"] ?? 0}</span>
        </button>
      ))}
    </div>
  );
}
