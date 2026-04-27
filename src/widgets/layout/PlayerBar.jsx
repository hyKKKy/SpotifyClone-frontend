import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  ListMusic,
  MonitorSpeaker,
  Music,
  Pause,
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
} from 'lucide-react';
import AppContext from '../../features/context/AppContext';
import './ui/PlayerBar.css';

function formatTime(value) {
  if (!Number.isFinite(value) || value < 0) {
    return '0:00';
  }

  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

export default function PlayerBar() {
  const { player, resolveBackendUrl } = useContext(AppContext);
  const audioRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.72);
  const {
    currentTrack,
    hasTracks,
    isPlaying,
    isRepeating,
    isShuffling,
    nextTrack,
    previousTrack,
    setPlaying,
    togglePlay,
    toggleRepeat,
    toggleShuffle,
  } = player;
  const currentTrackUrl = useMemo(
    () => (currentTrack?.url ? resolveBackendUrl(currentTrack.url) : ''),
    [currentTrack, resolveBackendUrl],
  );
  const progressPercent = duration ? Math.min(100, (currentTime / duration) * 100) : 0;

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    setCurrentTime(0);
    setDuration(0);
  }, [currentTrackUrl]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!currentTrackUrl) {
      audio.pause();
      return;
    }

    if (isPlaying) {
      const playRequest = audio.play();

      if (playRequest?.catch) {
        playRequest.catch(() => setPlaying(false));
      }
    } else {
      audio.pause();
    }
  }, [currentTrackUrl, isPlaying, setPlaying]);

  const handleLoadedMetadata = () => {
    const audio = audioRef.current;
    setDuration(audio?.duration || 0);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current?.currentTime || 0);
  };

  const handleSeek = (event) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const nextTime = ((event.clientX - bounds.left) / bounds.width) * duration;
    audio.currentTime = Math.max(0, Math.min(duration, nextTime));
  };

  const handleEnded = () => {
    const audio = audioRef.current;

    if (isRepeating && audio) {
      audio.currentTime = 0;
      const playRequest = audio.play();

      if (playRequest?.catch) {
        playRequest.catch(() => setPlaying(false));
      }

      return;
    }

    nextTrack({ play: true });
  };

  return (
    <footer className="player-bar" aria-label="Music player">
      <audio
        onEnded={handleEnded}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        ref={audioRef}
        src={currentTrackUrl || undefined}
      />
      <div className="player-bar__track">
        <div className="player-bar__art">
          <Music size={18} />
        </div>
        <div className="player-bar__trackText">
          <strong>{currentTrack?.title || 'No track selected'}</strong>
          <span>{currentTrack?.artist || 'Unknown Artist'}</span>
        </div>
      </div>

      <div className="player-bar__center">
        <div className="player-bar__controls">
          <button
            aria-label="Shuffle"
            className={isShuffling ? 'player-bar__control player-bar__control--active' : 'player-bar__control'}
            disabled={!hasTracks}
            onClick={toggleShuffle}
            type="button"
          >
            <Shuffle size={17} />
          </button>
          <button
            aria-label="Previous track"
            className="player-bar__control"
            disabled={!hasTracks}
            onClick={() => previousTrack({ play: isPlaying })}
            type="button"
          >
            <SkipBack size={18} fill="currentColor" />
          </button>
          <button
            aria-label={isPlaying ? 'Pause' : 'Play'}
            className="player-bar__play"
            disabled={!hasTracks}
            onClick={togglePlay}
            type="button"
          >
            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
          </button>
          <button
            aria-label="Next track"
            className="player-bar__control"
            disabled={!hasTracks}
            onClick={() => nextTrack({ play: isPlaying })}
            type="button"
          >
            <SkipForward size={18} fill="currentColor" />
          </button>
          <button
            aria-label="Repeat"
            className={isRepeating ? 'player-bar__control player-bar__control--active' : 'player-bar__control'}
            disabled={!hasTracks}
            onClick={toggleRepeat}
            type="button"
          >
            <Repeat size={17} />
          </button>
        </div>

        <div className="player-bar__progress" aria-label="Playback progress">
          <span>{formatTime(currentTime)}</span>
          <div className="player-bar__rail" onClick={handleSeek} role="presentation">
            <span style={{ width: `${progressPercent}%` }} />
          </div>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="player-bar__tools">
        <button aria-label="Queue" className="player-bar__control" disabled type="button">
          <ListMusic size={18} />
        </button>
        <button aria-label="Devices" className="player-bar__control" disabled type="button">
          <MonitorSpeaker size={18} />
        </button>
        <Volume2 size={18} />
        <input
          aria-label="Volume"
          className="player-bar__volumeInput"
          max="1"
          min="0"
          onChange={(event) => setVolume(Number(event.target.value))}
          step="0.01"
          type="range"
          value={volume}
        />
      </div>
    </footer>
  );
}
