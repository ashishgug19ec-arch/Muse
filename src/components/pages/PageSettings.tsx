'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@clerk/nextjs';
import { useMuseStore } from '@/lib/store';

interface Props { night: boolean; }

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.34, 1.2, 0.64, 1] } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };

export function PageSettings({ night }: Props) {
  const { user, isLoaded } = useUser();
  const { setNickname } = useMuseStore();
  const [username, setUsername]     = useState('');
  const [bio, setBio]               = useState('');
  const [pronouns, setPronouns]     = useState('');
  const [location, setLocation]     = useState('');
  const [whyYouWrite, setWhyYouWrite] = useState('');
  const [saving, setSaving]         = useState(false);
  const [saved, setSaved]           = useState(false);
  const [loaded, setLoaded]         = useState(false);
  const [usernameError, setUsernameError] = useState('');

  const n = night;
  const ink  = n ? 'rgba(230,220,255,.9)'  : '#1e1628';
  const ink2 = n ? 'rgba(200,180,255,.7)'  : '#4a3960';
  const ink3 = n ? 'rgba(160,140,200,.55)' : '#8a7aa0';
  const cardBd = n ? 'rgba(160,124,200,.2)'  : 'rgba(208,191,240,.52)';
  const cardBg = n ? 'rgba(255,255,255,.05)' : 'rgba(255,255,255,.72)';

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 16px', borderRadius: 14,
    border: `1.5px solid ${cardBd}`,
    background: n ? 'rgba(255,255,255,.06)' : 'rgba(255,255,255,.85)',
    backdropFilter: 'blur(18px)',
    color: ink, fontSize: 13, fontFamily: "'DM Sans',sans-serif",
    outline: 'none', boxSizing: 'border-box' as const,
    transition: 'border-color .2s',
  };

  useEffect(() => {
    if (!isLoaded || loaded) return;
    fetch('/api/profile/me')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data) {
          setUsername(data.username ?? '');
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
    setUsernameError('');
    if (username && !/^[a-z0-9_]{3,24}$/.test(username)) {
      setUsernameError('3–24 chars, lowercase letters, numbers and _ only');
      return;
    }
    setSaving(true); setSaved(false);
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username || undefined, bio, pronouns, location, whyYouWrite }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        if (err?.error?.includes('UNIQUE') || res.status === 409) {
          setUsernameError('That nickname is already taken');
          return;
        }
      }
      if (username) setNickname(username);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally { setSaving(false); }
  }

  const displayName = user?.firstName
    ? `${user.firstName}${user.lastName ? ' ' + user.lastName : ''}`
    : user?.emailAddresses?.[0]?.emailAddress?.split('@')[0] ?? '';
  const initials = user?.firstName?.[0] ?? user?.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase() ?? '🌸';

  return (
    <div style={{ padding: '36px 44px', maxWidth: 640, margin: '0 auto' }}>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ marginBottom: 36 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <div style={{ width: 22, height: 1, background: 'linear-gradient(90deg,#c084fc,transparent)' }} />
          <span style={{ fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: '#c084fc' }}>Account</span>
        </div>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, fontWeight: 300, color: ink, letterSpacing: '-.03em', lineHeight: 1.1 }}>
          Your{' '}
          <em style={{ fontStyle: 'italic', background: 'linear-gradient(135deg,#c084fc,#f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Profile</em>
        </h1>
      </motion.div>

      <motion.div initial="hidden" animate="show" variants={stagger} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Account identity (read-only from Clerk) */}
        <motion.div variants={fadeUp} style={{ borderRadius: 22, border: `1.5px solid ${cardBd}`, background: cardBg, backdropFilter: 'blur(20px)', padding: '22px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'linear-gradient(135deg,#c084fc,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, color: '#fff', fontWeight: 600, flexShrink: 0, boxShadow: '0 4px 16px rgba(124,58,237,.3)' }}>
              {initials}
            </div>
            <div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, color: ink, fontWeight: 400 }}>{displayName}</div>
              <div style={{ fontSize: 11, color: ink3, marginTop: 3 }}>{user?.emailAddresses?.[0]?.emailAddress}</div>
            </div>
            <div style={{ marginLeft: 'auto', fontSize: 10, padding: '3px 12px', borderRadius: 50, background: 'rgba(192,132,252,.12)', color: '#c084fc', border: '1px solid rgba(192,132,252,.3)', letterSpacing: '.06em' }}>Poet</div>
          </div>
        </motion.div>

        {/* Bio & details */}
        <motion.div variants={fadeUp} style={{ borderRadius: 22, border: `1.5px solid ${cardBd}`, background: cardBg, backdropFilter: 'blur(20px)', padding: '24px', overflow: 'hidden', position: 'relative' }}>
          <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: 'radial-gradient(circle,rgba(192,132,252,.12),transparent 70%)', pointerEvents: 'none' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <div style={{ width: 16, height: 1, background: 'linear-gradient(90deg,#c084fc,transparent)' }} />
            <span style={{ fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: ink3 }}>Writer Profile</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            <div>
              <label style={{ fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', color: ink3, display: 'block', marginBottom: 8 }}>Nickname / handle</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: ink3, pointerEvents: 'none', fontFamily: "'DM Sans',sans-serif" }}>@</span>
                <input
                  value={username}
                  onChange={e => { setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '')); setUsernameError(''); }}
                  placeholder="your_handle"
                  maxLength={24}
                  style={{ ...inputStyle, paddingLeft: 30 }}
                />
              </div>
              {usernameError && <div style={{ fontSize: 11, color: '#f472b6', marginTop: 5, fontFamily: "'DM Sans',sans-serif" }}>{usernameError}</div>}
              <div style={{ fontSize: 10, color: ink3, marginTop: 5, fontFamily: "'DM Sans',sans-serif" }}>Shows everywhere in place of your name. Lowercase letters, numbers and _ only.</div>
            </div>

            <div>
              <label style={{ fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', color: ink3, display: 'block', marginBottom: 8 }}>Bio</label>
              <textarea
                value={bio}
                onChange={e => setBio(e.target.value)}
                placeholder="A few words about you…"
                style={{ ...inputStyle, minHeight: 88, resize: 'none' as const, lineHeight: 1.65, fontFamily: "'Playfair Display',serif", fontSize: 14 }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label style={{ fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', color: ink3, display: 'block', marginBottom: 8 }}>Pronouns</label>
                <input value={pronouns} onChange={e => setPronouns(e.target.value)} placeholder="she/her, they/them…" style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', color: ink3, display: 'block', marginBottom: 8 }}>Location</label>
                <input value={location} onChange={e => setLocation(e.target.value)} placeholder="City, country…" style={inputStyle} />
              </div>
            </div>

            <div>
              <label style={{ fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', color: ink3, display: 'block', marginBottom: 8 }}>Why you write</label>
              <input value={whyYouWrite} onChange={e => setWhyYouWrite(e.target.value)} placeholder="What brings you to write…" style={inputStyle} />
            </div>

          </div>
        </motion.div>

        {/* Writing preferences */}
        <motion.div variants={fadeUp} style={{ borderRadius: 22, border: `1.5px solid ${cardBd}`, background: cardBg, backdropFilter: 'blur(20px)', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
            <div style={{ width: 16, height: 1, background: 'linear-gradient(90deg,#f472b6,transparent)' }} />
            <span style={{ fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: ink3 }}>Preferences</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { label: 'Email notifications', desc: 'When someone likes your poem' },
              { label: 'Weekly digest', desc: 'A summary of your week' },
              { label: 'Featured in Explore', desc: 'Allow your poems to be featured' },
              { label: 'Public profile', desc: 'Others can find your work' },
            ].map(pref => (
              <div key={pref.label} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '12px 14px', borderRadius: 14, border: `1px solid ${cardBd}`, background: n ? 'rgba(255,255,255,.03)' : 'rgba(255,255,255,.5)' }}>
                <div>
                  <div style={{ fontSize: 12, color: ink2, fontWeight: 400, marginBottom: 2, fontFamily: "'DM Sans',sans-serif" }}>{pref.label}</div>
                  <div style={{ fontSize: 10, color: ink3 }}>{pref.desc}</div>
                </div>
                <div style={{ width: 36, height: 20, borderRadius: 10, background: 'linear-gradient(135deg,#c084fc,#7c3aed)', flexShrink: 0, marginLeft: 10, marginTop: 2, cursor: 'pointer', display: 'flex', alignItems: 'center', paddingRight: 3, justifyContent: 'flex-end' }}>
                  <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,.2)' }} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Save bar */}
        <motion.div variants={fadeUp} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 14, paddingTop: 4 }}>
          <AnimatePresence>
            {saved && (
              <motion.span initial={{ opacity: 0, scale: .9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} style={{ fontSize: 12, color: '#7c3aed' }}>✓ Saved</motion.span>
            )}
          </AnimatePresence>
          <motion.button
            whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: .98 }}
            onClick={handleSave}
            disabled={saving}
            style={{ padding: '12px 34px', borderRadius: 50, border: 'none', background: saving ? 'rgba(124,58,237,.4)' : 'linear-gradient(135deg,#c084fc,#7c3aed)', color: '#fff', fontSize: 13, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: "'Playfair Display',serif", letterSpacing: '.04em', boxShadow: saving ? 'none' : '0 6px 22px rgba(124,58,237,.3)' }}
          >{saving ? 'Saving…' : 'Save changes'}</motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
