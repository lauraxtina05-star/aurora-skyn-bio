import { useEffect, useRef, useState } from 'react';

/**
 * Ported verbatim from the main Aurora Skyn site's hooks/use-reveal.ts.
 * Soft opacity + translateY reveal for a section as it scrolls into view.
 * One-shot (unobserves after the first reveal) and GPU-friendly (opacity +
 * transform only). Spread the returned ref/className onto the element you
 * want animated directly — no wrapper div, so grid/flex layouts stay intact.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (visible) return;
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      const timer = window.setTimeout(() => setVisible(true), 0);
      return () => window.clearTimeout(timer);
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.18, rootMargin: '0px 0px -8% 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [visible]);

  return { ref, className: `reveal-io${visible ? ' is-visible' : ''}` };
}
