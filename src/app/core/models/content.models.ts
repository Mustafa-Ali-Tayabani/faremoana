/**
 * Content model for the site. Every page is described by plain data in `core/content`,
 * so copy, prices and images can be edited without touching components.
 *
 * Image fields are paths relative to `public/` (e.g. `images/courses/open-water.webp`).
 * Missing files fall back to a styled placeholder (see `MediaComponent`).
 */

export interface Price {
  label: string;
  amount: string;
  note?: string;
}

export interface PriceBox {
  title: string;
  rows: Price[];
  cta?: { label: string; link: string };
}

export interface PriceTable {
  title: string;
  columns: string[];
  rows: string[][];
}

export interface TextSection {
  heading?: string;
  paragraphs?: string[];
  bullets?: string[];
}

export interface CardItem {
  title: string;
  /** Two-line title (event cards); falls back to `title`. */
  lines?: [string, string];
  text?: string;
  meta?: string;
  /** Internal route or absolute URL; cards without a link are not clickable. */
  link?: string;
  image?: string;
}

export interface Partner {
  name: string;
  text: string;
  url?: string;
  logo?: string;
}

export type CatalogKind = 'category' | 'course' | 'page';

export interface CatalogNode {
  /** Absolute URL path, without trailing slash (e.g. `/formations-loisirs/debutants`). */
  path: string;
  /** Short label used in the navigation menu. */
  label: string;
  kind: CatalogKind;
  /** Page heading; defaults to `label`. */
  title?: string;
  /** Label shown in the hero banner; defaults to `title` in uppercase. */
  heroTitle?: string;
  heroImage?: string;
  /** Card / feature image. */
  image?: string;
  /** Intro paragraphs. Short lines without final punctuation render as sub-headings. */
  intro?: string[];
  /** Bullet points shown after the intro (course programme, objectives…). */
  introList?: string[];
  /** Heading above the list of child courses on category pages. */
  listTitle?: string;
  /** Course-only fields. */
  included?: string[];
  requirements?: string[];
  prices?: Price[];
  /** YouTube video id shown next to the course intro. */
  videoId?: string;
  children?: CatalogNode[];
  /** Hide from the navigation menu while keeping the route. */
  hiddenInNav?: boolean;

  /** Short text used when this node is shown as a card on a listing page. */
  cardText?: string;
  /** Extra text blocks below the intro. */
  sections?: TextSection[];
  /** Card grid (services overview, voyages…). `'children'` renders child nodes as cards. */
  cards?: CardItem[] | 'children' | 'voyages';
  /** Turquoise-bordered price box (club fee, tank fills…). */
  priceBox?: PriceBox;
  /** Full price table (equipment rental). */
  priceTable?: PriceTable;
  partners?: Partner[];
  /** Show the PADI eLearning promo next to the price box. */
  showElearning?: boolean;

  /** Render a non-course page with the course layout (photo, video, prose, booking). */
  layout?: 'detail';
  /** Label above the title in the course layout; defaults to the parent's title. */
  eyebrow?: string;
  /** Image used when this node appears as a card (defaults to `image`). */
  cardImage?: string;
  /** Hand-picked “PLUS DE COURS” links (paths), as on the original page. */
  related?: string[];
  /** Images shown after the intro (e.g. PADI eLearning logo, Tec banner). */
  introImages?: { src: string; alt: string; width?: number }[];
  /** Large chart shown at the end of the page (PADI pathway, Tec flowchart). */
  chartImage?: { src: string; alt: string; width?: number };
  /** Logo + button column next to a photo (e-Learning page). */
  feature?: { logo: string; photo: string; ctaLabel: string; ctaLink: string };
}

export interface EventItem {
  /** Detail page path; omit for events that only link elsewhere (see `link`). */
  path?: string;
  /** Card target when it differs from `path` (e.g. a course page or an external page). */
  link?: string;
  title: string;
  /** Title split on two lines in cards, e.g. ['Sortie club', 'Quai Vevey']. */
  cardTitle: [string, string];
  /** Date shown on listing cards. */
  dateLabel: string;
  kind: 'voyage' | 'sortie';
  /** Listing card image. */
  image?: string;
  /** Shown in the homepage “Les évènements à venir” row. */
  onHome?: boolean;
  homeImage?: string;
  homeDateLabel?: string;
  /** Detail page headline (defaults to `title`). */
  headline?: string;
  intro?: string[];
  /** Photo carousel on the detail page. */
  gallery?: string[];
  /** Price shown on the homepage promo banner. */
  price?: string;
  /** Sidebar prices (voyages). */
  prices?: Price[];
  /** Sidebar “Détails” lines: place, duration, date. */
  details?: string[];
  /** Address or place used for the sidebar map. */
  location?: string;
  included?: string[];
  notIncluded?: string[];
  /** Collapsible “Conditions et inscription” block. */
  conditions?: string[];
}

export interface PastVideo {
  id: string;
  caption: string;
}

export interface HeroSlide {
  eyebrow: string;
  title: string;
  subtitle: string;
  link: string;
  image?: string;
}

export interface ServiceTeaser {
  title: string;
  link: string;
  image?: string;
  /** One-line description revealed on hover. */
  text?: string;
  /** Short highlight chips revealed on hover. */
  highlights?: string[];
}

export interface Reason {
  title: string;
  text: string;
}

export interface NavItem {
  label: string;
  path: string;
  children?: NavItem[];
}

export interface SocialLink {
  network: 'facebook' | 'youtube' | 'instagram' | 'tiktok';
  label: string;
  url: string;
}
