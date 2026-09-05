/**
 * Everything editable on the bio page lives here. To change what shows up,
 * what it says, or what order it appears in, edit this file only — nothing
 * else in `src/` should need to change for a copy/link/ordering update.
 */

export const brand = {
  name: 'Aurora Skyn',
  tagline: 'Skin health, beyond the surface.',
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
  message: 'Learn your skyn before you buy another product.',
};

export const featured = {
  eyebrow: 'The priority experience',
  title: 'The Virtual Skyn Experience',
  copy: 'A private virtual skincare experience designed to help you understand what your skyn is asking for.',
  duration: '60 minutes',
  price: '$125',
  cta: 'Book Virtual Skyn',
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
    description: 'Personalized in-spa skincare experiences.',
    action: 'in-spa',
  },
  {
    number: '02',
    label: 'Shop Aurora Skyn',
    description: 'Explore Jasmine’s skincare products.',
    action: 'link',
    href: links.shop,
  },
  {
    number: '03',
    label: 'Join The Skyn Collective',
    description: 'Connect with the free Aurora Skyn community.',
    action: 'link',
    href: links.skynCollective,
    pendingLabel: 'Coming soon',
  },
  {
    number: '04',
    label: 'Subscribe for Skyn Education',
    description: 'Learn your skyn before you buy another product.',
    action: 'subscribe',
  },
  {
    number: '05',
    label: 'Explore Aurora Skyn',
    description: 'Visit the full Aurora Skyn experience.',
    action: 'link',
    href: links.mainSite,
  },
];
