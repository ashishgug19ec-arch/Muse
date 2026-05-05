'use client';
import { useEffect, useState } from 'react';
import { Tilt } from '@/components/ui/Tilt';
import { Chip } from '@/components/ui/Chip';

interface Props { night: boolean; }

interface Collection {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export function PageCollections({ night }: Props) {
  const [cols, setCols] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [saving, setSaving] = useState(false);

  const ink  = night ? 'rgba(230,220,255,.9)'  : '#1e1628';
  const ink3 = night ? 'rgba(160,140,200,.55)' : '#8a7aa0';
  const cardBd = night ? 'rgba(160,124,200,.2)'  : 'rgba(208,191,240,.52)';
  const cardBg = night ? 'rgba(255,255,255,.05)' : 'rgba(255,255,255,.72)';

  useEffect(() => {
    fetch('/api/collections')
      .then(r => r.json())
      .then(data => { setCols(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function createCollection() {
    if (!newName.trim()) return;
    setSaving(true);
    try {
      const res = await fetch('/api/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName.trim() }),
      });
      if (res.ok) {
        const col = await res.json();
        setCols(prev => [col, ...prev]);
        setNewName(''); setCreating(false);
      }
    } finally { setSaving(false); }
  }

  const gradients = [
    'linear-gradient(160deg,rgba(238,230,255,.9),rgba(252,228,240,.8))',
    'linear-gradient(160deg,rgba(252,228,240,.9),rgba(255,245,220,.8))',
    'linear-gradient(160deg,rgba(230,244,234,.9),rgba(238,230,255,.8))',
    'linear-gradient(160deg,rgba(255,245,220,.9),rgba(252,228,240,.8))',
    'linear-gradient(160deg,rgba(220,235,255,.9),rgba(238,230,255,.8))',
  ];

  return (
    <div style={{ padding: '32px 40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: ink3, marginBottom: 6 }}>My Garden</div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 30, fontWeight: 300, color: ink }}>Collections</div>
        </div>
        <button onClick={() => setCreating(true)} style={{ padding: '10px 22px', borderRadius: 50, border: 'none', background: 'linear-gradient(135deg,#c084fc,#7c3aed)', color: '#fff', fontSize: 12, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>+ New Collection</button>
      </div>

      {/* New collection input */}
      {creating && (
        <div style={{ marginBottom: 20, display: 'flex', gap: 10, alignItems: 'center' }}>
          <input
            autoFocus
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') createCollection(); if (e.key === 'Escape') { setCreating(false); setNewName(''); } }}
            placeholder="Collection name…"
            style={{
              padding: '10px 16px', borderRadius: 12, fontSize: 13, color: ink,
              border: `1px solid rgba(160,100,220,.5)`, background: cardBg,
              outline: 'none', fontFamily: "'DM Sans',sans-serif", minWidth: 220,
            }}
          />
          <button onClick={createCollection} disabled={saving} style={{ padding: '10px 20px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#c084fc,#7c3aed)', color: '#fff', fontSize: 12, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>{saving ? 'Saving…' : 'Create'}</button>
          <button onClick={() => { setCreating(false); setNewName(''); }} style={{ padding: '10px 16px', borderRadius: 12, border: `1px solid ${cardBd}`, background: 'transparent', color: ink3, fontSize: 12, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>Cancel</button>
        </div>
      )}

      {loading ? (
        <div style={{ fontSize: 13, color: ink3, fontStyle: 'italic', fontFamily: "'Playfair Display',serif" }}>Loading…</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
          {cols.map((c, i) => (
            <Tilt key={c.id} style={{ borderRadius: 22, overflow: 'hidden', border: `1.5px solid ${cardBd}`, cursor: 'pointer' }}>
              <div style={{ height: 110, background: gradients[i % gradients.length], display: 'flex', alignItems: 'flex-end', padding: '14px 18px' }}>
                <div style={{ fontSize: 28 }}>📚</div>
              </div>
              <div style={{ padding: '16px 18px', background: cardBg, backdropFilter: 'blur(18px)' }}>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 17, fontWeight: 400, color: ink, marginBottom: 6 }}>{c.name}</div>
                <div style={{ fontSize: 11, color: ink3, fontWeight: 300 }}>
                  Updated {new Date(c.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </div>
            </Tilt>
          ))}

          {/* Empty new collection card */}
          <Tilt onClick={() => setCreating(true)} style={{ borderRadius: 22, border: `2px dashed ${cardBd}`, background: 'transparent', cursor: 'pointer', minHeight: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', border: `1.5px dashed ${cardBd}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: ink3 }}>+</div>
            <div style={{ fontSize: 13, color: ink3, fontWeight: 300, fontFamily: "'Playfair Display',serif", fontStyle: 'italic' }}>New Collection</div>
          </Tilt>
        </div>
      )}

      {!loading && cols.length === 0 && !creating && (
        <div style={{ textAlign: 'center', paddingTop: 40 }}>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: ink, fontWeight: 300, marginBottom: 10 }}>No collections yet</div>
          <div style={{ fontSize: 13, color: ink3, fontWeight: 300 }}>Group your poems into collections.</div>
        </div>
      )}
    </div>
  );
}
