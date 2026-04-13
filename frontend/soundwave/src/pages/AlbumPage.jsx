import { useState } from 'react';
import { createAlbum } from '../utils/api';
import './AlbumPage.css';

export default function AlbumPage() {
  const [title, setTitle] = useState('');
  const [musicIds, setMusicIds] = useState(['']);
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const addTrackId = () => setMusicIds([...musicIds, '']);
  const removeTrackId = (i) => setMusicIds(musicIds.filter((_, idx) => idx !== i));
  const updateTrackId = (i, val) => {
    const updated = [...musicIds];
    updated[i] = val;
    setMusicIds(updated);
  };

  const validIds = musicIds.filter(id => id.trim().length > 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || validIds.length === 0) return;
    setStatus('loading');
    setErrorMsg('');
    try {
      await createAlbum({ title: title.trim(), musics: validIds });
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.response?.data?.message || 'Failed to create album.');
    }
  };

  const reset = () => {
    setStatus('idle');
    setTitle('');
    setMusicIds(['']);
    setErrorMsg('');
  };

  if (status === 'success') {
    return (
      <div className="album-page fade-in">
        <div className="album-success">
          <div className="as-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </div>
          <h2 className="as-title">Album Created!</h2>
          <p className="as-sub">Your album <strong>"{title}"</strong> is live on Soundwave.</p>
          <button className="as-btn" onClick={reset}>Create Another Album</button>
        </div>
      </div>
    );
  }

  return (
    <div className="album-page fade-in">
      <div className="album-header">
        <h1 className="page-title">Create Album</h1>
        <p className="page-sub">Group your tracks into a cohesive album</p>
      </div>

      <div className="album-layout">

        {/* Album art preview */}
        <div className="album-art-preview">
          <div className="art-placeholder">
            <div className="art-rings">
              <div className="art-ring ar1" />
              <div className="art-ring ar2" />
              <div className="art-ring ar3" />
              <div className="art-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="24" height="24">
                  <path d="M9 18V5l12-2v13"/>
                  <circle cx="6" cy="18" r="3"/>
                  <circle cx="18" cy="16" r="3"/>
                </svg>
              </div>
            </div>
            {title && <p className="art-title-label">{title}</p>}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="album-form">
          <div className="field-group">
            <label className="field-label">Album Title</label>
            <input
              type="text"
              placeholder="My Debut Album"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="field-group">
            <div className="tracks-label-row">
              <label className="field-label">Track IDs</label>
              <span className="tracks-count">{validIds.length} track{validIds.length !== 1 ? 's' : ''}</span>
            </div>
            <p className="field-hint">
              Paste the MongoDB ObjectIDs of tracks you have already uploaded.
            </p>

            <div className="track-ids-list">
              {musicIds.map((id, i) => (
                <div key={i} className="track-id-row">
                  <div className="track-id-num">{i + 1}</div>
                  <input
                    type="text"
                    placeholder="507f1f77bcf86cd799439011"
                    value={id}
                    onChange={e => updateTrackId(i, e.target.value)}
                  />
                  {musicIds.length > 1 && (
                    <button
                      type="button"
                      className="remove-id-btn"
                      onClick={() => removeTrackId(i)}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button type="button" className="add-track-btn" onClick={addTrackId}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Add Track
            </button>
          </div>

          {status === 'error' && (
            <div className="album-error">{errorMsg}</div>
          )}

          <button
            type="submit"
            className="submit-btn"
            disabled={!title.trim() || validIds.length === 0 || status === 'loading'}
          >
            {status === 'loading' ? (
              <><span className="upload-spinner" /> Creating Album...</>
            ) : (
              <>Create Album</>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}