import { DOCUMENT, Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { SITE, SOCIAL_LINKS } from '../content/site';
import { CatalogNode, EventItem } from '../models/content.models';
import { ContentService } from '../services/content.service';
import { parseEventDates } from './event-dates';

export const SITE_URL = 'https://faremoana.ch';
const DEFAULT_IMAGE = 'images/home/slide-apprends.webp';
const DESCRIPTION_MAX = 158;

interface PageSeo {
  title: string;
  description: string;
  image: string;
  type: 'website' | 'article';
  noindex?: boolean;
  jsonLd: object[];
}

/**
 * Keeps <title>, meta description, canonical URL, Open Graph / Twitter tags and JSON-LD
 * in sync with the current route. Runs on the server during prerendering, so crawlers
 * receive complete metadata in the static HTML.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly document = inject(DOCUMENT);
  private readonly meta = inject(Meta);
  private readonly titleService = inject(Title);
  private readonly content = inject(ContentService);

  update(url: string): void {
    const path = normalizePath(url);
    const seo = this.resolve(path);
    const canonical = SITE_URL + (path === '/' ? '/' : `${path}/`);
    const image = absolute(seo.image);

    this.titleService.setTitle(seo.title);
    this.setTag('name', 'description', seo.description);
    this.setTag('name', 'robots', seo.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large');

    this.setTag('property', 'og:site_name', SITE.name);
    this.setTag('property', 'og:locale', 'fr_CH');
    this.setTag('property', 'og:type', seo.type);
    this.setTag('property', 'og:title', seo.title);
    this.setTag('property', 'og:description', seo.description);
    this.setTag('property', 'og:url', canonical);
    this.setTag('property', 'og:image', image);

    this.setTag('name', 'twitter:card', 'summary_large_image');
    this.setTag('name', 'twitter:title', seo.title);
    this.setTag('name', 'twitter:description', seo.description);
    this.setTag('name', 'twitter:image', image);

    this.setCanonical(canonical);
    this.setJsonLd([organization(), ...seo.jsonLd]);
  }

  private resolve(path: string): PageSeo {
    const suffix = ` – ${SITE.name}`;

    if (path === '/') {
      return {
        title: `${SITE.tagline} – ${SITE.name}`,
        description:
          'Centre de plongée PADI 5* IDC à Genève : baptêmes, formations dès 8 ans, plongée Tec, formations pro, sorties club et voyages plongée toute l’année.',
        image: DEFAULT_IMAGE,
        type: 'website',
        jsonLd: [],
      };
    }

    const listing: Record<string, [string, string, string]> = {
      '/evenements': [
        'Nos évènements',
        'Sorties club, journées à thème et formations spéciales organisées par Fare Moana, centre de plongée PADI 5* IDC à Genève.',
        'images/heroes/evenements.webp',
      ],
      '/voyages': [
        'Nos voyages',
        'Voyages et week-ends plongée avec le club Fare Moana : Philippines, lacs suisses, plongée sous glace et Méditerranée.',
        'images/heroes/voyages.webp',
      ],
      '/contact': [
        'Contact',
        `Contactez Fare Moana, centre de plongée PADI 5* IDC : ${SITE.address[2]}, ${SITE.address[3].replace(' I ', ', ')}. ${SITE.phone.label}, ${SITE.email}.`,
        'images/heroes/contact.webp',
      ],
    };
    if (listing[path]) {
      const [title, description, image] = listing[path];
      return { title: title + suffix, description, image, type: 'website', jsonLd: [breadcrumbs([[title, path]])] };
    }

    const event = this.content.event(path);
    if (event) return this.eventSeo(event, suffix);

    const node = this.content.node(path);
    if (node) return this.nodeSeo(node, suffix);

    return {
      title: 'Page introuvable' + suffix,
      description: 'La page demandée n’existe pas ou a été déplacée.',
      image: DEFAULT_IMAGE,
      type: 'website',
      noindex: true,
      jsonLd: [],
    };
  }

  private nodeSeo(node: CatalogNode, suffix: string): PageSeo {
    const title = node.title ?? node.label;
    const trail = this.trail(node);
    const firstText = (node.intro ?? []).find((p) => p.length > 40) ?? node.cardText ?? '';
    const description = clip(
      node.kind === 'course'
        ? `${title} à Genève avec Fare Moana, centre PADI 5* IDC. ${firstText}`
        : firstText || `${title} – Fare Moana, centre de plongée PADI 5* IDC à Genève.`,
    );
    const jsonLd: object[] = [breadcrumbs(trail)];
    if (node.kind === 'course') jsonLd.push(course(node, description));

    return {
      title: title + suffix,
      description,
      image: node.image ?? node.heroImage ?? this.content.parent(node.path)?.heroImage ?? DEFAULT_IMAGE,
      type: node.kind === 'course' ? 'article' : 'website',
      jsonLd,
    };
  }

  private eventSeo(event: EventItem, suffix: string): PageSeo {
    const description = clip(`${event.title} – ${event.dateLabel}. ${(event.intro ?? []).join(' ')}`);
    const parent: [string, string] = event.kind === 'voyage' ? ['Nos voyages', '/voyages'] : ['Nos évènements', '/evenements'];
    const jsonLd: object[] = [breadcrumbs([parent, [event.title, event.path!]])];
    const dates = parseEventDates(event.dateLabel);
    if (dates) jsonLd.push(eventLd(event, description, dates));
    return {
      title: event.title + suffix,
      description,
      image: event.gallery?.[0] ?? event.image ?? DEFAULT_IMAGE,
      type: 'article',
      jsonLd,
    };
  }

  /** Breadcrumb trail from the catalogue hierarchy. */
  private trail(node: CatalogNode): [string, string][] {
    const trail: [string, string][] = [];
    for (let n: CatalogNode | undefined = node; n; n = this.content.parent(n.path)) {
      trail.unshift([n.title ?? n.label, n.path]);
    }
    return trail;
  }

  private setTag(attr: 'name' | 'property', key: string, value: string): void {
    this.meta.updateTag({ [attr]: key, content: value }, `${attr}="${key}"`);
  }

  private setCanonical(href: string): void {
    let link = this.document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.rel = 'canonical';
      this.document.head.appendChild(link);
    }
    link.href = href;
  }

  private setJsonLd(data: object[]): void {
    let script = this.document.head.querySelector<HTMLScriptElement>('script#seo-jsonld');
    if (!script) {
      script = this.document.createElement('script');
      script.id = 'seo-jsonld';
      script.type = 'application/ld+json';
      this.document.head.appendChild(script);
    }
    script.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': data });
  }
}

