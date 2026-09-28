import { Injectable } from '@angular/core';
import { CATALOG } from '../content/catalog';
import { COURSE_DETAILS } from '../content/course-details.generated';
import { EVENTS } from '../content/events';
import { CatalogNode, EventItem, NavItem } from '../models/content.models';

/**
 * Catalogue with migrated course details applied. Fields set explicitly in `catalog.ts`
 * win over the generated ones, so individual pages can still be overridden by hand.
 */
const withDetails = (node: CatalogNode): CatalogNode => ({
  ...COURSE_DETAILS[node.path],
  ...node,
  children: node.children?.map(withDetails),
});

const RESOLVED_CATALOG = CATALOG.map(withDetails);

export function flattenCatalog(nodes: CatalogNode[] = RESOLVED_CATALOG): CatalogNode[] {
  return nodes.flatMap((node) => [node, ...flattenCatalog(node.children ?? [])]);
}

const toNav = (node: CatalogNode): NavItem => ({
  label: node.label,
  path: node.path,
  children: node.children?.filter((c) => !c.hiddenInNav).map(toNav),
});

@Injectable({ providedIn: 'root' })
export class ContentService {
  private readonly byPath = new Map(flattenCatalog().map((node) => [node.path, node]));
  private readonly parentOf = new Map(
    flattenCatalog().flatMap((node) => (node.children ?? []).map((c) => [c.path, node] as const)),
  );

  readonly navigation: NavItem[] = [
    { label: 'Accueil', path: '/' },
    ...RESOLVED_CATALOG.filter((n) => !n.hiddenInNav).map(toNav),
  ];

  readonly events: EventItem[] = EVENTS;
  /** Évènements page: club outings and one-off events. */
  readonly clubEvents = EVENTS.filter((e) => e.kind === 'sortie');
  /** Voyages page. */
  readonly voyages = EVENTS.filter((e) => e.kind === 'voyage');
  /** Homepage “Les évènements à venir” row. */
  readonly homeEvents = EVENTS.filter((e) => e.onHome);

  node(path: string): CatalogNode | undefined {
    return this.byPath.get(path);
  }

  parent(path: string): CatalogNode | undefined {
    return this.parentOf.get(path);
  }

  event(path: string): EventItem | undefined {
    return EVENTS.find((e) => e.path === path);
  }

  /**
   * “PLUS DE COURS” for a course page: the hand-picked list from the original page when there is
   * one, otherwise siblings first, then the rest of the catalogue.
   */
  relatedCourses(path: string, count = 5): CatalogNode[] {
    const curated = this.node(path)?.related;
    if (curated?.length) {
      return curated.map((p) => this.node(p)).filter((n): n is CatalogNode => !!n).slice(0, count);
    }
    const siblings = this.parent(path)?.children ?? [];
    const pool = [...siblings, ...flattenCatalog()].filter(
      (n, i, all) => n.kind === 'course' && n.path !== path && all.indexOf(n) === i,
    );
    return pool.slice(0, count);
  }
}
