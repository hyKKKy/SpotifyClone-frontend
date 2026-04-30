import { Link } from 'react-router-dom';
import './MediaCard.css';

export default function ArtistCard({ artist, resolveBackendUrl }) {
  const coverUrl = artist.coverUrl ? resolveBackendUrl(artist.coverUrl) : null;
  const artistUrl = `/artists/${artist.id}`;

  return (
    <article className="media-card media-card--artist">
      <Link
        aria-label={`Open ${artist.name}`}
        className="media-card__cover media-card__cover--artist media-card__coverLink"
        to={artistUrl}
      >
        {coverUrl ? <img alt={artist.name} src={coverUrl} /> : <span>{artist.name.slice(0, 1).toUpperCase()}</span>}
      </Link>
      <div className="media-card__body">
        <p className="eyebrow">Artist</p>
        <h3>
          <Link className="media-card__titleLink" to={artistUrl}>
            {artist.name}
          </Link>
        </h3>
        <p className="media-card__subtitle">
          {artist.albumCount} album{artist.albumCount === 1 ? '' : 's'}
        </p>
        <p className="media-card__meta">Latest release: {artist.latestRelease}</p>
      </div>
    </article>
  );
}
