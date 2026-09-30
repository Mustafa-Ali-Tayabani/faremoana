import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SITE, SOCIAL_LINKS } from '../../core/content/site';
import { IconComponent } from '../../shared/components/icon.component';
import { LogoComponent } from '../../shared/components/logo.component';
import { RevealDirective } from '../../shared/motion/reveal.directive';

interface LinkGroup {
  title: string;
  links: { label: string; path: string }[];
}

@Component({
  selector: 'app-footer',
  imports: [RevealDirective, RouterLink, IconComponent, LogoComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  protected readonly site = SITE;
  protected readonly socials = SOCIAL_LINKS;
  protected readonly year = new Date().getFullYear();

  protected readonly linkGroups: LinkGroup[] = [
    {
      title: 'Formations',
      links: [
        { label: 'Plongée loisir', path: '/formations-loisirs' },
        { label: 'Débutants', path: '/formations-loisirs/debutants' },
        { label: 'Plongée Pro', path: '/formations-pro' },
        { label: 'Plongée Tec', path: '/formations-tec' },
        { label: 'Secourisme', path: '/secourisme' },
        { label: 'e-Learning', path: '/formations-loisirs/theorie-en-ligne-e-learning' },
      ],
    },
    {
      title: 'Découvrir',
      links: [
        { label: 'Voyages', path: '/voyages' },
        { label: 'Évènements', path: '/evenements' },
        { label: 'Le Club', path: '/services/le-club' },
        { label: 'Location', path: '/services/location' },
        { label: 'Gonflage', path: '/services/gonflage' },
        { label: 'Partenaires', path: '/services/partenaires' },
      ],
    },
  ];
}
