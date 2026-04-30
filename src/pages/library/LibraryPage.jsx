import { Link } from 'react-router-dom';
import { useAppContext } from '@shared/lib/app-context';
import AlbumCard from '@entities/music/ui/AlbumCard';
import ArtistCard from '@entities/music/ui/ArtistCard';
import EmptyStateCard from '@shared/ui/EmptyStateCard';
import SectionHeading from '@shared/ui/SectionHeading';
import '@shared/styles/music-page.css';
import '@shared/styles/listen-hero.css';
import './LibraryPage.css';

export default function LibraryPage() {
  const { catalog, isAdmin, resolveBackendUrl } = useAppContext();

  return (
    <section className="music-page page-shell">
      <div className="listen-hero listen-hero--compact">
        <div className="listen-hero__copy">
          <p className="eyebrow">Browse</p>
          <h2>Albums and artists, together in one library view.</h2>
          <p>Move between fresh releases and the artists behind them without leaving the page.</p>
        </div>

        <div className="surface-card hero-summary">
          <p className="eyebrow">Collection</p>
          <strong>{catalog.albums.length} releases</strong>
          <span>
            {catalog.artists.length} artists and {catalog.genres.length} genres in rotation.
          </span>
          {isAdmin ? (
            <Link className="button button-primary" to="/studio">
              Go to studio
            </Link>
          ) : null}
          <Link className="button button-secondary" to="/genres">
            Browse genres
          </Link>
        </div>
      </div>

      {catalog.error ? <div className="status-banner status-banner--error">{catalog.error}</div> : null}

      <div className="library-layout">
        <section className="content-block">
          <SectionHeading
            eyebrow="All releases"
            title="Albums"
            description="The full release lineup in your library."
          />

          {catalog.isLoading ? (
            <EmptyStateCard title="Loading albums" description="Your releases are on the way." />
          ) : catalog.albums.length ? (
            <div className="album-wall">
              {catalog.albums.map((album) => (
                <AlbumCard album={album} key={album.id} resolveBackendUrl={resolveBackendUrl} />
              ))}
            </div>
          ) : (
            <EmptyStateCard title="No albums yet" description="Albums will appear here once the catalog has content." />
          )}
        </section>

        <section className="content-block">
          <SectionHeading
            eyebrow="People behind the music"
            title="Artists"
            description="Built from the artist names already attached to your albums."
          />

          {catalog.isLoading ? (
            <EmptyStateCard title="Loading artists" description="Artists will appear here as soon as albums finish loading." />
          ) : catalog.artists.length ? (
            <div className="artist-wall artist-wall--stacked">
              {catalog.artists.map((artist) => (
                <ArtistCard artist={artist} key={artist.id} resolveBackendUrl={resolveBackendUrl} />
              ))}
            </div>
          ) : (
            <EmptyStateCard title="No artists yet" description="Artists are derived from albums, so this list starts empty too." />
          )}
        </section>
      </div>
    </section>
  );
}
