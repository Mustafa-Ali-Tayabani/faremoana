import { DestroyRef, Directive, ElementRef, NgZone, PLATFORM_ID, afterNextRender, inject, input } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Subtle 3D tilt that follows the mouse. Writes CSS variables on the host:
 *   --rx / --ry   rotation in degrees (use in `transform: rotateX(var(--rx)) rotateY(var(--ry))`)
 *   --gx / --gy   pointer position in % (for a moving glare highlight)
 * Mouse only; disabled on touch devices and for reduced-motion users.
 */
@Directive({ selector: '[appTilt]' })
export class TiltDirective {
  /** Maximum rotation in degrees (`appTilt` alone uses the default). */
  readonly appTilt = input(7, {
    transform: (value: unknown) => (value === '' || value == null ? 7 : Number(value)),
  });

  constructor() {
    const el = inject(ElementRef<HTMLElement>).nativeElement as HTMLElement;
    if (!isPlatformBrowser(inject(PLATFORM_ID))) return;
    const zone = inject(NgZone);
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      let frame = 0;
      let px = 0.5;
      let py = 0.5;
      const apply = () => {
        frame = 0;
        const max = this.appTilt();
        el.style.setProperty('--ry', `${((px - 0.5) * 2 * max).toFixed(2)}deg`);
        el.style.setProperty('--rx', `${((0.5 - py) * 2 * max).toFixed(2)}deg`);
        el.style.setProperty('--gx', `${(px * 100).toFixed(1)}%`);
        el.style.setProperty('--gy', `${(py * 100).toFixed(1)}%`);
      };
      const onMove = (e: PointerEvent) => {
        if (e.pointerType !== 'mouse') return;
        const r = el.getBoundingClientRect();
        px = (e.clientX - r.left) / r.width;
        py = (e.clientY - r.top) / r.height;
        frame ||= requestAnimationFrame(apply);
      };
      const onLeave = () => {
        cancelAnimationFrame(frame);
        frame = 0;
        el.style.setProperty('--rx', '0deg');
        el.style.setProperty('--ry', '0deg');
      };
      zone.runOutsideAngular(() => {
        el.addEventListener('pointermove', onMove, { passive: true });
        el.addEventListener('pointerleave', onLeave, { passive: true });
      });
      destroyRef.onDestroy(() => {
        el.removeEventListener('pointermove', onMove);
        el.removeEventListener('pointerleave', onLeave);
        cancelAnimationFrame(frame);
      });
    });
  }
}
