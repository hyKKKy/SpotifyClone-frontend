import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAppContext } from '@shared/lib/app-context';
import AlbumCard from '@entities/music/ui/AlbumCard';
import ArtistCard from '@entities/music/ui/ArtistCard';
import EmptyStateCard from '@shared/ui/EmptyStateCard';
import SectionHeading from '@shared/ui/SectionHeading';
import TrackCard from '@entities/music/ui/TrackCard';
import '@shared/styles/music-page.css';
import './SearchPage.css';

function matchesQuery(values, query) {
  return values.some((value) => String(value || '').toLowerCase().includes(query));
}

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const { catalog, isAuthenticated, resolveBackendUrl, searchQuery } = useAppContext();
  const activeQuery = (searchParams.get('q') || searchQuery).trim();
  const normalizedQuery = activeQuery.toLowerCase();

  const results = useMemo(() => {
    if (!normalizedQuery) {
      return {
        albums: [],
        artists: [],
        tracks: [],
      };
    }

    return {
      albums: catalog.albums.filter((album) =>
        matchesQuery([album.title, album.artist, album.releaseDate, album.releaseYear], normalizedQuery),
      ),
      artists: catalog.artists.filter((artist) =>
        matchesQuery([artist.name, artist.latestRelease, artist.albumCount], normalizedQuery),
      ),
      tracks: catalog.tracks.filter((track) =>
        matchesQuery([track.title, track.artist, track.albumTitle, track.genreName], normalizedQuery),
      ),
    };
  }, [catalog.albums, catalog.artists, catalog.tracks, normalizedQuery]);

  const totalResults = results.albums.length + results.artists.length + results.tracks.length;

  return (
    <section className="music-page page-shell">
      <section className="content-block">
        <SectionHeading
          eyebrow="Search"
          title={activeQuery ? `Results for "${activeQuery}"` : 'Search your library'}
        />

        {catalog.isLoading ? (
          <EmptyStateCard title="Searching" description="The catalog is loading before results can be shown." />
        ) : !activeQuery ? (
          <EmptyStateCard title="No search yet" description="Use the search field above to find music in the catalog." />
        ) : totalResults ? (
          <>
            <section className="content-block">
              <SectionHeading
                eyebrow="Albums"
                title={`${results.albums.length} album${results.albums.length === 1 ? '' : 's'}`}
                description="Album title, artist, and release date matches."
              />
              {results.albums.length ? (
                <div className="album-wall">
                  {results.albums.map((album) => (
                    <AlbumCard album={album} key={album.id} resolveBackendUrl={resolveBackendUrl} />
                  ))}
                </div>
              ) : (
                <EmptyStateCard title="No albums found" description="No albums match this search." />
              )}
            </section>

            <section className="content-block">
              <SectionHeading
                eyebrow="Artists"
                title={`${results.artists.length} artist${results.artists.length === 1 ? '' : 's'}`}
                description="Artist name and release matches."
              />
              {results.artists.length ? (
                <div className="artist-wall">
                  {results.artists.map((artist) => (
                    <ArtistCard artist={artist} key={artist.id} resolveBackendUrl={resolveBackendUrl} />
                  ))}
                </div>
              ) : (
                <EmptyStateCard title="No artists found" description="No artists match this search." />
              )}
            </section>

            <section className="content-block">
              <SectionHeading
                eyebrow="Tracks"
                title={`${results.tracks.length} track${results.tracks.length === 1 ? '' : 's'}`}
                description={
                  isAuthenticated
                    ? 'Track title, artist, album, and genre matches.'
                    : 'Sign in to include protected tracks in search results.'
                }
              />
              {results.tracks.length ? (
                <div className="track-list">
                  {results.tracks.map((track) => (
                    <TrackCard key={track.id} resolveBackendUrl={resolveBackendUrl} track={track} />
                  ))}
                </div>
              ) : (
                <EmptyStateCard title="No tracks found" description="No tracks match this search." />
              )}
            </section>
          </>
        ) : (
          <EmptyStateCard title="No results" description="Try a title, artist, album, genre, or release date." />
        )}

        {activeQuery ? (
          <Link className="section-link search-page__browseLink" to="/browse">
            Back to library
          </Link>
        ) : null}
      </section>
    </section>
  );
}
