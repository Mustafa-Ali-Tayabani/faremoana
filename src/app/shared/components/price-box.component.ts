import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Price } from '../../core/models/content.models';
import { IconComponent } from './icon.component';

/** Turquoise-bordered price list with a tag icon and a filled CTA pill. */
@Component({
  selector: 'app-price-box',
  imports: [RouterLink, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-icon name="tag" [size]="30" />
    <h3>{{ title() }}</h3>
    @for (price of rows(); track price.label) {
      <div class="row">
        <span>{{ price.label }}</span>
        <strong>{{ price.amount }}</strong>
      </div>
      @if (price.note) {
        <p class="note">-> {{ price.note }}</p>
      }
    } @empty {
      <p class="note center">Tarifs sur demande</p>
    }
    <a class="btn btn-filled" [routerLink]="ctaLink()">{{ ctaLabel() }}</a>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 36px 12%;
      border: 3px solid var(--c-accent);
      background: var(--c-white);
    }
    app-icon { color: var(--c-accent); }
    h3 { margin: 10px 0 20px; color: var(--c-ink); font: 600 16px / 1.4 var(--font-heading); text-align: center; }
    .row {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      width: 100%;
      margin-top: 18px;
      font: 300 15px / 1.5 var(--font-body);
      strong { font: 600 18px / 1.3 var(--font-heading); white-space: nowrap; }
    }
    .note { align-self: stretch; margin: 6px 0 0; font: 300 14px / 1.6 var(--font-body); }
    .note.center { align-self: center; margin: 20px 0 30px; }
    .btn { margin-top: 36px; padding: 16px 36px; }
    @media (max-width: 767px) { :host { padding: 30px 20px; } }
  `,
})
export class PriceBoxComponent {
  readonly title = input('PRIX');
  readonly rows = input<Price[]>([]);
  readonly ctaLabel = input('S’inscrire');
  readonly ctaLink = input('/contact');
}
