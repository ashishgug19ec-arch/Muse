'use client';
import { useRef, useState, ReactNode, CSSProperties } from 'react';

export function Tilt({ children, style, className, onClick }: {
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
  onClick?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  function onMove(e: React.MouseEvent) {
    if (!active || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const dx = ((e.clientX - r.left  - r.width  / 2) / r.width)  * 16;
    const dy = ((e.clientY - r.top   - r.height / 2) / r.height) * 16;
    ref.current.style.transition = 'transform .08s ease';
    ref.current.style.transform  = `perspective(1000px) rotateX(${-dy}deg) rotateY(${dx}deg) translateY(-6px) scale(1.012)`;
  }

  function onLeave() {
    setActive(false);
    if (ref.current) {
      ref.current.style.transition = 'transform .65s cubic-bezier(.34,1.4,.64,1)';
      ref.current.style.transform  = '';
    }
  }

  return (
    <div
      ref={ref}
      style={style}
      className={className}
      onClick={onClick}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={onLeave}
      onMouseMove={onMove}
    >
      {children}
    </div>
  );
}
