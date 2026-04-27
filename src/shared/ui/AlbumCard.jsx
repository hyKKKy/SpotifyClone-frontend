import { Link } from 'react-router-dom';
import './MediaCard.css';

export default function AlbumCard({ action = null, album, resolveBackendUrl }) {
  const coverUrl = album.coverUrl ? resolveBackendUrl(album.coverUrl) : null;
  const albumUrl = `/albums/${album.id}`;

  return (
    <article className="media-card media-card--album">
      <Link aria-label={`Open ${album.title}`} className="media-card__cover media-card__coverLink" to={albumUrl}>
        {coverUrl ? <img alt={album.title} src={coverUrl} /> : <span>No artwork yet</span>}
      </Link>
      <div className="media-card__body">
        <h3>
          <Link className="media-card__titleLink" to={albumUrl}>
            {album.title}
          </Link>
        </h3>
        <p className="media-card__subtitle">{album.artist}</p>
        <p className="media-card__meta">{album.releaseDate}</p>
      </div>
      {action ? <div className="media-card__actions">{action}</div> : null}
    </article>
  );
}
