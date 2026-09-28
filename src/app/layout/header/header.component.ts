import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { ContentService } from '../../core/services/content.service';
import { SITE } from '../../core/content/site';
import { IconComponent } from '../../shared/components/icon.component';
import { LogoComponent } from '../../shared/components/logo.component';

@Component({
  selector: 'app-header',
  imports: [NgTemplateOutlet, RouterLink, RouterLinkActive, IconComponent, LogoComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  host: { '(document:keydown.escape)': 'close()' },
})
export class HeaderComponent {
  protected readonly nav = inject(ContentService).navigation;
  protected readonly site = SITE;
  protected readonly menuOpen = signal(false);
  /** Paths of submenus expanded in the mobile panel. */
  protected readonly expanded = signal<ReadonlySet<string>>(new Set());

  constructor() {
    inject(Router)
      .events.pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.close());
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
