'use client';
import { useEffect, useRef } from 'react';

interface Petal {
  x: number; y: number; r: number; rot: number;
  vx: number; vy: number; vr: number;
  swing: number; swingSpd: number; a: number; pink: boolean;
}

export function SakuraPetals({ night }: { night: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext('2d')!;
    let raf: number;
    const petals: Petal[] = [];

    function resize() {
      cv!.width = window.innerWidth;
      cv!.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < 45; i++) {
      petals.push({
        x: Math.random() * 1.3 - .15,
        y: Math.random(),
        r: 3 + Math.random() * 4,
        rot: Math.random() * Math.PI * 2,
        vx: (Math.random() - .5) * .3,
        vy: .25 + Math.random() * .45,
        vr: (Math.random() - .5) * .03,
        swing: Math.random() * Math.PI * 2,
        swingSpd: .008 + Math.random() * .012,
        a: .35 + Math.random() * .45,
        pink: Math.random() < .6,
      });
    }

    function draw() {
      const W = cv!.width, H = cv!.height;
      ctx.clearRect(0, 0, W, H);
      petals.forEach(p => {
        p.swing += p.swingSpd;
        p.x += p.vx + Math.sin(p.swing) * .003;
        p.y += p.vy / H * 1.8;
        p.rot += p.vr;
        if (p.y > 1.1) { p.y = -.05; p.x = Math.random() * 1.3 - .15; }
        ctx.save();
        ctx.translate(p.x * W, p.y * H);
        ctx.rotate(p.rot);
        ctx.globalAlpha = p.a;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.r * .45, p.r, 0, 0, Math.PI * 2);
        ctx.fillStyle = p.pink
          ? (night ? 'rgba(240,180,210,.8)' : 'rgba(248,196,218,.85)')
          : (night ? 'rgba(220,190,255,.7)' : 'rgba(234,218,255,.8)');
        ctx.fill();
        ctx.restore();
      });
      raf = requestAnimationFrame(draw);
    }
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, [night]);

  return (
    <canvas
      ref={ref}
      style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}
    />
  );
}
