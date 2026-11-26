import { useId } from 'react';
import { CONFIG, type Kit, type ShirtSide } from '@/src/lib/clearance';

interface ShirtArtworkProps {
  kit: Kit;
  side?: ShirtSide;
  back?: { name: string; num: string };
  className?: string;
}

const SHIRT_BODY_PATH =
  'M78 30 L46 40 L10 74 L34 118 L58 104 L58 226 Q120 236 182 226 L182 104 L206 118 L230 74 L194 40 L162 30 Q120 54 78 30Z';

export function ShirtArtwork({
  kit,
  side = 'front',
  back = CONFIG.defaultBack,
  className,
}: ShirtArtworkProps) {
  const rawId = useId();
  const id = `s${rawId.replace(/:/g, '')}`;

  const imageUrl = side === 'back' ? kit.imageBack : kit.image;
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={`${kit.name} ${side}`}
        loading="lazy"
        className={className}
      />
    );
  }

  const { look } = kit;
  const isFront = side === 'front';
  const nameText = (back.name || '').toUpperCase().slice(0, 12);
  const numText = back.num || '';

  return (
    <svg
      viewBox="0 0 240 240"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <defs>
        {look.pattern === 'stripes' ? (
          <pattern id={`${id}p`} width="44" height="10" patternUnits="userSpaceOnUse" x="12">
            <rect width="22" height="10" fill={look.a} />
            <rect x="22" width="22" height="10" fill={look.b} />
          </pattern>
        ) : look.pattern === 'halves' ? (
          <linearGradient id={`${id}p`} x1="0" x2="1">
            <stop offset="0.5" stopColor={side === 'back' ? look.b : look.a} />
            <stop offset="0.5" stopColor={side === 'back' ? look.a : look.b} />
          </linearGradient>
        ) : (
          <linearGradient id={`${id}p`}>
            <stop stopColor={look.a} />
          </linearGradient>
        )}

        <linearGradient id={`${id}s`} x1="0" x2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0.28" />
          <stop offset="0.22" stopColor="#000" stopOpacity="0" />
          <stop offset="0.55" stopColor="#fff" stopOpacity="0.07" />
          <stop offset="0.8" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.3" />
        </linearGradient>

        <linearGradient id={`${id}v`} y1="0" y2="1" x1="0" x2="0">
          <stop offset="0.6" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.22" />
        </linearGradient>

        <clipPath id={`${id}c`}>
          <path d={SHIRT_BODY_PATH} />
        </clipPath>
      </defs>

      <path d={SHIRT_BODY_PATH} fill={`url(#${id}p)`} />

      <g clipPath={`url(#${id}c)`}>
        {isFront ? (
          <>
            <path d="M147 70 l10 0 0 9 q0 7 -5 10 q-5 -3 -5 -10z" fill={look.trim} />
            <path d="M86 72 q5 -4 10 0 q-5 4 -10 0z" fill={look.trim} opacity="0.9" />
            <rect x="92" y="112" width="56" height="12" rx="2" fill={look.text} opacity="0.85" />
          </>
        ) : (
          <>
            <text
              x="120"
              y="96"
              textAnchor="middle"
              fontFamily="Big Shoulders Display, Arial Narrow, sans-serif"
              fontWeight="800"
              fontSize={nameText.length > 8 ? 17 : 21}
              letterSpacing="1.5"
              fill={look.text}
            >
              {nameText}
            </text>
            <text
              x="120"
              y="182"
              textAnchor="middle"
              fontFamily="Big Shoulders Display, Arial Narrow, sans-serif"
              fontWeight="900"
              fontSize="82"
              fill={look.text}
            >
              {numText}
            </text>
          </>
        )}

        <rect width="240" height="240" fill={`url(#${id}s)`} />
        <rect width="240" height="240" fill={`url(#${id}v)`} />

        <path
          d="M58 104 L58 230 M182 104 L182 230"
          stroke="#000"
          strokeOpacity="0.18"
          strokeWidth="1.2"
        />
        <path
          d="M78 30 Q72 70 58 104 M162 30 Q168 70 182 104"
          stroke="#000"
          strokeOpacity="0.12"
          strokeWidth="1.2"
          fill="none"
        />
        <path
          d="M10 74 L34 118 L40 115 L16 71Z M230 74 L206 118 L200 115 L224 71Z"
          fill={look.trim}
        />
      </g>

      {isFront ? (
        <>
          <path d="M78 30 Q120 54 162 30 L156 27 Q120 44 84 27Z" fill={look.trim} />
          <path
            d="M84 27 Q120 44 156 27 L148 25 Q120 36 92 25Z"
            fill="#000"
            opacity="0.35"
          />
        </>
      ) : (
        <path d="M78 30 Q120 42 162 30 L156 27 Q120 36 84 27Z" fill={look.trim} />
      )}
    </svg>
  );
}
