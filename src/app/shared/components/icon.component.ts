import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type IconName =
  | 'clock'
  | 'calendar'
  | 'map'
  | 'phone'
  | 'mail'
  | 'check'
  | 'tag'
  | 'chevron-left'
  | 'chevron-right'
  | 'chevron-down'
  | 'menu'
  | 'close'
  | 'arrow-right'
  | 'arrow-left'
  | 'arrow-up-right'
  | 'play'
  | 'pause'
  | 'heart'
  | 'message'
  | 'send'
  | 'bookmark'
  | 'music'
  | 'user-plus'
  | 'facebook'
  | 'youtube'
  | 'instagram'
  | 'tiktok';

/** SVG path for a circle, so every icon is a plain list of `d` strings. */
const circle = (cx: number, cy: number, r: number) =>
  `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`;

/**
 * Icons as path data rendered through the template (no innerHTML), so they also render
 * during server-side prerendering. Stroke icons use `currentColor` outlines; brand icons are filled.
 */
const STROKE: Partial<Record<IconName, string[]>> = {
  clock: [circle(12, 12, 9), 'M12 7v5l3 2'],
  calendar: ['M4 5h16a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z', 'M3 10h18M8 3v4M16 3v4'],
  map: ['M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z', 'M9 4v14M15 6v14'],
  phone: ['M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z'],
  mail: ['M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z', 'M3 6l9 7 9-7'],
  check: ['M4 12.5l5 5L20 6.5'],
  tag: ['M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9z', circle(8, 8, 1.5)],
  'chevron-left': ['M15 4l-8 8 8 8'],
  'chevron-right': ['M9 4l8 8-8 8'],
  'chevron-down': ['M5 9l7 7 7-7'],
  menu: ['M3 6h18M3 12h18M3 18h18'],
  close: ['M5 5l14 14M19 5L5 19'],
  'arrow-right': ['M4 12h15M13 6l6 6-6 6'],
  'arrow-left': ['M20 12H5M11 6l-6 6 6 6'],
  'arrow-up-right': ['M7 17L17 7M8 7h9v9'],
  heart: ['M12 20s-7-4.4-9.2-9A5 5 0 0 1 12 6.1 5 5 0 0 1 21.2 11C19 15.6 12 20 12 20z'],
  message: ['M20 12a8 8 0 0 1-11.8 7L4 20l1.1-3.9A8 8 0 1 1 20 12z'],
  send: ['M21 3L10 14', 'M21 3l-7 18-4-7-7-4z'],
  bookmark: ['M6 3h12v18l-6-4-6 4z'],
  music: ['M9 18V5l11-2v13', circle(6, 18, 3), circle(17, 16, 3)],
  'user-plus': [circle(9, 8, 4), 'M2 21c0-4 3-6 7-6s7 2 7 6M19 8v6M16 11h6'],
};

const FILL: Partial<Record<IconName, string[]>> = {
  play: ['M8 5.5v13a.8.8 0 0 0 1.2.7l10.4-6.5a.8.8 0 0 0 0-1.4L9.2 4.8A.8.8 0 0 0 8 5.5z'],
  pause: ['M7 5h3.5v14H7zM13.5 5H17v14h-3.5z'],
  facebook: [
    'M12 2a10 10 0 0 0-1.6 19.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.3v7A10 10 0 0 0 12 2z',
  ],
  youtube: [
    'M22 8.2a3 3 0 0 0-2.1-2.1C18 5.6 12 5.6 12 5.6s-6 0-7.9.5A3 3 0 0 0 2 8.2 31 31 0 0 0 1.6 12 31 31 0 0 0 2 15.8a3 3 0 0 0 2.1 2.1c1.9.5 7.9.5 7.9.5s6 0 7.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .4-3.8 31 31 0 0 0-.4-3.8zM10 15.1V8.9l5.2 3.1z',
  ],
  instagram: [
    'M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4zM17.3 5.5a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4zM12 3.8c2.7 0 3 0 4 .1 2.7.1 4 1.4 4.1 4.1.1 1 .1 1.3.1 4s0 3-.1 4c-.1 2.7-1.4 4-4.1 4.1-1 .1-1.3.1-4 .1s-3 0-4-.1c-2.7-.1-4-1.4-4.1-4.1-.1-1-.1-1.3-.1-4s0-3 .1-4C4 5.3 5.3 4 8 3.9c1 0 1.3-.1 4-.1zM12 2c-2.7 0-3.1 0-4.1.1C4.2 2.2 2.2 4.2 2.1 7.9 2 8.9 2 9.3 2 12s0 3.1.1 4.1c.1 3.7 2.1 5.7 5.8 5.8 1 .1 1.4.1 4.1.1s3.1 0 4.1-.1c3.7-.1 5.7-2.1 5.8-5.8.1-1 .1-1.4.1-4.1s0-3.1-.1-4.1c-.1-3.7-2.1-5.7-5.8-5.8C15.1 2 14.7 2 12 2z',
  ],
  tiktok: [
    'M16.6 2h-3.3v13.2a2.9 2.9 0 1 1-2-2.8V9a6.2 6.2 0 1 0 5.3 6.2V8.6a7.9 7.9 0 0 0 4.4 1.4V6.7a4.5 4.5 0 0 1-4.4-4.7z',
  ],
};

@Component({
  selector: 'app-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true', class: 'app-icon' },
  template: `
    <svg
      viewBox="0 0 24 24"
      [attr.width]="size()"
      [attr.height]="size()"
      [attr.fill]="filled() ? 'currentColor' : 'none'"
      [attr.stroke]="filled() ? 'none' : 'currentColor'"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      @for (d of paths(); track $index) {
        <path [attr.d]="d" />
      }
    </svg>
  `,
  styles: `:host { display: inline-flex; line-height: 0; }`,
})
export class IconComponent {
  readonly name = input.required<IconName>();
  readonly size = input(20);

  protected readonly filled = computed(() => this.name() in FILL);
  protected readonly paths = computed(() => FILL[this.name()] ?? STROKE[this.name()] ?? []);
}
