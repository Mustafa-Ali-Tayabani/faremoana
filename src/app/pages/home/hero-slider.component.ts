import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  PLATFORM_ID,
  inject,
  input,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HeroSlide } from '../../core/models/content.models';
import { IconComponent } from '../../shared/components/icon.component';
import { MediaComponent } from '../../shared/components/media.component';

const AUTOPLAY_MS = 5000;
/** Horizontal distance (px) that counts as a swipe. */
const SWIPE_THRESHOLD = 40;

/** Full-width fading slider with Ken Burns zoom, arrows, dots and touch swipe. */
@Component({
  selector: 'app-hero-slider',
  imports: [RouterLink, IconComponent, MediaComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'aria-roledescription': 'carousel',
    '(mouseenter)': 'paused.set(true)',
    '(mouseleave)': 'paused.set(false)',
    '(pointerdown)': 'swipeStart($event)',
    '(pointerup)': 'swipeEnd($event)',
    '(pointercancel)': 'swipeX = null',
  },
  template: `
    @for (slide of slides(); track slide.link; let i = $index) {
      <div
        class="slide"
        [class.active]="i === current()"
        role="group"
        aria-roledescription="slide"
        [attr.aria-label]="i + 1 + ' / ' + slides().length"
        [attr.aria-hidden]="i !== current()"
      >
        <app-media class="bg" [src]="slide.image" [eager]="i === 0" />
        <div class="content">
          <p class="eyebrow">{{ slide.eyebrow }}</p>
          <h2>{{ slide.title }}</h2>
          <p class="subtitle">{{ slide.subtitle }}</p>
          <a class="btn btn-hero" [routerLink]="slide.link" [attr.tabindex]="i === current() ? 0 : -1">En savoir plus <app-icon name="arrow-right" /></a>
        </div>
      </div>
    }
    <button type="button" class="arrow prev" (click)="go(-1)" aria-label="Diapositive précédente">
      <app-icon name="chevron-left" [size]="30" />
    </button>
    <button type="button" class="arrow next" (click)="go(1)" aria-label="Diapositive suivante">
      <app-icon name="chevron-right" [size]="30" />
    </button>
    <div class="dots">
      @for (slide of slides(); track slide.link; let i = $index) {
        <button
          type="button"
          [class.active]="i === current()"
          (click)="current.set(i)"
          [attr.aria-label]="'Diapositive ' + (i + 1)"
          [attr.aria-current]="i === current()"
        ></button>
      }
    </div>
  `,
  styleUrl: './hero-slider.component.scss',
})
export class HeroSliderComponent {
  readonly slides = input.required<HeroSlide[]>();

  protected readonly current = signal(0);
  protected readonly paused = signal(false);
  protected swipeX: number | null = null;

  constructor() {
    if (!isPlatformBrowser(inject(PLATFORM_ID))) return;
    const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;
    const timer = setInterval(() => !this.paused() && this.go(1), AUTOPLAY_MS);
    inject(DestroyRef).onDestroy(() => clearInterval(timer));
  }

  protected go(step: number): void {
    const count = this.slides().length;
    this.current.update((i) => (i + step + count) % count);
  }

  protected swipeStart(event: PointerEvent): void {
    if (event.pointerType !== 'mouse') this.swipeX = event.clientX;
  }

  protected swipeEnd(event: PointerEvent): void {
    if (this.swipeX === null) return;
    const dx = event.clientX - this.swipeX;
    this.swipeX = null;
    if (Math.abs(dx) > SWIPE_THRESHOLD) this.go(dx < 0 ? 1 : -1);
  }
}
