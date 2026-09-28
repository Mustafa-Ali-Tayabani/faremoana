import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';

/**
 * Responsive cover image. Renders an ocean-gradient placeholder when no image is
 * configured or the file is missing, so layouts hold before real photos are added.
 */
@Component({
  selector: 'app-media',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (src() && !failed()) {
      <img
        [src]="src()"
        [attr.srcset]="srcset()"
        [attr.sizes]="srcset() ? '100vw' : null"
        [alt]="alt()"
        [attr.loading]="eager() ? 'eager' : 'lazy'"
        [attr.fetchpriority]="eager() ? 'high' : null"
        decoding="async"
        (error)="failed.set(true)"
      />
    } @else {
      <div class="placeholder" role="img" [attr.aria-label]="alt()"></div>
    }
  `,
  styles: `
    :host { display: block; overflow: hidden; position: relative; }
    img, .placeholder { display: block; width: 100%; height: 100%; object-fit: cover; }
    .placeholder {
      background:
        var(--grad-placeholder);
    }
  `,
})
export class MediaComponent {
  readonly src = input<string | undefined>();
  readonly alt = input('');
  readonly eager = input(false);

  protected readonly failed = signal(false);

  /** Full-width images (page banners, homepage slides) have an 800px variant for phones. */
  protected readonly srcset = computed(() => {
    const src = this.src();
    if (!src || !/images\/(heroes\/|home\/slide-)[^/]+\.webp$/.test(src)) return null;
    return `${src.replace(/\.webp$/, '-800.webp')} 800w, ${src} 1920w`;
  });
}
