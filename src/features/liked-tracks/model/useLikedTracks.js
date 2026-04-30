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

export default function useLikedTracks(auth, tracks) {
  const [likedTrackIdsByUser, setLikedTrackIdsByUser] = useState(readLikedTracksStore);
  const userLikesKey = useMemo(() => getUserLikesKey(auth), [auth]);

  useEffect(() => {
    localStorage.setItem(LIKED_TRACKS_STORAGE_KEY, JSON.stringify(likedTrackIdsByUser));
  }, [likedTrackIdsByUser]);

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

  const toggleTrackLike = useCallback(
    (track) => {
      if (!userLikesKey || !track?.id) {
        return;
      }

      const trackId = String(track.id);

      setLikedTrackIdsByUser((currentStore) => {
        const currentLikedIds = (currentStore[userLikesKey] || []).map(String);
        const nextLikedIds = currentLikedIds.includes(trackId)
          ? currentLikedIds.filter((likedTrackId) => likedTrackId !== trackId)
          : [...currentLikedIds, trackId];

        return {
          ...currentStore,
          [userLikesKey]: nextLikedIds,
        };
      });
    },
    [userLikesKey],
  );

  return {
    isTrackLiked,
    likedTrackIds,
    likedTracks,
    toggleTrackLike,
  };
}
