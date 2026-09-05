import { useEffect } from 'react';
import { mailerlite } from '@/content';

/**
 * MailerLite Universal loader, ported verbatim from the main Aurora Skyn
 * site's components/mailerlite.tsx (same vendor snippet, same account).
 * Injects once, client-side, so it never races React hydration.
 *
 * Powers the embedded Skyn Notes form (data-form="ylJLrW").
 */
const SCRIPT_ID = 'mailerlite-universal';

const SNIPPET = `(function(w,d,e,u,f,l,n){w[f]=w[f]||function(){(w[f].q=w[f].q||[])
.push(arguments);},l=d.createElement(e),l.async=1,l.src=u,
n=d.getElementsByTagName(e)[0],n.parentNode.insertBefore(l,n);})
(window,document,'script','https://assets.mailerlite.com/js/universal.js','ml');
ml('account', '${mailerlite.accountId}');`;

export default function MailerLite() {
  useEffect(() => {
    if (document.getElementById(SCRIPT_ID)) return;
    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.textContent = SNIPPET;
    document.body.appendChild(script);
  }, []);

  return null;
}
