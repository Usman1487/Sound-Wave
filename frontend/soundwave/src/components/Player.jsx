import { usePlayer } from '../context/PlayerContext.jsx';
import './Player.css';

function formatTime(s) {
  if (!s || isNaN(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

export default function Player() {
  const { currentTrack, isPlaying, progress, duration, volume,
    togglePlay, seek, playNext, playPrev, setVolume } = usePlayer();

  if (!currentTrack) return null;

  const pct = duration ? (progress / duration) * 100 : 0;

  return (
    <div className="player fade-up">

      {/* Track info */}
      <div className="player-track">
        <div className="player-disc">
          <div className={`disc-inner ${isPlaying ? 'spinning' : ''}`}>
            <div className="disc-center" />
          </div>
        </div>
        <div className="player-info">
          <span className="player-title">{currentTrack.title}</span>
          <span className="player-artist">{currentTrack.artistName || 'Artist'}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="player-controls">
        <button className="ctrl-btn" onClick={playPrev}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
          </svg>
        </button>
        <button className="ctrl-btn play-btn" onClick={togglePlay}>
          {isPlaying ? (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
          )}
        </button>
        <button className="ctrl-btn" onClick={playNext}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 18l8.5-6L6 6v12zm2.5-6l5.5 3.9V8.1L8.5 12zm7.5 6h2V6h-2v12z"/>
          </svg>
        </button>
      </div>

      {/* Progress bar */}
      <div className="player-progress">
        <span className="time-label">{formatTime(progress)}</span>
        <div className="progress-bar" onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const pct = (e.clientX - rect.left) / rect.width;
          seek(pct * duration);
        }}>
          <div className="progress-fill" style={{ width: `${pct}%` }} />
          <div className="progress-thumb" style={{ left: `${pct}%` }} />
        </div>
        <span className="time-label">{formatTime(duration)}</span>
      </div>

      {/* Volume */}
      <div className="player-volume">
        <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"
          style={{ color: 'var(--text-secondary)', flexShrink: 0 }}>
          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
        </svg>
        <input
          type="range"
          className="volume-slider"
          min="0" max="1" step="0.01"
          value={volume}
          onChange={e => setVolume(parseFloat(e.target.value))}
        />
      </div>

    </div>
  );
}