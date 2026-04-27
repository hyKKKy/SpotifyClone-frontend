export default function TrackCard({ action = null, resolveBackendUrl, track }) {
  const trackUrl = track.url ? resolveBackendUrl(track.url) : '';

  return (
    <article className="track-card">
      <div className="track-card__main">
        <div className="track-card__index">{track.id}</div>
        <div className="track-card__copy">
          <h3>{track.title}</h3>
          <p>{track.artist}</p>
          <span>
            {track.albumTitle || `Album ${track.albumId || 'unknown'}`}
            {track.genreName ? ` - ${track.genreName}` : ''}
          </span>
        </div>
      </div>

      <div className="track-card__player">
        {trackUrl ? <audio controls src={trackUrl} /> : <span>No audio file uploaded.</span>}
      </div>

      {action ? <div className="track-card__actions">{action}</div> : null}
    </article>
  );
}
