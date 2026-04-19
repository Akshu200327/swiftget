import React, { useState } from 'react';
import './AppCard.css';

export default function AppCard({ app, selected, onToggle }) {
  const [imgErr, setImgErr] = useState(false);

  const initials = app.name
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase();

  const iconBg = app.color ? `${app.color}18` : 'var(--bg-subtle)';
  const iconBorder = app.color ? `${app.color}28` : 'var(--border)';

  return (
    <button
      className={`app-card ${selected ? 'selected' : ''}`}
      onClick={onToggle}
      aria-pressed={selected}
      title={app.name}
    >
      <div className="app-card-inner">
        <div className="app-icon-wrap" style={{ background: iconBg, borderColor: iconBorder }}>
          {!imgErr ? (
            <img
              src={app.icon}
              alt={app.name}
              className="app-icon"
              onError={() => setImgErr(true)}
            />
          ) : (
            <div className="app-icon-fallback" style={{ color: app.color || 'var(--text-muted)' }}>{initials}</div>
          )}
        </div>
        <div className="app-info">
          <span className="app-name">{app.name}</span>
          <span className="app-desc">{app.desc}</span>
        </div>
        <div className="app-check" aria-hidden="true">
          {selected && (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>
      </div>
    </button>
  );
}
