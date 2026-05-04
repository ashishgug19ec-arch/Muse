'use client';
import { useEffect, useRef } from 'react';

export function MeshBackground({ night }: { night: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d')!;
    let raf: number;
    const orbs = [
      { x: .18, y: .22, r: .28, vx: .0003, vy: .0002, color: night ? 'rgba(124,58,237,.12)' : 'rgba(192,132,252,.18)' },
      { x: .72, y: .14, r: .22, vx:-.0002, vy: .0003, color: night ? 'rgba(60,30,80,.15)'   : 'rgba(240,168,192,.22)' },
      { x: .85, y: .68, r: .30, vx:-.0003, vy:-.0002, color: night ? 'rgba(40,15,70,.18)'   : 'rgba(208,191,240,.2)' },
      { x: .28, y: .78, r: .25, vx: .0002, vy:-.0003, color: night ? 'rgba(80,20,100,.12)'  : 'rgba(252,228,240,.25)' },
      { x: .55, y: .45, r: .20, vx: .0002, vy: .0002, color: night ? 'rgba(100,40,140,.1)'  : 'rgba(200,232,210,.18)' },
      { x: .10, y: .55, r: .18, vx:-.0002, vy: .0002, color: night ? 'rgba(30,10,60,.15)'   : 'rgba(248,240,220,.2)' },
    ];
    let t = 0;

    function resize() {
      cv!.width = window.innerWidth;
      cv!.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    function draw() {
      const W = cv!.width, H = cv!.height;
      ctx.clearRect(0, 0, W, H);

      // base gradient
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      if (night) {
        bg.addColorStop(0, '#1a1130');
        bg.addColorStop(.5, '#2c1825');
        bg.addColorStop(1, '#3c1e34');
      } else {
        bg.addColorStop(0, '#faf7ff');
        bg.addColorStop(.5, '#f5eeff');
        bg.addColorStop(1, '#fef0f8');
      }
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // animated orbs
      t += .005;
      orbs.forEach((o, i) => {
        const x = (o.x + Math.sin(t * .7 + i) * .06) * W;
        const y = (o.y + Math.cos(t * .5 + i) * .05) * H;
        const r = o.r * Math.min(W, H);
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, o.color);
        g.addColorStop(1, 'transparent');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
      });

      raf = requestAnimationFrame(draw);
    }
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, [night]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}
    />
  );
}
