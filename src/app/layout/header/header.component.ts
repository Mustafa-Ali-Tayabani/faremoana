import { NgTemplateOutlet, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  NgZone,
  PLATFORM_ID,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { ContentService } from '../../core/services/content.service';
import { SITE } from '../../core/content/site';
import { IconComponent } from '../../shared/components/icon.component';
import { LogoComponent } from '../../shared/components/logo.component';
import { SOCIAL_LINKS } from '../../core/content/site';
import { buildMegaMenu } from './mega-menu';

@Component({
  selector: 'app-header',
  imports: [NgTemplateOutlet, RouterLink, RouterLinkActive, IconComponent, LogoComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  host: {
    '(document:keydown.escape)': 'close()',
    // Transparent over the page banner; solid white with dark text once the page scrolls.
    '[class.scrolled]': 'scrolled() || menuOpen()',
  },
})
export class HeaderComponent {
  private readonly content = inject(ContentService);
  protected readonly nav = this.content.navigation;
  /** Desktop mega menu, built from the same navigation tree. */
  protected readonly mega = buildMegaMenu(this.nav, (path) => this.content.node(path));
  protected readonly socials = SOCIAL_LINKS;
  /** Hides the open mega panel right after a link inside it is clicked. */
  protected readonly suppressed = signal(false);
  protected readonly site = SITE;
  protected readonly menuOpen = signal(false);
  /** Paths of submenus expanded in the mobile panel. */
  protected readonly expanded = signal<ReadonlySet<string>>(new Set());
  protected readonly scrolled = signal(false);

  constructor() {
    if (isPlatformBrowser(inject(PLATFORM_ID))) {
      const zone = inject(NgZone);
      const destroyRef = inject(DestroyRef);
      afterNextRender(() => {
        let frame = 0;
        const update = () => {
          frame = 0;
          const next = scrollY > 24;
          // Only re-enter Angular when the state actually flips.
          if (next !== this.scrolled()) zone.run(() => this.scrolled.set(next));
        };
        const onScroll = () => { frame ||= requestAnimationFrame(update); };
        zone.runOutsideAngular(() => addEventListener('scroll', onScroll, { passive: true }));
        update();
        destroyRef.onDestroy(() => { removeEventListener('scroll', onScroll); cancelAnimationFrame(frame); });
      });
    }

    inject(Router)
      .events.pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.close());
  }

  protected suppress(): void {
    this.suppressed.set(true);
    (document.activeElement as HTMLElement | null)?.blur();
  }

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  protected close(): void {
    this.menuOpen.set(false);
    this.expanded.set(new Set());
  }

  protected toggleSubmenu(path: string): void {
    this.expanded.update((set) => {
      const next = new Set(set);
      next.has(path) ? next.delete(path) : next.add(path);
      return next;
    });
  }
}
