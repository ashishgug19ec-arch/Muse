'use client';
import { useState, useEffect } from 'react';
import { useSignUp } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

type Step = 'info' | 'otp';

const PETALS = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  left: `${4 + (i * 6.8) % 88}%`,
  delay: `${(i * 0.9) % 9}s`,
  dur: `${8 + (i * 1.2) % 6}s`,
  size: 6 + (i * 1.8) % 7,
  pink: i % 2 === 0,
}));

const QUOTES = [
  { text: "She gather me, man. The pieces I am, she gather them and give them back to me in all the right order.", author: '— Toni Morrison' },
  { text: "I took a deep breath and listened to the old brag of my heart: I am, I am, I am.", author: '— Sylvia Plath' },
  { text: "You do not have to be good. You do not have to walk on your knees for a hundred miles repenting.", author: '— Mary Oliver' },
];

export default function SignUpPage() {
  const { isLoaded, signUp, setActive } = useSignUp() as any;
  const router = useRouter();
  const [step, setStep] = useState<Step>('info');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [quote, setQuote] = useState(QUOTES[0]);
  useEffect(() => { setQuote(QUOTES[new Date().getDate() % QUOTES.length]); }, []);

  async function handleInfo(e: React.FormEvent) {
    e.preventDefault();
    if (!isLoaded) return;
    setLoading(true); setError('');
    try {
      await signUp.create({ firstName, lastName, emailAddress: email });
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setStep('otp');
    } catch (err: any) {
      setError(err.errors?.[0]?.longMessage ?? err.errors?.[0]?.message ?? 'Something went wrong');
    } finally { setLoading(false); }
  }

  async function handleOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!isLoaded) return;
    setLoading(true); setError('');
    try {
      const result = await signUp.attemptEmailAddressVerification({ code });
      if (result.status === 'complete') { await setActive({ session: result.createdSessionId }); router.push('/'); }
    } catch (err: any) {
      setError(err.errors?.[0]?.longMessage ?? err.errors?.[0]?.message ?? 'Invalid code');
    } finally { setLoading(false); }
  }

  async function handleGoogle() {
    if (!isLoaded) return;
    await signUp.authenticateWithRedirect({ strategy: 'oauth_google', redirectUrl: '/sso-callback', redirectUrlComplete: '/' });
  }

  return (
    <>
      <style>{`
        @keyframes petalFall {
          0%   { transform: translateY(-20px) rotate(0deg) scale(1); opacity: 0; }
          8%   { opacity: 1; }
          90%  { opacity: .5; }
          100% { transform: translateY(105vh) rotate(380deg) scale(.85); opacity: 0; }
        }
        @keyframes petalSway {
          0%,100% { margin-left: 0px; }
          33%     { margin-left: 22px; }
          66%     { margin-left: -12px; }
        }
        .f-input { transition: border-color .18s, box-shadow .18s; outline: none; }
        .f-input:focus { border-color: #a855f7 !important; box-shadow: 0 0 0 3px rgba(168,85,247,.1) !important; }
        .f-input::placeholder { color: #c8b8d8; }
        .f-social:hover { border-color: rgba(168,85,247,.5) !important; background: rgba(168,85,247,.04) !important; }
        .f-ghost:hover { color: #a855f7 !important; }
      `}</style>

      {/* Page */}
      <div style={{
        minHeight: '100vh',
        background: '#f7f3ff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '28px 20px',
        fontFamily: "'DM Sans', sans-serif",
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Falling petals — outer background only */}
        {PETALS.map(p => (
          <div key={p.id} style={{
            position: 'absolute', left: p.left, top: '-20px', zIndex: 0,
            width: p.size, height: p.size * 1.5,
            background: p.pink
              ? 'radial-gradient(ellipse, rgba(220,130,190,.5) 30%, rgba(255,190,220,.28) 100%)'
              : 'radial-gradient(ellipse, rgba(170,110,240,.4) 30%, rgba(210,170,255,.22) 100%)',
            borderRadius: '50% 50% 50% 50% / 62% 62% 38% 38%',
            animation: `petalFall ${p.dur} ease-in infinite, petalSway ${2.8 + p.id * 0.25}s ease-in-out infinite`,
            animationDelay: p.delay, pointerEvents: 'none',
          }} />
        ))}
        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .55, ease: [.25, .9, .4, 1] }}
          style={{
            width: '100%', maxWidth: 1240, minHeight: 640,
            borderRadius: 0, overflow: 'hidden', display: 'flex',
            position: 'relative', zIndex: 1,
            boxShadow: '0 24px 64px rgba(80,20,140,.13), 0 4px 16px rgba(80,20,140,.07)',
          }}
        >

          {/* ── LEFT: Form ─────────────────────────────────── */}
          <div style={{
            width: 400, flexShrink: 0, background: '#fff',
            padding: '52px 52px 48px',
            display: 'flex', flexDirection: 'column',
            boxShadow: '4px 0 20px rgba(0,0,0,.06)', zIndex: 1,
          }}>


            {/* Muse logo */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 40 }}>
              <svg width="62" height="62" viewBox="0 0 36 36" fill="none">
                <circle cx="18" cy="18" r="4.5" fill="rgba(232,110,160,.92)"/>
                <g transform="translate(18,18)">
                  {[0,72,144,216,288].map((a,i) => (
                    <ellipse key={i} rx="5" ry="8.5"
                      fill={i%2===0?'rgba(192,100,252,.88)':'rgba(216,150,255,.84)'}
                      stroke="rgba(180,100,230,.3)" strokeWidth=".5"
                      transform={`rotate(${a}) translate(0,-7.5)`}/>
                  ))}
                </g>
              </svg>
              <div style={{ fontFamily:"'Fraunces','Cormorant Garamond',Georgia,serif", fontOpticalSizing: 'auto', fontSize: 24, color: '#1a0a2e', fontWeight: 400, letterSpacing: '.03em', marginTop: 10 }}>Muse</div>
              <div style={{ fontSize: 9, color: '#c4aedd', letterSpacing: '.18em', textTransform: 'uppercase', marginTop: 3 }}>garden of poetry</div>
            </div>

            <AnimatePresence mode="wait">

              {/* ── Info step ── */}
              {step === 'info' && (
                <motion.div key="info"
                  initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: .2 }}
                  style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>

                  <h1 style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 26, fontWeight: 800,
                    color: '#0e0616', lineHeight: 1.1,
                    letterSpacing: '-.02em',
                    margin: '0 0 32px',
                    whiteSpace: 'nowrap',
                  }}>
                    Let your words bloom.
                  </h1>

                  {/* Google first */}
                  <button type="button" onClick={handleGoogle} className="f-social"
                    style={{ ...socialBtn, marginBottom: 18 }}>
                    <GoogleIcon />
                    Continue with Google
                  </button>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
                    <div style={{ flex: 1, height: 1, background: '#ede8f5' }} />
                    <span style={{ fontSize: 12, color: '#b8a8cc', letterSpacing: '.03em' }}>or create account</span>
                    <div style={{ flex: 1, height: 1, background: '#ede8f5' }} />
                  </div>

                  <form onSubmit={handleInfo} style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <div>
                        <label style={lbl}>First name</label>
                        <input value={firstName} onChange={e => setFirstName(e.target.value)}
                          placeholder="Aria" required autoFocus
                          className="f-input" style={inp} />
                      </div>
                      <div>
                        <label style={lbl}>Last name</label>
                        <input value={lastName} onChange={e => setLastName(e.target.value)}
                          placeholder="Moon"
                          className="f-input" style={inp} />
                      </div>
                    </div>

                    <label style={lbl}>Email</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="Enter your email address" required
                      className="f-input" style={inp} />

                    {error && <p style={errSt}>{error}</p>}

                    <button type="submit" disabled={loading} style={primaryBtn(loading)}>
                      {loading ? 'Creating…' : 'Create account'}
                    </button>
                  </form>

                  <div style={{ marginTop: 'auto', paddingTop: 28 }}>
                    <p style={{ textAlign: 'center', fontSize: 12.5, color: '#a898bc', margin: '0 0 10px' }}>
                      Already have an account?
                    </p>
                    <Link href="/sign-in" style={{ textDecoration: 'none' }}>
                      <button type="button" style={outlineBtn}>Sign in</button>
                    </Link>
                    <p style={{ textAlign: 'center', fontSize: 11, color: '#c8b8d8', marginTop: 14, lineHeight: 1.6 }}>
                      Free forever · No credit card needed
                    </p>
                  </div>
                </motion.div>
              )}

              {/* ── OTP step ── */}
              {step === 'otp' && (
                <motion.form key="otp" onSubmit={handleOtp}
                  initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: .2 }}
                  style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>

                  <h1 style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 38, fontWeight: 900,
                    color: '#0e0616', lineHeight: 1.05,
                    letterSpacing: '-.02em',
                    margin: '0 0 8px',
                  }}>
                    Check your<br />inbox. 🌸
                  </h1>

                  <p style={{ fontSize: 13.5, color: '#7a6890', marginBottom: 28, lineHeight: 1.65, fontWeight: 300 }}>
                    We sent a 6-digit code to <strong style={{ color: '#4a1a7a', fontWeight: 500 }}>{email}</strong>.
                    Enter it below to enter your garden.
                  </p>

                  <label style={lbl}>Verification code</label>
                  <input type="text" value={code} onChange={e => setCode(e.target.value)}
                    placeholder="• • • • • •" maxLength={6} required autoFocus
                    className="f-input"
                    style={{ ...inp, letterSpacing: '0.4em', textAlign: 'center', fontSize: 22 }} />

                  {error && <p style={errSt}>{error}</p>}

                  <button type="submit" disabled={loading} style={primaryBtn(loading)}>
                    {loading ? 'Verifying…' : 'Verify & enter garden →'}
                  </button>
                  <button type="button" className="f-ghost"
                    onClick={() => { setStep('info'); setError(''); setCode(''); }}
                    style={ghostBtn}>
                    ← Back
                  </button>
                </motion.form>
              )}

            </AnimatePresence>
          </div>

          {/* ── RIGHT: Gradient background ──────────────────── */}
          <div style={{
            flex: 1, position: 'relative', overflow: 'hidden',
            background: [
              'radial-gradient(ellipse at 18% 12%, rgba(120,80,200,.42) 0%, transparent 60%)',
              'radial-gradient(ellipse at 80% 20%, rgba(90,40,150,.48) 0%, transparent 55%)',
              'radial-gradient(ellipse at 48% 55%, rgba(50,30,120,.36) 0%, transparent 62%)',
              'radial-gradient(ellipse at 10% 80%, rgba(140,100,220,.32) 0%, transparent 50%)',
              'radial-gradient(ellipse at 86% 74%, rgba(200,80,140,.30) 0%, transparent 52%)',
              '#06030f',
            ].join(','),
          }}>

            {/* Soft shimmer overlay */}
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, rgba(232,154,184,.12) 0%, transparent 65%)', pointerEvents: 'none', zIndex: 1 }} />

            {/* Bottom gradient overlay */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, height: 280,
              background: 'linear-gradient(to top, rgba(6,3,15,.85) 0%, rgba(6,3,15,.4) 52%, transparent 100%)',
              zIndex: 2,
            }} />

            {/* Quote — center of panel */}
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center', padding: '0 32px',
              pointerEvents: 'none',
            }}>
              <p style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 14, fontStyle: 'italic', fontWeight: 400,
                color: 'rgba(255,255,255,.65)',
                lineHeight: 1.8, margin: '0 0 8px',
                textShadow: '0 1px 8px rgba(0,0,0,.4)',
                maxWidth: 240,
              }}>
                "{quote.text}"
              </p>
              <div style={{ fontSize: 10.5, color: 'rgba(255,225,255,.45)', letterSpacing: '.07em' }}>{quote.author}</div>
            </div>

            {/* Text overlay — bottom */}
            <div style={{ position: 'absolute', bottom: 40, left: 38, zIndex: 2 }}>
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 38, fontStyle: 'normal', fontWeight: 700,
                color: '#fff',
                lineHeight: 1.25, margin: 0,
                textShadow: '0 3px 18px rgba(0,0,0,.4)',
                letterSpacing: '-.01em',
              }}>
                Write the poem<br />only you can write.
              </p>
              <p style={{ fontSize: 12, color: 'rgba(255,240,255,.6)', marginTop: 12, letterSpacing: '.12em', textTransform: 'uppercase', fontWeight: 400 }}>
                Free forever · 12k+ women writing
              </p>
            </div>

          </div>

        </motion.div>
      </div>
    </>
  );
}

function GoogleIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 18 18" style={{ flexShrink: 0 }}>
      <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
      <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
      <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"/>
      <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/>
    </svg>
  );
}

const lbl: React.CSSProperties = {
  fontSize: 12.5, color: '#7a6890', fontWeight: 400,
  display: 'block', marginBottom: 8, letterSpacing: '.01em',
};
const inp: React.CSSProperties = {
  width: '100%', padding: '12px 14px',
  borderRadius: 9, border: '1.5px solid #e8e0f0',
  background: '#fdfbff', fontSize: 14, color: '#1a0a2e',
  fontFamily: "'DM Sans', sans-serif",
  boxSizing: 'border-box', marginBottom: 14,
};
const errSt: React.CSSProperties = {
  fontSize: 12, color: '#c0406a', margin: '-6px 0 10px', lineHeight: 1.5,
};
const socialBtn: React.CSSProperties = {
  width: '100%', padding: '12px 16px',
  borderRadius: 9, border: '1.5px solid #e8e0f0',
  background: '#fff', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9,
  fontSize: 14, color: '#2d1a4a', fontFamily: "'DM Sans', sans-serif",
  transition: 'all .18s',
};
const outlineBtn: React.CSSProperties = {
  width: '100%', padding: '12px', borderRadius: 9,
  border: '1.5px solid #e8e0f0', background: '#fff',
  fontSize: 14, color: '#4a3060', cursor: 'pointer',
  fontFamily: "'DM Sans', sans-serif", transition: 'all .18s',
};
const ghostBtn: React.CSSProperties = {
  marginTop: 10, padding: '10px', background: 'none', border: 'none',
  color: '#b0a0c4', fontSize: 13, cursor: 'pointer',
  fontFamily: "'DM Sans', sans-serif", transition: 'color .18s',
  width: '100%',
};
function primaryBtn(loading: boolean): React.CSSProperties {
  return {
    width: '100%', padding: '13px',
    borderRadius: 9, border: 'none',
    background: loading
      ? 'rgba(168,85,247,.4)'
      : 'linear-gradient(135deg, #c084fc 0%, #a855f7 50%, #9333ea 100%)',
    color: '#fff', fontSize: 14, fontWeight: 500,
    cursor: loading ? 'not-allowed' : 'pointer',
    fontFamily: "'DM Sans', sans-serif",
    boxShadow: loading ? 'none' : '0 6px 20px rgba(168,85,247,.3)',
    transition: 'all .2s',
  };
}
