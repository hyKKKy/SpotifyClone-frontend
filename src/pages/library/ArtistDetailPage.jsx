import { useContext, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import AppContext from '../../features/context/AppContext';
import AlbumCard from '../../shared/ui/AlbumCard';
import EmptyStateCard from '../../shared/ui/EmptyStateCard';
import SectionHeading from '../../shared/ui/SectionHeading';
import '../music/MusicPage.css';
import '../music/DetailHero.css';

export default function ArtistDetailPage() {
  const { artistId } = useParams();
  const { catalog, isAdmin, resolveBackendUrl } = useContext(AppContext);
  const artist = useMemo(
    () => catalog.artists.find((catalogArtist) => String(catalogArtist.id) === String(artistId)),
    [artistId, catalog.artists],
  );
  const artistAlbums = artist?.albums || [];
  const coverUrl = artist?.coverUrl ? resolveBackendUrl(artist.coverUrl) : '';

  if (catalog.isLoading) {
    return (
      <section className="music-page page-shell">
        <EmptyStateCard title="Loading artist" description="The artist catalog is syncing with the backend." />
      </section>
    );
  }

  if (!artist) {
    return (
      <section className="music-page page-shell">
        <EmptyStateCard title="Artist not found" description="This artist is not available in the current catalog." />
      </section>
    );
  }

  return (
    <section className="music-page page-shell">
      <div className="album-detail-hero album-detail-hero--artist">
        <div className="album-detail-hero__cover">
          {coverUrl ? <img alt={artist.name} src={coverUrl} /> : <span>{artist.name.slice(0, 1).toUpperCase()}</span>}
        </div>

        <div className="album-detail-hero__copy">
          <p className="eyebrow">Artist</p>
          <h2>{artist.name}</h2>
          <p>
            {artist.albumCount} album{artist.albumCount === 1 ? '' : 's'} in your library
          </p>
          <span>Latest release: {artist.latestRelease}</span>
          <div className="button-row">
            <Link className="button button-secondary" to="/artists">
              Back to artists
            </Link>
            {isAdmin ? (
              <Link className="button button-primary" to="/albums/add">
                Add album
              </Link>
            ) : null}
          </div>
        </div>
      </div>

      <section className="content-block">
        <SectionHeading
          eyebrow="Albums"
          title={`${artistAlbums.length} release${artistAlbums.length === 1 ? '' : 's'}`}
          description={`Albums currently attached to ${artist.name}.`}
        />

        {artistAlbums.length ? (
          <div className="album-wall">
            {artistAlbums.map((album) => (
              <AlbumCard album={album} key={album.id} resolveBackendUrl={resolveBackendUrl} />
            ))}
          </div>
        ) : (
          <EmptyStateCard title="No albums yet" description="Albums will appear here once they are attached to this artist." />
        )}
      </section>
    </section>
  );
}
