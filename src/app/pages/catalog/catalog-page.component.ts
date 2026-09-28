import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { SITE, SOCIAL_LINKS } from '../../core/content/site';
import { CardItem } from '../../core/models/content.models';
import { ContentService } from '../../core/services/content.service';
import { CourseCardComponent } from '../../shared/components/course-card.component';
import { ElearningPromoComponent } from '../../shared/components/elearning-promo.component';
import { IconComponent } from '../../shared/components/icon.component';
import { InfoCardComponent } from '../../shared/components/info-card.component';
import { MediaComponent } from '../../shared/components/media.component';
import { PageHeroComponent } from '../../shared/components/page-hero.component';
import { PriceBoxComponent } from '../../shared/components/price-box.component';

/**
 * Renders any catalogue node (category, course or simple page).
 * `path` is bound from route data (see `app.routes.ts`).
 */
@Component({
  selector: 'app-catalog-page',
  imports: [
    RouterLink,
    PageHeroComponent,
    MediaComponent,
    IconComponent,
    CourseCardComponent,
    InfoCardComponent,
    PriceBoxComponent,
    ElearningPromoComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './catalog-page.component.html',
  styleUrl: './catalog-page.component.scss',
})
export class CatalogPageComponent {
  private readonly content = inject(ContentService);
  private readonly sanitizer = inject(DomSanitizer);

  readonly path = input.required<string>();

  protected readonly node = computed(() => this.content.node(this.path())!);
  protected readonly title = computed(() => this.node().title ?? this.node().label);
  protected readonly parent = computed(() => this.content.parent(this.path()));
  protected readonly related = computed(() => this.content.relatedCourses(this.path()));
  protected readonly videoUrl = computed(() => {
    const id = this.node().videoId;
    return id
      ? this.sanitizer.bypassSecurityTrustResourceUrl(
          `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}`,
        )
      : null;
  });

  /** Cards to render, resolved from explicit items, child pages or upcoming trips. */
  protected readonly cards = computed<CardItem[]>(() => {
    const { path, cards, children = [] } = this.node();
    if (cards === 'children') {
      // Only real sub-pages: menu shortcuts such as “Contact” under Services are skipped.
      return children.filter((c) => c.path.startsWith(`${path}/`)).map((c) => ({
        title: c.title ?? c.label,
        text: c.cardText,
        link: c.path,
        image: c.cardImage ?? c.image,
      }));
    }
    if (cards === 'voyages') {
      return this.content.events
        .filter((e) => e.kind === 'voyage')
        .map((e) => ({ title: e.title, meta: e.dateLabel, link: e.path, image: e.image }));
    }
    return cards ?? [];
  });

  /** Category whose children are themselves categories (e.g. Formations loisirs) → accordion overview. */
  protected readonly isOverview = computed(
    () => this.node().children?.some((c) => c.kind === 'category') ?? false,
  );

  protected readonly socials = SOCIAL_LINKS.filter((s) => s.network !== 'youtube');
  protected readonly email = SITE.email;

  /** Migrated copy mixes sub-headings (“Description”, “Vous apprendrez :”) with paragraphs. */
  protected isSubheading(line: string): boolean {
    return line.length < 45 && !/[.!?]$/.test(line);
  }
}
