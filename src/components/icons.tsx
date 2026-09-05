/**
 * Small monochrome line icons, ported verbatim from the main Aurora Skyn
 * site's components/icons.tsx. Plain inline SVG (not text glyphs), so
 * nothing ever renders as a colorful emoji regardless of platform/font —
 * every stroke uses currentColor and inherits the surrounding text color.
 */

export function ArrowIcon() {
  return (
    <svg
      className="arrow-icon"
      width="1em"
      height="1em"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 11L11 5M11 5H6.2M11 5V9.8" />
    </svg>
  );
}

export function ChevronIcon({ direction = 'right' }: { direction?: 'left' | 'right' }) {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ transform: direction === 'left' ? 'scaleX(-1)' : undefined }}
    >
      <path d="M6 3.5L11 8l-5 4.5" />
    </svg>
  );
}
