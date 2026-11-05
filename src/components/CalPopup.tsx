import { useEffect } from 'react';

type CalQueue = ((...args: unknown[]) => unknown) & { loaded?: boolean; ns?: Record<string, CalQueue>; q?: unknown[]; config?: { forwardQueryParams?: boolean } };
declare global { interface Window { Cal?: CalQueue } }

const NAMESPACE = 'root-to-radiance-experience';
const DISCOVERY_NAMESPACE = 'discoverycall';
let initialized = false;

function bootstrapCal() {
  if (window.Cal) return window.Cal;
  const Cal = function (...args: unknown[]) {
    const cal = window.Cal!;
    if (!cal.loaded) {
      cal.ns = {};
      cal.q = cal.q || [];
      const script = document.createElement('script');
      script.src = 'https://app.cal.com/embed/embed.js';
      document.head.appendChild(script);
      cal.loaded = true;
    }
    if (args[0] === 'init') {
      const namespace = args[1];
      const api = function (...queuedArgs: unknown[]) { api.q = api.q || []; api.q.push(queuedArgs); } as CalQueue;
      if (typeof namespace === 'string') {
        cal.ns![namespace] = cal.ns![namespace] || api;
        cal.ns![namespace].q = cal.ns![namespace].q || [];
        cal.ns![namespace].q!.push(args);
        cal.q!.push(['initNamespace', namespace]);
      } else cal.q!.push(args);
      return;
    }
    cal.q!.push(args);
  } as CalQueue;
  window.Cal = Cal;
  return Cal;
}

export const rootToRadianceCalAttributes = {
  'data-cal-link': 'auroraskyn/root-to-radiance-experience',
  'data-cal-namespace': NAMESPACE,
  'data-cal-config': JSON.stringify({ layout: 'month_view', useSlotsViewOnSmallScreen: 'true', theme: 'light' }),
};

export const discoveryCallCalAttributes = {
  'data-cal-link': 'auroraskyn/discoverycall',
  'data-cal-namespace': DISCOVERY_NAMESPACE,
  'data-cal-config': JSON.stringify({ layout: 'month_view', useSlotsViewOnSmallScreen: 'true', theme: 'light' }),
};

export default function CalPopup() {
  useEffect(() => {
    if (initialized) return;
    const Cal = bootstrapCal();
    Cal('init', NAMESPACE, { origin: 'https://app.cal.com' });
    Cal.config = Cal.config || {};
    Cal.config.forwardQueryParams = true;
    Cal.ns?.[NAMESPACE]?.('ui', { theme: 'light', cssVarsPerTheme: { light: { 'cal-brand': '#C8431C' } }, hideEventTypeDetails: false, layout: 'month_view' });
    Cal('init', DISCOVERY_NAMESPACE, { origin: 'https://app.cal.com' });
    Cal.ns?.[DISCOVERY_NAMESPACE]?.('ui', { theme: 'light', cssVarsPerTheme: { light: { 'cal-brand': '#C8431C' } }, hideEventTypeDetails: false, layout: 'month_view' });
    initialized = true;
  }, []);
  return null;
}
