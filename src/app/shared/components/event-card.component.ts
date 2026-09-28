import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EventItem } from '../../core/models/content.models';
import { MediaComponent } from './media.component';

@Component({
  selector: 'app-event-card',
  imports: [RouterLink, MediaComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a [routerLink]="event().link ?? event().path">
      <app-media class="thumb" [src]="event().homeImage ?? event().image" [alt]="event().title" />
      <div class="body">
        <h3>{{ event().cardTitle[0] }}<br />{{ event().cardTitle[1] }}</h3>
        <p>{{ event().homeDateLabel ?? event().dateLabel }}</p>
      </div>
    </a>
  `,
  styles: `
    a {
      display: flex;
      flex-direction: column;
      height: 100%;
      border: 1px solid var(--c-accent);
      border-radius: 10px;
      text-decoration: none;
      transition: transform 0.3s ease;
    }
    a:hover { transform: translateY(-4px); }
    .thumb { aspect-ratio: 16 / 10.3; border-radius: 10px 10px 0 0; }
    .body { padding: 18px 10px 24px; }
    h3 {
      margin: 0 0 14px;
      color: var(--c-white);
      font: var(--fw-event-title) var(--fs-event-title) / var(--lh-event) var(--font-feature);
      text-transform: uppercase;
    }
    p { margin: 0; color: var(--c-accent); font: var(--fw-event-date) var(--fs-event-date) / var(--lh-event) var(--font-feature); text-transform: capitalize; }
  `,
})
export class EventCardComponent {
  readonly event = input.required<EventItem>();
}
