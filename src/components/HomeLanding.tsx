'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Nav } from '@/components/Nav';
import { Drawer } from '@/components/Drawer';
import { AppOverlay } from '@/components/AppOverlay';
import { MeshBackground } from '@/components/MeshBackground';
import { SakuraPetals } from '@/components/SakuraPetals';
import { Tilt } from '@/components/ui/Tilt';
import { useMuseStore } from '@/lib/store';

const poems = [
  { text: 'between two words / silence blooms like peonies— / you are the garden', author: 'Luna A.' },
  { text: 'she keeps the moon / in her left pocket for / emergencies, just in case', author: 'Yuki M.' },
  { text: 'the thing about heartbreak / is it always surprises you / even the third time', author: 'Celia R.' },
  { text: 'dawn tastes like copper / and unfinished sentences / I leave on purpose', author: 'Priya S.' },
  { text: 'soft things are the / bravest things — a peony / opens anyway', author: 'Mei L.' },
];

const bentoItems = [
  {
    id: 'sanctuary',
    label: 'Writing Sanctuary',
    emoji: '✍️',
    desc: 'A distraction-free space where your words bloom in silence.',
    span: '2',
    bg: 'linear-gradient(160deg,rgba(238,230,255,.95),rgba(252,228,240,.88))',
    bd: 'rgba(208,191,240,.52)',
  },
  {
    id: 'collections',
    label: 'Collections',
    emoji: '🌸',
    desc: 'Curate your poems into beautiful, themed gardens.',
    span: '1',
    bg: 'rgba(255,255,255,.72)',
    bd: 'rgba(208,191,240,.52)',
  },
  {
    id: 'ikigai',
    label: 'Ikigai Journal',
    emoji: '✦',
    desc: 'Track your alignment with purpose across four pillars.',
    span: '1',
    bg: 'linear-gradient(160deg,rgba(238,230,255,.8),rgba(246,240,255,.9))',
    bd: 'rgba(192,132,252,.3)',
  },
  {
    id: 'explore',
    label: 'Explore',
    emoji: '🔍',
    desc: 'Discover poetry from writers who feel what you feel.',
    span: '1',
    bg: 'rgba(255,255,255,.72)',
    bd: 'rgba(208,191,240,.52)',
  },
  {
    id: 'fan-fiction',
    label: 'Fan Fiction',
    emoji: '🌙',
    desc: 'Poetic reimaginings of the worlds and characters you love.',
    span: '2',
    bg: 'linear-gradient(160deg,#1a1130,#2c1825)',
    bd: 'rgba(160,124,200,.3)',
    dark: true,
  },
];

const stats = [
  { n: '47k', label: 'Poems published' },
  { n: '12k', label: 'Writers blooming' },
  { n: '4.2M', label: 'Words written' },
  { n: '98%', label: 'Would recommend' },
];

const testimonials = [
  { quote: "Muse gave me back my voice after years of silence. I didn't know I still had poems in me.", name: 'Yuki M.', role: 'Poet · 3 years on Muse' },
  { quote: "The Ikigai journal changed how I think about writing — and about myself.", name: 'Celia R.', role: 'Writer · 18 months on Muse' },
  { quote: "Every morning I open the sanctuary before I open anything else.", name: 'Priya S.', role: 'Poet · 2 years on Muse' },
];

