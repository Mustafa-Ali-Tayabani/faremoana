import { DOCUMENT, Directive, ElementRef, PLATFORM_ID, afterNextRender, inject, input } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/** Elements waiting to be revealed, shared by every instance on the page. */
const pending = new Set<Element>();
let observer: IntersectionObserver | undefined;
let listening = false;
let frame = 0;

function reveal(el: Element): void {
  el.classList.add('is-revealed');
  pending.delete(el);
  observer?.unobserve(el);
}

/**
 * Safety net for fast scrolling: an IntersectionObserver can miss an element that jumps
 * from below the viewport to above it between two frames. On scroll, anything that has
 * reached the viewport (or been scrolled past) is revealed.
 */
function sweep(): void {
  frame = 0;
  const limit = innerHeight * 0.95;
  for (const el of pending) if (el.getBoundingClientRect().top < limit) reveal(el);
}

function track(el: Element): void {
  pending.add(el);
  observer ??= new IntersectionObserver(
    (entries) => { for (const entry of entries) if (entry.isIntersecting) reveal(entry.target); },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
  );
  observer.observe(el);
  if (!listening) {
    listening = true;
    const onScroll = () => { frame ||= requestAnimationFrame(sweep); };
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll, { passive: true });
  }
}

/**
 * Fades and slides an element in the first time it scrolls into view.
 * Siblings in a grid are staggered automatically (80ms apart). Content stays visible
 * without JavaScript and in the prerendered HTML: the hidden state only applies once
 * the browser has marked <html> with `.motion-ready` (see styles.scss).
 *
 * Usage: `<section appReveal>` or `<div appReveal="left">` (up | left | right | zoom | fade).
 */
@Directive({
  selector: '[appReveal]',
  host: { '[attr.data-reveal]': 'appReveal() || "up"' },
})
export class RevealDirective {
  readonly appReveal = input<'' | 'up' | 'left' | 'right' | 'zoom' | 'fade'>('');

  constructor() {
    const el = inject(ElementRef<HTMLElement>).nativeElement as HTMLElement;
    const doc = inject(DOCUMENT);
    if (!isPlatformBrowser(inject(PLATFORM_ID))) return;

    afterNextRender(() => {
      if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) {
        el.classList.add('is-revealed');
        return;
      }
      // Already on screen (or scrolled past) when the page renders: keep it visible, so
      // prerendered content never blinks out and back in during hydration.
      if (el.getBoundingClientRect().top < innerHeight * 0.95) {
        el.classList.add('is-revealed');
        doc.documentElement.classList.add('motion-ready');
        return;
      }
      doc.documentElement.classList.add('motion-ready');

      // Stagger cards that sit side by side in a grid / list.
      const item = el.parentElement?.tagName === 'LI' ? el.parentElement : el;
      const siblings = item.parentElement ? Array.from(item.parentElement.children) : [];
      const index = siblings.indexOf(item);
      if (index > 0) el.style.transitionDelay = `${Math.min(index % 6, 5) * 80}ms`;
      track(el);
    });
  }
}
