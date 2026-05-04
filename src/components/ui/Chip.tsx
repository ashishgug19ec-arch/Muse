type ChipColor = 'purple' | 'rose' | 'sage' | 'gold' | 'night';

const COLORS: Record<ChipColor, { bg: string; text: string; bd: string }> = {
  purple: { bg: 'rgba(208,191,240,.38)', text: '#5b21b6', bd: 'rgba(208,191,240,.62)' },
  rose:   { bg: 'rgba(240,168,192,.24)', text: '#9d174d', bd: 'rgba(240,168,192,.42)' },
  sage:   { bg: 'rgba(144,184,152,.22)', text: '#166534', bd: 'rgba(144,184,152,.42)' },
  gold:   { bg: 'rgba(200,160,80,.18)',  text: '#7a5a10', bd: 'rgba(200,160,80,.36)' },
  night:  { bg: 'rgba(124,58,237,.16)', text: '#c084fc', bd: 'rgba(124,58,237,.32)' },
};

export function Chip({ label, color = 'purple', size = 'sm', onClick }: {
  label: string;
  color?: ChipColor;
  size?: 'sm' | 'md';
  onClick?: () => void;
}) {
  const c = COLORS[color];
  return (
    <span
      onClick={onClick}
      style={{
        padding: size === 'sm' ? '3px 12px' : '5px 16px',
        borderRadius: 50,
        fontSize: size === 'sm' ? 10 : 12,
        fontWeight: 400,
        letterSpacing: '.08em',
        background: c.bg,
        color: c.text,
        border: `1px solid ${c.bd}`,
        display: 'inline-block',
        cursor: onClick ? 'pointer' : 'default',
        whiteSpace: 'nowrap',
        fontFamily: "'DM Sans',sans-serif",
      }}
    >
      {label}
    </span>
  );
}
