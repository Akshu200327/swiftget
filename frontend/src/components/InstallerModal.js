import React, { useState, useEffect } from 'react';
import './InstallerModal.css';

export default function InstallerModal({ selectedApps, os, method, onClose }) {
  const [status, setStatus] = useState('idle'); // idle | loading | done | error
  const [script, setScript] = useState('');
  const [filename, setFilename] = useState('');

  useEffect(() => {
    generateInstaller();
    // eslint-disable-next-line
  }, []);

  const generateInstaller = async () => {
    setStatus('loading');
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appIds: selectedApps.map(a => a.id),
          os,
          method,
        }),
      });
      const data = await res.json();
      setScript(data.script);
      setFilename(data.filename);
      setStatus('done');
    } catch {
      setStatus('error');
    }
  };

  const downloadFile = () => {
    const ext = os === 'windows' ? 'bat' : 'sh';
    const mime = os === 'windows' ? 'application/bat' : 'application/x-sh';
    const blob = new Blob([script], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || `swiftget-install.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(script);
  };

  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Your installer is ready</h2>
            <p className="modal-sub">
              {selectedApps.length} app{selectedApps.length !== 1 ? 's' : ''} selected for {os}
              {os === 'windows' ? ` via ${method}` : ''}
            </p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="modal-apps">
          {selectedApps.map(app => (
            <span key={app.id} className="modal-app-tag">{app.name}</span>
          ))}
        </div>

        <div className="modal-divider" />

        {status === 'loading' && (
          <div className="modal-loading">
            <div className="loading-spinner" />
            <span>Generating installer...</span>
          </div>
        )}

        {status === 'error' && (
          <div className="modal-error">
            <p>Could not connect to backend. Make sure the server is running on port 3001.</p>
          </div>
        )}

        {status === 'done' && (
          <>
            <div className="script-preview-wrap">
              <div className="script-preview-header">
                <span className="script-filename">{filename}</span>
                <button className="script-copy-btn" onClick={copyToClipboard}>
                  Copy
                </button>
              </div>
              <pre className="script-preview">{script.slice(0, 800)}{script.length > 800 ? '\n...' : ''}</pre>
            </div>

            <div className="modal-actions">
              <div className="how-to-run">
                {os === 'windows' ? (
                  <p>Right-click the <code>.bat</code> file → <strong>Run as administrator</strong></p>
                ) : (
                  <p>Run: <code>chmod +x {filename} && sudo ./{filename}</code></p>
                )}
              </div>
              <div className="action-btns">
                <button className="btn-secondary" onClick={onClose}>
                  Back
                </button>
                <button className="btn-primary" onClick={downloadFile}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M7 1v8M3.5 5.5L7 9l3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M1 11h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  Download {filename}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
