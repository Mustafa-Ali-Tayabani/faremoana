import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Turquoise eyebrow + large heading pair used across home sections. */
@Component({
  selector: 'app-section-heading',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.light]': 'tone() === "light"' },
  template: `
    <p class="eyebrow">{{ eyebrow() }}</p>
    <h2>
      @for (line of lines(); track $index) {
        {{ line }}@if (!$last) {<br />}
      }
    </h2>
  `,
  styles: `
    :host { display: block; }
    .eyebrow {
      margin: 0 0 6px;
      color: var(--c-accent-strong);
      font: 400 var(--fs-eyebrow) / var(--lh-eyebrow) var(--font-body);
    }
    h2 { margin: 0; color: var(--c-ink); font: 600 var(--fs-h2) / var(--lh-h2) var(--font-heading); }
    :host(.light) h2 { color: var(--c-white); }
  `,
})
export class SectionHeadingComponent {
  readonly eyebrow = input.required<string>();
  readonly lines = input.required<string[]>();
  readonly tone = input<'dark' | 'light'>('dark');
}
