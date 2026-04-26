export default function EndpointHero({ children, description, endpoint, method, title }) {
  return (
    <div className="page-hero endpoint-hero">
      <div className="endpoint-hero__content">
        <div className={`method-badge method-badge--${method}`}>{method}</div>
        <p className="eyebrow">Backend endpoint</p>
        <h1>{title}</h1>
        <p>{description}</p>
        <code className="endpoint-path">{endpoint}</code>
      </div>

      {children ? <div className="surface-card endpoint-hero__side">{children}</div> : null}
    </div>
  );
}
