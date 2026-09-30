import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  PLATFORM_ID,
  afterNextRender,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Muted, looping background-style video. Nothing is downloaded until it comes near the
 * viewport; it plays only while visible and pauses when scrolled away (saves battery/data).
 * Exposes `progress`, `paused` and `toggle()` for overlays such as the reel card.
 * Reduced-motion users get the poster frame and start it themselves.
 */
@Component({
  selector: 'app-autoplay-video',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <video
      #video
      [attr.poster]="poster()"
      [attr.aria-label]="label()"
      muted
      loop
      playsinline
      disablepictureinpicture
      preload="none"
      (timeupdate)="onTime()"
      (play)="paused.set(false)"
      (pause)="paused.set(true)"
    >
      <source [attr.src]="src()" type="video/mp4" />
    </video>
  `,
  styles: `
    :host { display: block; overflow: hidden; }
    video { display: block; width: 100%; height: 100%; object-fit: cover; background: var(--c-navy); }
  `,
})
export class AutoplayVideoComponent {
  readonly src = input.required<string>();
  readonly poster = input<string>();
  readonly label = input('');

  /** 0 → 1 playback position. */
  readonly progress = signal(0);
  readonly paused = signal(true);

  private readonly video = viewChild.required<ElementRef<HTMLVideoElement>>('video');
  /** Set when the visitor pauses: scrolling back into view must not restart it. */
  private pausedByUser = false;

  constructor() {
    if (!isPlatformBrowser(inject(PLATFORM_ID))) return;
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const video = this.video().nativeElement;
      video.muted = true; // the attribute alone is not enough for autoplay in some browsers
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
        video.preload = 'metadata';
        this.pausedByUser = true;
        return;
      }
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            if (video.preload === 'none') video.preload = 'auto';
            if (!this.pausedByUser) video.play().catch(() => this.paused.set(true));
          } else {
            video.pause();
          }
        },
        { rootMargin: '200px 0px', threshold: 0.25 },
      );
      observer.observe(video);
      destroyRef.onDestroy(() => observer.disconnect());
    });
  }

  toggle(): void {
    const video = this.video().nativeElement;
    if (video.paused) {
      this.pausedByUser = false;
      if (video.preload === 'none') video.preload = 'auto';
      video.play().catch(() => this.paused.set(true));
    } else {
      this.pausedByUser = true;
      video.pause();
    }
  }

  protected onTime(): void {
    const video = this.video().nativeElement;
    if (video.duration) this.progress.set(video.currentTime / video.duration);
  }
}
