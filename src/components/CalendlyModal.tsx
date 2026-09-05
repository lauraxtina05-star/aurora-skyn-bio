import { useEffect, useRef } from 'react';

/**
 * Ported verbatim from the main Aurora Skyn site's components/calendly-modal.tsx
 * — same official Calendly.initInlineWidget() integration, same dialog-sync
 * and mobile 100dvh handling (see the matching CSS in styles/global.css,
 * `dialog.booking-modal.calendly-modal[open]`, ported with the same [open]
 * scoping fix). Only the 'use client' directive was dropped. Keep this in
 * sync with the main site's version if its Calendly behavior changes.
 */

type CalendlyModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  calendlyUrl: string;
};

const CALENDLY_SCRIPT_SRC = 'https://assets.calendly.com/assets/external/widget.js';

type CalendlyGlobal = {
  initInlineWidget: (options: { url: string; parentElement: HTMLElement }) => void;
};

let calendlyScriptPromise: Promise<void> | null = null;

function loadCalendlyScript(): Promise<void> {
  const w = window as Window & { Calendly?: CalendlyGlobal };
  if (w.Calendly) return Promise.resolve();
  if (calendlyScriptPromise) return calendlyScriptPromise;

  calendlyScriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${CALENDLY_SCRIPT_SRC}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('Calendly widget script failed to load')));
      return;
    }
    const script = document.createElement('script');
    script.src = CALENDLY_SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Calendly widget script failed to load'));
    document.body.appendChild(script);
  });
  return calendlyScriptPromise;
}

/**
 * A branded <dialog> (same visual language as BookingModal — same overlay,
 * panel, close button, mobile bottom sheet) that houses the official
 * Calendly inline embed. We only load Calendly's script and initialize the
 * widget once the dialog is actually open, via their documented JS API
 * (Calendly.initInlineWidget) rather than the static data-url auto-init,
 * since this container mounts/unmounts dynamically.
 */
export default function CalendlyModal({ open, onClose, title, subtitle, calendlyUrl }: CalendlyModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    try {
      if (open && !dialog.open) dialog.showModal();
      else if (!open && dialog.open) dialog.close();
    } catch {
      // Defensive only — keeps a thrown InvalidStateError from leaving
      // dialog.open out of sync with the open prop.
    }
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    function handleClose() {
      onClose();
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    }
    function handleClick(event: MouseEvent) {
      if (!dialog || event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      const inside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;
      if (!inside) onClose();
    }

    dialog.addEventListener('close', handleClose);
    dialog.addEventListener('keydown', handleKeyDown);
    dialog.addEventListener('click', handleClick);
    return () => {
      dialog.removeEventListener('close', handleClose);
      dialog.removeEventListener('keydown', handleKeyDown);
      dialog.removeEventListener('click', handleClick);
    };
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    loadCalendlyScript()
      .then(() => {
        if (cancelled) return;
        const container = widgetRef.current;
        const w = window as Window & { Calendly?: CalendlyGlobal };
        if (!container || !w.Calendly) return;
        container.innerHTML = '';
        w.Calendly.initInlineWidget({ url: calendlyUrl, parentElement: container });
      })
      .catch(() => {
        // Leave the panel visible with its heading; Calendly's own script
        // reports load failures to the console, nothing further to do here.
      });
    return () => {
      cancelled = true;
    };
  }, [open, calendlyUrl]);

  return (
    <dialog
      ref={dialogRef}
      className="booking-modal calendly-modal"
      aria-labelledby="calendly-modal-title"
      aria-describedby="calendly-modal-desc"
    >
      <button type="button" className="booking-close" onClick={onClose} aria-label="Close scheduling">
        <span aria-hidden="true">×</span>
      </button>

      <div className="booking-head calendly-head">
        <p className="eyebrow gold">Book with Aurora Skyn</p>
        <h2 id="calendly-modal-title">{title}</h2>
        <p id="calendly-modal-desc">{subtitle}</p>
      </div>

      <div className="calendly-widget" ref={widgetRef} />
    </dialog>
  );
}
