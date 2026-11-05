import { useEffect, useRef } from 'react';

type CalQueue = ((...args: unknown[]) => unknown) & {
  loaded?: boolean;
  ns?: Record<string, CalQueue>;
  q?: unknown[];
  config?: { forwardQueryParams?: boolean };
};

declare global {
  interface Window {
    Cal?: CalQueue;
  }
}

type CalModalProps = { open: boolean; onClose: () => void; title: string; subtitle: string };
const NAMESPACE = 'root-to-radiance-experience';
const CAL_LINK = 'auroraskyn/root-to-radiance-experience';
const CONTAINER_ID = 'my-cal-inline-root-to-radiance-experience';
let rootToRadianceInitialized = false;

function ensureCalBootstrap() {
  if (window.Cal) return window.Cal;
  const Cal = function (...args: unknown[]) {
    const cal = window.Cal!;
    if (!cal.loaded) {
      cal.ns = {};
      cal.q = cal.q || [];
      const script = document.createElement('script');
      script.src = 'https://app.cal.com/embed/embed.js';
      script.async = true;
      document.head.appendChild(script);
      cal.loaded = true;
    }
    if (args[0] === 'init') {
      const namespace = args[1];
      const api = function (...queuedArgs: unknown[]) {
        api.q = api.q || [];
        api.q.push(arguments);
      } as CalQueue;
      if (typeof namespace === 'string') {
        cal.ns![namespace] = cal.ns![namespace] || api;
        cal.ns![namespace].q = cal.ns![namespace].q || [];
        cal.ns![namespace].q!.push(arguments);
        cal.q!.push(['initNamespace', namespace]);
      } else cal.q!.push(arguments);
      return;
    }
    cal.q!.push(arguments);
  } as CalQueue;
  window.Cal = Cal;
  return Cal;
}

export default function CalModal({ open, onClose, title, subtitle }: CalModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (rootToRadianceInitialized) return;
    const Cal = ensureCalBootstrap();
    Cal('init', NAMESPACE, { origin: 'https://app.cal.com' });
    Cal.config = Cal.config || {};
    Cal.config.forwardQueryParams = true;
    Cal.ns?.[NAMESPACE]?.('inline', {
      elementOrSelector: `#${CONTAINER_ID}`,
      config: { layout: 'month_view', useSlotsViewOnSmallScreen: 'true', theme: 'light' },
      calLink: CAL_LINK,
    });
    Cal.ns?.[NAMESPACE]?.('ui', {
      theme: 'light',
      cssVarsPerTheme: { light: { 'cal-brand': '#C8431C' } },
      hideEventTypeDetails: false,
      layout: 'month_view',
    });
    rootToRadianceInitialized = true;
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    try {
      if (open && !dialog.open) dialog.showModal();
      else if (!open && dialog.open) dialog.close();
    } catch {}
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClose = () => onClose();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); onClose(); }
    };
    const handleClick = (event: MouseEvent) => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (!(event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom)) onClose();
    };
    dialog.addEventListener('close', handleClose);
    dialog.addEventListener('keydown', handleKeyDown);
    dialog.addEventListener('click', handleClick);
    return () => {
      dialog.removeEventListener('close', handleClose);
      dialog.removeEventListener('keydown', handleKeyDown);
      dialog.removeEventListener('click', handleClick);
    };
  }, [onClose]);

  return (
    <dialog ref={dialogRef} className="booking-modal cal-modal" aria-labelledby="cal-modal-title" aria-describedby="cal-modal-desc">
      <button type="button" className="booking-close" onClick={onClose} aria-label="Close scheduling"><span aria-hidden="true">×</span></button>
      <div className="booking-head cal-head">
        <p className="eyebrow gold">Book with Aurora Skyn</p>
        <h2 id="cal-modal-title">{title}</h2>
        <p id="cal-modal-desc">{subtitle}</p>
      </div>
      <div className="cal-widget"><div id={CONTAINER_ID} style={{ width: '100%', height: '100%', overflow: 'auto' }} /></div>
    </dialog>
  );
}
