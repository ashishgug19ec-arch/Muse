'use client';
import { useState } from 'react';
import { useSignIn, useSignUp } from '@clerk/nextjs';
import { motion, AnimatePresence } from 'framer-motion';
import { useMuseStore } from '@/lib/store';

type Mode = 'signin' | 'signup';
type SiStep = 'email' | 'otp' | 'password';
type SuStep = 'info' | 'otp';

function getClerk() { return (window as any).Clerk; }
function getSignIn() { return getClerk()?.client?.signIn; }
function getSignUp() { return getClerk()?.client?.signUp; }

export function SignInModal() {
  const { signInOpen, setSignInOpen, night } = useMuseStore();
  const [mode, setMode] = useState<Mode>('signin');

  const { isLoaded: siLoaded, signIn: hookSignIn, setActive: hookSiSetActive } = (useSignIn() ?? {}) as any;
  const { isLoaded: suLoaded, signUp: hookSignUp, setActive: hookSuSetActive } = (useSignUp() ?? {}) as any;

  const [siStep, setSiStep] = useState<SiStep>('email');
  const [suStep, setSuStep] = useState<SuStep>('info');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [code, setCode] = useState('');
  const [suCode, setSuCode] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function getSignInObj() { return siLoaded ? hookSignIn : getSignIn(); }
  function getSignUpObj() { return suLoaded ? hookSignUp : getSignUp(); }
  async function doSetActive(sessionId: string) {
    if (hookSiSetActive) return hookSiSetActive({ session: sessionId });
    if (hookSuSetActive) return hookSuSetActive({ session: sessionId });
    await getClerk()?.setActive({ session: sessionId });
  }

  function reset() {
    setEmail(''); setFirstName(''); setCode(''); setSuCode(''); setPassword('');
    setSiStep('email'); setSuStep('info'); setError(''); setLoading(false);
  }
  function close() { reset(); setSignInOpen(false); }
  function switchMode(m: Mode) { reset(); setMode(m); }

  async function handleSiEmail(e: React.FormEvent) {
    e.preventDefault();
    const si = getSignInObj();
    if (!si) { setError('Auth not ready, please refresh the page'); return; }
    setLoading(true); setError('');
    try {
      const res = await si.create({ identifier: email });
      const factors = res.supportedFirstFactors ?? [];
      const codeF = factors.find((f: any) => f.strategy === 'email_code');
      const passF = factors.find((f: any) => f.strategy === 'password');
      if (codeF) {
        await si.prepareFirstFactor({ strategy: 'email_code', emailAddressId: codeF.emailAddressId });
        setSiStep('otp');
      } else if (passF) {
        setSiStep('password');
      } else { setError('No supported login method.'); }
    } catch (err: any) { setError(err.errors?.[0]?.longMessage ?? 'Something went wrong'); }
    finally { setLoading(false); }
  }

  async function handleSiOtp(e: React.FormEvent) {
    e.preventDefault();
    const si = getSignInObj();
    if (!si) { setError('Auth not ready, please refresh the page'); return; }
    setLoading(true); setError('');
    try {
      const r = await si.attemptFirstFactor({ strategy: 'email_code', code });
      if (r.status === 'complete') { await doSetActive(r.createdSessionId); close(); }
    } catch (err: any) { setError(err.errors?.[0]?.longMessage ?? 'Invalid code'); }
    finally { setLoading(false); }
  }

  async function handleSiPassword(e: React.FormEvent) {
    e.preventDefault();
    const si = getSignInObj();
    if (!si) { setError('Auth not ready, please refresh the page'); return; }
    setLoading(true); setError('');
    try {
      const r = await si.attemptFirstFactor({ strategy: 'password', password });
      if (r.status === 'complete') { await doSetActive(r.createdSessionId); close(); }
    } catch (err: any) { setError(err.errors?.[0]?.longMessage ?? 'Incorrect password'); }
    finally { setLoading(false); }
  }

  async function handleSuInfo(e: React.FormEvent) {
    e.preventDefault();
    const su = getSignUpObj();
    if (!su) { setError('Auth not ready, please refresh the page'); return; }
    setLoading(true); setError('');
    try {
      await su.create({ firstName, emailAddress: email });
      await su.prepareEmailAddressVerification({ strategy: 'email_code' });
      setSuStep('otp');
    } catch (err: any) { setError(err.errors?.[0]?.longMessage ?? 'Something went wrong'); }
    finally { setLoading(false); }
  }

  async function handleSuOtp(e: React.FormEvent) {
    e.preventDefault();
    const su = getSignUpObj();
    if (!su) { setError('Auth not ready, please refresh the page'); return; }
    setLoading(true); setError('');
    try {
      const r = await su.attemptEmailAddressVerification({ code: suCode });
      if (r.status === 'complete') { await doSetActive(r.createdSessionId); close(); }
    } catch (err: any) { setError(err.errors?.[0]?.longMessage ?? 'Invalid code'); }
    finally { setLoading(false); }
  }

  async function handleGoogle() {
    const origin = window.location.origin;
    const si = getSignInObj();
    const su = getSignUpObj();
    try {
      if (mode === 'signin' && si)
        await si.authenticateWithRedirect({ strategy: 'oauth_google', redirectUrl: `${origin}/sso-callback`, redirectUrlComplete: `${origin}/` });
      else if (mode === 'signup' && su)
        await su.authenticateWithRedirect({ strategy: 'oauth_google', redirectUrl: `${origin}/sso-callback`, redirectUrlComplete: `${origin}/` });
      else
        setError('Auth not ready, please refresh the page');
    } catch (err: any) {
      setError(err.errors?.[0]?.longMessage ?? err.message ?? 'Google sign-in failed');
    }
  }

  const leftBg = night
    ? 'linear-gradient(160deg,#180a30,#3a1a52,#5a2868)'
    : 'linear-gradient(160deg,#fadbf0,#e8d4f0,#d4b8e0)';

  return (
    <AnimatePresence>
      {signInOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={close}
            style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,.55)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)' }}
          />
          <div style={{ position: 'fixed', inset: 0, zIndex: 301, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
          <motion.div
            initial={{ opacity: 0, scale: .92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: .95 }}
            transition={{ type: 'spring', damping: 26, stiffness: 260 }}
            style={{
              pointerEvents: 'all',
              width: 'min(880px,94vw)', height: 'min(580px,92vh)', overflow: 'hidden',
              borderRadius: 30,
              display: 'grid', gridTemplateColumns: '1fr 1.1fr',
              background: night ? 'rgba(20,8,38,.9)' : 'rgba(255,255,255,.92)',
              backdropFilter: 'blur(40px) saturate(180%)',
              WebkitBackdropFilter: 'blur(40px) saturate(180%)',
              border: `1px solid ${night ? 'rgba(184,154,216,.22)' : 'rgba(255,255,255,.6)'}`,
              boxShadow: '0 40px 100px rgba(12,6,30,.5),inset 0 1px 0 rgba(255,255,255,.6)',
            }}
          >
            {/* ── LEFT: Visual panel ── */}
            <div style={{
              position: 'relative', padding: 40,
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              background: leftBg, overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', top: -60, right: -60, width: 240, aspectRatio: '1', borderRadius: '50%', background: night ? 'radial-gradient(circle,rgba(232,154,184,.4),transparent 70%)' : 'radial-gradient(circle,rgba(255,255,255,.7),transparent 70%)', filter: 'blur(20px)' }} />
              <div style={{ position: 'absolute', bottom: -40, left: -40, width: 180, aspectRatio: '1', borderRadius: '50%', background: night ? 'radial-gradient(circle,rgba(184,154,216,.4),transparent 70%)' : 'radial-gradient(circle,rgba(212,184,232,.7),transparent 70%)', filter: 'blur(20px)' }} />

              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 32 }}>
                  <svg width="34" height="34" viewBox="0 0 36 36" fill="none">
                    <circle cx="18" cy="18" r="4.5" fill="rgba(232,110,160,.92)" />
                    <g transform="translate(18,18)">
                      {[0, 72, 144, 216, 288].map((a, i) => (
                        <ellipse key={i} rx="5.5" ry="9.5"
                          fill={i < 2 ? 'rgba(248,200,224,.95)' : 'rgba(232,212,248,.92)'}
                          stroke="rgba(160,124,200,.55)" strokeWidth=".7"
                          transform={`rotate(${a}) translate(0,-9)`} />
                      ))}
                    </g>
                  </svg>
                  <div style={{ lineHeight: 1.05 }}>
                    <div style={{ fontFamily: "'Fraunces','Cormorant Garamond',Georgia,serif", fontOpticalSizing: 'auto', fontSize: 20, fontWeight: 300, letterSpacing: '-.045em', color: night ? '#f6eafd' : '#0c0612' }}>Muse</div>
                    <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 9, letterSpacing: '.18em', opacity: .7, marginTop: 2, textTransform: 'uppercase', color: night ? '#b89ad8' : '#7a3a8a' }}>garden of poetry</div>
                  </div>
                </div>

                <h3 style={{ fontFamily: "'Fraunces','Cormorant Garamond',Georgia,serif", fontOpticalSizing: 'auto', fontSize: 38, fontWeight: 300, letterSpacing: '-.045em', lineHeight: 1.05, marginBottom: 18, color: night ? '#f6eafd' : '#0c0612' }}>
                  {mode === 'signin'
                    ? <><span>Welcome</span><br /><span>back, <em style={{ fontStyle: 'italic', background: 'linear-gradient(90deg,#7a3a8a 0%,#e89aae 25%,#b89ad8 50%,#e89aae 75%,#7a3a8a 100%)', backgroundSize: '200% 100%', backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent', animation: 'shimmer 8s linear infinite' }}>poet.</em></span></>
                    : <><span>Plant your</span><br /><em style={{ fontStyle: 'italic', background: 'linear-gradient(90deg,#7a3a8a 0%,#e89aae 25%,#b89ad8 50%,#e89aae 75%,#7a3a8a 100%)', backgroundSize: '200% 100%', backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent', animation: 'shimmer 8s linear infinite' }}>first poem.</em></>}
                </h3>
                <p style={{ fontFamily: "'Fraunces','Cormorant Garamond',Georgia,serif", fontOpticalSizing: 'auto', fontSize: 15, fontStyle: 'italic', opacity: .78, lineHeight: 1.55, maxWidth: 300, fontWeight: 300, color: night ? '#c8b4dc' : '#3a2a4a' }}>
                  {mode === 'signin' ? 'Your sanctuary is ready. The page has been waiting.' : 'Free forever. No algorithm. Just your words.'}
                </p>
              </div>

              {/* Poetry quote */}
              <div style={{ position: 'relative', zIndex: 1, padding: '18px 20px', borderRadius: 18, background: 'rgba(255,255,255,.22)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,.35)' }}>
                <div style={{ fontFamily: "'Fraunces','Cormorant Garamond',Georgia,serif", fontOpticalSizing: 'auto', fontSize: 15, fontStyle: 'italic', lineHeight: 1.55, fontWeight: 300, marginBottom: 10, color: night ? '#f6eafd' : '#0c0612' }}>
                  Between two words<br />silence blooms—<br />you are the garden
                </div>
                <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 9, letterSpacing: '.2em', opacity: .65, color: night ? '#b89ad8' : '#7a3a8a' }}>— AIKO Y. · 2,147 ♡</div>
              </div>
            </div>

            {/* ── RIGHT: Form panel ── */}
            <div style={{ padding: '48px 44px', display: 'flex', flexDirection: 'column', position: 'relative', background: night ? 'rgba(12,4,24,.85)' : '#fff', overflowY: 'auto' }}>
              <button onClick={close} style={{ position: 'absolute', top: 16, right: 16, width: 36, height: 36, borderRadius: '50%', background: 'transparent', border: `1px solid ${night ? 'rgba(184,154,216,.25)' : 'rgba(122,58,138,.18)'}`, cursor: 'pointer', fontSize: 14, color: night ? '#f6eafd' : '#0c0612' }}>✕</button>

              {/* Tabs */}
              <div style={{ display: 'inline-flex', background: night ? 'rgba(184,154,216,.1)' : 'rgba(122,58,138,.08)', padding: 4, borderRadius: 50, alignSelf: 'flex-start', marginBottom: 28 }}>
                {(['signin', 'signup'] as Mode[]).map((k) => (
                  <button key={k} onClick={() => switchMode(k)}
                    style={{ padding: '8px 18px', borderRadius: 50, fontSize: 12, fontWeight: 500, background: mode === k ? (night ? '#f6eafd' : '#0c0612') : 'transparent', color: mode === k ? (night ? '#0c0612' : '#f7f3ff') : (night ? '#f6eafd' : '#0c0612'), border: 'none', cursor: 'pointer', transition: 'all .25s', fontFamily: "'DM Sans',sans-serif" }}>
                    {k === 'signin' ? 'Sign in' : 'Create account'}
                  </button>
                ))}
              </div>

              <div style={{ fontFamily: "'Fraunces','Cormorant Garamond',Georgia,serif", fontOpticalSizing: 'auto', fontSize: 26, fontWeight: 300, letterSpacing: '-.045em', marginBottom: 6, background: 'linear-gradient(90deg,#7a3a8a 0%,#e89aae 25%,#b89ad8 50%,#e89aae 75%,#7a3a8a 100%)', backgroundSize: '200% 100%', backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent', animation: 'shimmer 8s linear infinite' }}>
                {mode === 'signin' ? 'Step into the sanctuary.' : 'Begin your garden.'}
              </div>
              <div style={{ fontSize: 13, opacity: .7, marginBottom: 24, color: night ? '#c8b4dc' : '#7a6890', fontFamily: "'DM Sans',sans-serif" }}>
                {mode === 'signin' ? 'No account? ' : 'Already a poet? '}
                <button onClick={() => switchMode(mode === 'signin' ? 'signup' : 'signin')}
                  style={{ background: 'none', border: 'none', color: night ? '#e89aae' : '#7a3a8a', fontWeight: 500, cursor: 'pointer', fontSize: 13, fontFamily: "'DM Sans',sans-serif" }}>
                  {mode === 'signin' ? 'Plant your first poem →' : 'Sign in →'}
                </button>
              </div>

              <AnimatePresence mode="wait">
                {mode === 'signin' && siStep === 'email' && (
                  <motion.form key="si-email" onSubmit={handleSiEmail}
                    initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: .2 }} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <MField label="Email" type="email" value={email} onChange={setEmail} placeholder="poet@muse.garden" night={night} autoFocus />
                    {error && <p style={errSt}>{error}</p>}
                    <PrimaryBtn loading={loading} label="Continue" night={night} />
                    <MDivider night={night} />
                    <GoogleBtn onClick={handleGoogle} night={night} />
                  </motion.form>
                )}
                {mode === 'signin' && siStep === 'otp' && (
                  <motion.form key="si-otp" onSubmit={handleSiOtp}
                    initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: .2 }} style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '10px 14px', background: night ? 'rgba(184,154,216,.08)' : 'rgba(122,58,138,.06)', border: `1px solid ${night ? 'rgba(184,154,216,.2)' : 'rgba(122,58,138,.14)'}`, borderRadius: 10, marginBottom: 18, fontSize: 13, color: night ? '#c8b4dc' : '#7a5490', fontFamily: "'DM Sans',sans-serif" }}>
                      Code sent to <strong>{email}</strong>
                    </div>
                    <MField label="6-digit code" type="text" value={code} onChange={setCode} placeholder="• • • • • •" night={night} autoFocus center large />
                    {error && <p style={errSt}>{error}</p>}
                    <PrimaryBtn loading={loading} label="Sign in" night={night} />
                    <GhostBtn label="← Different email" onClick={() => { setSiStep('email'); setError(''); setCode(''); }} night={night} />
                  </motion.form>
                )}
                {mode === 'signin' && siStep === 'password' && (
                  <motion.form key="si-pass" onSubmit={handleSiPassword}
                    initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: .2 }} style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontSize: 12.5, color: night ? '#b0a0c4' : '#a898bc', marginBottom: 14, padding: '8px 12px', background: night ? 'rgba(184,154,216,.08)' : '#faf8ff', borderRadius: 8, border: `1px solid ${night ? 'rgba(184,154,216,.15)' : 'rgba(122,58,138,.1)'}`, fontFamily: "'DM Sans',sans-serif" }}>{email}</div>
                    <MField label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" night={night} autoFocus />
                    {error && <p style={errSt}>{error}</p>}
                    <PrimaryBtn loading={loading} label="Login" night={night} />
                    <GhostBtn label="← Back" onClick={() => { setSiStep('email'); setError(''); setPassword(''); }} night={night} />
                  </motion.form>
                )}
                {mode === 'signup' && suStep === 'info' && (
                  <motion.form key="su-info" onSubmit={handleSuInfo}
                    initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: .2 }} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <MField label="What should we call you?" type="text" value={firstName} onChange={setFirstName} placeholder="Aiko, Mira, sora.tales…" night={night} autoFocus />
                    <MField label="Email" type="email" value={email} onChange={setEmail} placeholder="poet@muse.garden" night={night} />
                    {error && <p style={errSt}>{error}</p>}
                    <PrimaryBtn loading={loading} label={loading ? 'Creating…' : 'Create account'} night={night} />
                    <MDivider night={night} />
                    <GoogleBtn onClick={handleGoogle} night={night} />
                  </motion.form>
                )}
                {mode === 'signup' && suStep === 'otp' && (
                  <motion.form key="su-otp" onSubmit={handleSuOtp}
                    initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: .2 }} style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '10px 14px', background: night ? 'rgba(184,154,216,.08)' : 'rgba(122,58,138,.06)', border: `1px solid ${night ? 'rgba(184,154,216,.2)' : 'rgba(122,58,138,.14)'}`, borderRadius: 10, marginBottom: 18, fontSize: 13, color: night ? '#c8b4dc' : '#7a5490', fontFamily: "'DM Sans',sans-serif" }}>
                      Code sent to <strong>{email}</strong>. Enter it below to enter your garden.
                    </div>
                    <MField label="Verification code" type="text" value={suCode} onChange={setSuCode} placeholder="• • • • • •" night={night} autoFocus center large />
                    {error && <p style={errSt}>{error}</p>}
                    <PrimaryBtn loading={loading} label={loading ? 'Verifying…' : 'Verify & enter garden →'} night={night} />
                    <GhostBtn label="← Back" onClick={() => { setSuStep('info'); setError(''); setSuCode(''); }} night={night} />
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

