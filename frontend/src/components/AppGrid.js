import React from 'react';
import AppCard from './AppCard';
import './AppGrid.css';

const CAT_LABELS = {
  browsers: 'Browsers',
  communication: 'Communication',
  media: 'Media',
  design: 'Design & Creative',
  development: 'Development',
  utilities: 'Utilities',
  security: 'Security',
  productivity: 'Productivity',
  gaming: 'Gaming',
  cloud: 'Cloud Storage',
};

const CAT_COLORS = {
  browsers: '#4285F4',
  communication: '#5865F2',
  media: '#FF8800',
  design: '#F24E1E',
  development: '#007ACC',
  utilities: '#2E7D32',
  security: '#00A4BD',
  productivity: '#DB4035',
  gaming: '#1B2838',
  cloud: '#0061FF',
};

export default function AppGrid({ grouped, selected, onToggle, search }) {
  const keys = Object.keys(grouped);

  if (keys.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="14" cy="14" r="9" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M21 21l7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        <p className="empty-title">No apps found{search ? ` for "${search}"` : ''}</p>
        <p className="empty-sub">Try a different search term or category</p>
      </div>
    );
  }

  return (
    <div className="app-grid-root">
      {keys.map(cat => (
        <section key={cat} className="cat-section">
          <div className="cat-heading-row">
            <span
              className="cat-dot"
              style={{ background: CAT_COLORS[cat] || '#aaa' }}
            />
            <h2 className="cat-heading">{CAT_LABELS[cat] || cat}</h2>
          </div>
          <div className="app-grid">
            {grouped[cat].map(app => (
              <AppCard
                key={app.id}
                app={app}
                selected={selected.has(app.id)}
                onToggle={() => onToggle(app.id)}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
