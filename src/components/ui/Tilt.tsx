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
    const dx = ((e.clientX - r.left - r.width / 2) / r.width) * 14;
    const dy = ((e.clientY - r.top - r.height / 2) / r.height) * 14;
    ref.current.style.transition = 'transform .1s ease';
    ref.current.style.transform = `perspective(960px) rotateX(${-dy}deg) rotateY(${dx}deg) translateY(-5px) scale(1.008)`;
  }

  function onLeave() {
    setActive(false);
    if (ref.current) {
      ref.current.style.transition = 'transform .7s cubic-bezier(.34,1.56,.64,1)';
      ref.current.style.transform = '';
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
