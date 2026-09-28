import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MediaComponent } from './media.component';

/** Full-width banner with a centred uppercase title, used at the top of inner pages. */
@Component({
  selector: 'app-page-hero',
  imports: [MediaComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-media class="bg" [src]="image() ?? 'images/heroes/default.webp'" [eager]="true" />
    <h1>{{ title() }}</h1>
  `,
  styles: `
    :host {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 400px;
      overflow: hidden;
    }
    .bg { position: absolute; inset: 0; }
    .bg::after { content: ''; position: absolute; inset: 0; background: var(--overlay-banner); }
    h1 {
      position: relative;
      margin: 0;
      padding: 0 var(--gutter);
      color: var(--c-white);
      font: 600 var(--fs-hero-title) / 1.3 var(--font-heading);
      text-transform: uppercase;
      text-align: center;
    }
    @media (max-width: 767px) { :host { height: 260px; } }
  `,
})
export class PageHeroComponent {
  readonly title = input.required<string>();
  readonly image = input<string>();
}
