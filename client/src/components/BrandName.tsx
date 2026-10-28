interface BrandNameProps {
  name: string;
  className?: string;
}

export default function BrandName({ name, className = '' }: BrandNameProps) {
  // Format "Lexis Technology" with Lexis bold dark blue and Technology in vibrant electric blue
  const techMatch = name.match(/^(Lexis)\s+(Technology.*)$/i);
  if (techMatch) {
    return (
      <span className={className}>
        <span className="font-sans font-extrabold tracking-tight text-blue-900">
          {techMatch[1]}
        </span>
        <span className="ml-1.5 font-sans font-bold tracking-wide text-blue-600">
          {techMatch[2]}
        </span>
      </span>
    );
  }

  const match = name.match(/^(.*?)(\s+Co\.?\s+Ltd\.?)$/i);
  if (!match) {
    return (
      <span className={`${className} font-sans font-extrabold tracking-tight`}>
        {name}
      </span>
    );
  }

  return (
    <span className={className}>
      <span className="font-sans font-extrabold tracking-tight">
        {match[1]}
      </span>
      <span className="ml-1.5 font-sans font-light tracking-wide opacity-80">
        {match[2].trim()}
      </span>
    </span>
  );
}