export default function HomeLanding() {
  const { openPage, night } = useMuseStore();
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const page = searchParams.get('page');
    if (page && isLoaded && isSignedIn) {
      openPage(page);
      router.replace('/');
    }
  }, [isLoaded, isSignedIn, searchParams]);

  function handleBeginWriting() {
    if (!isLoaded) return;
    if (isSignedIn) openPage('write');
    else router.push('/sign-up');
  }

  const ink  = night ? 'rgba(230,220,255,.9)'  : '#1e1628';
  const ink2 = night ? 'rgba(200,180,255,.7)'  : '#4a3960';
  const ink3 = night ? 'rgba(160,140,200,.55)' : '#8a7aa0';
  const cardBd = night ? 'rgba(160,124,200,.2)'  : 'rgba(208,191,240,.52)';
  const cardBg = night ? 'rgba(255,255,255,.05)' : 'rgba(255,255,255,.72)';

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflowX: 'hidden' }}>
      <MeshBackground night={night} />
      <SakuraPetals night={night} />
      <Nav />
      <Drawer />
      <AppOverlay />

      {/* ══ HERO ══ */}
      <section style={{ minHeight: '90vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '80px 24px 60px', position: 'relative' }}>
        <div style={{ fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', color: '#c084fc', marginBottom: 20, opacity: .85 }}>A sanctuary for women who write</div>

        <h1 style={{
          fontFamily: "'Playfair Display',serif", fontWeight: 300,
          fontSize: 'clamp(48px,7vw,88px)', lineHeight: 1.1, letterSpacing: '-.04em',
          background: night ? 'linear-gradient(135deg,rgba(230,220,255,.95),rgba(192,132,252,.9))' : 'linear-gradient(135deg,#1e1628,#4a3960,#7c3aed)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          marginBottom: 28, maxWidth: 780,
        }}>
          Your words have<br />always been a garden.
        </h1>

        <p style={{ fontSize: 18, color: ink2, fontWeight: 300, lineHeight: 1.8, maxWidth: 520, marginBottom: 44, fontFamily: "'Playfair Display',serif", fontStyle: 'italic' }}>
          Muse is a writing sanctuary for women — a place to bloom, grow, and share the poems only you can write.
        </p>

        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={handleBeginWriting}
            style={{
              padding: '15px 36px', borderRadius: 50, border: 'none',
              background: 'linear-gradient(135deg,#c084fc,#9b72cf,#7c3aed)',
              color: '#fff', fontSize: 14, cursor: 'pointer',
              fontFamily: "'Playfair Display',serif", fontStyle: 'italic', letterSpacing: '.04em',
              boxShadow: '0 8px 30px rgba(124,58,237,.38)', transition: 'transform .2s, box-shadow .2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 14px 40px rgba(124,58,237,.45)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 8px 30px rgba(124,58,237,.38)'; }}
          >Begin writing →</button>
          <button
            onClick={() => openPage('explore')}
            style={{
              padding: '15px 36px', borderRadius: 50,
              border: `1.5px solid ${night ? 'rgba(160,124,200,.45)' : '#d0bff0'}`,
              background: cardBg, backdropFilter: 'blur(16px)',
              color: '#c084fc', fontSize: 14, cursor: 'pointer',
              fontFamily: "'Playfair Display',serif", fontStyle: 'italic', letterSpacing: '.04em',
              transition: 'border-color .2s',
            }}
          >Explore poetry</button>
        </div>

        {/* Floating poem card */}
        <div style={{ marginTop: 64, position: 'relative', maxWidth: 380 }}>
          <Tilt style={{
            borderRadius: 24,
            border: `1.5px solid ${cardBd}`,
            background: cardBg,
            backdropFilter: 'blur(24px)',
            padding: '28px 32px',
            boxShadow: '0 24px 56px rgba(124,58,237,.13)',
          }}>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontStyle: 'italic', fontWeight: 300, color: ink2, lineHeight: 2, marginBottom: 16 }}>
              "Between two words<br />silence blooms like peonies—<br />you are the garden"
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#c084fc,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>🌸</div>
              <div>
                <div style={{ fontSize: 11, color: ink, fontWeight: 400 }}>Luna A.</div>
                <div style={{ fontSize: 10, color: ink3 }}>Haiku · Apr 12</div>
              </div>
              <div style={{ marginLeft: 'auto', fontSize: 11, color: ink3 }}>♡ 284</div>
            </div>
          </Tilt>
        </div>
      </section>

      {/* ══ STATS ══ */}
      <section style={{ padding: '40px 60px', maxWidth: 900, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24 }}>
          {stats.map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 36, fontWeight: 300, color: ink, letterSpacing: '-.04em' }}>{s.n}</div>
              <div style={{ fontSize: 11, color: ink3, marginTop: 4, fontWeight: 300 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ BENTO GRID ══ */}
      <section style={{ padding: '60px 40px', maxWidth: 1080, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <div style={{ fontSize: 10, letterSpacing: '.15em', textTransform: 'uppercase', color: '#c084fc', marginBottom: 12 }}>Features</div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 36, fontWeight: 300, color: ink, letterSpacing: '-.03em' }}>Everything your garden needs</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
          {/* Row 1: 2+1 */}
          {bentoItems.slice(0, 2).map(item => (
            <Tilt
              key={item.id}
              onClick={() => openPage(item.id)}
              style={{
                gridColumn: item.span === '2' ? 'span 2' : 'span 1',
                borderRadius: 24, border: `1.5px solid ${item.bd}`,
                background: item.bg, backdropFilter: 'blur(20px)',
                padding: '36px 32px', cursor: 'pointer', minHeight: 200,
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 16 }}>{item.emoji}</div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 400, color: item.dark ? 'rgba(230,220,255,.9)' : ink, marginBottom: 8 }}>{item.label}</div>
              <div style={{ fontSize: 13, color: item.dark ? 'rgba(200,180,255,.6)' : ink3, fontWeight: 300, lineHeight: 1.7 }}>{item.desc}</div>
            </Tilt>
          ))}

          {/* Row 2: 1+1+2 */}
          {bentoItems.slice(2).map(item => (
            <Tilt
              key={item.id}
              onClick={() => openPage(item.id)}
              style={{
                gridColumn: item.span === '2' ? 'span 2' : 'span 1',
                borderRadius: 24, border: `1.5px solid ${item.bd}`,
                background: item.bg, backdropFilter: 'blur(20px)',
                padding: '36px 32px', cursor: 'pointer', minHeight: 180,
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 16 }}>{item.emoji}</div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 400, color: item.dark ? 'rgba(230,220,255,.9)' : ink, marginBottom: 8 }}>{item.label}</div>
              <div style={{ fontSize: 13, color: item.dark ? 'rgba(200,180,255,.6)' : ink3, fontWeight: 300, lineHeight: 1.7 }}>{item.desc}</div>
            </Tilt>
          ))}
        </div>
      </section>

      {/* ══ POEM STRIP ══ */}
      <section style={{ padding: '60px 0', overflow: 'hidden', borderTop: `1px solid ${cardBd}`, borderBottom: `1px solid ${cardBd}` }}>
        <div style={{ display: 'flex', gap: 28, animation: 'slide 28s linear infinite', width: 'max-content' }}>
          {[...poems, ...poems].map((p, i) => (
            <div key={i} style={{
              width: 280, flexShrink: 0, padding: '24px 26px',
              borderRadius: 20, border: `1.5px solid ${cardBd}`,
              background: cardBg, backdropFilter: 'blur(18px)',
            }}>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 13, fontStyle: 'italic', color: ink2, lineHeight: 2, marginBottom: 12 }}>"{p.text}"</div>
              <div style={{ fontSize: 10, color: ink3 }}>— {p.author}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ TESTIMONIALS ══ */}
      <section style={{ padding: '80px 40px', maxWidth: 960, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontSize: 10, letterSpacing: '.15em', textTransform: 'uppercase', color: '#c084fc', marginBottom: 12 }}>From the garden</div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 34, fontWeight: 300, color: ink, letterSpacing: '-.03em' }}>Writers who found their voice</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
          {testimonials.map(t => (
            <Tilt key={t.name} style={{ borderRadius: 22, border: `1.5px solid ${cardBd}`, background: cardBg, backdropFilter: 'blur(20px)', padding: '28px 26px' }}>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 15, fontStyle: 'italic', color: ink2, lineHeight: 1.8, marginBottom: 20 }}>"{t.quote}"</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#c084fc,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🌸</div>
                <div>
                  <div style={{ fontSize: 12, color: ink, fontWeight: 400 }}>{t.name}</div>
                  <div style={{ fontSize: 10, color: ink3, fontWeight: 300 }}>{t.role}</div>
                </div>
              </div>
            </Tilt>
          ))}
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section style={{
        position: 'relative',
        margin: '40px', borderRadius: 32,
        background: night ? 'linear-gradient(160deg,#1a1130,#2c1060)' : 'linear-gradient(160deg,#ede8ff,#f7e8f5)',
        border: `1.5px solid ${cardBd}`,
        padding: '80px 60px', textAlign: 'center',
      }}>
        <div style={{ fontSize: 10, letterSpacing: '.15em', textTransform: 'uppercase', color: '#c084fc', marginBottom: 16 }}>Begin today</div>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 42, fontWeight: 300, color: ink, letterSpacing: '-.04em', lineHeight: 1.2, marginBottom: 18, maxWidth: 560, margin: '0 auto 18px' }}>
          Your garden is waiting to bloom.
        </h2>
        <p style={{ fontSize: 15, color: ink2, fontWeight: 300, marginBottom: 36, fontFamily: "'Playfair Display',serif", fontStyle: 'italic' }}>
          Free forever. No pressure. Just your words and a quiet place to write them.
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center' }}>
          <button
            onClick={handleBeginWriting}
            style={{
              padding: '16px 44px', borderRadius: 50, border: 'none',
              background: 'linear-gradient(135deg,#c084fc,#9b72cf,#7c3aed)',
              color: '#fff', fontSize: 15, cursor: 'pointer',
              fontFamily: "'Playfair Display',serif", fontStyle: 'italic',
              boxShadow: '0 8px 30px rgba(124,58,237,.38)',
            }}
          >Begin writing — it&apos;s free</button>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer style={{
        position: 'relative',
        background: night ? 'rgba(20,10,36,.95)' : 'rgba(240,235,255,.98)',
        borderTop: `1px solid ${cardBd}`,
        padding: '36px 60px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 16,
      }}>
        <div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, color: ink, fontWeight: 400, marginBottom: 3 }}>Muse</div>
          <div style={{ fontSize: 11, color: ink3, fontWeight: 300 }}>A garden of poetry — tended with love.</div>
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          {[
            { label: 'Poems', page: 'poems' },
            { label: 'Fan Fiction', page: 'fan fiction' },
            { label: 'Collections', page: 'collections' },
            { label: 'Settings', page: 'settings' },
          ].map(l => (
            <button key={l.label} onClick={() => openPage(l.page)} style={{ fontSize: 12, color: ink3, background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontWeight: 300 }}>{l.label}</button>
          ))}
        </div>
        <div style={{ fontSize: 11, color: ink3, fontWeight: 300 }}>© {new Date().getFullYear()} Muse · All rights reserved</div>
      </footer>
    </div>
  );
}
