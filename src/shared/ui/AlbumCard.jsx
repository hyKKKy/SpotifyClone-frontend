export default function AlbumCard({ album, resolveBackendUrl }) {
  const coverUrl = album.coverUrl ? resolveBackendUrl(album.coverUrl) : null;

  return (
    <article className="media-card media-card--album">
      <div className="media-card__cover">
        {coverUrl ? <img alt={album.title} src={coverUrl} /> : <span>No artwork yet</span>}
      </div>
      <div className="media-card__body">
        <h3>{album.title}</h3>
        <p className="media-card__subtitle">{album.artist}</p>
        <p className="media-card__meta">{album.releaseDate}</p>
      </div>
    </article>
  );
}
