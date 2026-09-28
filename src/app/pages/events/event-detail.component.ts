import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  PLATFORM_ID,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { CardItem } from '../../core/models/content.models';
import { ContentService } from '../../core/services/content.service';
import { IconComponent, IconName } from '../../shared/components/icon.component';
import { InfoCardComponent } from '../../shared/components/info-card.component';
import { MobileActionBarComponent } from '../../shared/components/mobile-action-bar.component';
import { MediaComponent } from '../../shared/components/media.component';
import { PageHeroComponent } from '../../shared/components/page-hero.component';

/** Event / trip page: 840px main column + 300px sidebar (details, map, other events). */
@Component({
  selector: 'app-event-detail',
  imports: [RouterLink, PageHeroComponent, MediaComponent, IconComponent, InfoCardComponent, MobileActionBarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './event-detail.component.html',
  styleUrl: './event-detail.component.scss',
})
export class EventDetailComponent {
  private readonly content = inject(ContentService);
  private readonly sanitizer = inject(DomSanitizer);

  readonly path = input.required<string>();

  protected readonly event = computed(() => this.content.event(this.path())!);

  /** Photo carousel: two photos visible at a time on desktop. */
  protected readonly slide = signal(0);
  protected readonly gallery = computed(() => {
    const e = this.event();
    return e.gallery?.length ? e.gallery : e.image ? [e.image] : [];
  });
  /** Phones show one photo per slide, larger screens two. */
  private readonly narrow = signal(false);
  protected readonly slideCount = computed(() =>
    Math.max(1, this.gallery().length - (this.narrow() ? 0 : 1)),
  );
  protected readonly dots = computed(() => Array.from({ length: this.slideCount() }, (_, i) => i));

  constructor() {
    if (!isPlatformBrowser(inject(PLATFORM_ID))) return;
    const query = matchMedia('(max-width: 767px)');
    // Inputs are not set yet in the constructor: only record the width here.
    this.narrow.set(query.matches);
    const update = () => {
      this.narrow.set(query.matches);
      this.slide.update((i) => Math.min(i, this.slideCount() - 1));
    };
    query.addEventListener('change', update);
    inject(DestroyRef).onDestroy(() => query.removeEventListener('change', update));
  }

  /** Sidebar “Évènements / Voyages actuels”: same kind, excluding this page. */
  protected readonly others = computed<CardItem[]>(() => {
    const e = this.event();
    return (e.kind === 'voyage' ? this.content.voyages : this.content.clubEvents)
      .filter((o) => o.path && o.path !== e.path)
      .map((o) => ({ title: o.title, lines: o.cardTitle, meta: o.dateLabel, link: o.path, image: o.image }));
  });
  protected readonly other = signal(0);

  protected readonly mapUrl = computed(() => {
    const place = this.event().location;
    return place
      ? this.sanitizer.bypassSecurityTrustResourceUrl(
          `https://maps.google.com/maps?q=${encodeURIComponent(place)}&t=m&z=12&output=embed&iwloc=near`,
        )
      : null;
  });

  protected step(target: 'slide' | 'other', delta: number): void {
    if (target === 'slide') {
      const n = this.slideCount();
      this.slide.update((i) => (i + delta + n) % n);
    } else {
      const n = this.others().length;
      this.other.update((i) => (i + delta + n) % n);
    }
  }

  /** Touch swipe on the photo carousel. */
  protected swipeX: number | null = null;

  protected swipeStart(event: PointerEvent): void {
    if (event.pointerType !== 'mouse') this.swipeX = event.clientX;
  }

  protected swipeEnd(event: PointerEvent): void {
    if (this.swipeX === null) return;
    const dx = event.clientX - this.swipeX;
    this.swipeX = null;
    if (Math.abs(dx) > 40) this.step('slide', dx < 0 ? 1 : -1);
  }

  protected goToSlide(index: number): void {
    this.slide.set(index);
  }

  /** Place, duration, date. */
  protected detailIcon(index: number): IconName {
    return (['map', 'clock', 'calendar'] as const)[index] ?? 'tag';
  }
}
