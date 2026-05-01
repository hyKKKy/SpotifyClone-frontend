import { useCallback, useEffect, useMemo, useState } from 'react';

const LIKED_TRACKS_STORAGE_KEY = 'spotify-clone-liked-tracks';

function readLikedTracksStore() {
  try {
    const storedValue = localStorage.getItem(LIKED_TRACKS_STORAGE_KEY);
    const parsedValue = storedValue ? JSON.parse(storedValue) : {};
    return parsedValue && typeof parsedValue === 'object' && !Array.isArray(parsedValue) ? parsedValue : {};
  } catch {
    return {};
  }
}

function getUserLikesKey(auth) {
  return auth.userId || auth.loginName || auth.email || auth.userName || null;
}

function extractLikedTrackIds(payload) {
  const source = Array.isArray(payload?.trackIds)
    ? payload.trackIds
    : Array.isArray(payload?.data)
      ? payload.data.map((track) => track.id)
      : [];

  return source.filter((trackId) => trackId !== null && trackId !== undefined).map(String);
}

export default function useLikedTracks(auth, tracks, request) {
  const [likedTrackIdsByUser, setLikedTrackIdsByUser] = useState(readLikedTracksStore);
  const [likeError, setLikeError] = useState('');
  const [pendingTrackIds, setPendingTrackIds] = useState(() => new Set());
  const userLikesKey = useMemo(() => getUserLikesKey(auth), [auth]);

  useEffect(() => {
    localStorage.setItem(LIKED_TRACKS_STORAGE_KEY, JSON.stringify(likedTrackIdsByUser));
  }, [likedTrackIdsByUser]);

  useEffect(() => {
    if (!userLikesKey) {
      setLikeError('');
      return undefined;
    }

    let isActive = true;

    const loadLikedTracks = async () => {
      try {
        const payload = await request('/api/tracks/liked');
        const nextLikedTrackIds = extractLikedTrackIds(payload);

        if (!isActive) {
          return;
        }

        setLikedTrackIdsByUser((currentStore) => ({
          ...currentStore,
          [userLikesKey]: nextLikedTrackIds,
        }));
        setLikeError('');
      } catch (requestError) {
        if (isActive && requestError.status !== 401) {
          setLikeError(requestError.message || 'Could not load liked tracks.');
        }
      }
    };

    void loadLikedTracks();

    return () => {
      isActive = false;
    };
  }, [request, userLikesKey]);

  const likedTrackIds = useMemo(() => {
    if (!userLikesKey) {
      return [];
    }

    return (likedTrackIdsByUser[userLikesKey] || []).map(String);
  }, [likedTrackIdsByUser, userLikesKey]);

  const likedTrackIdSet = useMemo(() => new Set(likedTrackIds), [likedTrackIds]);

  const likedTracks = useMemo(
    () => tracks.filter((track) => likedTrackIdSet.has(String(track.id))),
    [likedTrackIdSet, tracks],
  );

  const isTrackLiked = useCallback(
    (trackId) => likedTrackIdSet.has(String(trackId)),
    [likedTrackIdSet],
  );

  const isTrackLikePending = useCallback(
    (trackId) => pendingTrackIds.has(String(trackId)),
    [pendingTrackIds],
  );

  const setTrackLiked = useCallback(
    (trackId, isLiked) => {
      if (!userLikesKey || !trackId) {
        return;
      }

      setLikedTrackIdsByUser((currentStore) => {
        const currentLikedIds = (currentStore[userLikesKey] || []).map(String);
        const nextLikedIds = isLiked
          ? Array.from(new Set([...currentLikedIds, trackId]))
          : currentLikedIds.filter((likedTrackId) => likedTrackId !== trackId);

        return {
          ...currentStore,
          [userLikesKey]: nextLikedIds,
        };
      });
    },
    [userLikesKey],
  );

  const toggleTrackLike = useCallback(
    async (track) => {
      if (!userLikesKey || !track?.id || isTrackLikePending(track.id)) {
        return null;
      }

      const trackId = String(track.id);
      const fallbackIsLiked = !likedTrackIdSet.has(trackId);

      setLikeError('');
      setPendingTrackIds((currentTrackIds) => new Set(currentTrackIds).add(trackId));

      try {
        const payload = await request(`/api/tracks/like/${track.id}`, { method: 'POST' });
        const nextIsLiked = typeof payload?.isLiked === 'boolean' ? payload.isLiked : fallbackIsLiked;
        setTrackLiked(trackId, nextIsLiked);
        return payload;
      } catch (requestError) {
        setLikeError(requestError.message || 'Could not update liked tracks.');
        return null;
      } finally {
        setPendingTrackIds((currentTrackIds) => {
          const nextTrackIds = new Set(currentTrackIds);
          nextTrackIds.delete(trackId);
          return nextTrackIds;
        });
      }
    },
    [isTrackLikePending, likedTrackIdSet, request, setTrackLiked, userLikesKey],
  );

  return {
    error: likeError,
    isTrackLikePending,
    isTrackLiked,
    likedTrackIds,
    likedTracks,
    toggleTrackLike,
  };
}
