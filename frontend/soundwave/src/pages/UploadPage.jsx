import { useState, useRef } from 'react';
import { uploadMusic } from '../utils/api';
import './UploadPage.css';

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [dragging, setDragging] = useState(false);
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const fileRef = useRef();

  const acceptFile = (f) => {
    if (!f) return;
    setFile(f);
    if (!title) setTitle(f.name.replace(/\.[^.]+$/, ''));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    acceptFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !title.trim()) return;
    setStatus('uploading');
    setErrorMsg('');

    const formData = new FormData();
    formData.append('music', file);
    formData.append('title', title.trim());

    try {
      await uploadMusic(formData);
      setStatus('success');
      setFile(null);
      setTitle('');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.response?.data?.message || 'Upload failed. Please try again.');
    }
  };

  const reset = () => {
    setStatus('idle');
    setFile(null);
    setTitle('');
    setErrorMsg('');
  };

  const formatSize = (bytes) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (status === 'success') {
    return (
      <div className="upload-page fade-in">
        <div className="success-card">
          <div className="success-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <h2 className="success-title">Track Uploaded!</h2>
          <p className="success-sub">Your track has been successfully uploaded.</p>
          <button className="upload-again-btn" onClick={reset}>
            Upload Another Track
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="upload-page fade-in">
      <div className="upload-header">
        <h1 className="page-title">Upload Track</h1>
        <p className="page-sub">Share your music with listeners on Soundwave</p>
      </div>

      <form onSubmit={handleSubmit} className="upload-form">

        {/* Drop zone */}
        <div
          className={`dropzone ${dragging ? 'dragging' : ''} ${file ? 'has-file' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => !file && fileRef.current.click()}
        >
          <input
            ref={fileRef}
            type="file"
            accept="audio/*"
            style={{ display: 'none' }}
            onChange={e => acceptFile(e.target.files[0])}
          />

          {file ? (
            <div className="file-preview">
              <div className="file-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9 18V5l12-2v13"/>
                  <circle cx="6" cy="18" r="3"/>
                  <circle cx="18" cy="16" r="3"/>
                </svg>
              </div>
              <div className="file-details">
                <p className="file-name">{file.name}</p>
                <p className="file-size">{formatSize(file.size)}</p>
              </div>
              <button
                type="button"
                className="file-remove"
                onClick={(e) => { e.stopPropagation(); setFile(null); }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          ) : (
            <div className="dropzone-idle">
              <div className="dz-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
              </div>
              <p className="dz-title">Drop your audio file here</p>
              <p className="dz-sub">or <span className="dz-link">browse files</span></p>
              <p className="dz-formats">MP3, WAV, AAC, OGG, FLAC supported</p>
            </div>
          )}
        </div>

        {/* Title input */}
        <div className="field-group">
          <label className="field-label">Track Title</label>
          <input
            type="text"
            placeholder="Give your track a name"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Error */}
        {status === 'error' && (
          <div className="upload-error">{errorMsg}</div>
        )}

        {/* Progress */}
        {status === 'uploading' && (
          <div className="progress-wrap">
            <div className="upload-progress-bar">
              <div className="upload-progress-fill" />
            </div>
            <p className="progress-label">Uploading to Soundwave...</p>
          </div>
        )}

        <button
          type="submit"
          className="submit-btn"
          disabled={!file || !title.trim() || status === 'uploading'}
        >
          {status === 'uploading' ? (
            <><span className="upload-spinner" /> Uploading...</>
          ) : (
            <>Upload Track</>
          )}
        </button>

      </form>
    </div>
  );
}