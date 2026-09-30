import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  HERO_SLIDES,
  PROMO_BACKGROUND,
  REASONS,
  SERVICES,
  SERVICES_BACKGROUND,
  DEPTHS_BACKGROUND,
  VIDEOS,
  WELCOME,
} from '../../core/content/home';
import { SITE } from '../../core/content/site';
import { ContentService } from '../../core/services/content.service';
import { EventCardComponent } from '../../shared/components/event-card.component';
import { MediaComponent } from '../../shared/components/media.component';
import { SectionHeadingComponent } from '../../shared/components/section-heading.component';
import { IconComponent } from '../../shared/components/icon.component';
import { VideoCardComponent } from '../../shared/components/video-card.component';
import { ReelComponent } from '../../shared/components/reel.component';
import { RevealDirective } from '../../shared/motion/reveal.directive';
import { HeroSliderComponent } from './hero-slider.component';

@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
    HeroSliderComponent,
    SectionHeadingComponent,
    MediaComponent,
    EventCardComponent,
    ReelComponent,
    VideoCardComponent,
    IconComponent,
    RevealDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private readonly content = inject(ContentService);

  protected readonly slides = HERO_SLIDES;
  protected readonly welcome = WELCOME;
  protected readonly promoBackground = PROMO_BACKGROUND;
  protected readonly servicesBackground = SERVICES_BACKGROUND;
  protected readonly depthsBackground = DEPTHS_BACKGROUND;
  protected readonly services = SERVICES;
  protected readonly reasons = REASONS;
  protected readonly events = this.content.homeEvents;
  /** Featured trip for the promo banner: the first upcoming “voyage”. */
  protected readonly featured = this.content.voyages.find((e) => e.price);
  protected readonly youtubeChannel = SITE.youtubeChannel;
  protected readonly logo = SITE.logo;
  protected readonly videos = VIDEOS;
}
