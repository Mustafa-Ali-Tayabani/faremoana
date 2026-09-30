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
import { IconComponent } from '../components/icon.component';

const RADIUS = 22;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * Floating “back to top” button (bottom right). Appears after the first screen of scrolling;
 * the ring around it fills with the scroll progress. Scroll handling runs outside Angular.
 */
@Component({
  selector: 'app-back-to-top',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button type="button" (click)="toTop()" aria-label="Retour en haut de la page">
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <circle class="track" cx="24" cy="24" [attr.r]="radius" />
        <circle #ring class="ring" cx="24" cy="24" [attr.r]="radius" [attr.stroke-dasharray]="circumference" [attr.stroke-dashoffset]="circumference" />
      </svg>
      <app-icon name="arrow-right" [size]="18" />
    </button>
  `,
  styles: `
    :host {
      position: fixed;
      right: 22px;
      bottom: calc(22px + env(safe-area-inset-bottom));
      z-index: 45;
      opacity: 0;
      visibility: hidden;
      transform: translateY(16px) scale(0.9);
      transition: opacity 0.3s ease, transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), visibility 0s linear 0.3s;
    }
    :host(.visible) { opacity: 1; visibility: visible; transform: none; transition-delay: 0s; }
    button {
      position: relative;
      display: grid;
      place-items: center;
      width: 52px;
      height: 52px;
      padding: 0;
      border: 0;
      border-radius: 50%;
      background: var(--c-card-ink);
      color: var(--c-white);
      box-shadow: 0 12px 30px -10px rgba(9, 27, 64, 0.6);
      cursor: pointer;
      transition: background-color 0.25s, color 0.25s, transform 0.25s;
      &:hover { background: var(--c-accent); color: var(--c-card-ink); transform: translateY(-3px); }
    }
    app-icon { transform: rotate(-90deg); }
    svg { position: absolute; inset: 2px; width: 48px; height: 48px; transform: rotate(-90deg); }
    circle { fill: none; stroke-width: 2.5; }
    .track { stroke: rgba(255, 255, 255, 0.15); }
    .ring { stroke: var(--c-accent); stroke-linecap: round; }
    button:hover .ring { stroke: var(--c-card-ink); }

    /* Phones: sit above the sticky “S’inscrire” bar when a page has one. */
    @media (max-width: 767px) {
      :host { right: 14px; bottom: calc(14px + env(safe-area-inset-bottom)); }
      :host-context(body:has(app-mobile-action-bar)) { bottom: calc(86px + env(safe-area-inset-bottom)); }
      button { width: 46px; height: 46px; }
      svg { inset: 1px; width: 44px; height: 44px; }
    }
  `,
})
export class BackToTopComponent {
  protected readonly radius = RADIUS;
  protected readonly circumference = CIRCUMFERENCE;
  private readonly ring = viewChild.required<ElementRef<SVGCircleElement>>('ring');

  constructor() {
    if (!isPlatformBrowser(inject(PLATFORM_ID))) return;
    const host = inject(ElementRef<HTMLElement>).nativeElement as HTMLElement;
    const zone = inject(NgZone);
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const ring = this.ring().nativeElement;
      let frame = 0;
      const update = () => {
        frame = 0;
        const max = document.documentElement.scrollHeight - innerHeight;
        const progress = max > 0 ? Math.min(1, scrollY / max) : 0;
        ring.style.strokeDashoffset = String(CIRCUMFERENCE * (1 - progress));
        // Phones: step aside once the footer (with its own “Haut de page” link) is on screen,
        // so the button never covers the footer buttons.
        const footer = document.querySelector('app-footer');
        const overFooter = innerWidth < 768 && !!footer && footer.getBoundingClientRect().top < innerHeight - 60;
        host.classList.toggle('visible', scrollY > innerHeight * 0.8 && !overFooter);
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

  protected toTop(): void {
    const smooth = !matchMedia('(prefers-reduced-motion: reduce)').matches;
    scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' });
  }
}