/* ---------- Helpers ---------- */

function normalizePath(url: string): string {
  const path = url.split(/[?#]/)[0].replace(/\/+$/, '');
  return path || '/';
}

function absolute(path: string): string {
  return /^https?:/.test(path) ? path : `${SITE_URL}/${path.replace(/^\//, '')}`;
}

function clip(text: string): string {
  let clean = text.replace(/\s+/g, ' ').trim();
  // Thin descriptions get the location, which is what people search for.
  if (clean.length < 110) clean += ' Centre de plongée PADI 5* IDC à Thônex, Genève.';
  if (clean.length <= DESCRIPTION_MAX) return clean;
  return clean.slice(0, DESCRIPTION_MAX - 1).replace(/\s+\S*$/, '') + '…';
}

function price(amount: string): number | undefined {
  const digits = amount.replace(/[^\d]/g, '');
  return digits ? Number(digits) : undefined;
}

function organization(): object {
  return {
    '@type': ['SportsActivityLocation', 'LocalBusiness'],
    '@id': `${SITE_URL}/#organization`,
    name: SITE.name,
    description: SITE.tagline,
    url: `${SITE_URL}/`,
    logo: absolute(SITE.logo),
    image: absolute(DEFAULT_IMAGE),
    telephone: SITE.phone.href.replace('tel:', ''),
    email: SITE.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE.address[2],
      postalCode: '1226',
      addressLocality: 'Thônex',
      addressRegion: 'GE',
      addressCountry: 'CH',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '09:00',
        closes: '19:00',
      },
    ],
    sameAs: SOCIAL_LINKS.map((s) => s.url),
  };
}

function breadcrumbs(trail: [string, string][]): object {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [['Accueil', '/'] as [string, string], ...trail].map(([name, path], i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name,
      item: SITE_URL + (path === '/' ? '/' : `${path}/`),
    })),
  };
}

function course(node: CatalogNode, description: string): object {
  const offers = (node.prices ?? [])
    .map((p) => ({ p, value: price(p.amount) }))
    .filter((o) => o.value)
    .map(({ p, value }) => ({ '@type': 'Offer', name: p.label, price: value, priceCurrency: 'CHF', category: 'Fees' }));
  return {
    '@type': 'Course',
    name: node.title ?? node.label,
    description,
    url: `${SITE_URL}${node.path}/`,
    ...(node.image ? { image: absolute(node.image) } : {}),
    inLanguage: 'fr',
    provider: { '@id': `${SITE_URL}/#organization` },
    ...(offers.length ? { offers } : {}),
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'Onsite',
      location: { '@id': `${SITE_URL}/#organization` },
    },
  };
}

function eventLd(event: EventItem, description: string, dates: { start: string; end: string }): object {
  const offer = event.prices?.[0] ?? (event.price ? { amount: event.price, label: '' } : undefined);
  const value = offer ? price(offer.amount) : undefined;
  return {
    '@type': 'Event',
    name: event.title,
    description,
    startDate: dates.start,
    endDate: dates.end,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    url: `${SITE_URL}${event.path}/`,
    image: absolute(event.gallery?.[0] ?? event.image ?? DEFAULT_IMAGE),
    location: {
      '@type': 'Place',
      name: event.details?.[0] ?? event.cardTitle[1],
      address: event.location ?? event.cardTitle[1],
    },
    organizer: { '@id': `${SITE_URL}/#organization` },
    ...(value ? { offers: { '@type': 'Offer', price: value, priceCurrency: 'CHF', url: `${SITE_URL}/contact/` } } : {}),
  };
}
