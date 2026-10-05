import './Skeleton.css';

export function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-media" />
      <div className="skeleton-body">
        <div className="skeleton-line skeleton-badge" />
        <div className="skeleton-line skeleton-title" />
        <div className="skeleton-line skeleton-text" />
        <div className="skeleton-line skeleton-text short" />
        <div className="skeleton-specs">
          <div className="skeleton-spec-item" />
          <div className="skeleton-spec-item" />
          <div className="skeleton-spec-item" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonTableRow() {
  return (
    <tr className="skeleton-table-row">
      <td><div className="skeleton-line skeleton-table-cell" /></td>
      <td><div className="skeleton-line skeleton-table-cell short" /></td>
      <td><div className="skeleton-line skeleton-table-cell" /></td>
      <td><div className="skeleton-line skeleton-table-cell" /></td>
      <td><div className="skeleton-line skeleton-table-cell short" /></td>
    </tr>
  );
}

export function SkeletonCardGrid({ count = 6 }) {
  return (
    <div className="skeleton-grid">
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonTable({ rows = 5 }) {
  return (
    <div className="skeleton-card" style={{ padding: 0, overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {['Product', 'Price', 'Category', 'Description', 'Actions'].map((h) => (
              <th key={h} style={{ padding: '1rem', textAlign: 'left', fontWeight: 700, fontSize: '0.85rem' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }, (_, i) => (
            <SkeletonTableRow key={i} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
