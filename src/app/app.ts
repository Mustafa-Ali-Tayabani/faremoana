import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './layout/footer/footer.component';
import { HeaderComponent } from './layout/header/header.component';
import { BackToTopComponent } from './shared/motion/back-to-top.component';
import { CursorComponent } from './shared/motion/cursor.component';
import { ScrollProgressComponent } from './shared/motion/scroll-progress.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, CursorComponent, ScrollProgressComponent, BackToTopComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-scroll-progress />
    <app-header />
    <main id="content" tabindex="-1">
      <router-outlet />
    </main>
    <app-footer />
    <app-back-to-top />
    <app-cursor />
  `,
  styles: `main { display: block; outline: none; }`,
})
export class App {}
