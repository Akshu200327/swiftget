import React from 'react';
import './CategoryBar.css';

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

export default function CategoryBar({ categories, active, onChange, counts }) {
  return (
    <div className="catbar-outer">
      <div className="catbar-inner">
        <div className="catbar-scroll">
          {categories.map(cat => {
            const color = CAT_COLORS[cat.id];
            const isActive = active === cat.id;
            return (
              <button
                key={cat.id}
                className={`cat-btn ${isActive ? 'active' : ''}`}
                onClick={() => onChange(cat.id)}
                style={isActive && color ? {
                  background: `${color}15`,
                  color: color,
                  borderColor: `${color}40`,
                } : {}}
              >
                {cat.label}
                {cat.id !== 'all' && counts[cat.id] && (
                  <span
                    className="cat-count"
                    style={isActive && color ? {
                      background: `${color}25`,
                      color: color,
                    } : {}}
                  >{counts[cat.id]}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
