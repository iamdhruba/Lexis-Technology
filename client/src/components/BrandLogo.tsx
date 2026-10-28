import { useState } from 'react';

interface BrandLogoProps {
  src?: string;
  alt?: string;
  className?: string;
  badgeSize?: 'sm' | 'md' | 'lg';
}

export default function BrandLogo({
  src,
  alt = 'Lexis Technology',
  className,
  badgeSize = 'md',
}: BrandLogoProps) {
  const [imgError, setImgError] = useState(false);

  const badgeDimensions = {
    sm: 'h-9 w-9 text-lg',
    md: 'h-10 w-10 text-xl',
    lg: 'h-14 w-14 text-2xl',
  }[badgeSize];

  if (src && !imgError) {
    return (
      <img
        src={src}
        alt={alt}
        className={className || 'h-10 w-auto max-w-[180px] object-contain'}
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <div
      className={`flex shrink-0 items-center justify-center bg-blue-600 text-white font-extrabold shadow-md ${badgeDimensions}`}
    >
      L
    </div>
  );
}
