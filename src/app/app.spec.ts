import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';
import { flattenCatalog } from './core/services/content.service';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes)],
    }).compileComponents();
  });

  it('renders header, main and footer', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('app-header')).toBeTruthy();
    expect(el.querySelector('main#content')).toBeTruthy();
    expect(el.querySelector('app-footer')?.textContent).toContain('info@faremoana.ch');
  });

  it('has a route for every catalogue page', () => {
    const paths = new Set(routes.map((r) => r.path));
    for (const node of flattenCatalog()) {
      expect(paths.has(node.path.slice(1))).toBe(true);
    }
  });
});
