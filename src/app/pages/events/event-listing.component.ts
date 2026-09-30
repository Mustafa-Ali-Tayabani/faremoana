import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CardItem, EventItem, PastVideo } from '../../core/models/content.models';
import { InfoCardComponent } from '../../shared/components/info-card.component';
import { PageHeroComponent } from '../../shared/components/page-hero.component';
import { PastVideosComponent } from '../../shared/components/past-videos.component';
import { RevealDirective } from '../../shared/motion/reveal.directive';

/** Shared layout of the Évènements and Voyages pages: hero, intro, 3-column cards, past videos. */
@Component({
  selector: 'app-event-listing',
  imports: [RevealDirective, PageHeroComponent, InfoCardComponent, PastVideosComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-hero [title]="title()" [image]="heroImage()" />
    <div class="container page">
      @for (p of intro(); track $index) {
        <p class="intro" appReveal>{{ p }}</p>
      }
      <ul class="grid">
        @for (card of cards(); track card.title) {
          <li><app-info-card [card]="card" variant="event" /></li>
        }
      </ul>
    </div>
    <app-past-videos [label]="videosLabel()" [videos]="videos()" [buttonLabel]="videosButton()" />
  `,
  styles: `
    .page { max-width: calc(1120px + 2 * var(--gutter)); padding-top: 50px; }
    .intro { margin: 0 0 10px; font: 300 15px / 24px var(--font-copy); }
    .grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      max-width: 1100px;
      margin: 36px auto 60px;
      padding: 0;
      list-style: none;
    }
    @media (max-width: 1024px) { .grid { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 600px) { .grid { grid-template-columns: 1fr; } }
  `,
})
export class EventListingComponent {
  readonly title = input.required<string>();
  readonly heroImage = input.required<string>();
  readonly intro = input<string[]>([]);
  readonly events = input.required<EventItem[]>();
  readonly videosLabel = input.required<string>();
  readonly videos = input.required<PastVideo[]>();
  readonly videosButton = input('Toutes les vidéos');

  protected readonly cards = computed<CardItem[]>(() =>
    this.events().map((e) => ({
      title: e.title,
      lines: e.cardTitle,
      meta: e.dateLabel,
      link: e.link ?? e.path,
      image: e.image,
    })),
  );
}
