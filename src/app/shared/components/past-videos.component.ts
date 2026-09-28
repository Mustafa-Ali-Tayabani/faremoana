import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { PastVideo } from '../../core/models/content.models';

/** “Vidéos … passés” block: letter-spaced turquoise label, 3 captioned YouTube embeds, outline button. */
@Component({
  selector: 'app-past-videos',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2>{{ label() }}</h2>
    <ul>
      @for (v of embeds(); track v.id) {
        <li>
          <iframe [src]="v.url" [title]="v.caption" loading="lazy" allowfullscreen></iframe>
          <p>{{ v.caption }}</p>
        </li>
      }
    </ul>
    <a class="btn btn-outline" [href]="channel" target="_blank" rel="noopener">{{ buttonLabel() }}</a>
  `,
  styles: `
    :host { display: flex; flex-direction: column; align-items: center; padding: 30px 0 80px; }
    h2 {
      margin: 0 0 70px;
      color: var(--c-accent);
      font: 600 18px / 24px var(--font-heading);
      letter-spacing: 3.5px;
      text-transform: uppercase;
    }
    ul {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      width: 100%;
      max-width: 1297px;
      margin: 0 0 60px;
      padding: 0 var(--gutter);
      list-style: none;
    }
    iframe { display: block; width: 100%; aspect-ratio: 419 / 235; border: 0; border-radius: var(--radius-card); background: var(--c-black); }
    p { margin: 18px 0 0; color: var(--c-ink); font: 600 14px / 18.2px var(--font-heading); }
    .btn { padding: 12px 34px; }
    @media (max-width: 767px) {
      h2 { margin-bottom: 30px; text-align: center; }
      ul { grid-template-columns: 1fr; gap: 28px; margin-bottom: 36px; }
    }
  `,
})
export class PastVideosComponent {
  private readonly sanitizer = inject(DomSanitizer);

  readonly label = input.required<string>();
  readonly videos = input.required<PastVideo[]>();
  readonly buttonLabel = input('Toutes les vidéos');

  protected readonly channel = 'https://www.youtube.com/faremoana';
  protected readonly embeds = computed(() =>
    this.videos().map((v) => ({
      ...v,
      url: this.sanitizer.bypassSecurityTrustResourceUrl(
        `https://www.youtube-nocookie.com/embed/${encodeURIComponent(v.id)}`,
      ),
    })),
  );
}
