import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Dark teal PADI eLearning promo panel, shown next to price boxes. */
@Component({
  selector: 'app-elearning-promo',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a routerLink="/formations-loisirs/theorie-en-ligne-e-learning" aria-label="PADI eLearning – commencer maintenant">
      <img src="images/misc/elearning-promo.webp" alt="PADI eLearning : profitez du système de formation théorique en ligne" />
    </a>
  `,
  styles: `
    :host { display: block; background: var(--c-teal-3); }
    a { display: block; height: 100%; min-height: 300px; }
    img { display: block; width: 100%; height: 100%; object-fit: cover; }
  `,
})
export class ElearningPromoComponent {}
