import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { IconComponent } from './icon.component';

/**
 * Lightweight YouTube card: shows the video thumbnail, a play button and the title.
 * The YouTube player (≈1 MB of scripts per embed) is only loaded when the card is clicked,
 * then plays immediately in place.
 */
@Component({
  selector: 'app-video-card',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="frame">
      @if (playing()) {
        <iframe
          [src]="embedUrl()"
          [title]="title()"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      } @else {
        <button type="button" class="poster" (click)="playing.set(true)" [attr.aria-label]="'Lire la vidéo : ' + title()">
          <img [src]="thumbnail()" alt="" loading="lazy" />
          <span class="play"><app-icon name="play" [size]="22" /></span>
          @if (tag()) {
            <span class="tag">{{ tag() }}</span>
          }
        </button>
      }
    </div>
    <div class="meta">
      <h3>{{ title() }}</h3>
      <a class="yt" [href]="'https://www.youtube.com/watch?v=' + id()" target="_blank" rel="noopener">
        <app-icon name="youtube" [size]="16" /> YouTube
      </a>
    </div>
  `,
  styles: `
    :host { display: block; }
    .frame {
      position: relative;
      aspect-ratio: 16 / 9;
      overflow: hidden;
      border-radius: 18px;
      background: var(--c-navy-deep);
      box-shadow: 0 18px 40px -18px rgba(9, 27, 64, 0.45);
    }
    iframe { display: block; width: 100%; height: 100%; border: 0; }
    .poster {
      position: absolute;
      inset: 0;
      padding: 0;
      border: 0;
      background: none;
      cursor: pointer;
      img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.7s cubic-bezier(0.22, 1, 0.36, 1); }
      &::after {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(180deg, rgba(3, 12, 30, 0) 40%, rgba(3, 12, 30, 0.55));
        transition: opacity 0.3s;
      }
    }
    .play {
      position: absolute;
      top: 50%;
      left: 50%;
      z-index: 1;
      display: grid;
      place-items: center;
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.92);
      color: var(--c-card-ink);
      translate: -50% -50%;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), background-color 0.3s;
      app-icon { margin-left: 3px; }
      /* Pulsing ring */
      &::before {
        content: '';
        position: absolute;
        inset: -8px;
        border: 2px solid rgba(255, 255, 255, 0.6);
        border-radius: 50%;
        animation: ring 2.2s ease-out infinite;
      }
    }
    @keyframes ring { from { transform: scale(0.85); opacity: 1; } to { transform: scale(1.35); opacity: 0; } }
    .tag {
      position: absolute;
      left: 14px;
      bottom: 14px;
      z-index: 1;
      padding: 5px 10px;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.9);
      color: var(--c-card-ink);
      font: 600 11px / 1 var(--font-body);
      letter-spacing: 1px;
      text-transform: uppercase;
    }
    .poster:hover img, .poster:focus-visible img { transform: scale(1.06); }
    .poster:hover .play, .poster:focus-visible .play { transform: scale(1.1); background: var(--c-accent); }

    .meta { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; padding: 16px 4px 0; }
    h3 { margin: 0; color: var(--c-card-ink); font: 600 16px / 1.35 var(--font-heading); }
    .yt {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      flex: none;
      padding: 4px 0;
      color: #6b7489;
      font: 500 12.5px / 1 var(--font-body);
      text-decoration: none;
      transition: color 0.2s;
      app-icon { color: #ff0033; }
      &:hover { color: var(--c-card-ink); }
    }
    @media (prefers-reduced-motion: reduce) { .play::before { animation: none; } }
  `,
})
export class VideoCardComponent {
  readonly id = input.required<string>();
  readonly title = input.required<string>();
  /** Small label on the thumbnail (e.g. the destination). */
  readonly tag = input<string>();

  private readonly sanitizer = inject(DomSanitizer);
  protected readonly playing = signal(false);
  protected readonly thumbnail = computed(() => `https://i.ytimg.com/vi/${encodeURIComponent(this.id())}/hqdefault.jpg`);
  protected readonly embedUrl = computed(() =>
    this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube-nocookie.com/embed/${encodeURIComponent(this.id())}?autoplay=1&rel=0`,
    ),
  );
}
