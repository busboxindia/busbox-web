interface Pt { lat: number; lng: number }

/** Lightweight route sketch used when no Mapbox token is configured. */
export default function Schematic({ drop, traveller }: { drop: Pt; traveller: Pt | null }) {
  const pts = [drop, ...(traveller ? [traveller] : [])];
  const minX = Math.min(...pts.map((p) => p.lng)), maxX = Math.max(...pts.map((p) => p.lng));
  const minY = Math.min(...pts.map((p) => p.lat)), maxY = Math.max(...pts.map((p) => p.lat));
  const span = Math.max(maxX - minX, maxY - minY, 0.01);
  const single = !traveller;
  const proj = (p: Pt) =>
    single ? { x: 200, y: 170 } : { x: 70 + ((p.lng - minX) / span) * 260, y: 280 - ((p.lat - minY) / span) * 220 };
  const d = proj(drop);
  const t = traveller ? proj(traveller) : null;
  return (
    <div className="track-map">
      <svg viewBox="0 0 400 340" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Route map">
        <defs>
          <pattern id="g" width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M28 0H0V28" fill="none" stroke="#E1E8F4" />
          </pattern>
        </defs>
        <rect width="400" height="340" fill="#EFF3FA" />
        <rect width="400" height="340" fill="url(#g)" />
        {t && <line x1={t.x} y1={t.y} x2={d.x} y2={d.y} stroke="#0B2B66" strokeWidth="4" strokeDasharray="8 8" strokeLinecap="round" />}
        <circle cx={d.x} cy={d.y} r="14" fill="#fff" />
        <circle cx={d.x} cy={d.y} r="9" fill="#FF8A00" />
        <text x={d.x} y={d.y + 34} textAnchor="middle" fontSize="13" fontWeight="600" fill="#0B2B66" fontFamily="Inter, sans-serif">Drop point</text>
        {t && (
          <>
            <circle cx={t.x} cy={t.y} r="17" fill="rgba(22,163,74,.2)" />
            <circle cx={t.x} cy={t.y} r="9" fill="#16A34A" stroke="#fff" strokeWidth="4" />
          </>
        )}
      </svg>
    </div>
  );
}
