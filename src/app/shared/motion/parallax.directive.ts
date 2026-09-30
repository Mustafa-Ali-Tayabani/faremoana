import { DestroyRef, Directive, ElementRef, NgZone, PLATFORM_ID, afterNextRender, inject, input } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Subtle parallax: moves the element at a fraction of the scroll speed while its
 * container is on screen. Used on banner/slider background images.
 * Disabled for reduced-motion users. Runs outside Angular change detection.
 */
@Directive({ selector: '[appParallax]' })
export class ParallaxDirective {
  /** 0 = static, 0.3 = moves at 30% of scroll speed. */
  readonly appParallax = input(0.25);

  constructor() {
    const el = inject(ElementRef<HTMLElement>).nativeElement as HTMLElement;
    if (!isPlatformBrowser(inject(PLATFORM_ID))) return;
    const zone = inject(NgZone);
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      let frame = 0;
      const update = () => {
        frame = 0;
        const rect = (el.parentElement ?? el).getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > innerHeight) return;
        el.style.transform = `translate3d(0, ${Math.round(-rect.top * this.appParallax())}px, 0)`;
      };
      const onScroll = () => { frame ||= requestAnimationFrame(update); };
      zone.runOutsideAngular(() => addEventListener('scroll', onScroll, { passive: true }));
      update();
      destroyRef.onDestroy(() => { removeEventListener('scroll', onScroll); cancelAnimationFrame(frame); });
    });
  }
}
