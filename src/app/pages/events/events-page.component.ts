import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { EVENT_VIDEOS } from '../../core/content/events';
import { ContentService } from '../../core/services/content.service';
import { EventListingComponent } from './event-listing.component';

@Component({
  selector: 'app-events-page',
  imports: [EventListingComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-event-listing
      title="Nos évènements"
      heroImage="images/heroes/evenements.webp"
      [intro]="intro"
      [events]="events"
      videosLabel="Vidéos évènements passés"
      [videos]="videos"
      videosButton="Toutes nos vidéos"
    />
  `,
})
export class EventsPageComponent {
  protected readonly events = inject(ContentService).clubEvents;
  protected readonly videos = EVENT_VIDEOS;
  protected readonly intro = [
    'Sorties club, formations spéciales et journées à thème : retrouvez ici tous les rendez-vous de l’année, au centre et sur les sites de plongée de la région.',
    'Débutant ou plongeur expérimenté, il y a forcément une sortie pour vous — et l’occasion de rencontrer d’autres passionnés.',
  ];
}
