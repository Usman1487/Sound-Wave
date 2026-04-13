import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { usePlayer } from '../context/PlayerContext.jsx';
import TrackCard from '../components/TrackCard.jsx';
import './HomePage.css';

export default function HomePage() {
  const { user } = useAuth();
  const { play, isPlaying } = usePlayer();
  const [tracks, setTracks] = useState([]);
  const [greeting, setGreeting] = useState('');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('top hits');

  useEffect(() => {
    const h = new Date().getHours();
    if (h < 12) setGreeting('Good morning');
    else if (h < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:3000/api/deezer/search?q=${query}`)
      .then(res => res.json())
      .then(data => {
        const formatted = data.data
          .filter(track => track.preview)
          .map(track => ({
            _id: String(track.id),
            title: track.title,
            uri: track.preview,
            artistName: track.artist.name,
            cover: track.album.cover_medium,
          }));
        setTracks(formatted);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) setQuery(search.trim());
  };

  const playAll = () => {
    if (tracks.length) play(tracks[0], tracks);
  };

  return (
    <div className="home-page fade-in">

      {/* Hero */}
      <section className="hero">
        <div className="hero-text">
          <p className="hero-greeting">{greeting},</p>
          <h1 className="hero-name">{user?.username}</h1>
          <p className="hero-role-badge">
            {user?.role === 'artist' ? '🎵 Artist Account' : '🎧 Listener Account'}
          </p>
        </div>
        <div className="hero-visual">
          <div className={`vinyl ${isPlaying ? 'spinning' : ''}`}>
            <div className="vinyl-ring r1" />
            <div className="vinyl-ring r2" />
            <div className="vinyl-ring r3" />
            <div className="vinyl-center">
              <div className="vinyl-dot" />
            </div>
          </div>
        </div>
      </section>

      {/* Quick actions for artists */}
      {user?.role === 'artist' && (
        <section className="quick-actions">
          <a href="/upload" className="quick-card">
            <div className="qc-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </div>
            <div>
              <p className="qc-title">Upload Track</p>
              <p className="qc-sub">Share your music</p>
            </div>
          </a>
          <a href="/albums/new" className="quick-card">
            <div className="qc-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </div>
            <div>
              <p className="qc-title">Create Album</p>
              <p className="qc-sub">Group your tracks</p>
            </div>
          </a>
        </section>
      )}

      {/* Search bar */}
      <section className="search-section">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-wrap">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="search-icon">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              placeholder="Search songs, artists..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="search-input"
            />
          </div>
          <button type="submit" className="search-btn">Search</button>
        </form>
      </section>

      {/* Track library */}
      <section className="library-section">
        <div className="section-header">
          <h2 className="section-title">
            {query === 'top hits' ? 'Top Hits' : `Results for "${query}"`}
          </h2>
          {tracks.length > 0 && (
            <button className="play-all-btn" onClick={playAll}>
              <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                <path d="M8 5v14l11-7z"/>
              </svg>
              Play All
            </button>
          )}
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner" />
            <p>Loading tracks...</p>
          </div>
        ) : tracks.length === 0 ? (
          <div className="empty-state">
            <p className="empty-title">No tracks found</p>
            <p className="empty-sub">Try searching for something else</p>
          </div>
        ) : (
          <div className="track-list">
            {tracks.map((track, i) => (
              <TrackCard key={track._id} track={track} queue={tracks} index={i} />
            ))}
          </div>
        )}
      </section>

    </div>
  );
}