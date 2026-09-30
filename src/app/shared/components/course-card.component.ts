import { IconComponent } from './icon.component';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CatalogNode } from '../../core/models/content.models';
import { RevealDirective } from '../motion/reveal.directive';
import { MediaComponent } from './media.component';

/**
 * “PLUS DE COURS” card, measured on the original: 228px column with 10px padding,
 * 208×138 image (10px radius), white title tab overlapping the image by 10px,
 * outline pill button pinned to the bottom so buttons line up across cards.
 */
@Component({
  selector: 'app-course-card',
  imports: [IconComponent, RouterLink, MediaComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [RevealDirective],
  template: `
    <div class="card">
      <app-media class="thumb" [src]="course().cardImage ?? course().image" [alt]="course().label" />
      <h3>{{ course().title ?? course().label }}</h3>
      <a class="btn btn-outline btn-sm more" [routerLink]="course().path">Plus d’infos<span class="visually-hidden"> – {{ course().label }}</span> <app-icon name="arrow-right" /></a>
    </div>
  `,
  styles: `
    :host { display: flex; width: 100%; padding: 10px; }
    .card {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      padding-bottom: 20px;
      background: var(--c-white);
      border-radius: var(--radius-card);
      box-shadow: var(--shadow-card);
    }
    .thumb { width: 100%; aspect-ratio: 208 / 138; border-radius: var(--radius-card) var(--radius-card) 0 0; }
    h3 {
      position: relative;
      width: calc(100% - 34px);
      margin: -10px 0 20px;
      padding: 10px 6px 0;
      background: var(--c-white);
      border-radius: var(--radius-card) var(--radius-card) 0 0;
      color: var(--c-ink);
      font: 600 18px / 1.2 var(--font-heading);
      text-align: center;
      overflow-wrap: anywhere;
    }
    .more { margin-top: auto; max-width: calc(100% - 20px); }
  `,
})
export class CourseCardComponent {
  readonly course = input.required<CatalogNode>();
}