const errSt: React.CSSProperties = { fontSize: 12.5, color: '#e05a7a', marginBottom: 10, fontFamily: "'DM Sans',sans-serif", lineHeight: 1.4 };

function MField({ label, type = 'text', value, onChange, placeholder, night, autoFocus, center, large }: {
  label: string; type?: string; value: string; onChange: (v: string) => void;
  placeholder?: string; night?: boolean; autoFocus?: boolean; center?: boolean; large?: boolean;
}) {
  return (
    <label style={{ display: 'block', marginBottom: 14 }}>
      <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 9.5, letterSpacing: '.22em', opacity: .55, marginBottom: 6, textTransform: 'uppercase', color: night ? '#f6eafd' : '#0c0612' }}>{label}</div>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} autoFocus={autoFocus}
        style={{ width: '100%', padding: '13px 16px', borderRadius: 12, background: night ? 'rgba(184,154,216,.08)' : 'rgba(122,58,138,.05)', border: `1px solid ${night ? 'rgba(184,154,216,.2)' : 'rgba(122,58,138,.14)'}`, fontSize: large ? 22 : 14, fontFamily: "'DM Sans',sans-serif", color: night ? '#f6eafd' : '#0c0612', outline: 'none', letterSpacing: center ? '.4em' : undefined, textAlign: center ? 'center' : undefined, transition: 'border-color .2s', boxSizing: 'border-box' }}
        onFocus={e => e.target.style.borderColor = night ? 'rgba(232,154,184,.6)' : 'rgba(122,58,138,.5)'}
        onBlur={e => e.target.style.borderColor = night ? 'rgba(184,154,216,.2)' : 'rgba(122,58,138,.14)'}
      />
    </label>
  );
}

