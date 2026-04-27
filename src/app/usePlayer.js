import { useCallback, useEffect, useMemo, useState } from 'react';

export default function usePlayer(tracks) {
  const [playerState, setPlayerState] = useState({
    isPlaying: false,
    isRepeating: false,
    isShuffling: false,
    trackId: null,
  });

  const playableTracks = useMemo(() => tracks.filter((track) => track.url), [tracks]);
  const currentTrack = useMemo(
    () => playableTracks.find((track) => String(track.id) === String(playerState.trackId)) || null,
    [playableTracks, playerState.trackId],
  );

  useEffect(() => {
    setPlayerState((currentPlayerState) => {
      if (
        !currentPlayerState.trackId ||
        playableTracks.some((track) => String(track.id) === String(currentPlayerState.trackId))
      ) {
        return currentPlayerState;
      }

      return {
        ...currentPlayerState,
        isPlaying: false,
        trackId: null,
      };
    });
  }, [playableTracks]);

  const playTrack = useCallback((track) => {
    if (!track?.url) {
      return;
    }

    setPlayerState((currentPlayerState) => ({
      ...currentPlayerState,
      isPlaying: true,
      trackId: track.id,
    }));
  }, []);

  const setPlayerPlaying = useCallback((isPlaying) => {
    setPlayerState((currentPlayerState) => ({
      ...currentPlayerState,
      isPlaying: Boolean(isPlaying && currentPlayerState.trackId),
    }));
  }, []);

  const togglePlay = useCallback(() => {
    setPlayerState((currentPlayerState) => {
      const nextTrackId = currentPlayerState.trackId || playableTracks[0]?.id || null;

      return {
        ...currentPlayerState,
        isPlaying: nextTrackId ? !currentPlayerState.isPlaying : false,
        trackId: nextTrackId,
      };
    });
  }, [playableTracks]);

  const skipTrack = useCallback(
    (direction = 1, { play = true } = {}) => {
      setPlayerState((currentPlayerState) => {
        if (!playableTracks.length) {
          return {
            ...currentPlayerState,
            isPlaying: false,
            trackId: null,
          };
        }

        const currentIndex = playableTracks.findIndex(
          (track) => String(track.id) === String(currentPlayerState.trackId),
        );
        let nextIndex = currentIndex === -1 ? 0 : currentIndex + direction;

        if (currentPlayerState.isShuffling && direction > 0 && playableTracks.length > 1) {
          const availableIndexes = playableTracks
            .map((_, index) => index)
            .filter((index) => index !== currentIndex);
          nextIndex = availableIndexes[Math.floor(Math.random() * availableIndexes.length)];
        } else {
          nextIndex = (nextIndex + playableTracks.length) % playableTracks.length;
        }

        return {
          ...currentPlayerState,
          isPlaying: play,
          trackId: playableTracks[nextIndex].id,
        };
      });
    },
    [playableTracks],
  );

  const nextTrack = useCallback((options) => skipTrack(1, options), [skipTrack]);
  const previousTrack = useCallback((options) => skipTrack(-1, options), [skipTrack]);

  const toggleShuffle = useCallback(() => {
    setPlayerState((currentPlayerState) => ({
      ...currentPlayerState,
      isShuffling: !currentPlayerState.isShuffling,
    }));
  }, []);

  const toggleRepeat = useCallback(() => {
    setPlayerState((currentPlayerState) => ({
      ...currentPlayerState,
      isRepeating: !currentPlayerState.isRepeating,
    }));
  }, []);

  return useMemo(
    () => ({
      currentTrack,
      hasTracks: playableTracks.length > 0,
      isPlaying: playerState.isPlaying,
      isRepeating: playerState.isRepeating,
      isShuffling: playerState.isShuffling,
      nextTrack,
      playTrack,
      previousTrack,
      setPlaying: setPlayerPlaying,
      togglePlay,
      toggleRepeat,
      toggleShuffle,
    }),
    [
      currentTrack,
      nextTrack,
      playableTracks.length,
      playTrack,
      playerState.isPlaying,
      playerState.isRepeating,
      playerState.isShuffling,
      previousTrack,
      setPlayerPlaying,
      togglePlay,
      toggleRepeat,
      toggleShuffle,
    ],
  );
}
