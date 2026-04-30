import { Link } from 'react-router-dom';
import { useAppContext } from '@shared/lib/app-context';
import EmptyStateCard from '@shared/ui/EmptyStateCard';
import SectionHeading from '@shared/ui/SectionHeading';
import '@shared/styles/music-page.css';
import './GenresPage.css';

export default function GenresPage() {
  const { catalog } = useAppContext();

  return (
    <section className="music-page page-shell">
      {catalog.error ? <div className="status-banner status-banner--error">{catalog.error}</div> : null}

      <section className="content-block">
        <SectionHeading
          eyebrow="Browse"
          title="Genres"
          description={
            catalog.genres.length
              ? `${catalog.genres.length} genres available for organizing tracks.`
              : 'Genres will appear here once the backend returns them.'
          }
        />

        {catalog.isLoading ? (
          <EmptyStateCard title="Loading genres" description="The genre catalog is syncing with the backend." />
        ) : catalog.genres.length ? (
          <div className="genre-grid">
            {catalog.genres.map((genre) => (
              <Link className="genre-tile" key={genre.id} to={`/search?q=${encodeURIComponent(genre.name)}`}>
                <span>{genre.name.slice(0, 1).toUpperCase()}</span>
                <strong>{genre.name}</strong>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyStateCard title="No genres yet" description="Add genres in the backend to make this section useful." />
        )}
      </section>
    </section>
  );
}
