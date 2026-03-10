interface OrbitalBackgroundProps {
  variant?: 'default' | 'small' | 'large';
  position?: 'center' | 'right' | 'left';
  className?: string;
}

export function OrbitalBackground({ variant = 'default', position = 'center', className = '' }: OrbitalBackgroundProps) {
  const sizes = {
    small: { orbits: [80, 140, 200], center: 12, dot: 2 },
    default: { orbits: [100, 180, 260], center: 16, dot: 2.5 },
    large: { orbits: [140, 240, 340], center: 20, dot: 3 },
  };

  const config = sizes[variant];

  const positionClasses = {
    center: 'left-1/2 -translate-x-1/2',
    right: 'right-0 translate-x-1/4',
    left: 'left-0 -translate-x-1/4',
  };

  return (
    <div className={`absolute top-1/2 -translate-y-1/2 ${positionClasses[position]} ${className} pointer-events-none`}>
      <div className="relative">
        {/* Orbits */}
        {config.orbits.map((size, i) => (
          <div
            key={i}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#39D2ED]/15"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              animation: `spin ${25 + i * 8}s linear infinite`,
            }}
          >
            {/* Orbit dot */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-[#1973AE] to-[#39D2ED] shadow-lg"
              style={{
                width: `${config.dot}px`,
                height: `${config.dot}px`,
              }}
            />
          </div>
        ))}

        {/* Center circle */}
        <div
          className="relative rounded-full bg-gradient-to-br from-[#1973AE] to-[#39D2ED] shadow-xl"
          style={{
            width: `${config.center}px`,
            height: `${config.center}px`,
          }}
        />
      </div>

      <style>{`
        @keyframes spin {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