function PrimaryBtn({ loading, label, night }: { loading: boolean; label: string; night?: boolean }) {
  return (
    <button type="submit" disabled={loading} style={{ padding: '15px 26px', borderRadius: 50, background: loading ? 'rgba(122,58,138,.4)' : (night ? '#f6eafd' : '#0c0612'), color: loading ? '#fff' : (night ? '#0c0612' : '#f7f3ff'), fontSize: 13.5, fontWeight: 500, letterSpacing: '.04em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, cursor: loading ? 'not-allowed' : 'pointer', border: 'none', boxShadow: loading ? 'none' : '0 8px 28px rgba(12,6,18,.25)', marginTop: 6, width: '100%', transition: 'all .2s', fontFamily: "'DM Sans',sans-serif" }}>
      <span>{label}</span>
      {!loading && <span style={{ width: 24, height: 24, borderRadius: '50%', background: night ? '#0c0612' : '#f7f3ff', color: night ? '#f6eafd' : '#0c0612', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}>→</span>}
    </button>
  );
}

function MDivider({ night }: { night?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0', opacity: .5, color: night ? '#f6eafd' : '#0c0612' }}>
      <div style={{ flex: 1, height: 1, background: 'currentColor' }} />
      <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: 9, letterSpacing: '.22em' }}>OR</span>
      <div style={{ flex: 1, height: 1, background: 'currentColor' }} />
    </div>
  );
}

function GoogleBtn({ onClick, night }: { onClick: () => void; night?: boolean }) {
  return (
    <button type="button" onClick={onClick} style={{ width: '100%', padding: '13px 16px', borderRadius: 14, border: `1.5px solid ${night ? 'rgba(184,154,216,.2)' : 'rgba(122,58,138,.14)'}`, background: night ? 'rgba(184,154,216,.08)' : 'rgba(122,58,138,.05)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, fontSize: 14, color: night ? '#f6eafd' : '#0c0612', fontFamily: "'DM Sans',sans-serif", transition: 'all .18s' }}>
      <GoogleIcon /> Continue with Google
    </button>
  );
}

function GhostBtn({ label, onClick, night }: { label: string; onClick: () => void; night?: boolean }) {
  return (
    <button type="button" onClick={onClick} style={{ marginTop: 10, padding: '10px', background: 'none', border: 'none', color: night ? '#7a6088' : '#b0a0c4', fontSize: 13, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", transition: 'color .18s', width: '100%' }}>{label}</button>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18">
      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
      <path fill="#FBBC05" d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z"/>
      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
    </svg>
  );
}
