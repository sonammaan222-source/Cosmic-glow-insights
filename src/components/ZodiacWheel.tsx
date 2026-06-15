const SIGNS = ["♈","♉","♊","♋","♌","♍","♎","♏","♐","♑","♒","♓"];

/** Animated zodiac wheel composed entirely from SVG + CSS spin. */
export function ZodiacWheel({ className = "" }: { className?: string }) {
  return (
    <div className={`relative aspect-square ${className}`}>
      {/* outer glow */}
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,_oklch(0.65_0.20_290/0.35),transparent_60%)] blur-2xl" />

      {/* slow outer ring */}
      <svg viewBox="0 0 400 400" className="absolute inset-0 animate-spin-slow">
        <defs>
          <linearGradient id="ringGold" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.88 0.10 88)" />
            <stop offset="100%" stopColor="oklch(0.72 0.16 75)" />
          </linearGradient>
        </defs>
        <circle cx="200" cy="200" r="190" fill="none" stroke="url(#ringGold)" strokeWidth="0.7" opacity="0.7" />
        <circle cx="200" cy="200" r="170" fill="none" stroke="url(#ringGold)" strokeWidth="0.4" strokeDasharray="2 6" opacity="0.5" />
        {SIGNS.map((s, i) => {
          const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
          const x = 200 + Math.cos(angle) * 180;
          const y = 200 + Math.sin(angle) * 180;
          return (
            <g key={i}>
              <circle cx={x} cy={y} r="14" fill="oklch(0.20 0.07 285 / 0.6)" stroke="url(#ringGold)" strokeWidth="0.6" />
              <text x={x} y={y + 5} textAnchor="middle" fontSize="14" fill="oklch(0.88 0.10 88)">{s}</text>
            </g>
          );
        })}
        {/* spokes */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
          return (
            <line
              key={i}
              x1={200 + Math.cos(angle) * 60}
              y1={200 + Math.sin(angle) * 60}
              x2={200 + Math.cos(angle) * 165}
              y2={200 + Math.sin(angle) * 165}
              stroke="url(#ringGold)"
              strokeWidth="0.3"
              opacity="0.4"
            />
          );
        })}
      </svg>

      {/* inner counter-rotating ring */}
      <svg viewBox="0 0 400 400" className="absolute inset-0 animate-spin-slower">
        <circle cx="200" cy="200" r="120" fill="none" stroke="oklch(0.82 0.14 85 / 0.5)" strokeWidth="0.5" />
        <circle cx="200" cy="200" r="100" fill="none" stroke="oklch(0.65 0.20 290 / 0.4)" strokeWidth="0.4" strokeDasharray="1 4" />
        {/* sacred geometry triangles */}
        <polygon points="200,90 295,255 105,255" fill="none" stroke="oklch(0.82 0.14 85 / 0.45)" strokeWidth="0.5" />
        <polygon points="200,310 105,145 295,145" fill="none" stroke="oklch(0.65 0.20 290 / 0.45)" strokeWidth="0.5" />
      </svg>

      {/* center sigil */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="glass-strong glow-gold flex h-24 w-24 items-center justify-center rounded-full text-3xl text-gold animate-pulse-glow">
          ✦
        </div>
      </div>
    </div>
  );
}
