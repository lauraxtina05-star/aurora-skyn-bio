import { useCallback, useEffect, useRef, useState } from 'react';
import BookingModal, { type BookingLinks } from '@/components/BookingModal';
import CalendlyModal from '@/components/CalendlyModal';
import MailerLite from '@/components/MailerLite';
import { ArrowIcon, ChevronIcon } from '@/components/icons';
import { useReveal } from '@/hooks/useReveal';
import { brand, featured, links, mailerlite, menu, withCalendlyAccent } from '@/content';

const bookingLinks: BookingLinks = {
  inSpa: links.inSpaFresha,
  redEye: links.redEyeFresha,
  teethWhitening: links.teethWhiteningFresha,
  teethGems: links.teethGemsFresha,
};

export default function App() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [virtualOpen, setVirtualOpen] = useState(false);
  const [discoveryOpen, setDiscoveryOpen] = useState(false);
  const [subscribeOpen, setSubscribeOpen] = useState(false);

  const bookingTriggerRef = useRef<HTMLButtonElement | null>(null);
  const virtualTriggerRef = useRef<HTMLButtonElement | null>(null);
  const discoveryTriggerRef = useRef<HTMLButtonElement | null>(null);

  const anyModalOpen = bookingOpen || virtualOpen || discoveryOpen;

  // Same single-source-of-truth scroll lock as the main site (position:fixed
  // + saved scrollY, the reliable cross-browser way to stop background
  // scroll on iOS Safari) — see app/page.tsx on the main project.
  useEffect(() => {
    if (!anyModalOpen) return;
    const scrollY = window.scrollY;
    const body = document.body;
    const previous = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      overflow: body.style.overflow,
    };
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.width = '100%';
    body.style.overflow = 'hidden';
    return () => {
      body.style.position = previous.position;
      body.style.top = previous.top;
      body.style.left = previous.left;
      body.style.right = previous.right;
      body.style.width = previous.width;
      body.style.overflow = previous.overflow;
      window.scrollTo(0, scrollY);
    };
  }, [anyModalOpen]);

  const openBooking = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    bookingTriggerRef.current = event.currentTarget;
    setBookingOpen(true);
  }, []);
  const closeBooking = useCallback(() => {
    setBookingOpen(false);
    const trigger = bookingTriggerRef.current;
    if (trigger && document.contains(trigger)) setTimeout(() => trigger.focus(), 0);
  }, []);

  const openVirtual = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    virtualTriggerRef.current = event.currentTarget;
    setVirtualOpen(true);
  }, []);
  const closeVirtual = useCallback(() => {
    setVirtualOpen(false);
    const trigger = virtualTriggerRef.current;
    if (trigger && document.contains(trigger)) setTimeout(() => trigger.focus(), 0);
  }, []);

  const openDiscoveryFromBookingModal = useCallback(() => {
    discoveryTriggerRef.current = bookingTriggerRef.current;
    setDiscoveryOpen(true);
  }, []);
  const closeDiscovery = useCallback(() => {
    setDiscoveryOpen(false);
    const trigger = discoveryTriggerRef.current;
    if (trigger && document.contains(trigger)) setTimeout(() => trigger.focus(), 0);
  }, []);

  const { ref: heroRef, className: heroRevealClass } = useReveal<HTMLDivElement>();
  const { ref: featuredRef, className: featuredRevealClass } = useReveal<HTMLElement>();
  const { ref: menuRef, className: menuRevealClass } = useReveal<HTMLElement>();

  return (
    <div className="bio">
      <MailerLite />

      <header className="bio-hero">
        <div className="bio-hero-image">
          <img
            src="/images/jasmine-bio-hero-gold.jpg"
            alt="Jasmine, Aurora Skyn's esthetician, in a gold outfit against a large tree at golden hour"
            width={932}
            height={1400}
            loading="eager"
            fetchPriority="high"
          />
        </div>
        <div ref={heroRef} className={`bio-brand ${heroRevealClass}`}>
          <img className="bio-logo" src="/images/logo-dark.png" alt={brand.name} width={280} height={157} />
          <p className="bio-tagline">{brand.tagline}</p>
        </div>
      </header>

      <section ref={featuredRef} className={`bio-featured ${featuredRevealClass}`} aria-labelledby="featured-title">
        <div className="bio-featured-photo">
          <img
            src="/images/jasmine-virtual-skyn.jpg"
            alt="Jasmine glancing through green foliage in a colorful floral top"
            width={1600}
            height={1066}
            loading="lazy"
          />
        </div>
        <div className="bio-featured-copy">
          <p className="eyebrow gold">{featured.eyebrow}</p>
          <h2 id="featured-title">{featured.title}</h2>
          <p className="bio-featured-lede">{featured.copy}</p>
          <p className="bio-featured-meta">
            {featured.duration} <span aria-hidden="true">·</span> {featured.price}
          </p>
          <button type="button" className="bio-cta" onClick={openVirtual}>
            {featured.cta} <ArrowIcon />
          </button>
        </div>
      </section>

      <nav ref={menuRef} className={`bio-menu ${menuRevealClass}`} aria-label="Quick links">
        <ul>
          {menu.map((item) => {
            const inner = (
              <>
                <span className="bio-menu-number" aria-hidden="true">
                  {item.number}
                </span>
                <span className="bio-menu-text">
                  <strong>{item.label}</strong>
                  <span>{item.description}</span>
                </span>
                <span className={`bio-menu-indicator${item.action === 'subscribe' && subscribeOpen ? ' is-open' : ''}`} aria-hidden="true">
                  {item.action === 'subscribe' ? (
                    <ChevronIcon />
                  ) : item.action === 'link' && !item.href ? (
                    (item.pendingLabel ?? 'Coming soon')
                  ) : (
                    <ArrowIcon />
                  )}
                </span>
              </>
            );

            if (item.action === 'in-spa') {
              return (
                <li key={item.label} className="bio-menu-row">
                  <button type="button" onClick={openBooking}>
                    {inner}
                  </button>
                </li>
              );
            }

            if (item.action === 'subscribe') {
              return (
                <li key={item.label} className="bio-menu-row bio-menu-row--subscribe">
                  <button type="button" aria-expanded={subscribeOpen} onClick={() => setSubscribeOpen((open) => !open)}>
                    {inner}
                  </button>
                  {/* Always mounted (never conditionally rendered) so MailerLite's
                      universal script — which scans for .ml-embedded once on load —
                      can find and initialize it; only visibility is toggled. */}
                  <div className={`bio-subscribe${subscribeOpen ? '' : ' bio-subscribe--collapsed'}`}>
                    <p>{mailerlite.message}</p>
                    <div className="ml-embedded" data-form={mailerlite.formId} />
                  </div>
                </li>
              );
            }

            if (!item.href) {
              return (
                <li key={item.label} className="bio-menu-row bio-menu-row--pending">
                  <span>{inner}</span>
                </li>
              );
            }

            return (
              <li key={item.label} className="bio-menu-row">
                <a href={item.href} target="_blank" rel="noopener noreferrer">
                  {inner}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      <footer className="bio-footer">
        <p className="bio-footer-brand">{brand.name}</p>
        <p className="bio-footer-links">
          <a href={links.mainSite} target="_blank" rel="noopener noreferrer">
            auroraskynholistics.com
          </a>
          <a href={links.instagram} target="_blank" rel="noopener noreferrer">
            Instagram
          </a>
        </p>
        <p className="bio-footer-credit">
          Digital Experience by{' '}
          <a href={links.onyxCreatrix} target="_blank" rel="noopener noreferrer">
            ONYX Creatrix
          </a>
        </p>
      </footer>

      <BookingModal open={bookingOpen} onClose={closeBooking} onOpenDiscovery={openDiscoveryFromBookingModal} links={bookingLinks} />
      <CalendlyModal
        open={virtualOpen}
        onClose={closeVirtual}
        title="Book Your Virtual Skyn Experience"
        subtitle="A 60-minute private virtual session, plus everything Jasmine reviews before you meet."
        calendlyUrl={withCalendlyAccent(links.virtualCalendly)}
      />
      <CalendlyModal
        open={discoveryOpen}
        onClose={closeDiscovery}
        title="Book Your Discovery Call"
        subtitle="A complimentary 15-minute call to help you decide where to begin."
        calendlyUrl={withCalendlyAccent(links.discoveryCalendly)}
      />
    </div>
  );
}
