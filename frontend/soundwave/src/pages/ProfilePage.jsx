import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : '??';

  return (
    <div className="profile-page fade-in">
      <h1 className="page-title">Profile</h1>

      {/* Avatar card */}
      <div className="profile-hero">
        <div className="profile-avatar">{initials}</div>
        <div className="profile-hero-info">
          <h2 className="profile-username">{user?.username}</h2>
          <p className="profile-email">{user?.email}</p>
          <span className={`profile-badge ${user?.role}`}>
            {user?.role === 'artist' ? (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12">
                  <path d="M9 18V5l12-2v13"/>
                  <circle cx="6" cy="18" r="3"/>
                  <circle cx="18" cy="16" r="3"/>
                </svg>
                Artist
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12">
                  <path d="M3 18v-6a9 9 0 0118 0v6"/>
                  <path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z"/>
                </svg>
                Listener
              </>
            )}
          </span>
        </div>
      </div>

      {/* Account details */}
      <div className="profile-section">
        <h3 className="profile-section-title">Account Details</h3>
        <div className="details-card">
          <div className="detail-row">
            <span className="detail-label">User ID</span>
            <span className="detail-value monospace">{user?.id}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Username</span>
            <span className="detail-value">{user?.username}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Email</span>
            <span className="detail-value">{user?.email}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Account Type</span>
            <span className="detail-value capitalize">{user?.role}</span>
          </div>
        </div>
      </div>

      {/* Artist permissions */}
      {user?.role === 'artist' && (
        <div className="profile-section">
          <h3 className="profile-section-title">Artist Permissions</h3>
          <div className="permissions-grid">
            <div className="permission-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Upload music tracks
            </div>
            <div className="permission-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Create albums
            </div>
            <div className="permission-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Manage your catalog
            </div>
            <div className="permission-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Listen to all music
            </div>
          </div>
        </div>
      )}

      {/* Quick links for artists */}
      {user?.role === 'artist' && (
        <div className="profile-section">
          <h3 className="profile-section-title">Quick Actions</h3>
          <div className="quick-links">
            <a href="/upload" className="quick-link">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              Upload a Track
            </a>
            <a href="/albums/new" className="quick-link">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              Create Album
            </a>
          </div>
        </div>
      )}

      {/* Sign out */}
      <div className="profile-section">
        <h3 className="profile-section-title danger-title">Session</h3>
        <button className="logout-danger-btn" onClick={handleLogout}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Sign Out
        </button>
      </div>

    </div>
  );
}