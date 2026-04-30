function parseDateValue(value) {
  const timestamp = Date.parse(value || '');
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function buildArtistId(value) {
  return (
    value
      ?.trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'unknown-artist'
  );
}

export function getReleaseYear(value) {
  const timestamp = parseDateValue(value);
  return timestamp ? new Date(timestamp).getFullYear() : 'Unknown';
}

export function normalizeAlbums(items = []) {
  return [...(Array.isArray(items) ? items : [])]
    .map((item, index) => ({
      artist: item.artist || 'Unknown artist',
      coverUrl: item.coverUrl || '',
      id: item.id ?? index,
      releaseDate: item.releaseDate || 'Unknown release date',
      releaseYear: getReleaseYear(item.releaseDate),
      title: item.title || 'Untitled release',
    }))
    .sort((left, right) => parseDateValue(right.releaseDate) - parseDateValue(left.releaseDate) || right.id - left.id);
}

export function normalizeTracks(items = []) {
  return [...(Array.isArray(items) ? items : [])]
    .map((item, index) => ({
      albumId: item.albumId ?? item.album?.id ?? null,
      albumTitle: item.albumTitle || item.album?.title || '',
      artist: item.artist || item.album?.artist || 'Unknown artist',
      duration: item.duration || '',
      genreId: item.genreId ?? item.genre?.id ?? null,
      genreName: item.genreName || item.genre?.name || '',
      id: item.id ?? index,
      likesCount: item.likesCount ?? 0,
      title: item.title || item.name || 'Untitled track',
      url: item.url || item.trackUrl || item.fileUrl || '',
    }))
    .sort((left, right) => Number(right.id) - Number(left.id));
}

export function normalizeGenres(items = []) {
  return [...(Array.isArray(items) ? items : [])]
    .map((item, index) => ({
      id: item.id ?? index,
      name: item.name || 'Uncategorized',
    }))
    .sort((left, right) => left.name.localeCompare(right.name));
}

export function buildArtistsFromAlbums(albums) {
  const artistMap = new Map();

  for (const album of albums) {
    const artistName = album.artist?.trim() || 'Unknown artist';
    const artistKey = artistName.toLowerCase();
    const existingArtist = artistMap.get(artistKey) || {
      albumCount: 0,
      albums: [],
      coverUrl: '',
      id: buildArtistId(artistName),
      latestRelease: album.releaseDate,
      name: artistName,
    };

    existingArtist.albumCount += 1;
    existingArtist.albums.push(album);
    existingArtist.coverUrl = existingArtist.coverUrl || album.coverUrl;

    if (parseDateValue(album.releaseDate) > parseDateValue(existingArtist.latestRelease)) {
      existingArtist.latestRelease = album.releaseDate;
    }

    artistMap.set(artistKey, existingArtist);
  }

  return Array.from(artistMap.values()).sort(
    (left, right) => right.albumCount - left.albumCount || left.name.localeCompare(right.name),
  );
}
