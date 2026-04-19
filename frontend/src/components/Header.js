import React from 'react';
import './Header.css';

export default function Header({ search, onSearch, os, onOsChange }) {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-brand">
          <div className="brand-logo">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <rect width="22" height="22" rx="6" fill="#2563eb"/>
              <path d="M6 11l3.5 3.5L16 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="brand-name">SwiftGet</span>
          <span className="brand-tagline">Get everything, instantly</span>
        </div>
        <div className="header-controls">
          <div className="search-wrap">
            <svg className="search-icon" width="15" height="15" viewBox="0 0 15 15" fill="none">
              <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M10.5 10.5L13.5 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="Search apps..."
              value={search}
              onChange={e => onSearch(e.target.value)}
            />
            {search && (
              <button className="search-clear" onClick={() => onSearch('')} aria-label="Clear search">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            )}
          </div>
          <div className="os-picker">
            {['windows', 'macos', 'linux'].map(o => (
              <button
                key={o}
                className={`os-btn ${os === o ? 'active' : ''}`}
                onClick={() => onOsChange(o)}
              >
                {o === 'windows' ? (
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="currentColor">
                    <path d="M0 1.5L5.5 0.7V6H0V1.5zM6.5 0.6L13 0V6H6.5V0.6zM0 7H5.5V12.3L0 11.5V7zM6.5 7H13V13L6.5 12.4V7z"/>
                  </svg>
                ) : o === 'macos' ? (
                  <svg width="13" height="13" viewBox="0 0 814 1000" fill="currentColor">
                    <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 434.9 0 290.9 0 296.9c0-9.7 13.9-13.8 25.7-13.8 46.5 0 119.1 48.5 167.3 62.4 59.7 16.8 138.3 30.9 185 30.9 0-5.3-1.4-21.4 0-29.9 8.5-61.6 59.7-110.1 117.1-110.1 59.7 0 101 42 125.2 101.6 26-9.7 56.1-17.2 86.5-17.2 9.7 0 45.6 0 45.6 19.4z"/>
                  </svg>
                ) : (
                  <svg width="13" height="13" viewBox="0 0 448 512" fill="currentColor">
                    <path d="M220.8 123.3c1 .5 1.8 1.7 3 1.7 1.1 0 2.8-.4 2.9-1.5.2-1.4-1.9-2.3-3.2-2.9-1.7-.7-3.9-1-5.5-.1-.4.2-.8.7-.6 1.1.3 1.3 2.3 1.1 3.4 1.7zm-21.9 1.7c1.2 0 2-1.2 3-1.7 1.1-.6 3.1-.4 3.5-1.6.2-.4-.2-.9-.6-1.1-1.6-.9-3.8-.6-5.5.1-1.3.6-3.4 1.5-3.2 2.9.1 1 1.8 1.5 2.8 1.4zM420 403.8c-3.6-4-5.3-11.6-7.2-19.7-1.8-8.1-3.9-16.8-10.5-22.4-1.3-1.1-2.6-2.1-4-2.9-1.3-.8-2.7-1.5-4.1-2 9.2-27.3 5.6-54.5-3.7-79.1-11.4-30.1-31.3-56.4-46.5-74.4-17.1-20.5-33.7-43.4-44.3-68.4-14.2-34.4-14.4-77.2 8.2-107.5 6.3-8.6 14.9-16.2 18.4-26.5-5.4 1.5-9.6 8.2-13.8 13.5-6.4 8-12.8 15.9-19.1 23.9-19.8-8.8-46.4-7.3-76.9 0-4.5-9.9-14.3-21.2-26-27.5 1.5 13.5-1.9 25.5-8.6 34.5-21.1 28.4-20.9 73.9-5.7 110.6 10.6 25.8 27.3 49.3 44.5 70.3 15.5 19.3 35.3 45.9 46.4 76.2-2.9 2.1-5.6 4.5-8 7.1-7.9 8.5-10.7 20.1-13.6 31.5-4.1 16-8.9 34.3-24.8 43.3-20.6 11.9-54.9 12.1-74.5 12.7-19.6.6-42.7 2.8-53.7 18.7-9.2 13.5-6.9 34.4-3.7 50 2.6 12.7 7.8 24.9 15.6 35.5 9.6 13.2 21.6 24.1 34.8 33 23.1 15.4 50 25.2 78.6 25.3 2.9 0 5.9-.1 8.8-.4 10-.9 19.2-3.4 27.7-7.4 8.4 3.9 17.6 6.4 27.4 7.3 2.9.3 5.8.4 8.7.4 28.6-.1 55.5-9.9 78.6-25.3 13.2-8.9 25.2-19.8 34.8-33 7.7-10.6 13-22.8 15.6-35.5 3.2-15.6 5.4-36.5-3.8-50zm-218.4 94.4c-16.9-15.2-29.1-33.9-35.2-55.6 15.3 14.3 35.2 25.7 61 25.4 0 0 20.5-.3 37.4-5.3 1.5 6.9 3.3 13.6 5.5 20.3-18.1 11.3-48.4 28-68.7 15.2zm120.5 3c-13.7 6-29.5 9.3-46.3 9.3h-1c-13.2 0-27.5-3.1-40.1-10.3 19.4-12.3 47.5-31.5 65.3-42.4 6.8 12.1 15.1 23.6 22.1 43.4zm30.9-48.9c-21.8 21.9-49.5 37-71.3 21-20-14.7-26.9-50.5-4.9-68.5 7.4-5.9 17.6-8.4 26.4-12.2 15.8-6.8 27.3-18.4 32.4-35.3 1.7 7.5 3.7 16.1 6.1 24.1 4.1 13.5 8.6 26.7 12.4 40.1 2 7.2 5.5 14.5 5.5 22-.2 3.2-.9 6.3-2.3 8.8 0 0-2.2.2-4.3 0z"/>
                  </svg>
                )}
                <span>{o === 'windows' ? 'Windows' : o === 'macos' ? 'macOS' : 'Linux'}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
