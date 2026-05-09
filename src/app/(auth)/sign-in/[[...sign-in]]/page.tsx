'use client';
import { useState } from 'react';
import { useSignIn } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

type Step = 'email' | 'otp' | 'password';

const PETALS = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  left: `${4 + (i * 6.8) % 88}%`,
  delay: `${(i * 0.9) % 9}s`,
  dur: `${8 + (i * 1.2) % 6}s`,
  size: 6 + (i * 1.8) % 7,
  pink: i % 2 === 0,
}));

export default function SignInPage() {
  const { isLoaded, signIn, setActive } = useSignIn() as any;
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
      if (result.status === 'complete') { await setActive({ session: result.createdSessionId }); router.push('/'); }
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
      if (result.status === 'complete') { await setActive({ session: result.createdSessionId }); router.push('/'); }
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

      <div style={{
        minHeight: '100vh',
        background: [
          'radial-gradient(ellipse at 15% 8%, rgba(232,154,184,.45) 0%, transparent 55%)',
          'radial-gradient(ellipse at 82% 16%, rgba(232,210,244,.5) 0%, transparent 48%)',
          'radial-gradient(ellipse at 50% 40%, rgba(212,184,232,.4) 0%, transparent 65%)',
          'radial-gradient(ellipse at 8% 65%, rgba(200,232,210,.38) 0%, transparent 42%)',
          'radial-gradient(ellipse at 90% 70%, rgba(248,224,200,.36) 0%, transparent 46%)',
          'radial-gradient(ellipse at 42% 92%, rgba(232,200,224,.42) 0%, transparent 50%)',
          '#f7f3ff',
        ].join(','),
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '28px 20px',
        fontFamily: "'DM Sans', sans-serif",
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Falling petals — outer background, behind card */}
        {PETALS.map(p => (
          <div key={p.id} style={{
            position: 'absolute', left: p.left, top: '-20px', zIndex: 0,
            width: p.size, height: p.size * 1.5,
            background: p.pink
              ? 'radial-gradient(ellipse, rgba(220,130,190,.5) 30%, rgba(255,190,220,.28) 100%)'
              : 'radial-gradient(ellipse, rgba(170,110,240,.4) 30%, rgba(210,170,255,.22) 100%)',
            borderRadius: '50% 50% 50% 50% / 62% 62% 38% 38%',
            animation: `petalFall ${p.dur} ease-in infinite, petalSway ${2.8 + p.id * 0.25}s ease-in-out infinite`,
            animationDelay: p.delay,
            pointerEvents: 'none',
          }} />
        ))}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .55, ease: [.25, .9, .4, 1] }}
          style={{
            width: '100%', maxWidth: 1240, minHeight: 640,
            borderRadius: 0, overflow: 'hidden', display: 'flex',
            boxShadow: '0 24px 64px rgba(80,20,140,.13), 0 4px 16px rgba(80,20,140,.07)',
            position: 'relative', zIndex: 1,
          }}
        >

          {/* ── LEFT: Form ─────────────────────────────────── */}
          <div style={{
            width: 400, flexShrink: 0, background: '#fff',
            padding: '60px 52px 52px',
            display: 'flex', flexDirection: 'column',
            boxShadow: '4px 0 20px rgba(0,0,0,.06)', zIndex: 1,
          }}>


              {/* Muse logo — centered, large */}
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

              {/* Heading — single line */}
              <h1 style={{
                fontFamily: "'Fraunces','Cormorant Garamond',Georgia,serif",
                fontOpticalSizing: 'auto',
                fontSize: 28, fontWeight: 400, fontStyle: 'italic',
                color: '#0e0616', lineHeight: 1.15,
                letterSpacing: '-.01em', margin: '0 0 32px',
              }}>
                Your words wait for you.
              </h1>

              {/* Steps */}
              <AnimatePresence mode="wait">

                {step === 'email' && (
                  <motion.form key="email" onSubmit={handleEmail}
                    initial={{ opacity:0, x:10 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-10 }}
                    transition={{ duration:.2 }}
                    style={{ display:'flex', flexDirection:'column', flex:1 }}>

                    <label style={lbl}>Email</label>
                    <input type="email" value={email} onChange={e=>setEmail(e.target.value)}
                      placeholder="Enter your email address" required autoFocus
                      className="f-input" style={inp}/>

                    {error && <p style={errSt}>{error}</p>}

                    <button type="submit" disabled={loading} style={primaryBtn(loading)}>
                      {loading ? 'Checking…' : 'Continue'}
                    </button>

                    <div style={{ display:'flex', alignItems:'center', gap:12, margin:'20px 0 18px' }}>
                      <div style={{ flex:1, height:1, background:'#ede8f5' }}/>
                      <span style={{ fontSize:12, color:'#b8a8cc', letterSpacing:'.03em' }}>or</span>
                      <div style={{ flex:1, height:1, background:'#ede8f5' }}/>
                    </div>

                    <button type="button" onClick={handleGoogle} className="f-social" style={socialBtn}>
                      <GoogleIcon /> Continue with Google
                    </button>

                    <div style={{ marginTop:'auto', paddingTop:32 }}>
                      <p style={{ textAlign:'center', fontSize:12.5, color:'#a898bc', margin:'0 0 10px' }}>
                        Don't have an account?
                      </p>
                      <Link href="/sign-up" style={{ textDecoration:'none' }}>
                        <button type="button" style={outlineBtn}>Create account</button>
                      </Link>
                    </div>
                  </motion.form>
                )}

                {step === 'otp' && (
                  <motion.form key="otp" onSubmit={handleOtp}
                    initial={{ opacity:0, x:10 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-10 }}
                    transition={{ duration:.2 }}
                    style={{ display:'flex', flexDirection:'column', flex:1 }}>

                    <div style={{ padding:'12px 14px', background:'rgba(168,85,247,.06)', border:'1px solid rgba(168,85,247,.15)', borderRadius:10, marginBottom:22 }}>
                      <p style={{ fontSize:13, color:'#7a5490', margin:0, fontWeight:300, lineHeight:1.6 }}>
                        Code sent to <strong style={{ fontWeight:500, color:'#4a1a7a' }}>{email}</strong>
                      </p>
                    </div>

                    <label style={lbl}>6-digit code</label>
                    <input type="text" value={code} onChange={e=>setCode(e.target.value)}
                      placeholder="• • • • • •" maxLength={6} required autoFocus
                      className="f-input"
                      style={{ ...inp, letterSpacing:'0.4em', textAlign:'center', fontSize:22 }}/>

                    {error && <p style={errSt}>{error}</p>}

                    <button type="submit" disabled={loading} style={primaryBtn(loading)}>
                      {loading ? 'Verifying…' : 'Sign in'}
                    </button>
                    <button type="button" className="f-ghost"
                      onClick={()=>{setStep('email');setError('');setCode('');}} style={ghostBtn}>
                      ← Different email
                    </button>
                  </motion.form>
                )}

                {step === 'password' && (
                  <motion.form key="password" onSubmit={handlePassword}
                    initial={{ opacity:0, x:10 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-10 }}
                    transition={{ duration:.2 }}
                    style={{ display:'flex', flexDirection:'column', flex:1 }}>

                    <div style={{ fontSize:12.5, color:'#a898bc', marginBottom:18, padding:'8px 12px', background:'#faf8ff', borderRadius:8, border:'1px solid #ede8f5' }}>
                      {email}
                    </div>

                    <label style={lbl}>Password</label>
                    <input type="password" value={password} onChange={e=>setPassword(e.target.value)}
                      placeholder="Enter your password" required autoFocus
                      className="f-input" style={{ ...inp, marginBottom:8 }}/>

                    <div style={{ textAlign:'right', marginBottom:20 }}>
                      <span style={{ fontSize:12.5, color:'#a855f7', cursor:'pointer', textDecoration:'underline', textUnderlineOffset:2 }}>
                        Forgot your password?
                      </span>
                    </div>

                    {error && <p style={errSt}>{error}</p>}

                    <button type="submit" disabled={loading} style={primaryBtn(loading)}>
                      {loading ? 'Signing in…' : 'Login'}
                    </button>
                    <button type="button" className="f-ghost"
                      onClick={()=>{setStep('email');setError('');setPassword('');}} style={ghostBtn}>
                      ← Back
                    </button>
                  </motion.form>
                )}

              </AnimatePresence>
          </div>

          {/* ── RIGHT: Rose photo ──────────────────────────── */}
          <div style={{ flex:1, position:'relative', overflow:'hidden' }}>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/roses.jpg" alt="Garden of roses" style={{
              position:'absolute', inset:0,
              width:'100%', height:'100%',
              objectFit:'cover', objectPosition:'center',
              filter: 'brightness(0.78)',
            }}/>

            {/* Uniform white tint */}
            <div style={{ position:'absolute', inset:0, background:'rgba(255,255,255,.18)', pointerEvents:'none', zIndex:1 }}/>

            {/* Bottom dark overlay */}
            <div style={{ position:'absolute', bottom:0, left:0, right:0, height:260, background:'linear-gradient(to top, rgba(10,4,24,.75) 0%, rgba(10,4,24,.35) 55%, transparent 100%)', zIndex:2 }}/>

            {/* Text overlay */}
            <div style={{ position:'absolute', bottom:44, left:42, zIndex:3 }}>
              <p style={{
                fontFamily: "'Fraunces','Cormorant Garamond',Georgia,serif",
                fontOpticalSizing: 'auto',
                fontSize: 42, fontWeight: 400, fontStyle: 'italic',
                color: '#fff', lineHeight: 1.2, margin: 0,
                textShadow: '0 3px 18px rgba(0,0,0,.4)',
                letterSpacing: '-.01em',
              }}>
                Where every word<br />finds its bloom.
              </p>
              <p style={{ fontSize:11.5, color:'rgba(255,235,255,.58)', marginTop:12, letterSpacing:'.14em', textTransform:'uppercase' }}>
                Muse · Garden of Poetry
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
    <svg width="17" height="17" viewBox="0 0 18 18" style={{ flexShrink:0 }}>
      <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
      <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
      <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"/>
      <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/>
    </svg>
  );
}

