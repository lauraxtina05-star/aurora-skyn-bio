import { useEffect, useRef } from 'react';
import { ArrowIcon } from '@/components/icons';

/**
 * Ported verbatim from the main Aurora Skyn site's components/booking-modal.tsx
 * (same dialog-sync logic, same Escape/backdrop/close handling, same row
 * markup) — only the 'use client' directive was dropped, since this is a
 * plain Vite SPA rather than a Next.js/vinext app. Keep this in sync with
 * the main site's version if its booking behavior changes.
 */

export type BookingLinks = {
  inSpa: string;
  redEye: string;
  teethWhitening: string;
  teethGems?: string | null;
};

type BookingModalProps = {
  open: boolean;
  onClose: () => void;
  /** Opens the separate Discovery Call Calendly modal (closes this one first). */
  onOpenDiscovery: () => void;
  links: BookingLinks;
};

export default function BookingModal({ open, onClose, onOpenDiscovery, links }: BookingModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Sync React state -> native <dialog>. showModal() gives us the focus trap,
  // Escape handling, the top-layer + backdrop, and focus return for free.
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

  // Native close (Escape / dialog.close()) and outside-the-panel clicks.
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

  function handleOpenDiscovery() {
    onClose();
    onOpenDiscovery();
  }

  const options = [
    {
      label: 'In person',
      title: 'In-Spa Experiences',
      meta: 'Explore Jasmine’s available facial and personal skincare experiences.',
      href: links.inSpa,
      cta: 'View In-Spa Availability',
      variant: '',
    },
    {
      label: 'Specialty',
      title: 'Red-Eye Recovery Facial',
      meta: 'Created with flight attendants, frequent flyers, and travel-stressed skyn in mind.',
      href: links.redEye,
      cta: 'Book Red-Eye Recovery',
      variant: 'booking-row--specialty',
    },
    {
      label: 'Add-on',
      title: 'Take-Home Teeth Whitening',
      meta: 'A simple at-home extra alongside your skyn care.',
      href: links.teethWhitening,
      cta: 'Explore Teeth Whitening',
      variant: 'booking-row--secondary',
    },
    {
      label: 'Add-on',
      title: 'Teeth Gems',
      meta: 'A subtle sparkle added to your smile.',
      href: links.teethGems,
      cta: 'Explore Teeth Gems',
      variant: 'booking-row--secondary',
    },
  ];

  return (
    <dialog ref={dialogRef} className="booking-modal" aria-labelledby="booking-modal-title" aria-describedby="booking-modal-desc">
      <button type="button" className="booking-close" onClick={onClose} aria-label="Close booking options">
        <span aria-hidden="true">×</span>
      </button>

      <div className="booking-head">
        <p className="eyebrow gold">Book with Aurora Skyn</p>
        <h2 id="booking-modal-title">Choose Your In-Spa Experience</h2>
        <p id="booking-modal-desc">
          Aurora Skyn offers personal and specialty services in Pompano Beach, Florida. Choose where you’d like to begin,
          or explore the full menu if you want to see everything available.
        </p>
      </div>

      <ul className="booking-list">
        {options.map((option) => (
          <li key={option.title} className={`booking-row ${option.variant}`.trim()}>
            <div className="booking-row-text">
              <span className="booking-row-label">{option.label}</span>
              <h3>{option.title}</h3>
              <p>{option.meta}</p>
            </div>
            {option.href ? (
              <a className="booking-row-cta" href={option.href} target="_blank" rel="noopener noreferrer" onClick={onClose}>
                {option.cta} <ArrowIcon />
              </a>
            ) : (
              <span className="booking-row-pending">Booking link coming soon</span>
            )}
          </li>
        ))}
      </ul>

      <a className="booking-full-menu" href={links.inSpa} target="_blank" rel="noopener noreferrer" onClick={onClose}>
        View the Full In-Spa Menu <ArrowIcon />
      </a>

      <p className="booking-note">
        In-person appointments are completed through our booking system in a new tab. Keep Aurora Skyn open so you can
        easily return and continue exploring.
      </p>

      <div className="booking-discovery">
        <p className="eyebrow navy">Not sure where to start?</p>
        <p className="booking-discovery-lede">Book a complimentary 15-minute Discovery Call.</p>
        <p className="booking-discovery-note">
          Tell me a little about what you’re looking for and I’ll help you decide which Aurora Skyn experience makes the
          most sense. Depending on what you need, we can also talk about combining virtual and in-person support.
        </p>
        <button type="button" className="booking-row-cta booking-discovery-cta" onClick={handleOpenDiscovery}>
          Book a Discovery Call <ArrowIcon />
        </button>
      </div>
    </dialog>
  );
}
