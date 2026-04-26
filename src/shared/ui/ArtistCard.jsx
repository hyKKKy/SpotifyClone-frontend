export default function ArtistCard({ artist, resolveBackendUrl }) {
  const coverUrl = artist.coverUrl ? resolveBackendUrl(artist.coverUrl) : null;

  return (
    <article className="media-card media-card--artist">
      <div className="media-card__cover media-card__cover--artist">
        {coverUrl ? <img alt={artist.name} src={coverUrl} /> : <span>{artist.name.slice(0, 1).toUpperCase()}</span>}
      </div>
      <div className="media-card__body">
        <p className="eyebrow">Artist</p>
        <h3>{artist.name}</h3>
        <p className="media-card__subtitle">
          {artist.albumCount} album{artist.albumCount === 1 ? '' : 's'}
        </p>
        <p className="media-card__meta">Latest release: {artist.latestRelease}</p>
      </div>
    </article>
  );
}
