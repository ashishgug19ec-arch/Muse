'use client';

const orbs = [
  { top: '5%',  left: '8%',  w: 520, h: 520, c: 'rgba(167,139,250,.22)', delay: '0s',    dur: '18s' },
  { top: '2%',  left: '60%', w: 420, h: 420, c: 'rgba(196,181,253,.2)',  delay: '-6s',   dur: '22s' },
  { top: '50%', left: '75%', w: 460, h: 460, c: 'rgba(221,214,254,.18)', delay: '-12s',  dur: '20s' },
  { top: '65%', left: '15%', w: 380, h: 380, c: 'rgba(232,212,248,.2)',  delay: '-4s',   dur: '16s' },
  { top: '30%', left: '42%', w: 320, h: 320, c: 'rgba(192,132,252,.15)', delay: '-9s',   dur: '24s' },
];

const nightOrbs = [
  { top: '5%',  left: '8%',  w: 520, h: 520, c: 'rgba(124,58,237,.16)',  delay: '0s',    dur: '18s' },
  { top: '2%',  left: '60%', w: 420, h: 420, c: 'rgba(139,92,246,.13)',  delay: '-6s',   dur: '22s' },
  { top: '50%', left: '75%', w: 460, h: 460, c: 'rgba(76,29,149,.15)',   delay: '-12s',  dur: '20s' },
  { top: '65%', left: '15%', w: 380, h: 380, c: 'rgba(109,40,217,.12)',  delay: '-4s',   dur: '16s' },
  { top: '30%', left: '42%', w: 320, h: 320, c: 'rgba(91,33,182,.1)',    delay: '-9s',   dur: '24s' },
];

export function MeshBackground({ night }: { night: boolean }) {
  const list = night ? nightOrbs : orbs;
  const bg = night
    ? 'linear-gradient(160deg,#120c24 0%,#1a0f30 40%,#2a1540 100%)'
    : 'linear-gradient(160deg,#f8f5ff 0%,#f3eeff 40%,#fdf0fa 100%)';

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
      background: bg, overflow: 'hidden',
    }}>
      <style>{`
        @keyframes orbFloat {
          0%,100% { transform: translate(0,0) scale(1); }
          33%      { transform: translate(30px,-40px) scale(1.06); }
          66%      { transform: translate(-20px,25px) scale(.95); }
        }
      `}</style>
      {list.map((o, i) => (
        <div key={i} style={{
          position: 'absolute',
          top: o.top, left: o.left,
          width: o.w, height: o.h,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${o.c} 0%, transparent 70%)`,
          filter: 'blur(40px)',
          animation: `orbFloat ${o.dur} ease-in-out infinite`,
          animationDelay: o.delay,
          willChange: 'transform',
        }} />
      ))}
    </div>
  );
}
