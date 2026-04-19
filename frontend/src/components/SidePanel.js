import React from 'react';
import './SidePanel.css';

export default function SidePanel({ selectedApps, os, method, onMethodChange, onRemove, onClear, onGetInstaller }) {
  const count = selectedApps.length;

  return (
    <aside className="side-panel">
      <div className="panel-header">
        <span className="panel-title">Your bundle</span>
        {count > 0 && (
          <button className="panel-clear" onClick={onClear}>Clear all</button>
        )}
      </div>

      {count === 0 ? (
        <div className="panel-empty">
          <div className="panel-empty-icon">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="3" y="3" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
              <rect x="11" y="3" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
              <rect x="3" y="11" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
              <rect x="11" y="11" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
            </svg>
          </div>
          <p className="panel-empty-text">Click apps to add them to your bundle</p>
        </div>
      ) : (
        <>
          <div className="panel-apps">
            {selectedApps.map(app => (
              <div key={app.id} className="panel-app-row">
                <div className="panel-app-left">
                  <span
                    className="panel-app-dot"
                    style={{ background: app.color || '#aaa' }}
                  />
                  <span className="panel-app-name">{app.name}</span>
                </div>
                <button
                  className="panel-app-remove"
                  onClick={() => onRemove(app.id)}
                  aria-label={`Remove ${app.name}`}
                >
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                    <path d="M1 1l9 9M10 1L1 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <div className="panel-divider" />
        </>
      )}

      {os === 'windows' && count > 0 && (
        <div className="method-picker">
          <p className="method-label">Install via</p>
          <div className="method-btns">
            <button
              className={`method-btn ${method === 'winget' ? 'active' : ''}`}
              onClick={() => onMethodChange('winget')}
            >
              winget
            </button>
            <button
              className={`method-btn ${method === 'choco' ? 'active' : ''}`}
              onClick={() => onMethodChange('choco')}
            >
              Chocolatey
            </button>
          </div>
        </div>
      )}

      <button
        className={`get-btn ${count === 0 ? 'disabled' : ''}`}
        onClick={count > 0 ? onGetInstaller : undefined}
        disabled={count === 0}
      >
        {count === 0 ? (
          'Select apps first'
        ) : (
          <>
            Get Installer
            <span className="get-btn-count">{count}</span>
          </>
        )}
      </button>

      {count > 0 && (
        <p className="panel-hint">
          Downloads a {os === 'windows' ? '.bat file' : 'shell script'} — just run it and all apps install silently.
        </p>
      )}
    </aside>
  );
}
