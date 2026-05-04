export function MuseLogo({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
      <circle cx="18" cy="18" r="17" stroke="rgba(160,124,200,.38)" strokeWidth="1"/>
      <circle cx="18" cy="18" r="4" fill="rgba(208,100,136,.78)"/>
      <g transform="translate(18,18)">
        <ellipse rx="5.5" ry="9" fill="rgba(248,226,244,.88)" stroke="rgba(208,100,136,.48)" strokeWidth=".7" transform="rotate(0) translate(0,-8)"/>
        <ellipse rx="5.5" ry="9" fill="rgba(248,226,244,.84)" stroke="rgba(208,100,136,.44)" strokeWidth=".7" transform="rotate(72) translate(0,-8)"/>
        <ellipse rx="5.5" ry="9" fill="rgba(234,218,255,.84)" stroke="rgba(160,124,200,.42)" strokeWidth=".7" transform="rotate(144) translate(0,-8)"/>
        <ellipse rx="5.5" ry="9" fill="rgba(234,218,255,.84)" stroke="rgba(160,124,200,.42)" strokeWidth=".7" transform="rotate(216) translate(0,-8)"/>
        <ellipse rx="5.5" ry="9" fill="rgba(248,226,244,.88)" stroke="rgba(208,100,136,.48)" strokeWidth=".7" transform="rotate(288) translate(0,-8)"/>
      </g>
    </svg>
  );
}
