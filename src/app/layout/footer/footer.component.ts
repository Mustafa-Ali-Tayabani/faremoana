import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SITE, SOCIAL_LINKS } from '../../core/content/site';
import { IconComponent } from '../../shared/components/icon.component';
import { LogoComponent } from '../../shared/components/logo.component';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, IconComponent, LogoComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  protected readonly site = SITE;
  protected readonly socials = SOCIAL_LINKS;
  protected readonly year = new Date().getFullYear();
}
