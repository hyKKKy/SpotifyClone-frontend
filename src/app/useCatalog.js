import { useCallback, useEffect, useState } from 'react';
import { buildArtistsFromAlbums, normalizeAlbums, normalizeGenres, normalizeTracks } from '../shared/music/catalog';

const createCatalogState = (overrides = {}) => ({
  albums: [],
  artists: [],
  error: '',
  genres: [],
  isLoading: true,
  tracks: [],
  ...overrides,
});

export default function useCatalog(request) {
  const [catalog, setCatalog] = useState(() => createCatalogState());

  const refreshCatalog = useCallback(async () => {
    setCatalog((currentCatalog) => ({
      ...currentCatalog,
      error: '',
      isLoading: true,
    }));

    try {
      const payload = await request('/api/albums');
      const albums = normalizeAlbums(payload.data);
      const artists = buildArtistsFromAlbums(albums);
      let genres = [];
      let tracks = [];

      try {
        const genresPayload = await request('/api/genres');
        genres = normalizeGenres(genresPayload.data || genresPayload);
      } catch {
        genres = [];
      }

      try {
        const tracksPayload = await request('/api/tracks');
        tracks = normalizeTracks(tracksPayload.data || tracksPayload);
      } catch {
        tracks = [];
      }

      setCatalog(createCatalogState({ albums, artists, genres, isLoading: false, tracks }));
    } catch (requestError) {
      setCatalog(createCatalogState({ error: requestError.message, isLoading: false }));
    }
  }, [request]);

  useEffect(() => {
    void refreshCatalog();
  }, [refreshCatalog]);

  return {
    catalog,
    refreshCatalog,
  };
}
