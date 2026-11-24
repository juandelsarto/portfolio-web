// Íconos del sitio. Siempre decorativos (el control que los usa tiene nombre
// accesible) y en currentColor, para heredar el color del token del texto.

type IconProps = { className?: string };

const base = {
  "aria-hidden": true,
  focusable: false,
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function CopyIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" strokeWidth="1.25" className={className} {...base}>
      <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" />
      <path d="M10.5 3.5V3a1.5 1.5 0 0 0-1.5-1.5H3A1.5 1.5 0 0 0 1.5 3v6A1.5 1.5 0 0 0 3 10.5h.5" />
    </svg>
  );
}

export function CheckIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" strokeWidth="1.5" className={className} {...base}>
      <path d="m3 8.5 3.25 3.25L13 5" />
    </svg>
  );
}

export function InfoIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" strokeWidth="1.25" className={className} {...base}>
      <circle cx="8" cy="8" r="6.5" />
      <path d="M8 7.25V11.5M8 4.75v.01" />
    </svg>
  );
}
