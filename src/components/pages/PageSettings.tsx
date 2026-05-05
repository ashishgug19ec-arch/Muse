'use client';
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';

interface Props { night: boolean; }

export function PageSettings({ night }: Props) {
  const { user, isLoaded } = useUser();
  const [bio, setBio] = useState('');
  const [pronouns, setPronouns] = useState('');
  const [location, setLocation] = useState('');
  const [whyYouWrite, setWhyYouWrite] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const n = night;
  const ink  = n ? 'rgba(230,220,255,.9)'  : '#1e1628';
  const ink3 = n ? 'rgba(160,140,200,.55)' : '#8a7aa0';
  const cardBd = n ? 'rgba(160,124,200,.2)'  : 'rgba(208,191,240,.52)';
  const cardBg = n ? 'rgba(255,255,255,.05)' : 'rgba(255,255,255,.72)';

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '11px 16px',
    borderRadius: 12, border: `1.5px solid ${cardBd}`,
    background: cardBg, backdropFilter: 'blur(18px)',
    color: ink, fontSize: 13, fontFamily: "'DM Sans',sans-serif",
    outline: 'none', boxSizing: 'border-box',
  };

  useEffect(() => {
    if (!isLoaded || loaded) return;
    fetch('/api/profile/me')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data) {
          setBio(data.bio ?? '');
          setPronouns(data.pronouns ?? '');
          setLocation(data.location ?? '');
          setWhyYouWrite(data.whyYouWrite ?? '');
        }
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, [isLoaded, loaded]);

  async function handleSave() {
    setSaving(true); setSaved(false);
    try {
      await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bio, pronouns, location, whyYouWrite }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally { setSaving(false); }
  }

  const Section = ({ title }: { title: string }) => (
    <div style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: ink3, marginBottom: 14, marginTop: 28 }}>{title}</div>
  );

  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div style={{ marginBottom: 16 }}>
      <label style={{ fontSize: 10, color: ink3, display: 'block', marginBottom: 6, letterSpacing: '.06em', textTransform: 'uppercase' }}>{label}</label>
      {children}
    </div>
  );

  const displayName = user?.firstName
    ? `${user.firstName}${user.lastName ? ' ' + user.lastName : ''}`
    : user?.emailAddresses?.[0]?.emailAddress?.split('@')[0] ?? '';

  const initials = user?.firstName?.[0] ?? user?.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase() ?? '🌸';

  return (
    <div style={{ padding: '32px 40px', maxWidth: 620, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: ink3, marginBottom: 6 }}>Account</div>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 30, fontWeight: 300, color: ink }}>Settings</div>
      </div>

      <Section title="Profile" />
      <div style={{ borderRadius: 20, border: `1.5px solid ${cardBd}`, background: cardBg, backdropFilter: 'blur(18px)', padding: '20px 22px' }}>
        {/* Avatar + name (read-only from Clerk) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20, paddingBottom: 20, borderBottom: `1px solid ${cardBd}` }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg,#c084fc,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: '#fff', fontWeight: 600, flexShrink: 0 }}>
            {initials}
          </div>
          <div>
            <div style={{ fontSize: 15, color: ink, fontWeight: 400 }}>{displayName}</div>
            <div style={{ fontSize: 11, color: ink3, marginTop: 2 }}>{user?.emailAddresses?.[0]?.emailAddress}</div>
          </div>
        </div>

        <Field label="Bio">
          <textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="A few words about you…"
            style={{ ...inputStyle, minHeight: 80, resize: 'none' as const, lineHeight: 1.6 }} />
        </Field>
        <Field label="Pronouns">
          <input value={pronouns} onChange={e => setPronouns(e.target.value)} placeholder="she/her, they/them…" style={inputStyle} />
        </Field>
        <Field label="Location">
          <input value={location} onChange={e => setLocation(e.target.value)} placeholder="City, country…" style={inputStyle} />
        </Field>
        <Field label="Why you write">
          <input value={whyYouWrite} onChange={e => setWhyYouWrite(e.target.value)} placeholder="What brings you to write…" style={inputStyle} />
        </Field>
      </div>

      <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 14 }}>
        {saved && <span style={{ fontSize: 12, color: '#7c3aed' }}>Saved ✓</span>}
        <button onClick={handleSave} disabled={saving} style={{
          padding: '11px 32px', borderRadius: 50, border: 'none',
          background: saving ? 'rgba(124,58,237,.4)' : 'linear-gradient(135deg,#c084fc,#7c3aed)',
          color: '#fff', fontSize: 13, cursor: saving ? 'not-allowed' : 'pointer',
          fontFamily: "'Playfair Display',serif",
          boxShadow: saving ? 'none' : '0 6px 20px rgba(124,58,237,.3)',
        }}>{saving ? 'Saving…' : 'Save changes'}</button>
      </div>
    </div>
  );
}
