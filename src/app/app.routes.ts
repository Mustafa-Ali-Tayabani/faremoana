import { Routes } from '@angular/router';
import { EVENTS } from './core/content/events';
import { SITE } from './core/content/site';
import { flattenCatalog } from './core/services/content.service';

/** Paths that have a dedicated page component instead of the generic catalogue page. */
const DEDICATED = new Set(['/evenements', '/voyages', '/contact']);

const pageTitle = (title: string) => `${title} – ${SITE.name}`;

const catalogRoutes: Routes = flattenCatalog()
  .filter((node) => !DEDICATED.has(node.path))
  .map((node) => ({
    path: node.path.slice(1),
    title: pageTitle(node.title ?? node.label),
    data: { path: node.path },
    loadComponent: () =>
      import('./pages/catalog/catalog-page.component').then((m) => m.CatalogPageComponent),
  }));

const eventRoutes: Routes = EVENTS.filter((event) => event.path).map((event) => ({
  path: event.path!.slice(1),
  title: pageTitle(event.title),
  data: { path: event.path },
  loadComponent: () =>
    import('./pages/events/event-detail.component').then((m) => m.EventDetailComponent),
}));

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    title: SITE.tagline,
    loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'evenements',
    title: pageTitle('Évènements'),
    loadComponent: () =>
      import('./pages/events/events-page.component').then((m) => m.EventsPageComponent),
  },
  {
    path: 'voyages',
    title: pageTitle('Nos voyages'),
    loadComponent: () =>
      import('./pages/events/voyages-page.component').then((m) => m.VoyagesPageComponent),
  },
  {
    path: 'contact',
    title: pageTitle('Contact'),
    loadComponent: () =>
      import('./pages/contact/contact-page.component').then((m) => m.ContactPageComponent),
  },
  ...eventRoutes,
  ...catalogRoutes,
  {
    path: '**',
    title: pageTitle('Page introuvable'),
    loadComponent: () =>
      import('./pages/not-found/not-found.component').then((m) => m.NotFoundComponent),
  },
];
