import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SITE } from '../../core/content/site';
import { IconComponent } from '../../shared/components/icon.component';
import { PageHeroComponent } from '../../shared/components/page-hero.component';
import { RevealDirective } from '../../shared/motion/reveal.directive';

/** Contact page: centred heading, contact details and map (same layout as the original). */
@Component({
  selector: 'app-contact-page',
  imports: [RevealDirective, PageHeroComponent, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-hero title="Contact" image="images/heroes/contact.webp" />

    <section class="container contact">
      <h2 appReveal>Commence ton aventure</h2>
      <p class="intro" appReveal>
        Envie de découvrir la plongée, de passer un nouveau brevet ou de partir avec le club ? Contactez-nous
        pour préparer ensemble votre prochaine aventure sous-marine — nous nous réjouissons de vous accueillir !
      </p>

      <ul class="info" appReveal>
        <li><app-icon name="clock" [size]="22" /><span>{{ site.hours }}</span></li>
        <li>
          <app-icon name="map" [size]="22" />
          <span>
            {{ site.address[0] }} {{ site.address[1] }}<br />
            {{ site.address[2] }}<br />
            {{ site.address[3] }}
          </span>
        </li>
        <li><app-icon name="phone" [size]="22" /><a [href]="site.phone.href">{{ site.phone.label }}</a></li>
        <li><app-icon name="mail" [size]="22" /><a [href]="'mailto:' + site.email">{{ site.email }}</a></li>
      </ul>

      <iframe class="map" appReveal="zoom" [src]="mapUrl" title="Plan d’accès Fare Moana" loading="lazy"></iframe>
    </section>
  `,
  styles: `
    .contact {
      display: flex;
      flex-direction: column;
      align-items: center;
      max-width: calc(1200px + 2 * var(--gutter));
      padding-top: 50px;
      padding-bottom: 60px;
      text-align: center;
    }
    h2 { margin: 0 0 20px; color: var(--c-ink); font: 600 55px / 71.5px var(--font-heading); }
    .intro { max-width: 1040px; margin: 0 0 70px; font: 300 15px / 25.5px var(--font-body); }
    .info { margin: 0 0 90px; padding: 0; list-style: none; }
    .info li {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 22px;
      padding: 11px 0;
      font: 300 15px / 24px var(--font-copy);
    }
    .info app-icon { flex: none; color: var(--c-accent); }
    .info a { text-decoration: underline; }
    .info a:hover { color: var(--c-accent); }
    .map { display: block; width: 100%; max-width: 636px; height: 400px; border: 0; }
    @media (max-width: 767px) {
      h2 { font-size: 32px; line-height: 1.3; }
      .intro { margin-bottom: 40px; }
      .info { margin-bottom: 40px; }
      .map { height: 300px; }
    }
  `,
})
export class ContactPageComponent {
  protected readonly site = SITE;
  protected readonly mapUrl = inject(DomSanitizer).bypassSecurityTrustResourceUrl(
    'https://maps.google.com/maps?q=Chem.%20de%20Marcelly%208%2C%201226%20Th%C3%B4nex&t=m&z=12&output=embed&iwloc=near',
  );
}
