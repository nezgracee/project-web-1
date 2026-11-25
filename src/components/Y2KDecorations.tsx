import { useId } from 'react';

export function ChromeStar({ className = 'w-6 h-6' }: { className?: string }) {
  const gradId = useId();
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={gradId} x1="6" y1="6" x2="42" y2="42" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="38%" stopColor="#E2E8F0" />
          <stop offset="68%" stopColor="#94A3B8" />
          <stop offset="100%" stopColor="#F8FAFC" />
        </linearGradient>
      </defs>
      <path
        d="M24 3C25.9 15.6 32.4 22.1 45 24C32.4 25.9 25.9 32.4 24 45C22.1 32.4 15.6 25.9 3 24C15.6 22.1 22.1 15.6 24 3Z"
        fill={`url(#${gradId})`}
        stroke="#CBD5E1"
        strokeWidth="1.2"
      />
      <path
        d="M24 9C25 17 29 21 37 22.5C29 23 25 26 24 32C23 26 19 23 13 22.5C19 21 23 17 24 9Z"
        fill="rgba(255,255,255,0.75)"
      />
    </svg>
  );
}

export function ChromeSparkle({ className = 'w-5 h-5' }: { className?: string }) {
  const gradId = useId();
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={gradId} x1="4" y1="4" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="50%" stopColor="#F4BFD3" />
          <stop offset="100%" stopColor="#B55478" />
        </linearGradient>
      </defs>
      <path
        d="M16 4C17 11.5 20.5 15 28 16C20.5 17 17 20.5 16 28C15 20.5 11.5 17 4 16C11.5 15 15 11.5 16 4Z"
        fill={`url(#${gradId})`}
      />
      <path
        d="M31 23C31.6 26.5 33.5 28.4 37 29C33.5 29.6 31.6 31.5 31 35C30.4 31.5 28.5 29.6 25 29C28.5 28.4 30.4 26.5 31 23Z"
        fill="#CBD5E1"
      />
    </svg>
  );
}

export function ChromeButterfly({ className = 'w-10 h-10' }: { className?: string }) {
  const wingGrad = useId();
  const bodyGrad = useId();
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={wingGrad} x1="8" y1="10" x2="56" y2="54" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="35%" stopColor="#F8DCE8" />
          <stop offset="70%" stopColor="#D98EAA" />
          <stop offset="100%" stopColor="#CBD5E1" />
        </linearGradient>
        <linearGradient id={bodyGrad} x1="32" y1="16" x2="32" y2="50" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F8FAFC" />
          <stop offset="55%" stopColor="#94A3B8" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>
      </defs>
      <path
        d="M31 28C25 14 9 11 8 22C7 31 18 35 28 33C19 37 14 45 20 50C26 54 31 44 31 35"
        fill={`url(#${wingGrad})`}
        stroke="#D98EAA"
        strokeWidth="1.2"
      />
      <path
        d="M33 28C39 14 55 11 56 22C57 31 46 35 36 33C45 37 50 45 44 50C38 54 33 44 33 35"
        fill={`url(#${wingGrad})`}
        stroke="#D98EAA"
        strokeWidth="1.2"
      />
      <ellipse cx="18" cy="23" rx="4" ry="2.2" transform="rotate(-20 18 23)" fill="rgba(255,255,255,0.7)" />
      <ellipse cx="46" cy="23" rx="4" ry="2.2" transform="rotate(20 46 23)" fill="rgba(255,255,255,0.7)" />
      <rect x="30.2" y="20" width="3.6" height="24" rx="1.8" fill={`url(#${bodyGrad})`} />
      <path d="M31 20C29 15 26 13 24 13M33 20C35 15 38 13 40 13" stroke="#94A3B8" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

export function GlossyHeart({ className = 'w-6 h-6' }: { className?: string }) {
  const gradId = useId();
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <defs>
        <radialGradient id={gradId} cx="35%" cy="28%" r="72%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="28%" stopColor="#F8DCE8" />
          <stop offset="68%" stopColor="#D98EAA" />
          <stop offset="100%" stopColor="#B55478" />
        </radialGradient>
      </defs>
      <path
        d="M24 41.5C24 41.5 7 30.8 7 18.2C7 12.6 11.4 8.5 16.6 8.5C19.8 8.5 22.6 10.2 24 12.7C25.4 10.2 28.2 8.5 31.4 8.5C36.6 8.5 41 12.6 41 18.2C41 30.8 24 41.5 24 41.5Z"
        fill={`url(#${gradId})`}
        stroke="#F4BFD3"
        strokeWidth="1"
      />
      <ellipse cx="16" cy="16" rx="3.2" ry="1.8" transform="rotate(-30 16 16)" fill="rgba(255,255,255,0.8)" />
    </svg>
  );
}

export function AbstractFlower({ className = 'w-8 h-8' }: { className?: string }) {
  const petalGrad = useId();
  const centerGrad = useId();
  return (
    <svg viewBox="0 0 56 56" fill="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={petalGrad} x1="10" y1="10" x2="46" y2="46" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="50%" stopColor="#F8DCE8" />
          <stop offset="100%" stopColor="#F4BFD3" />
        </linearGradient>
        <radialGradient id={centerGrad} cx="38%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="55%" stopColor="#CBD5E1" />
          <stop offset="100%" stopColor="#94A3B8" />
        </radialGradient>
      </defs>
      {[0, 72, 144, 216, 288].map((deg) => (
        <ellipse
          key={deg}
          cx="28"
          cy="14"
          rx="7.5"
          ry="11"
          transform={`rotate(${deg} 28 28)`}
          fill={`url(#${petalGrad})`}
          stroke="#D98EAA"
          strokeWidth="0.9"
        />
      ))}
      <circle cx="28" cy="28" r="6.5" fill={`url(#${centerGrad})`} stroke="#E2E8F0" strokeWidth="1" />
    </svg>
  );
}
