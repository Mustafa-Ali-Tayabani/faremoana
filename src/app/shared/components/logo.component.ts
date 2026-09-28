import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { SITE } from '../../core/content/site';

/** Brand logo from `public/images/brand/logo.webp`, with a text wordmark fallback. */
@Component({
  selector: 'app-logo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (!failed()) {
      <img [src]="src" [alt]="name" (error)="failed.set(true)" />
    } @else {
      <span class="wordmark"><strong>Fare</strong><strong>Moana</strong><small>Centre de Plongée</small></span>
    }
  `,
  styles: `
    :host { display: inline-flex; align-items: center; }
    img { display: block; height: 100%; width: auto; max-width: 100%; object-fit: contain; }
    .wordmark {
      display: flex;
      flex-direction: column;
      align-items: center;
      color: var(--c-brand-blue);
      font-family: var(--font-heading);
      line-height: 1;
    }
    strong { font-size: 26px; font-weight: 700; }
    small { margin-top: 4px; font-size: 10px; font-weight: 500; }
  `,
})
export class LogoComponent {
  protected readonly src = SITE.logo;
  protected readonly name = SITE.name;
  protected readonly failed = signal(false);
}
