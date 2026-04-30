import { Link } from 'react-router-dom';
import { useAppContext } from '@shared/lib/app-context';
import AlbumCard from '@entities/music/ui/AlbumCard';
import ArtistCard from '@entities/music/ui/ArtistCard';
import EmptyStateCard from '@shared/ui/EmptyStateCard';
import SectionHeading from '@shared/ui/SectionHeading';

import '@shared/styles/music-page.css';
import '@shared/styles/listen-hero.css';
import './Home.css';

export default function Home() {
  const { auth, catalog, isAdmin, isAuthenticated, resolveBackendUrl } = useAppContext();
  const featuredAlbums = catalog.albums.slice(0, 6);
  const featuredArtists = catalog.artists.slice(0, 6);

  return (
    <section className="music-page page-shell">
      <div className="listen-hero">
        <div className="listen-hero__copy">
          <p className="eyebrow">{isAuthenticated ? 'Welcome back' : 'Start listening'}</p>
          <h2>{isAuthenticated ? `Good evening, ${auth.userName}.` : 'Music for every mood.'}</h2>
          <p>Jump into fresh releases, revisit familiar artists, and keep the music moving.</p>
          <div className="button-row">
            <Link className="button button-primary" to="/browse">
              Browse library
            </Link>
            <Link className="button button-secondary" to="/artists">
              View artists
            </Link>
            {isAdmin ? (
              <Link className="button button-secondary" to="/studio">
                Open studio
              </Link>
            ) : null}
          </div>
        </div>

        
      </div>

      {catalog.error ? <div className="status-banner status-banner--error">{catalog.error}</div> : null}

      <section className="content-block">
        <SectionHeading
          eyebrow="Fresh picks"
          title="Latest albums"
          description="Start here with the newest releases in your collection."
          action={<Link className="section-link" to="/albums">See all albums</Link>}
        />

        {catalog.isLoading ? (
          <EmptyStateCard title="Loading albums" description="Your latest picks are on the way." />
        ) : featuredAlbums.length ? (
          <div className="album-wall">
            {featuredAlbums.map((album) => (
              <AlbumCard album={album} key={album.id} resolveBackendUrl={resolveBackendUrl} />
            ))}
          </div>
        ) : (
          <EmptyStateCard title="No albums yet" description="Once albums are added, they will show up here automatically." />
        )}
      </section>

      <section className="content-block">
        <SectionHeading
          eyebrow="Artists"
          title="Artists in your rotation"
          description="The voices showing up across your library right now."
          action={<Link className="section-link" to="/artists">See all artists</Link>}
        />

        {catalog.isLoading ? (
          <EmptyStateCard title="Loading artists" description="Your artist lineup is getting ready." />
        ) : featuredArtists.length ? (
          <div className="artist-wall">
            {featuredArtists.map((artist) => (
              <ArtistCard artist={artist} key={artist.id} resolveBackendUrl={resolveBackendUrl} />
            ))}
          </div>
        ) : (
          <EmptyStateCard title="No artists yet" description="Add an album with an artist name and this shelf will populate." />
        )}
      </section>
    </section>
  );
}
