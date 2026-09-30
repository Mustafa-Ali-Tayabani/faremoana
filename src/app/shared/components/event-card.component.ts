import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EventItem } from '../../core/models/content.models';
import { TiltDirective } from '../motion/tilt.directive';
import { IconComponent } from './icon.component';
import { MediaComponent } from './media.component';

/**
 * Homepage event card. At rest: photo, two-line title, date.
 * On hover (desktop): the card lifts and tilts toward the pointer, the photo zooms and a frosted
 * panel rises over the photo with place, duration, price and a call to action. The panel overlays
 * the photo, so the grid never shifts. Touch devices show the details panel permanently.
 */
@Component({
  selector: 'app-event-card',
  imports: [RouterLink, MediaComponent, IconComponent, TiltDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a class="card" [routerLink]="event().link ?? event().path" appTilt="5">
      <div class="media">
        <app-media class="thumb" [src]="event().homeImage ?? event().image" [alt]="event().title" />
        <span class="badge">
          <app-icon [name]="event().kind === 'voyage' ? 'send' : 'map'" [size]="12" />
          {{ event().kind === 'voyage' ? 'Voyage' : 'Sortie club' }}
        </span>
        <span class="glare" aria-hidden="true"></span>

        <div class="panel">
          <ul class="facts">
            @if (place()) {
              <li><app-icon name="map" [size]="14" />{{ place() }}</li>
            }
            @if (duration()) {
              <li><app-icon name="clock" [size]="14" />{{ duration() }}</li>
            }
            @if (price()) {
              <li class="price"><app-icon name="tag" [size]="14" />{{ price() }}</li>
            }
          </ul>
          <span class="cta">Voir l’évènement <app-icon name="arrow-right" [size]="14" /></span>
        </div>
      </div>
      <div class="body">
        <h3>{{ event().cardTitle[0] }}<br />{{ event().cardTitle[1] }}</h3>
        <p><app-icon name="calendar" [size]="15" />{{ event().homeDateLabel ?? event().dateLabel }}</p>
      </div>
    </a>
  `,
  styles: `
    :host { display: block; height: 100%; perspective: 1000px; }

    .card {
      --rx: 0deg;
      --ry: 0deg;
      --ease: cubic-bezier(0.22, 1, 0.36, 1);
      position: relative;
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
      border: 1px solid rgba(41, 217, 213, 0.55);
      border-radius: 16px;
      background: rgba(255, 255, 255, 0.02);
      text-decoration: none;
      transform: rotateX(var(--rx)) rotateY(var(--ry)) translateZ(0);
      transition: transform 0.5s var(--ease), box-shadow 0.5s var(--ease), border-color 0.4s ease,
        background-color 0.4s ease, filter 0.4s ease;
      will-change: transform;
    }

    .media { position: relative; aspect-ratio: 16 / 10.3; overflow: hidden; }
    .thumb { position: absolute; inset: 0; transition: transform 0.9s var(--ease), filter 0.5s ease; }

    .badge {
      position: absolute;
      top: 12px;
      left: 12px;
      z-index: 2;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 10px;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.92);
      color: var(--c-card-ink);
      font: 600 11px / 1 var(--font-body);
      letter-spacing: 0.4px;
      text-transform: uppercase;
      app-icon { color: var(--c-accent-strong); }
    }

    .glare {
      position: absolute;
      inset: 0;
      z-index: 1;
      background: radial-gradient(circle at var(--gx, 50%) var(--gy, 0%), rgba(255, 255, 255, 0.3), transparent 50%);
      opacity: 0;
      transition: opacity 0.4s ease;
      pointer-events: none;
    }

    /* Frosted details panel, rises over the photo */
    .panel {
      position: absolute;
      left: 10px;
      right: 10px;
      bottom: 10px;
      z-index: 2;
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 12px 14px;
      border: 1px solid rgba(255, 255, 255, 0.25);
      border-radius: 12px;
      background: rgba(6, 20, 48, 0.62);
      -webkit-backdrop-filter: blur(12px) saturate(140%);
      backdrop-filter: blur(12px) saturate(140%);
      color: var(--c-white);
      opacity: 0;
      transform: translateY(calc(100% + 14px));
      transition: transform 0.55s var(--ease), opacity 0.35s ease;
    }
    .facts { display: flex; flex-wrap: wrap; gap: 6px 14px; margin: 0; padding: 0; list-style: none; }
    .facts li {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font: 400 12.5px / 1.3 var(--font-body);
      opacity: 0;
      transform: translateY(8px);
      transition: opacity 0.3s ease, transform 0.45s var(--ease);
      app-icon { color: var(--c-accent); }
    }
    .facts li.price { font-weight: 600; }
    .cta {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      align-self: flex-start;
      padding: 8px 14px;
      border-radius: 999px;
      background: var(--c-accent);
      color: var(--c-card-ink);
      font: 600 12px / 1 var(--font-body);
      opacity: 0;
      transform: translateY(8px);
      transition: opacity 0.3s ease, transform 0.45s var(--ease);
      app-icon { transition: transform 0.3s var(--ease); }
    }

    .body { padding: 18px 16px 22px; }
    h3 {
      margin: 0 0 12px;
      color: var(--c-white);
      font: var(--fw-event-title) var(--fs-event-title) / var(--lh-event) var(--font-feature);
      text-transform: uppercase;
      transition: color 0.3s ease;
    }
    p {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0;
      color: var(--c-accent);
      font: var(--fw-event-date) var(--fs-event-date) / var(--lh-event) var(--font-feature);
      text-transform: capitalize;
    }

    /* Hover / keyboard focus */
    @media (hover: hover) {
      .card:hover,
      .card:focus-visible {
        border-color: var(--c-accent);
        background: rgba(41, 217, 213, 0.06);
        box-shadow: 0 30px 60px -24px rgba(0, 0, 0, 0.7), 0 0 0 1px var(--c-accent), 0 0 40px -10px rgba(41, 217, 213, 0.45);
        transform: rotateX(var(--rx)) rotateY(var(--ry)) translateY(-10px) scale(1.03);

        .thumb { transform: scale(1.1); filter: saturate(1.15); }
        .glare { opacity: 1; }
        .panel { opacity: 1; transform: none; }
        .facts li, .cta { opacity: 1; transform: none; }
        .facts li:nth-child(1) { transition-delay: 0.1s; }
        .facts li:nth-child(2) { transition-delay: 0.16s; }
        .facts li:nth-child(3) { transition-delay: 0.22s; }
        .cta { transition-delay: 0.28s; }
        h3 { color: var(--c-accent); }
      }
      .card:hover .cta app-icon { transform: translateX(4px); }
      /* Other cards in the row step back */
      :host-context(ul:has(.card:hover)) .card:not(:hover) { filter: saturate(0.6) brightness(0.8); }
    }

    /* Touch devices: details always visible (compact) */
    @media (hover: none) {
      .panel, .facts li, .cta { opacity: 1; transform: none; }
      .panel { gap: 8px; padding: 10px 12px; }
      .cta { display: none; }
    }

    @media (prefers-reduced-motion: reduce) {
      .card, .thumb, .panel, .facts li, .cta { transition: none; }
    }
  `,
})
export class EventCardComponent {
  readonly event = input.required<EventItem>();

  /** details = [place, duration, date] */
  protected readonly place = computed(() => this.event().details?.[0]);
  protected readonly duration = computed(() => this.event().details?.[1]);
  protected readonly price = computed(() => {
    const e = this.event();
    const amount = e.price ?? e.prices?.[0]?.amount;
    return amount ? `dès ${amount}` : undefined;
  });
}
