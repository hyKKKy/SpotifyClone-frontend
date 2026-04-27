import { useContext } from 'react';
import AppContext from '../../features/context/AppContext';
import ArtistCard from '../../shared/ui/ArtistCard';
import EmptyStateCard from '../../shared/ui/EmptyStateCard';
import SectionHeading from '../../shared/ui/SectionHeading';
import '../music/MusicPage.css';

export default function ArtistsPage() {
  const { catalog, resolveBackendUrl } = useContext(AppContext);

  return (
    <section className="music-page page-shell">
      {catalog.error ? <div className="status-banner status-banner--error">{catalog.error}</div> : null}

      <section className="content-block">
        <SectionHeading
          eyebrow="Directory"
          title="Artists"
          description={catalog.artists.length ? `${catalog.artists.length} artists in your library.` : 'No artists yet.'}
        />

        {catalog.isLoading ? (
          <EmptyStateCard title="Loading artists" description="Your artist list is almost ready." />
        ) : catalog.artists.length ? (
          <div className="artist-wall">
            {catalog.artists.map((artist) => (
              <ArtistCard artist={artist} key={artist.id} resolveBackendUrl={resolveBackendUrl} />
            ))}
          </div>
        ) : (
          <EmptyStateCard title="No artists yet" description="Add albums first and the artist directory will appear here." />
        )}
      </section>
    </section>
  );
}
