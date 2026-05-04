'use client';
import { useState } from 'react';

interface Props { night: boolean; }

export function PageSettings({ night }: Props) {
  const [name, setName] = useState('Luna Ashwood');
  const [bio, setBio] = useState("I write to find the words for things that happen in the quiet hours.");
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [publicProfile, setPublicProfile] = useState(true);
  const n = night;
  const ink  = n ? 'rgba(230,220,255,.9)'  : '#1e1628';
  const ink3 = n ? 'rgba(160,140,200,.55)' : '#8a7aa0';
  const cardBd = n ? 'rgba(160,124,200,.2)'  : 'rgba(208,191,240,.52)';
  const cardBg = n ? 'rgba(255,255,255,.05)' : 'rgba(255,255,255,.72)';

  const inputStyle = {
    width: '100%', padding: '11px 16px',
    borderRadius: 12, border: `1.5px solid ${cardBd}`,
    background: cardBg, backdropFilter: 'blur(18px)',
    color: ink, fontSize: 13, fontFamily: "'DM Sans',sans-serif", outline: 'none',
  };

  const Toggle = ({ on, toggle }: { on: boolean; toggle: () => void }) => (
    <button onClick={toggle} style={{
      width: 42, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
      background: on ? 'linear-gradient(135deg,#c084fc,#7c3aed)' : cardBd,
      position: 'relative', flexShrink: 0, transition: 'background .2s',
    }}>
      <div style={{
        position: 'absolute', top: 3, left: on ? 21 : 3,
        width: 18, height: 18, borderRadius: '50%', background: '#fff',
        transition: 'left .2s',
      }} />
    </button>
  );

  const Section = ({ title }: { title: string }) => (
    <div style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: ink3, marginBottom: 14, marginTop: 28 }}>{title}</div>
  );

  const Row = ({ label, desc, on, toggle }: { label: string; desc: string; on: boolean; toggle: () => void }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: `1px solid ${cardBd}` }}>
      <div>
        <div style={{ fontSize: 13, color: ink, marginBottom: 2 }}>{label}</div>
        <div style={{ fontSize: 11, color: ink3, fontWeight: 300 }}>{desc}</div>
      </div>
      <Toggle on={on} toggle={toggle} />
    </div>
  );

  return (
    <div style={{ padding: '32px 40px', maxWidth: 620, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: ink3, marginBottom: 6 }}>Account</div>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 30, fontWeight: 300, color: ink }}>Settings</div>
      </div>

      <Section title="Profile" />
      <div style={{ borderRadius: 20, border: `1.5px solid ${cardBd}`, background: cardBg, backdropFilter: 'blur(18px)', padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 4 }}>
          <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'linear-gradient(135deg,#c084fc,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>🌸</div>
          <button style={{ padding: '8px 18px', borderRadius: 50, border: `1px solid ${cardBd}`, background: 'transparent', color: ink3, fontSize: 11, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>Change photo</button>
        </div>
        <div>
          <label style={{ fontSize: 10, color: ink3, display: 'block', marginBottom: 6, letterSpacing: '.06em', textTransform: 'uppercase' }}>Display name</label>
          <input value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
        </div>
        <div>
          <label style={{ fontSize: 10, color: ink3, display: 'block', marginBottom: 6, letterSpacing: '.06em', textTransform: 'uppercase' }}>Bio</label>
          <textarea value={bio} onChange={e => setBio(e.target.value)} style={{ ...inputStyle, minHeight: 80, resize: 'none' }} />
        </div>
      </div>

      <Section title="Privacy" />
      <div style={{ borderRadius: 20, border: `1.5px solid ${cardBd}`, background: cardBg, backdropFilter: 'blur(18px)', padding: '0 22px' }}>
        <Row label="Public profile" desc="Allow others to discover your work" on={publicProfile} toggle={() => setPublicProfile(v => !v)} />
      </div>

      <Section title="Notifications" />
      <div style={{ borderRadius: 20, border: `1.5px solid ${cardBd}`, background: cardBg, backdropFilter: 'blur(18px)', padding: '0 22px' }}>
        <Row label="Email notifications" desc="Likes, comments, and follows" on={emailNotifs} toggle={() => setEmailNotifs(v => !v)} />
        <Row label="Weekly digest" desc="A gentle summary of your garden" on={weeklyDigest} toggle={() => setWeeklyDigest(v => !v)} />
      </div>

      <div style={{ marginTop: 28, display: 'flex', justifyContent: 'flex-end' }}>
        <button style={{ padding: '11px 32px', borderRadius: 50, border: 'none', background: 'linear-gradient(135deg,#c084fc,#7c3aed)', color: '#fff', fontSize: 13, cursor: 'pointer', fontFamily: "'Playfair Display',serif", boxShadow: '0 6px 20px rgba(124,58,237,.3)' }}>Save changes</button>
      </div>
    </div>
  );
}
