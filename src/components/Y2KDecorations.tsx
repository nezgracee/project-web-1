import { useId } from 'react';

export function ChromeStar({ className = 'w-8 h-8' }: { className?: string }) {
  const gradId = useId();
  const path =
    'M24 5C25.8 16.4 31.6 22.2 43 24C31.6 25.8 25.8 31.6 24 43C22.2 31.6 16.4 25.8 5 24C16.4 22.2 22.2 16.4 24 5Z';
  return (
    <svg viewBox="0 0 48 48" fill="none" className={`sticker-diecut ${className}`} aria-hidden="true">
      <defs>
        <linearGradient id={gradId} x1="6" y1="6" x2="42" y2="42" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="38%" stopColor="#E2E8F0" />
          <stop offset="70%" stopColor="#94A3B8" />
          <stop offset="100%" stopColor="#F8FAFC" />
        </linearGradient>
      </defs>
      {/* White die-cut sticker outline */}
      <path d={path} stroke="#FFFFFF" strokeWidth="6" strokeLinejoin="round" />
      <path d={path} fill={`url(#${gradId})`} stroke="#CBD5E1" strokeWidth="1.2" />
      <path
        d="M24 10C25 17.5 28.5 21 36 22.5C28.5 23 25 26 24 32C23 26 19.5 23 13 22.5C19.5 21 23 17.5 24 10Z"
        fill="rgba(255,255,255,0.8)"
      />
    </svg>
  );
}

export function ChromeSparkle({ className = 'w-7 h-7' }: { className?: string }) {
  const gradId = useId();
  const big = 'M17 5C18 12 21 15 28 16C21 17 18 20 17 27C16 20 13 17 6 16C13 15 16 12 17 5Z';
  const small =
    'M31 22C31.6 25.5 33.5 27.4 37 28C33.5 28.6 31.6 30.5 31 34C30.4 30.5 28.5 28.6 25 28C28.5 27.4 30.4 25.5 31 22Z';
  return (
    <svg viewBox="0 0 42 40" fill="none" className={`sticker-diecut ${className}`} aria-hidden="true">
      <defs>
        <linearGradient id={gradId} x1="6" y1="5" x2="36" y2="34" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="50%" stopColor="#F4BFD3" />
          <stop offset="100%" stopColor="#B55478" />
        </linearGradient>
      </defs>
      <path d={big} stroke="#FFFFFF" strokeWidth="5.5" strokeLinejoin="round" />
      <path d={small} stroke="#FFFFFF" strokeWidth="5" strokeLinejoin="round" />
      <path d={big} fill={`url(#${gradId})`} />
      <path d={small} fill="#CBD5E1" stroke="#94A3B8" strokeWidth="0.7" />
    </svg>
  );
}

