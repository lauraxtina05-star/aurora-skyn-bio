/**
 * Everything editable on the bio page lives here. To change what shows up,
 * what it says, or what order it appears in, edit this file only — nothing
 * else in `src/` should need to change for a copy/link/ordering update.
 *
 * Voice: first-person, as Jasmine speaking directly to the visitor ("I help
 * you...", "Come see me...") — not third-person brand copy ("Jasmine
 * helps...", "Aurora Skyn provides..."). Keep new copy in that voice.
 */

export const brand = {
  name: 'Aurora Skyn',
  tagline: 'Skin health, beyond the surface.',
  heroLede: 'I help you understand what your skyn is asking for, so you can stop guessing and start making choices that actually fit you.',
};

export const links = {
  // Reused verbatim from the main site (app/page.tsx `links`) — keep these
  // two in sync if either project's URLs change.
  virtualCalendly: 'https://calendly.com/auroraskyn/vse?back=1&month=2026-09',
  discoveryCalendly: 'https://calendly.com/auroraskyn/discoverycall?back=1&month=2026-09',
  inSpaFresha: 'https://www.fresha.com/book-now/aurora-skyn-hmifnwoh/services?lid=1297352&eid=2998182&share=true&pId=1231654',
  redEyeFresha: 'https://www.fresha.com/book-now/aurora-skyn-hmifnwoh/services?lid=1297352&eid=2998182&oiid=sv%3A28811121&share=true&pId=1231654',
  teethWhiteningFresha: 'https://www.fresha.com/book-now/aurora-skyn-hmifnwoh/services?lid=1297352&eid=2998182&oiid=sv%3A18176254&share=true&pId=1231654',
  teethGemsFresha: 'https://www.fresha.com/book-now/aurora-skyn-hmifnwoh/services?lid=1297352&eid=2998182&oiid=sv%3A18175995&share=true&pId=1231654',
  shop: 'https://www.fresha.com/store/aurora-skyn-store-mqm8e2hv?share=true&pId=1231654',
  mainSite: 'https://auroraskynholistics.com',
  instagram: 'https://www.instagram.com/auroraskyn',
  onyxCreatrix: 'https://onyxcreatrix.com/',

  // The Skyn Collective's Instagram Channel ("The Inner Glow Collective").
  skynCollective: 'https://www.instagram.com/channel/AbZda0FEKOIvYodO/' as string | null,
};

// Calendly's own (non-hacky) color customization — matches the main site.
const CALENDLY_ACCENT_COLOR = 'c21875'; // Berry Magenta, no leading #
export function withCalendlyAccent(url: string) {
  return `${url}&primary_color=${CALENDLY_ACCENT_COLOR}`;
}

export const mailerlite = {
  accountId: '2614510',
  formId: 'ylJLrW',
  heading: 'Learn Your Skyn',
  message: 'Want to understand your skyn a little better? I’ll send you skincare education, practical guidance, and updates from Aurora Skyn.',
  // Shown instead of `message` at very narrow widths — see the
  // `.bio-subscribe-message--short` / `--full` split in styles/global.css.
  shortMessage: 'I’ll send you skincare education, practical guidance, and updates from Aurora Skyn.',
};

export const featured = {
  eyebrow: 'Featured experience',
  title: 'The Virtual Skyn Experience',
  copy: 'A private virtual skincare experience where I help you understand what your skyn is asking for, look at what may have changed, and give you clear next steps you can actually follow.',
  duration: '60 minutes',
  price: '$125',
  cta: 'Book Virtual Skyn',
};

// Deliberately quiet — a secondary nudge for visitors unsure whether Virtual
// Skyn or in-spa is the right fit, not a second competing offer. Keep it
// visually smaller/muted relative to `featured` above.
export const discovery = {
  copy: 'Not sure where to begin? Book a complimentary 15-minute call and I’ll help you figure out whether virtual or in-spa support makes the most sense for you.',
  cta: 'Book a Discovery Call',
};

export type MenuItem = {
  number: string;
  label: string;
  description: string;
} & (
  | { action: 'in-spa' }
  | { action: 'subscribe' }
  | { action: 'link'; href: string | null; pendingLabel?: string }
);

// Order here is the order they render in. Move an entry up or down to
// reorder the menu; nothing else needs to change.
export const menu: MenuItem[] = [
  {
    number: '01',
    label: 'Book In-Spa',
    description: 'Come see me in person for a personalized skincare experience in Pompano Beach.',
    action: 'in-spa',
  },
  {
    number: '02',
    label: 'Shop Aurora Skyn',
    description: 'Explore the skincare products I use and recommend.',
    action: 'link',
    href: links.shop,
  },
  {
    number: '03',
    label: 'Join The Skyn Collective',
    description: 'Join my free community for skincare education, conversation, and support.',
    action: 'link',
    href: links.skynCollective,
    pendingLabel: 'Coming soon',
  },
  {
    number: '04',
    label: 'Subscribe for Skyn Education',
    description: 'Get skincare education, tips, and updates from me directly.',
    action: 'subscribe',
  },
  {
    number: '05',
    label: 'Explore Aurora Skyn',
    description: 'Want to learn more about me, my approach, and everything I offer? Visit the full site.',
    action: 'link',
    href: links.mainSite,
  },
];
