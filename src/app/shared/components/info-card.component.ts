import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CardItem } from '../../core/models/content.models';
import { MediaComponent } from './media.component';

/**
 * Listing card, measured from the original:
 * - `event`   (Évènements / Voyages): image 15px top radius, 2-line bold title, turquoise date.
 * - `service` (Services): image 20px top radius, centred title, text and “En savoir plus”.
 */
@Component({
  selector: 'app-info-card',
  imports: [NgTemplateOutlet, RouterLink, MediaComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'variant()' },
  template: `
    <ng-template #content>
      <app-media class="thumb" [src]="card().image" [alt]="card().title" />
      <div class="body">
        <h3>
          @if (card().lines; as lines) {
            {{ lines[0] }}<br />{{ lines[1] }}
          } @else {
            {{ card().title }}
          }
        </h3>
        @if (card().meta) {
          <p class="meta">{{ card().meta }}</p>
        }
        @if (card().text) {
          <p class="text">{{ card().text }}</p>
        }
        @if (variant() === 'service') {
          <span class="more">En savoir plus</span>
        }
      </div>
    </ng-template>

    @if (!card().link) {
      <div class="card"><ng-container [ngTemplateOutlet]="content" /></div>
    } @else if (external()) {
      <a class="card" [href]="card().link" target="_blank" rel="noopener"><ng-container [ngTemplateOutlet]="content" /></a>
    } @else {
      <a class="card" [routerLink]="card().link"><ng-container [ngTemplateOutlet]="content" /></a>
    }
  `,
  styles: `
    :host { display: block; height: 100%; }
    .card {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
      background: var(--c-white);
      border: 1px solid var(--c-accent);
      color: var(--c-ink);
      text-decoration: none;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    a.card:hover { transform: translateY(-4px); box-shadow: var(--shadow-card); }
    .body { display: flex; flex-direction: column; flex: 1; }
    h3 { margin: 0; color: var(--c-ink); font: 600 18px / 21.6px var(--font-heading); text-transform: uppercase; }
    p { margin: 0; }

    /* Évènements / Voyages */
    :host(.event) .card { border-radius: 15px; }
    :host(.event) .thumb { aspect-ratio: 351 / 225; }
    :host(.event) .body { padding: 30px 10px 22px 15px; }
    :host(.event) .meta { margin-top: 20px; color: var(--c-accent); font: 400 15px / 25.5px var(--font-body); }

    /* Services */
    :host(.service) .card { border-radius: 20px; }
    :host(.service) .thumb { aspect-ratio: 319 / 213; }
    :host(.service) .body { align-items: center; padding: 30px 12px; text-align: center; }
    :host(.service) .text { margin-top: 20px; font: 300 15px / 25.5px var(--font-body); }
    :host(.service) .more {
      margin-top: auto;
      padding-top: 22px;
      color: var(--c-accent);
      font: 500 15px / 15px var(--font-body);
      letter-spacing: 0.8px;
      text-decoration: underline;
    }
  `,
})
export class InfoCardComponent {
  readonly card = input.required<CardItem>();
  readonly variant = input<'event' | 'service'>('event');

  protected readonly external = computed(() => /^https?:/.test(this.card().link ?? ''));
}
