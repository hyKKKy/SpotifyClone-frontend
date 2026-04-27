import './EmptyStateCard.css';

export default function EmptyStateCard({ title, description }) {
  return (
    <article className="surface-card empty-panel">
      <p className="eyebrow">Empty state</p>
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  );
}
