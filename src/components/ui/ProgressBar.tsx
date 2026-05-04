const GRADS: Record<string, string> = {
  purple: 'linear-gradient(90deg,#c084fc,#7c3aed)',
  rose:   'linear-gradient(90deg,#f0a8c0,#d06888)',
  sage:   'linear-gradient(90deg,#90b898,#5a8a68)',
  gold:   'linear-gradient(90deg,#f8d890,#c8a050)',
};

export function ProgressBar({ pct, color = 'purple', height = 3.5 }: {
  pct: number;
  color?: string;
  height?: number;
}) {
  return (
    <div style={{ height, borderRadius: 50, background: 'rgba(208,191,240,.28)', overflow: 'hidden' }}>
      <div style={{ width: `${pct}%`, height: '100%', background: GRADS[color] ?? GRADS.purple, borderRadius: 50, transition: 'width .8s ease' }} />
    </div>
  );
}
