import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAppContext } from '@shared/lib/app-context';
import EmptyStateCard from '@shared/ui/EmptyStateCard';
import SectionHeading from '@shared/ui/SectionHeading';
import TrackCard from '@entities/music/ui/TrackCard';
import '@shared/styles/music-page.css';
import '@shared/styles/detail-hero.css';

export default function AlbumDetailPage() {
  const { albumId } = useParams();
  const { catalog, isAdmin, isAuthenticated, resolveBackendUrl } = useAppContext();
  const album = useMemo(
    () => catalog.albums.find((catalogAlbum) => String(catalogAlbum.id) === String(albumId)),
    [albumId, catalog.albums],
  );
  const albumTracks = useMemo(
    () => catalog.tracks.filter((track) => String(track.albumId) === String(albumId)),
    [albumId, catalog.tracks],
  );
  const coverUrl = album?.coverUrl ? resolveBackendUrl(album.coverUrl) : '';

  if (catalog.isLoading) {
    return (
      <section className="music-page page-shell">
        <EmptyStateCard title="Loading album" description="The album and track list are syncing with the backend." />
      </section>
    );
  }

  if (!album) {
    return (
      <section className="music-page page-shell">
        <EmptyStateCard title="Album not found" description="This album is not available in the current catalog." />
      </section>
    );
  }

  return (
    <section className="music-page page-shell">
      <div className="album-detail-hero">
        <div className="album-detail-hero__cover">
          {coverUrl ? <img alt={album.title} src={coverUrl} /> : <span>No artwork yet</span>}
        </div>

        <div className="album-detail-hero__copy">
          <p className="eyebrow">Album</p>
          <h2>{album.title}</h2>
          <p>{album.artist}</p>
          <span>{album.releaseDate}</span>
          <div className="button-row">
            <Link className="button button-secondary" to="/albums">
              Back to albums
            </Link>
            {isAdmin ? (
              <>
                <Link className="button button-primary" to="/tracks/add">
                  Add track
                </Link>
                <Link className="button button-secondary" to={`/albums/${album.id}/edit`}>
                  Edit album
                </Link>
              </>
            ) : null}
          </div>
        </div>
      </div>

      <section className="content-block">
        <SectionHeading
          eyebrow="Tracks"
          title={`${albumTracks.length} track${albumTracks.length === 1 ? '' : 's'}`}
          description={
            isAuthenticated
              ? `Tracks attached to ${album.title}.`
              : 'Sign in to load the tracks attached to this album.'
          }
        />

        {!isAuthenticated ? (
          <EmptyStateCard title="Sign in required" description="Tracks are visible to signed-in listeners and admins." />
        ) : albumTracks.length ? (
          <div className="track-list">
            {albumTracks.map((track) => (
              <TrackCard
                action={
                  isAdmin ? (
                    <div className="button-row media-card__button-row">
                      <Link className="button button-secondary" to={`/tracks/${track.id}/edit`}>
                        Edit track
                      </Link>
                    </div>
                  ) : null
                }
                key={track.id}
                resolveBackendUrl={resolveBackendUrl}
                track={track}
              />
            ))}
          </div>
        ) : (
          <EmptyStateCard title="No tracks in this album" description="Tracks will appear here once an admin attaches them." />
        )}
      </section>
    </section>
  );
}
