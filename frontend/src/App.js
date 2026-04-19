import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import CategoryBar from './components/CategoryBar';
import AppGrid from './components/AppGrid';
import SidePanel from './components/SidePanel';
import InstallerModal from './components/InstallerModal';
import './styles/App.css';

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'browsers', label: 'Browsers' },
  { id: 'communication', label: 'Communication' },
  { id: 'media', label: 'Media' },
  { id: 'design', label: 'Design' },
  { id: 'development', label: 'Development' },
  { id: 'utilities', label: 'Utilities' },
  { id: 'security', label: 'Security' },
  { id: 'productivity', label: 'Productivity' },
  { id: 'gaming', label: 'Gaming' },
  { id: 'cloud', label: 'Cloud Storage' },
];

export default function App() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(new Set());
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [os, setOs] = useState('windows');
  const [method, setMethod] = useState('winget');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch('/api/apps')
      .then(r => r.json())
      .then(data => { setApps(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const grouped = useMemo(() => {
    const cats = activeCategory === 'all'
      ? CATEGORIES.slice(1).map(c => c.id)
      : [activeCategory];

    return cats.reduce((acc, cat) => {
      let catApps = apps.filter(a => a.category === cat);
      if (search.trim()) {
        const q = search.toLowerCase();
        catApps = catApps.filter(a =>
          a.name.toLowerCase().includes(q) || a.desc.toLowerCase().includes(q)
        );
      }
      if (catApps.length > 0) acc[cat] = catApps;
      return acc;
    }, {});
  }, [apps, activeCategory, search]);

  const selectedApps = apps.filter(a => selected.has(a.id));

  const toggle = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const remove = (id) => {
    setSelected(prev => { const n = new Set(prev); n.delete(id); return n; });
  };

  const clearAll = () => setSelected(new Set());

  const catLabel = (id) => CATEGORIES.find(c => c.id === id)?.label || id;

  return (
    <div className="app-layout">
      <Header search={search} onSearch={setSearch} os={os} onOsChange={setOs} />
      <CategoryBar
        categories={CATEGORIES}
        active={activeCategory}
        onChange={setActiveCategory}
        counts={apps.reduce((acc, a) => { acc[a.category] = (acc[a.category] || 0) + 1; return acc; }, {})}
      />
      <div className="content-area">
        <main className="main-content">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner" />
              <p>Loading apps...</p>
            </div>
          ) : (
            <AppGrid
              grouped={grouped}
              selected={selected}
              onToggle={toggle}
              catLabel={catLabel}
              search={search}
            />
          )}
        </main>
        <SidePanel
          selectedApps={selectedApps}
          os={os}
          method={method}
          onMethodChange={setMethod}
          onRemove={remove}
          onClear={clearAll}
          onGetInstaller={() => setShowModal(true)}
        />
      </div>
      {showModal && (
        <InstallerModal
          selectedApps={selectedApps}
          os={os}
          method={method}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
