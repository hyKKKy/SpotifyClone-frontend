import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAppContext } from '@shared/lib/app-context';
import { normalizeAlbums, normalizeTracks } from '@entities/music/model/catalog';
import AlbumCard from '@entities/music/ui/AlbumCard';
import ArtistCard from '@entities/music/ui/ArtistCard';
import EmptyStateCard from '@shared/ui/EmptyStateCard';
import SectionHeading from '@shared/ui/SectionHeading';
import TrackCard from '@entities/music/ui/TrackCard';
import '@shared/styles/music-page.css';
import './SearchPage.css';

const EMPTY_RESULTS = {
  albums: [],
  artists: [],
  tracks: [],
};

function normalizeArtists(items = []) {
  return [...(Array.isArray(items) ? items : [])]
    .map((item, index) => ({
      albumCount: item.albumCount ?? item.AlbumCount ?? 0,
      coverUrl: item.coverUrl || item.CoverUrl || '',
      id: item.id || item.Id || index,
      latestRelease: item.latestRelease || item.LatestRelease || 'Unknown release date',
      name: item.name || item.Name || 'Unknown artist',
    }))
    .sort((left, right) => right.albumCount - left.albumCount || left.name.localeCompare(right.name));
}

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const { request, resolveBackendUrl, searchQuery } = useAppContext();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(EMPTY_RESULTS);
  const activeQuery = (searchParams.get('q') || searchQuery).trim();

  useEffect(() => {
    if (!activeQuery) {
      setError('');
      setIsLoading(false);
      setResults(EMPTY_RESULTS);
      return undefined;
    }

    let isActive = true;

    const loadSearchResults = async () => {
      setError('');
      setIsLoading(true);

      try {
        const payload = await request(`/api/search?q=${encodeURIComponent(activeQuery)}`);

        if (!isActive) {
          return;
        }

        setResults({
          albums: normalizeAlbums(payload.albums),
          artists: normalizeArtists(payload.artists),
          tracks: normalizeTracks(payload.tracks),
        });
      } catch (requestError) {
        if (isActive) {
          setError(requestError.message || 'Search failed.');
          setResults(EMPTY_RESULTS);
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void loadSearchResults();

    return () => {
      isActive = false;
    };
  }, [activeQuery, request]);

  const totalResults = useMemo(
    () => results.albums.length + results.artists.length + results.tracks.length,
    [results],
  );

  return (
    <section className="music-page page-shell">
      <section className="content-block">
        <SectionHeading
          eyebrow="Search"
          title={activeQuery ? `Results for "${activeQuery}"` : 'Search your library'}
        />

        {isLoading ? (
          <EmptyStateCard title="Searching" description="The backend is searching the music catalog." />
        ) : error ? (
          <EmptyStateCard title="Search unavailable" description={error} />
        ) : !activeQuery ? (
          <EmptyStateCard title="No search yet" description="Use the search field above to find music in the catalog." />
        ) : totalResults ? (
          <>
            <section className="content-block">
              <SectionHeading
                eyebrow="Albums"
                title={`${results.albums.length} album${results.albums.length === 1 ? '' : 's'}`}
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