export function ChromeButterfly({ className = 'w-12 h-12' }: { className?: string }) {
  const wingGrad = useId();
  const bodyGrad = useId();
  const leftWing =
    'M31 28C25 14 9 11 8 22C7 31 18 35 28 33C19 37 14 45 20 50C26 54 31 44 31 35';
  const rightWing =
    'M33 28C39 14 55 11 56 22C57 31 46 35 36 33C45 37 50 45 44 50C38 54 33 44 33 35';
  return (
    <svg viewBox="0 0 64 64" fill="none" className={`sticker-diecut ${className}`} aria-hidden="true">
      <defs>
        <linearGradient id={wingGrad} x1="8" y1="10" x2="56" y2="54" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="32%" stopColor="#F8DCE8" />
          <stop offset="68%" stopColor="#D98EAA" />
          <stop offset="100%" stopColor="#CBD5E1" />
        </linearGradient>
        <linearGradient id={bodyGrad} x1="32" y1="16" x2="32" y2="50" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="50%" stopColor="#94A3B8" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>
      </defs>
      {/* White die-cut sticker outline */}
      <path d={leftWing} stroke="#FFFFFF" strokeWidth="6" strokeLinejoin="round" />
      <path d={rightWing} stroke="#FFFFFF" strokeWidth="6" strokeLinejoin="round" />
      <rect x="29" y="19" width="6" height="26" rx="3" fill="#FFFFFF" />
      {/* Wings */}
      <path d={leftWing} fill={`url(#${wingGrad})`} stroke="#D98EAA" strokeWidth="1.1" />
      <path d={rightWing} fill={`url(#${wingGrad})`} stroke="#D98EAA" strokeWidth="1.1" />
      <ellipse cx="18" cy="23" rx="4.2" ry="2.3" transform="rotate(-20 18 23)" fill="rgba(255,255,255,0.75)" />
      <ellipse cx="46" cy="23" rx="4.2" ry="2.3" transform="rotate(20 46 23)" fill="rgba(255,255,255,0.75)" />
      <rect x="30.2" y="20" width="3.6" height="24" rx="1.8" fill={`url(#${bodyGrad})`} />
      <path
        d="M31 20C29 15 26 13 24 13M33 20C35 15 38 13 40 13"
        stroke="#94A3B8"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function PinkBow({ className = 'w-12 h-10' }: { className?: string }) {
  const gradId = useId();
  const bowLeft = 'M29 24C21 13 7 12 7 24C7 35 21 34 29 25Z';
  const bowRight = 'M35 24C43 13 57 12 57 24C57 35 43 34 35 25Z';
  const tailLeft = 'M28 28L16 44L23 43L30 31Z';
  const tailRight = 'M36 28L48 44L41 43L34 31Z';
  return (
    <svg viewBox="0 0 64 52" fill="none" className={`sticker-diecut ${className}`} aria-hidden="true">
      <defs>
        <linearGradient id={gradId} x1="8" y1="12" x2="56" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFE9F2" />
          <stop offset="48%" stopColor="#F4BFD3" />
          <stop offset="100%" stopColor="#B55478" />
        </linearGradient>
      </defs>
      {/* White die-cut outline */}
      <path d={tailLeft} stroke="#FFFFFF" strokeWidth="6" strokeLinejoin="round" />
      <path d={tailRight} stroke="#FFFFFF" strokeWidth="6" strokeLinejoin="round" />
      <path d={bowLeft} stroke="#FFFFFF" strokeWidth="6" strokeLinejoin="round" />
      <path d={bowRight} stroke="#FFFFFF" strokeWidth="6" strokeLinejoin="round" />
      <circle cx="32" cy="24" r="7.5" fill="#FFFFFF" />
      {/* Bow & ribbons */}
      <path d={tailLeft} fill={`url(#${gradId})`} stroke="#B55478" strokeWidth="1" />
      <path d={tailRight} fill={`url(#${gradId})`} stroke="#B55478" strokeWidth="1" />
      <path d={bowLeft} fill={`url(#${gradId})`} stroke="#B55478" strokeWidth="1" />
      <path d={bowRight} fill={`url(#${gradId})`} stroke="#B55478" strokeWidth="1" />
      <ellipse cx="16" cy="21" rx="3.5" ry="1.8" transform="rotate(-15 16 21)" fill="rgba(255,255,255,0.75)" />
      <ellipse cx="48" cy="21" rx="3.5" ry="1.8" transform="rotate(15 48 21)" fill="rgba(255,255,255,0.75)" />
      <circle cx="32" cy="24" r="5" fill="#F8DCE8" stroke="#B55478" strokeWidth="1.2" />
      <circle cx="30.5" cy="22.5" r="1.4" fill="#FFFFFF" />
    </svg>
  );
}

export function GlossyHeart({ className = 'w-8 h-8' }: { className?: string }) {
  const gradId = useId();
  const path =
    'M24 41C24 41 7 30.5 7 18.2C7 12.8 11.3 8.8 16.5 8.8C19.8 8.8 22.6 10.5 24 12.9C25.4 10.5 28.2 8.8 31.5 8.8C36.7 8.8 41 12.8 41 18.2C41 30.5 24 41 24 41Z';
  return (
    <svg viewBox="0 0 48 48" fill="none" className={`sticker-diecut ${className}`} aria-hidden="true">
      <defs>
        <radialGradient id={gradId} cx="35%" cy="28%" r="72%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="28%" stopColor="#F8DCE8" />
          <stop offset="68%" stopColor="#D98EAA" />
          <stop offset="100%" stopColor="#B55478" />
        </radialGradient>
      </defs>
      <path d={path} stroke="#FFFFFF" strokeWidth="6" strokeLinejoin="round" />
      <path d={path} fill={`url(#${gradId})`} stroke="#D98EAA" strokeWidth="1" />
      <ellipse cx="16" cy="16" rx="3.2" ry="1.8" transform="rotate(-30 16 16)" fill="rgba(255,255,255,0.85)" />
    </svg>
  );
}

export function PinkFlower({ className = 'w-9 h-9' }: { className?: string }) {
  const petalGrad = useId();
  const centerGrad = useId();
  return (
    <svg viewBox="0 0 56 56" fill="none" className={`sticker-diecut ${className}`} aria-hidden="true">
      <defs>
        <linearGradient id={petalGrad} x1="10" y1="10" x2="46" y2="46" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="45%" stopColor="#F8DCE8" />
          <stop offset="100%" stopColor="#F4BFD3" />
        </linearGradient>
        <radialGradient id={centerGrad} cx="38%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="55%" stopColor="#E2E8F0" />
          <stop offset="100%" stopColor="#94A3B8" />
        </radialGradient>
      </defs>
      {/* White die-cut outline */}
      {[0, 72, 144, 216, 288].map((deg) => (
        <ellipse
          key={`out-${deg}`}
          cx="28"
          cy="14"
          rx="8"
          ry="11"
          transform={`rotate(${deg} 28 28)`}
          fill="#FFFFFF"
          stroke="#FFFFFF"
          strokeWidth="4.5"
        />
      ))}
      {[0, 72, 144, 216, 288].map((deg) => (
        <ellipse
          key={deg}
          cx="28"
          cy="14"
          rx="7.5"
          ry="10.5"
          transform={`rotate(${deg} 28 28)`}
          fill={`url(#${petalGrad})`}
          stroke="#D98EAA"
          strokeWidth="0.9"
        />
      ))}
      <circle cx="28" cy="28" r="6.5" fill={`url(#${centerGrad})`} stroke="#CBD5E1" strokeWidth="1" />
    </svg>
  );
}

export function RetroCD({ className = 'w-14 h-14' }: { className?: string }) {
  const discGrad = useId();
  const holoGrad = useId();
  return (
    <svg viewBox="0 0 64 64" fill="none" className={`sticker-diecut ${className}`} aria-hidden="true">
      <defs>
        <linearGradient id={discGrad} x1="6" y1="6" x2="58" y2="58" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="30%" stopColor="#E2E8F0" />
          <stop offset="55%" stopColor="#F8DCE8" />
          <stop offset="78%" stopColor="#CBD5E1" />
          <stop offset="100%" stopColor="#F4BFD3" />
        </linearGradient>
        <linearGradient id={holoGrad} x1="16" y1="10" x2="48" y2="54" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="rgba(255,255,255,0.85)" />
          <stop offset="50%" stopColor="rgba(244,191,211,0.45)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.75)" />
        </linearGradient>
      </defs>
      {/* White die-cut outline */}
      <circle cx="32" cy="32" r="27" fill="#FFFFFF" />
      <circle cx="32" cy="32" r="24" fill={`url(#${discGrad})`} stroke="#94A3B8" strokeWidth="1.2" />
      <path d="M32 8L46 28L32 32Z" fill={`url(#${holoGrad})`} />
      <path d="M32 56L18 36L32 32Z" fill={`url(#${holoGrad})`} />
      <circle cx="32" cy="32" r="9.5" fill="#F8DCE8" stroke="#D98EAA" strokeWidth="1" />
      <circle cx="32" cy="32" r="4.5" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1" />
    </svg>
  );
}

export function CuteSmiley({ className = 'w-10 h-10' }: { className?: string }) {
  const gradId = useId();
  return (
    <svg viewBox="0 0 48 48" fill="none" className={`sticker-diecut ${className}`} aria-hidden="true">
      <defs>
        <radialGradient id={gradId} cx="35%" cy="30%" r="72%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="35%" stopColor="#F8DCE8" />
          <stop offset="100%" stopColor="#F4BFD3" />
        </radialGradient>
      </defs>
      <circle cx="24" cy="24" r="21" fill="#FFFFFF" />
      <circle cx="24" cy="24" r="18" fill={`url(#${gradId})`} stroke="#B55478" strokeWidth="1.4" />
      <ellipse cx="18.5" cy="19.5" rx="1.7" ry="2.6" fill="#39313A" />
      <ellipse cx="29.5" cy="19.5" rx="1.7" ry="2.6" fill="#39313A" />
      <circle cx="14.5" cy="24" r="2.2" fill="#D98EAA" opacity="0.65" />
      <circle cx="33.5" cy="24" r="2.2" fill="#D98EAA" opacity="0.65" />
      <path
        d="M17.5 27.5C19.3 31 22 32 24 32C26 32 28.7 31 30.5 27.5"
        stroke="#39313A"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function MiniComputer({ className = 'w-12 h-12' }: { className?: string }) {
  const bodyGrad = useId();
  const screenGrad = useId();
  return (
    <svg viewBox="0 0 56 56" fill="none" className={`sticker-diecut ${className}`} aria-hidden="true">
      <defs>
        <linearGradient id={bodyGrad} x1="8" y1="8" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="45%" stopColor="#E2E8F0" />
          <stop offset="100%" stopColor="#CBD5E1" />
        </linearGradient>
        <linearGradient id={screenGrad} x1="14" y1="14" x2="42" y2="34" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F8DCE8" />
          <stop offset="100%" stopColor="#F4BFD3" />
        </linearGradient>
      </defs>
      {/* White die-cut outline */}
      <rect x="6" y="7" width="44" height="34" rx="8" fill="#FFFFFF" />
      <rect x="14" y="39" width="28" height="10" rx="4" fill="#FFFFFF" />
      {/* Monitor */}
      <rect x="9" y="10" width="38" height="28" rx="6" fill={`url(#${bodyGrad})`} stroke="#94A3B8" strokeWidth="1.2" />
      <rect x="13" y="14" width="30" height="19" rx="3.5" fill={`url(#${screenGrad})`} stroke="#B55478" strokeWidth="1" />
      {/* Tiny Heart on Screen */}
      <path
        d="M28 28C28 28 22.5 24.5 22.5 21C22.5 19.3 23.8 18 25.4 18C26.5 18 27.5 18.6 28 19.5C28.5 18.6 29.5 18 30.6 18C32.2 18 33.5 19.3 33.5 21C33.5 24.5 28 28 28 28Z"
        fill="#B55478"
      />
      {/* Stand */}
      <path d="M23 38H33L36 45H20L23 38Z" fill={`url(#${bodyGrad})`} stroke="#94A3B8" strokeWidth="1.1" />
      <rect x="17" y="44" width="22" height="3" rx="1.5" fill="#94A3B8" />
    </svg>
  );
}

export function StickerLabel({
  text,
  variant = 'pink',
  className = '',
}: {
  text: string;
  variant?: 'pink' | 'chrome' | 'charcoal';
  className?: string;
}) {
  const palette =
    variant === 'chrome'
      ? 'y2k-chrome-surface text-[#39313A] border-white'
      : variant === 'charcoal'
        ? 'bg-[#39313A] text-[#F8DCE8] border-white'
        : 'y2k-glossy-pink text-white border-white';

  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border-[2.5px] text-[10px] font-mono font-bold tracking-wider uppercase sticker-diecut whitespace-nowrap select-none ${palette} ${className}`}
    >
      {text}
    </span>
  );
}

export function WashiTape({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none h-5 w-16 y2k-washi-tape rounded-sm ${className}`}
    />
  );
}

export const AbstractFlower = PinkFlower;
