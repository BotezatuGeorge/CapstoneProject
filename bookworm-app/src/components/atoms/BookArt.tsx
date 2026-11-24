/** Local decorative artwork (floating books) used behind checkout screens; no network images. */
export function BookArt({ variant }: { variant: 'backdrop' | 'panel' }) {
  if (variant === 'panel') {
    return (
      <svg viewBox="0 0 200 400" preserveAspectRatio="xMidYMid slice" className="w-full h-full" aria-hidden="true">
        <rect width="200" height="400" fill="#163a5f" />
        <g transform="translate(40 60) rotate(-24)">
          <rect width="100" height="74" fill="#a8562b" />
          <rect x="12" y="14" width="34" height="26" fill="#8c3a22" />
          <rect y="68" width="100" height="10" fill="#d9ceb0" />
        </g>
        <rect x="140" y="30" width="46" height="96" fill="#2b6a8f" />
        <rect x="30" y="280" width="110" height="26" fill="#2b6a8f" />
        <rect x="22" y="306" width="118" height="30" fill="#c9972e" />
        <polygon points="96,330 150,308 196,330 176,392 110,392" fill="#cdbf9a" />
        <path d="M20 200 Q60 170 100 210 T180 190" fill="none" stroke="#c9972e" strokeWidth="3" />
        <rect x="150" y="160" width="12" height="12" fill="#c9972e" transform="rotate(45 156 166)" />
        <rect x="30" y="236" width="10" height="10" fill="#a8562b" transform="rotate(45 35 241)" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" className="w-full h-full" aria-hidden="true">
      <rect width="1600" height="1000" fill="#163a5f" />
      <circle cx="120" cy="60" r="260" fill="#1f5078" />
      <circle cx="1560" cy="40" r="160" fill="#a8562b" />
      <g transform="translate(250 130) rotate(-30)">
        <rect width="380" height="270" fill="#a8562b" />
        <rect x="46" y="54" width="130" height="96" fill="#8c3a22" />
        <rect y="250" width="380" height="34" fill="#d9ceb0" />
      </g>
      <rect x="1040" y="0" width="230" height="300" fill="#2b6a8f" />
      <rect x="230" y="760" width="440" height="96" fill="#2b6a8f" />
      <rect x="200" y="856" width="460" height="110" fill="#c9972e" />
      <rect x="200" y="930" width="460" height="14" fill="#d9ceb0" />
      <polygon points="880,820 1180,760 1420,820 1300,1000 940,1000" fill="#cdbf9a" />
      <polygon points="1180,760 1420,820 1500,780 1240,720" fill="#e0d4b0" />
      <path d="M120 600 Q260 520 360 640 T560 620" fill="none" stroke="#c9972e" strokeWidth="6" />
      <path d="M1140 480 Q1300 420 1320 560 T1520 640" fill="none" stroke="#c9972e" strokeWidth="6" />
      <rect x="820" y="100" width="50" height="50" fill="#c9972e" transform="rotate(45 845 125)" />
      <rect x="1400" y="260" width="44" height="44" fill="#a8562b" transform="rotate(10 1422 282)" />
      <rect x="90" y="400" width="44" height="44" fill="#a8562b" transform="rotate(20 112 422)" />
      <rect x="0" y="0" width="1600" height="1000" fill="#000000" opacity="0.28" />
    </svg>
  );
}
