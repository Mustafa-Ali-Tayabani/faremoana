import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../shared/components/icon.component';
import { PageHeroComponent } from '../../shared/components/page-hero.component';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink, PageHeroComponent, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-hero title="Page introuvable" />
    <div class="container box">
      <p>La page demandée n’existe pas ou a été déplacée.</p>
      <a class="btn btn-filled" routerLink="/">Retour à l’accueil <app-icon name="arrow-left" /></a>
    </div>
  `,
  styles: `.box { padding: 70px var(--gutter) 90px; text-align: center; } p { margin: 0 0 28px; }`,
})
export class NotFoundComponent {}
