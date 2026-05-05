'use client';
import { useState } from 'react';
import { useSignIn } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Step = 'email' | 'otp' | 'password';

export default function SignInPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!isLoaded) return;
    setLoading(true); setError('');
    try {
      const si = await signIn.create({ identifier: email });
      const factors = si.supportedFirstFactors ?? [];
      const hasCode = factors.some((f: any) => f.strategy === 'email_code');
      const hasPass = factors.some((f: any) => f.strategy === 'password');
      if (hasCode) {
        await signIn.prepareFirstFactor({ strategy: 'email_code', emailAddressId: (factors.find((f: any) => f.strategy === 'email_code') as any).emailAddressId });
        setStep('otp');
      } else if (hasPass) {
        setStep('password');
      } else {
        setError('No supported login method found.');
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.longMessage ?? err.errors?.[0]?.message ?? 'Something went wrong');
    } finally { setLoading(false); }
  }

  async function handleOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!isLoaded) return;
    setLoading(true); setError('');
    try {
      const result = await signIn.attemptFirstFactor({ strategy: 'email_code', code });
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        router.push('/');
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.longMessage ?? err.errors?.[0]?.message ?? 'Invalid code');
    } finally { setLoading(false); }
  }

  async function handlePassword(e: React.FormEvent) {
    e.preventDefault();
    if (!isLoaded) return;
    setLoading(true); setError('');
    try {
      const result = await signIn.attemptFirstFactor({ strategy: 'password', password });
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        router.push('/');
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.longMessage ?? err.errors?.[0]?.message ?? 'Incorrect password');
    } finally { setLoading(false); }
  }

  async function handleGoogle() {
    if (!isLoaded) return;
    await signIn.authenticateWithRedirect({ strategy: 'oauth_google', redirectUrl: '/sso-callback', redirectUrlComplete: '/' });
  }

  return (
    <>
      <style>{`::placeholder { color: rgba(140,100,180,.45) !important; }`}</style>
      <div style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        fontFamily: "'DM Sans', sans-serif", position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(160deg, #f5eeff 0%, #ede0ff 30%, #e8d5f5 55%, #f0e8ff 80%, #fdf5ff 100%)',
      }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>

        {/* Background */}
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none' }}>
          {/* Sun */}
          <div style={{ position: 'absolute', top: '-8%', right: '8%', width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,235,180,.7) 0%, rgba(255,200,150,.2) 45%, transparent 70%)' }} />
          {/* Sky blush */}
          <div style={{ position: 'absolute', top: '5%', left: '-5%', width: 500, height: 350, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(220,180,255,.35) 0%, transparent 70%)' }} />
          {/* Lavender field clusters */}
          {[
            { l:'0%',   w:200, h:260, c:'rgba(155,90,215,.38)'  },
            { l:'9%',   w:150, h:210, c:'rgba(175,115,230,.32)' },
            { l:'19%',  w:220, h:290, c:'rgba(140,75,205,.42)'  },
            { l:'30%',  w:130, h:220, c:'rgba(185,125,240,.3)'  },
            { l:'40%',  w:170, h:270, c:'rgba(150,85,218,.38)'  },
            { l:'51%',  w:145, h:225, c:'rgba(170,110,232,.33)' },
            { l:'61%',  w:195, h:280, c:'rgba(142,78,208,.4)'   },
            { l:'72%',  w:155, h:235, c:'rgba(162,100,222,.35)' },
            { l:'82%',  w:175, h:255, c:'rgba(152,88,214,.38)'  },
            { l:'91%',  w:145, h:210, c:'rgba(175,115,228,.32)' },
          ].map((b, i) => (
            <div key={i} style={{
              position: 'absolute', bottom: '-5%', left: b.l,
              width: b.w, height: b.h,
              background: `radial-gradient(ellipse at 50% 88%, ${b.c} 0%, transparent 70%)`,
              filter: 'blur(4px)',
            }} />
          ))}
          {/* Ground haze */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '28%', background: 'linear-gradient(0deg, rgba(180,140,240,.18) 0%, transparent 100%)' }} />
        </div>

        {/* Card */}
        <div style={{
          width: '100%', maxWidth: 420, position: 'relative', zIndex: 10,
          background: 'rgba(255,252,255,.62)',
          backdropFilter: 'blur(36px)', WebkitBackdropFilter: 'blur(36px)',
          borderRadius: 28,
          border: '1px solid rgba(220,190,255,.55)',
          boxShadow: '0 8px 40px rgba(140,80,220,.12), 0 1px 0 rgba(255,255,255,.9) inset',
          padding: '44px 40px 36px',
        }}>

          {/* Logo */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32 }}>
            <svg width="48" height="48" viewBox="0 0 36 36" fill="none">
              <circle cx="18" cy="18" r="17" stroke="rgba(160,100,200,.4)" strokeWidth="1"/>
              <circle cx="18" cy="18" r="4" fill="rgba(210,100,140,.85)"/>
              <g transform="translate(18,18)">
                <ellipse rx="5.5" ry="9" fill="rgba(220,170,255,.95)" stroke="rgba(180,120,230,.5)" strokeWidth=".7" transform="rotate(0) translate(0,-8)"/>
                <ellipse rx="5.5" ry="9" fill="rgba(235,190,255,.9)"  stroke="rgba(195,140,240,.5)" strokeWidth=".7" transform="rotate(72) translate(0,-8)"/>
                <ellipse rx="5.5" ry="9" fill="rgba(215,165,250,.95)" stroke="rgba(175,115,225,.5)" strokeWidth=".7" transform="rotate(144) translate(0,-8)"/>
                <ellipse rx="5.5" ry="9" fill="rgba(235,190,255,.9)"  stroke="rgba(195,140,240,.5)" strokeWidth=".7" transform="rotate(216) translate(0,-8)"/>
                <ellipse rx="5.5" ry="9" fill="rgba(220,170,255,.95)" stroke="rgba(180,120,230,.5)" strokeWidth=".7" transform="rotate(288) translate(0,-8)"/>
              </g>
            </svg>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: '#2d1a4a', fontWeight: 400, marginTop: 12, letterSpacing: '-.02em' }}>Welcome back</div>
            <div style={{ fontSize: 13, color: '#9070b0', marginTop: 4, fontWeight: 300 }}>Sign in to your garden</div>
          </div>

          {/* Google */}
          <button onClick={handleGoogle} style={{
            width: '100%', padding: '11px 16px', borderRadius: 12,
            border: '1px solid rgba(200,170,240,.5)', background: 'rgba(255,255,255,.7)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            fontSize: 14, color: '#3c2a5a', fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
            marginBottom: 20, transition: 'all .2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,.9)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,.7)'; }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/><path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/><path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"/><path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/></svg>
            Continue with Google
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(190,160,230,.3)' }} />
            <span style={{ fontSize: 12, color: '#b090c8', fontWeight: 300 }}>or</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(190,160,230,.3)' }} />
          </div>

          {step === 'email' && (
            <form onSubmit={handleEmail}>
              <label style={label}>Email address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com" required autoFocus style={input}
                onFocus={e => e.currentTarget.style.borderColor = 'rgba(160,100,220,.7)'}
                onBlur={e => e.currentTarget.style.borderColor = 'rgba(200,170,240,.5)'}
              />
              {error && <p style={err}>{error}</p>}
              <button type="submit" disabled={loading} style={btn(loading)}>{loading ? 'Checking…' : 'Continue →'}</button>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={handleOtp}>
              <p style={{ fontSize: 13, color: '#7a5a9a', marginBottom: 16, fontWeight: 300, lineHeight: 1.6 }}>
                Code sent to <strong style={{ color: '#3d1f6a' }}>{email}</strong>
              </p>
              <label style={label}>6-digit code</label>
              <input type="text" value={code} onChange={e => setCode(e.target.value)}
                placeholder="000000" maxLength={6} required autoFocus
                style={{ ...input, letterSpacing: '0.4em', textAlign: 'center', fontSize: 22 }}
                onFocus={e => e.currentTarget.style.borderColor = 'rgba(160,100,220,.7)'}
                onBlur={e => e.currentTarget.style.borderColor = 'rgba(200,170,240,.5)'}
              />
              {error && <p style={err}>{error}</p>}
              <button type="submit" disabled={loading} style={btn(loading)}>{loading ? 'Verifying…' : 'Sign in →'}</button>
              <button type="button" onClick={() => { setStep('email'); setError(''); setCode(''); }} style={ghost}>← Different email</button>
            </form>
          )}

          {step === 'password' && (
            <form onSubmit={handlePassword}>
              <label style={label}>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" required autoFocus style={input}
                onFocus={e => e.currentTarget.style.borderColor = 'rgba(160,100,220,.7)'}
                onBlur={e => e.currentTarget.style.borderColor = 'rgba(200,170,240,.5)'}
              />
              {error && <p style={err}>{error}</p>}
              <button type="submit" disabled={loading} style={btn(loading)}>{loading ? 'Signing in…' : 'Sign in →'}</button>
              <button type="button" onClick={() => { setStep('email'); setError(''); setPassword(''); }} style={ghost}>← Back</button>
            </form>
          )}

          <p style={{ textAlign: 'center', fontSize: 13, color: '#a080c0', marginTop: 24, fontWeight: 300 }}>
            New to Muse?{' '}
            <Link href="/sign-up" style={{ color: '#7c3aed', fontWeight: 500, textDecoration: 'none' }}>Join free</Link>
          </p>
        </div>
      </div></div>

      <footer style={{
        position: 'relative', zIndex: 10,
        padding: '20px 40px',
        borderTop: '1px solid rgba(190,160,230,.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
        background: 'rgba(255,252,255,.4)', backdropFilter: 'blur(20px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 13, color: '#2d1a4a', fontWeight: 400 }}>Muse</span>
          <span style={{ fontSize: 11, color: '#8a7aa0', fontWeight: 300 }}>garden of poetry</span>
        </div>
        <div style={{ display: 'flex', gap: 20 }}>
          {[
            { label: 'Home', href: '/' },
            { label: 'Sign Up', href: '/sign-up' },
          ].map(l => (
            <Link key={l.label} href={l.href} style={{ fontSize: 11, color: '#8a7aa0', textDecoration: 'none', fontFamily: "'DM Sans',sans-serif", fontWeight: 300 }}>{l.label}</Link>
          ))}
        </div>
        <div style={{ fontSize: 11, color: '#8a7aa0', fontWeight: 300 }}>© {new Date().getFullYear()} Muse · All rights reserved</div>
      </footer>
    </div>
    </>
  );
}

const label: React.CSSProperties = { fontSize: 12, color: '#6a4a8a', fontWeight: 400, display: 'block', marginBottom: 6 };
const input: React.CSSProperties = {
  width: '100%', padding: '11px 14px', borderRadius: 12,
  border: '1px solid rgba(200,170,240,.5)', background: 'rgba(255,255,255,.65)',
  fontSize: 14, color: '#2d1a4a', fontFamily: "'DM Sans', sans-serif",
  outline: 'none', boxSizing: 'border-box', marginBottom: 16, transition: 'border-color .2s',
};
const err: React.CSSProperties = { fontSize: 12, color: '#c0406a', marginBottom: 12, marginTop: -8 };
const ghost: React.CSSProperties = {
  width: '100%', marginTop: 8, padding: '10px', background: 'none', border: 'none',
  color: '#a080c0', fontSize: 13, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
};
function btn(loading: boolean): React.CSSProperties {
  return {
    width: '100%', padding: '12px', borderRadius: 12, border: 'none',
    background: loading ? 'rgba(124,58,237,.4)' : 'linear-gradient(135deg, #a855f7, #7c3aed)',
    color: '#fff', fontSize: 14, fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer',
    fontFamily: "'DM Sans', sans-serif", letterSpacing: '.02em',
    boxShadow: loading ? 'none' : '0 4px 20px rgba(124,58,237,.3)',
    transition: 'all .2s',
  };
}
