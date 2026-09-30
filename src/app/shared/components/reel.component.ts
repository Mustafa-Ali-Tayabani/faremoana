import { ChangeDetectionStrategy, Component, input, signal, viewChild } from '@angular/core';
import { SOCIAL_LINKS } from '../../core/content/site';
import { AutoplayVideoComponent } from './autoplay-video.component';
import { IconComponent } from './icon.component';

const DOUBLE_TAP_MS = 280;

/**
 * Instagram-Reels style video card: story progress bar, profile row with a gradient ring,
 * action icons on the right, caption and sound line at the bottom.
 * Tap to play / pause, double-tap to like (heart burst). Links point to the Instagram profile.
 */
@Component({
  selector: 'app-reel',
  imports: [AutoplayVideoComponent, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './reel.component.html',
  styleUrl: './reel.component.scss',
})
export class ReelComponent {
  readonly src = input.required<string>();
  readonly poster = input<string>();
  readonly caption = input('');
  readonly tags = input<string[]>([]);
  readonly avatar = input.required<string>();

  protected readonly player = viewChild.required(AutoplayVideoComponent);
  protected readonly instagram = SOCIAL_LINKS.find((s) => s.network === 'instagram')?.url ?? '#';
  protected readonly handle = this.instagram.replace(/\/$/, '').split('/').pop() ?? 'faremoana';

  protected readonly liked = signal(false);
  protected readonly saved = signal(false);
  /** Increments on each double-tap so the heart burst animation restarts. */
  protected readonly burst = signal(0);

  private tapTimer: ReturnType<typeof setTimeout> | undefined;

  protected onTap(): void {
    if (this.tapTimer) {
      // Second tap within the window: like instead of pausing.
      clearTimeout(this.tapTimer);
      this.tapTimer = undefined;
      this.liked.set(true);
      this.burst.update((n) => n + 1);
      return;
    }
    this.tapTimer = setTimeout(() => {
      this.tapTimer = undefined;
      this.player().toggle();
    }, DOUBLE_TAP_MS);
  }

  protected toggleLike(event: Event): void {
    event.stopPropagation();
    this.liked.update((v) => !v);
  }

  protected toggleSave(event: Event): void {
    event.stopPropagation();
    this.saved.update((v) => !v);
  }
}
