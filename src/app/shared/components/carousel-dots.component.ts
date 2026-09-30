import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  NgZone,
  PLATFORM_ID,
  afterNextRender,
  inject,
  input,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Dots for a horizontal scroll-snap row (used on phones, where card grids become swipeable
 * carousels). Follows the scroll position and scrolls to a card when a dot is tapped.
 * Hidden when the row does not scroll (tablet / desktop grids).
 *
 * Usage: `<ul #row class="...">…</ul> <app-carousel-dots [for]="row" />`
 */
@Component({
  selector: 'app-carousel-dots',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.active]': 'scrollable()' },
  template: `
    @for (d of dots(); track d) {
      <button
        type="button"
        [class.on]="d === current()"
        (click)="go(d)"
        [attr.aria-label]="'Élément ' + (d + 1) + ' sur ' + dots().length"
        [attr.aria-current]="d === current()"
      ></button>
    }
  `,
  styles: `
    :host { display: none; justify-content: center; gap: 2px; margin-top: 18px; }
    :host(.active) { display: flex; }
    button {
      width: 24px;
      height: 24px;
      padding: 0;
      border: 0;
      background: none;
      cursor: pointer;
      &::before {
        content: '';
        display: block;
        width: 8px;
        height: 8px;
        margin: auto;
        border-radius: 999px;
        background: currentColor;
        opacity: 0.3;
        transition: width 0.3s ease, opacity 0.3s ease, background-color 0.3s ease;
      }
      &.on::before { width: 22px; opacity: 1; background: var(--c-accent); }
    }
  `,
})
export class CarouselDotsComponent {
  readonly for = input.required<HTMLElement>();

  protected readonly dots = signal<number[]>([]);
  protected readonly current = signal(0);
  protected readonly scrollable = signal(false);

  constructor() {
    if (!isPlatformBrowser(inject(PLATFORM_ID))) return;
    const zone = inject(NgZone);
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const row = this.for();
      let frame = 0;
      const measure = () => {
        frame = 0;
        const items = Array.from(row.children) as HTMLElement[];
        const canScroll = row.scrollWidth > row.clientWidth + 4;
        const step = items.length > 1 ? items[1].offsetLeft - items[0].offsetLeft : row.clientWidth;
        // Last reachable position may show several cards at once: count positions, not cards.
        const positions = canScroll ? Math.min(items.length, Math.round((row.scrollWidth - row.clientWidth) / step) + 1) : 0;
        const index = Math.min(positions - 1, Math.round(row.scrollLeft / step));
        zone.run(() => {
          this.scrollable.set(canScroll);
          if (this.dots().length !== positions) this.dots.set(Array.from({ length: positions }, (_, i) => i));
          this.current.set(Math.max(0, index));
        });
      };
      const schedule = () => { frame ||= requestAnimationFrame(measure); };
      zone.runOutsideAngular(() => {
        row.addEventListener('scroll', schedule, { passive: true });
        addEventListener('resize', schedule, { passive: true });
      });
      measure();
      destroyRef.onDestroy(() => {
        row.removeEventListener('scroll', schedule);
        removeEventListener('resize', schedule);
        cancelAnimationFrame(frame);
      });
    });
  }

  protected go(index: number): void {
    const row = this.for();
    const items = Array.from(row.children) as HTMLElement[];
    const target = items[index];
    if (!target) return;
    const smooth = !matchMedia('(prefers-reduced-motion: reduce)').matches;
    row.scrollTo({ left: target.offsetLeft - items[0].offsetLeft, behavior: smooth ? 'smooth' : 'auto' });
  }
}
