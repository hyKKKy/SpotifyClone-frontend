export default function SectionHeading({ action = null, description, eyebrow, title }) {
  return (
    <div className="section-heading">
      <div className="section-heading__copy">
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      {action ? <div className="section-heading__action">{action}</div> : null}
    </div>
  );
}
