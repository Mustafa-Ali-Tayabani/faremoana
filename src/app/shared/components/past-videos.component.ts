import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { PastVideo } from '../../core/models/content.models';
import { RevealDirective } from '../motion/reveal.directive';
import { IconComponent } from './icon.component';
import { VideoCardComponent } from './video-card.component';

/** “Vidéos … passés” block: label, 3 video cards (player loads on click), YouTube channel button. */
@Component({
  selector: 'app-past-videos',
  imports: [IconComponent, RevealDirective, VideoCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="head" appReveal>
      <h2>{{ label() }}</h2>
      <a class="btn btn-outline" [href]="channel" target="_blank" rel="noopener">{{ buttonLabel() }} <app-icon name="youtube" /></a>
    </div>
    <ul>
      @for (v of videos(); track v.id) {
        <li appReveal><app-video-card [id]="v.id" [title]="v.caption" /></li>
      }
    </ul>
  `,
  styles: `
    :host {
      display: block;
      max-width: calc(1140px + 2 * var(--gutter));
      margin: 0 auto;
      padding: 40px var(--gutter) 100px;
    }
    .head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
      padding-top: 40px;
      border-top: 1px solid var(--c-divider);
    }
    h2 {
      margin: 0;
      color: var(--c-accent-strong);
      font: 600 16px / 24px var(--font-heading);
      letter-spacing: 3px;
      text-transform: uppercase;
    }
    ul {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 28px;
      margin: 36px 0 0;
      padding: 0;
      list-style: none;
    }
    @media (max-width: 1024px) { ul { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 767px) {
      :host { padding-bottom: 64px; }
      .head { flex-direction: column; align-items: flex-start; }
      ul { grid-template-columns: 1fr; gap: 28px; }
    }
  `,
})
export class PastVideosComponent {
  readonly label = input.required<string>();
  readonly videos = input.required<PastVideo[]>();
  readonly buttonLabel = input('Toutes les vidéos');

  protected readonly channel = 'https://www.youtube.com/faremoana';
}
