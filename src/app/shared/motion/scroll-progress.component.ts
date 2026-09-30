import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  NgZone,
  PLATFORM_ID,
  afterNextRender,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/** Thin turquoise bar at the very top showing how far the page has been scrolled. */
@Component({
  selector: 'app-scroll-progress',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true' },
  template: '',
  styles: `
    :host {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 70;
      height: 3px;
      background: var(--c-accent);
      transform: scaleX(0);
      transform-origin: 0 50%;
      pointer-events: none;
    }
  `,
})
export class ScrollProgressComponent {
  constructor() {
    if (!isPlatformBrowser(inject(PLATFORM_ID))) return;
    const host = inject(ElementRef<HTMLElement>).nativeElement as HTMLElement;
    const zone = inject(NgZone);
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      let frame = 0;
      const update = () => {
        frame = 0;
        const max = document.documentElement.scrollHeight - innerHeight;
        host.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`;
      };
      const onScroll = () => { frame ||= requestAnimationFrame(update); };
      zone.runOutsideAngular(() => {
        addEventListener('scroll', onScroll, { passive: true });
        addEventListener('resize', onScroll, { passive: true });
      });
      update();
      destroyRef.onDestroy(() => {
        removeEventListener('scroll', onScroll);
        removeEventListener('resize', onScroll);
        cancelAnimationFrame(frame);
      });
    });
  }
}
