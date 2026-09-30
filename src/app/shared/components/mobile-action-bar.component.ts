import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SITE } from '../../core/content/site';
import { IconComponent } from './icon.component';

/**
 * Phones only: sticky bottom bar on course and event pages so “call” and “sign up”
 * stay one tap away while reading. Hidden on tablets and desktop.
 */
@Component({
  selector: 'app-mobile-action-bar',
  imports: [RouterLink, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="spacer" aria-hidden="true"></div>
    <div class="bar" role="region" aria-label="Actions rapides">
      <a class="call" [href]="phone" aria-label="Appeler Fare Moana"><app-icon name="phone" [size]="20" /></a>
      @if (price()) {
        <span class="price">{{ price() }}</span>
      }
      <a class="btn btn-filled cta" [routerLink]="ctaLink()">{{ ctaLabel() }} <app-icon name="arrow-right" /></a>
    </div>
  `,
  styles: `
    :host { display: none; }
    @media (max-width: 767px) {
      :host { display: block; }
      .spacer { height: calc(72px + env(safe-area-inset-bottom)); }
      .bar {
        position: fixed;
        inset: auto 0 0;
        z-index: 40;
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px var(--gutter) calc(10px + env(safe-area-inset-bottom));
        background: var(--c-white);
        box-shadow: 0 -4px 18px rgba(0, 0, 0, 0.1);
      }
      .call {
        display: grid;
        place-items: center;
        flex: none;
        width: 48px;
        height: 48px;
        border: 1px solid var(--c-accent);
        border-radius: 50%;
        color: var(--c-accent);
      }
      .price { color: var(--c-ink); font: 600 16px / 1.2 var(--font-heading); white-space: nowrap; }
      .cta { flex: 1; justify-content: space-between; }
    }
  `,
})
export class MobileActionBarComponent {
  readonly ctaLabel = input('S’inscrire');
  readonly ctaLink = input('/contact');
  /** Optional price shown next to the button (e.g. “dès CHF 550”). */
  readonly price = input<string | undefined>();

  protected readonly phone = SITE.phone.href;
}
