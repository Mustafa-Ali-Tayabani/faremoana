import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  NgZone,
  PLATFORM_ID,
  afterNextRender,
  inject,
  viewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const INTERACTIVE = 'a, button, summary, [role="button"], input, label, iframe';

/**
 * Cursor follower for mouse users: a turquoise dot on the pointer and a ring that trails it,
 * growing over links and buttons. The native cursor stays visible. Inactive on touch
 * devices and for reduced-motion users. Animation runs outside Angular change detection.
 */
@Component({
  selector: 'app-cursor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true' },
  template: `<div class="ring" #ring></div><div class="dot" #dot></div>`,
  styles: `
    :host { position: fixed; inset: 0; z-index: 1000; pointer-events: none; }
    .dot, .ring {
      position: fixed;
      top: 0;
      left: 0;
      border-radius: 50%;
      opacity: 0;
      transition: opacity 0.25s, width 0.25s, height 0.25s, margin 0.25s, background-color 0.25s, border-color 0.25s;
      will-change: transform;
    }
    .dot { width: 6px; height: 6px; margin: -3px 0 0 -3px; background: var(--c-accent); }
    .ring { width: 34px; height: 34px; margin: -17px 0 0 -17px; border: 1.5px solid var(--c-accent); }
    :host(.visible) .dot, :host(.visible) .ring { opacity: 1; }
    :host(.hover) .ring { width: 56px; height: 56px; margin: -28px 0 0 -28px; background: rgba(41, 217, 213, 0.12); border-color: transparent; }
    :host(.hover) .dot { opacity: 0; }
    :host(.down) .ring { width: 26px; height: 26px; margin: -13px 0 0 -13px; }
  `,
})
export class CursorComponent {
  private readonly dot = viewChild.required<ElementRef<HTMLElement>>('dot');
  private readonly ring = viewChild.required<ElementRef<HTMLElement>>('ring');

  constructor() {
    if (!isPlatformBrowser(inject(PLATFORM_ID))) return;
    const host = inject(ElementRef<HTMLElement>).nativeElement as HTMLElement;
    const zone = inject(NgZone);
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const dot = this.dot().nativeElement;
      const ring = this.ring().nativeElement;
      let x = -100, y = -100, rx = -100, ry = -100, frame = 0;

      const loop = () => {
        // The ring eases towards the pointer; the dot is exact.
        rx += (x - rx) * 0.18;
        ry += (y - ry) * 0.18;
        dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
        frame = Math.abs(x - rx) + Math.abs(y - ry) > 0.2 ? requestAnimationFrame(loop) : 0;
      };
      const onMove = (e: PointerEvent) => {
        if (e.pointerType !== 'mouse') return;
        x = e.clientX;
        y = e.clientY;
        host.classList.add('visible');
        host.classList.toggle('hover', !!(e.target as Element | null)?.closest?.(INTERACTIVE));
        frame ||= requestAnimationFrame(loop);
      };
      const onLeave = () => host.classList.remove('visible');
      const onDown = () => host.classList.add('down');
      const onUp = () => host.classList.remove('down');

      zone.runOutsideAngular(() => {
        addEventListener('pointermove', onMove, { passive: true });
        addEventListener('pointerdown', onDown, { passive: true });
        addEventListener('pointerup', onUp, { passive: true });
        document.documentElement.addEventListener('mouseleave', onLeave);
      });
      destroyRef.onDestroy(() => {
        removeEventListener('pointermove', onMove);
        removeEventListener('pointerdown', onDown);
        removeEventListener('pointerup', onUp);
        document.documentElement.removeEventListener('mouseleave', onLeave);
        cancelAnimationFrame(frame);
      });
    });
  }
}
