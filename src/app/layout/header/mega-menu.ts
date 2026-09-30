import { CatalogNode, NavItem } from '../../core/models/content.models';

export interface MegaLink {
  label: string;
  path: string;
  /** Thumbnail for tile panels. */
  image?: string;
  /** e.g. “dès CHF 550”. */
  price?: string;
}

export interface MegaGroup {
  title: string;
  path: string;
  links: MegaLink[];
}

export interface MegaFeature {
  title: string;
  text: string;
  image?: string;
  path: string;
}

/**
 * One top-level entry of the desktop menu.
 * - `link`: plain link (Accueil, Voyages, Évènements)
 * - `groups`: columns of categories with their courses (Plongée loisir)
 * - `tiles`: grid of course tiles with thumbnail and price (Pro, Tec, Secourisme, Services)
 */
export interface MegaEntry {
  label: string;
  path: string;
  kind: 'link' | 'groups' | 'tiles';
  groups: MegaGroup[];
  /** Standalone links shown under the groups (e.g. e-Learning). */
  extras: MegaLink[];
  tiles: MegaLink[];
  feature?: MegaFeature;
}

type Lookup = (path: string) => CatalogNode | undefined;

/** Lowest price of a course, formatted like the price boxes (“dès CHF 470”). */
function fromPrice(node: CatalogNode | undefined): string | undefined {
  const prices = (node?.prices ?? node?.priceBox?.rows ?? [])
    .map((p) => ({ label: p.amount, value: Number(p.amount.replace(/[^\d]/g, '')) }))
    .filter((p) => p.value > 0)
    .sort((a, b) => a.value - b.value);
  if (!prices.length) return undefined;
  return (prices.length > 1 ? 'dès ' : '') + prices[0].label;
}

function feature(item: NavItem, node: CatalogNode | undefined): MegaFeature {
  const text =
    node?.intro?.find((p) => p.length > 40) ??
    node?.cardText ??
    'Découvrez toutes nos formations et services au centre PADI 5* IDC de Genève.';
  return { title: node?.title ?? item.label, text, image: node?.heroImage ?? node?.image, path: item.path };
}

export function buildMegaMenu(nav: NavItem[], lookup: Lookup): MegaEntry[] {
  return nav.map((item) => {
    const base: MegaEntry = { label: item.label, path: item.path, kind: 'link', groups: [], extras: [], tiles: [] };
    const children = item.children ?? [];
    if (!children.length) return base;

    const node = lookup(item.path);
    const nested = children.filter((c) => c.children?.length);

    if (nested.length) {
      return {
        ...base,
        kind: 'groups',
        groups: nested.map((g) => ({
          title: g.label,
          path: g.path,
          links: (g.children ?? []).map((c) => ({ label: c.label.replace(/\s+/g, ' '), path: c.path })),
        })),
        extras: children.filter((c) => !c.children?.length).map((c) => ({ label: c.label, path: c.path })),
        feature: feature(item, node),
      };
    }

    return {
      ...base,
      kind: 'tiles',
      tiles: children.map((c) => {
        const child = lookup(c.path);
        return {
          label: c.label,
          path: c.path,
          image: child?.cardImage ?? child?.image ?? child?.heroImage,
          price: fromPrice(child),
        };
      }),
      feature: feature(item, node),
    };
  });
}