const lbl: React.CSSProperties = { fontSize:12.5, color:'#7a6890', fontWeight:400, display:'block', marginBottom:8, letterSpacing:'.01em' };
const inp: React.CSSProperties = { width:'100%', padding:'12px 14px', borderRadius:9, border:'1.5px solid #e8e0f0', background:'#fdfbff', fontSize:14, color:'#1a0a2e', fontFamily:"'DM Sans',sans-serif", boxSizing:'border-box', marginBottom:18 };
const errSt: React.CSSProperties = { fontSize:12, color:'#c0406a', margin:'-10px 0 12px', lineHeight:1.5 };
const socialBtn: React.CSSProperties = { width:'100%', padding:'12px 16px', borderRadius:9, border:'1.5px solid #e8e0f0', background:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:9, fontSize:14, color:'#2d1a4a', fontFamily:"'DM Sans',sans-serif", transition:'all .18s', marginBottom:0 };
const outlineBtn: React.CSSProperties = { width:'100%', padding:'12px', borderRadius:9, border:'1.5px solid #e8e0f0', background:'#fff', fontSize:14, color:'#4a3060', cursor:'pointer', fontFamily:"'DM Sans',sans-serif", transition:'all .18s' };
const ghostBtn: React.CSSProperties = { marginTop:10, padding:'10px', background:'none', border:'none', color:'#b0a0c4', fontSize:13, cursor:'pointer', fontFamily:"'DM Sans',sans-serif", transition:'color .18s', width:'100%' };
function primaryBtn(loading: boolean): React.CSSProperties {
  return { width:'100%', padding:'13px', borderRadius:9, border:'none', background: loading ? 'rgba(168,85,247,.4)' : 'linear-gradient(135deg,#c084fc 0%,#a855f7 50%,#9333ea 100%)', color:'#fff', fontSize:14, fontWeight:500, cursor: loading ? 'not-allowed' : 'pointer', fontFamily:"'DM Sans',sans-serif", boxShadow: loading ? 'none' : '0 6px 20px rgba(168,85,247,.3)', transition:'all .2s' };
}
