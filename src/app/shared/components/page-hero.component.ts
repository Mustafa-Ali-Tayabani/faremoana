import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ParallaxDirective } from '../motion/parallax.directive';
import { MediaComponent } from './media.component';

/**
 * Full-width banner with a centred uppercase title, used at the top of inner pages.
 * It extends under the fixed transparent header (the top --header-h is reserved),
 * so the visible banner keeps its original height. Background has a subtle parallax.
 */
@Component({
  selector: 'app-page-hero',
  imports: [MediaComponent, ParallaxDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-wrap">
      <app-media class="bg" [src]="image() ?? 'images/heroes/default.webp'" [eager]="true" [appParallax]="0.3" />
    </div>
    <h1>{{ title() }}</h1>
  `,
  styles: `
    :host {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      height: calc(400px + var(--header-h));
      padding-top: var(--header-h);
      overflow: hidden;
      background: var(--c-navy-deep);
    }
    .bg-wrap { position: absolute; inset: 0; overflow: hidden; }
    /* Taller than the banner so the parallax shift never reveals an edge. */
    .bg { position: absolute; inset: -12% 0; }
    .bg-wrap::after {
      content: '';
      position: absolute;
      inset: 0;
      /* Soft dark fade at the top keeps the transparent header readable */
      background: linear-gradient(180deg, rgba(3, 12, 30, 0.6) 0%, rgba(3, 12, 30, 0.25) calc(var(--header-h) + 40px), rgba(3, 12, 30, 0) 45%), var(--overlay-banner);
    }
    h1 {
      position: relative;
      margin: 0;
      padding: 0 var(--gutter);
      color: var(--c-white);
      font: 600 var(--fs-hero-title) / 1.3 var(--font-heading);
      text-transform: uppercase;
      text-align: center;
      text-shadow: 0 2px 16px rgba(0, 0, 0, 0.25);
      animation: hero-title 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
    }
    @keyframes hero-title {
      from { opacity: 0; transform: translateY(24px); letter-spacing: 0.08em; }
      to { opacity: 1; transform: none; }
    }
    @media (max-width: 767px) { :host { height: calc(260px + var(--header-h)); } }
    @media (prefers-reduced-motion: reduce) { h1 { animation: none; } }
  `,
})
export class PageHeroComponent {
  readonly title = input.required<string>();
  readonly image = input<string>();
}
