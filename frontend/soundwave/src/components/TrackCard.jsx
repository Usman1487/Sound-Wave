import { usePlayer } from '../context/PlayerContext.jsx';
import './TrackCard.css';

export default function TrackCard({ track, queue = [], index = 0 }) {
  const { currentTrack, isPlaying, play } = usePlayer();
  const isActive = currentTrack?._id === track._id;

  return (
    <div
      className={`track-card ${isActive ? 'active' : ''}`}
      onClick={() => play(track, queue)}
    >

      <div className="track-num">
        {isActive && isPlaying ? (
          <div className="eq-bars">
            <span style={{ animationDelay: '0s' }} />
            <span style={{ animationDelay: '0.15s' }} />
            <span style={{ animationDelay: '0.3s' }} />
          </div>
        ) : (
          <span className="track-index">{index + 1}</span>
        )}
      </div>

      <div className="track-disc">
        {track.cover ? (
          <img src={track.cover} alt={track.title} className="track-cover" />
        ) : (
          <svg viewBox="0 0 36 36" fill="none">
            <circle cx="18" cy="18" r="17" stroke="var(--bg-raised)" strokeWidth="1" />
            <circle cx="18" cy="18" r="12" stroke="var(--border)" strokeWidth="0.5" strokeDasharray="4 2" />
            <circle cx="18" cy="18" r="4" fill={isActive ? 'var(--accent)' : 'var(--bg-raised)'} />
          </svg>
        )}
        <div className="track-play-overlay">
          <svg viewBox="0 0 24 24" fill="white" width="16" height="16">
            {isActive && isPlaying
              ? <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              : <path d="M8 5v14l11-7z" />
            }
          </svg>
        </div>
      </div>

      <div className="track-info">
        <span className="track-title">{track.title}</span>
        <span className="track-meta">Track</span>
      </div>

      <div className="track-actions">
        <a
          href={track.uri}
          target="_blank"
          rel="noreferrer"
          className="track-action-btn"
          title="Open file"
          onClick={(e) => e.stopPropagation()}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="14" height="14">
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </a>
      </div>

    </div>
  );
}