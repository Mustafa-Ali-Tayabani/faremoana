import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { VOYAGE_VIDEOS } from '../../core/content/events';
import { ContentService } from '../../core/services/content.service';
import { EventListingComponent } from './event-listing.component';

@Component({
  selector: 'app-voyages-page',
  imports: [EventListingComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-event-listing
      title="Nos voyages"
      heroImage="images/heroes/voyages.webp"
      [events]="voyages"
      videosLabel="Vidéos voyages passés"
      [videos]="videos"
    />
  `,
})
export class VoyagesPageComponent {
  protected readonly voyages = inject(ContentService).voyages;
  protected readonly videos = VOYAGE_VIDEOS;
}
