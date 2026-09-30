import { HeroSlide, Reason, ServiceTeaser } from '../models/content.models';

export const HERO_SLIDES: HeroSlide[] = [
  {
    eyebrow: 'DÉCOUVRE',
    title: 'L’univers de la plongée',
    subtitle: 'Passe tes premiers brevets et explore le monde sous-marin.',
    link: '/formations-loisirs',
    image: 'images/home/slide-decouvre.webp',
  },
  {
    eyebrow: 'APPRENDS',
    title: 'Débutant ou plongeur confirmé',
    subtitle: 'Des formations pour tous les niveaux, toute l’année, dans notre centre PADI 5* IDC à Genève.',
    link: '/formations-pro',
    image: 'images/home/slide-apprends.webp',
  },
  {
    eyebrow: 'EXPLORE',
    title: 'Voyage à travers le monde',
    subtitle: 'Sorties club et voyages plongée organisés tout au long de l’année.',
    link: '/evenements',
    image: 'images/home/slide-explore.webp',
  },
];

export const PROMO_BACKGROUND = 'images/home/promo-bg.webp';
export const SERVICES_BACKGROUND = 'images/home/services-bg.webp';
export const DEPTHS_BACKGROUND = 'images/home/why-bg.webp';
export const VIDEOS_BACKGROUND = 'images/home/videos-bg.webp';

export const WELCOME = {
  eyebrow: 'BIENVENUE A FARE MOANA',
  title: ['Centre de plongée', 'PADI 5* IDC à Genève'],
  paragraphs: [
    'Fare Moana (« la Maison de l’Océan » en polynésien) est un centre de plongée PADI 5* IDC situé à Thônex, près de Genève.',
    'Depuis 2011, nous formons des plongeurs de tous niveaux : enfants dès 8 ans, loisirs, plongée technique et formations professionnelles jusqu’à l’instructeur.',
  ],
  partners: [
    { name: 'PADI', logo: 'images/brand/padi.webp', height: 52 },
    { name: 'DAN Business Partner', logo: 'images/brand/dan.webp', height: 60 },
    { name: 'Project AWARE', logo: 'images/brand/aware.webp', height: 55 },
  ],
  video: {
    src: 'videos/welcome.mp4',
    poster: 'videos/welcome-poster.jpg',
    caption: 'Immersion au Léman avec le club 🌊',
    tags: ['plongée', 'padi', 'genève'],
  },
};

export const SERVICES: ServiceTeaser[] = [
  { title: 'Formations', link: '/formations-loisirs', image: 'images/home/service-formations.webp' },
  { title: 'Pro', link: '/formations-pro', image: 'images/home/service-pro.webp' },
  { title: 'Secourisme', link: '/secourisme', image: 'images/home/service-secourisme.webp' },
  { title: 'Voyages', link: '/voyages', image: 'images/home/service-voyages.webp' },
  { title: 'Club', link: '/services/le-club', image: 'images/home/service-club.webp' },
];

export const REASONS: Reason[] = [
  {
    title: 'Expérience et professionnalisme',
    text: 'Des instructeurs certifiés et passionnés, qui vous accompagnent à chaque étape.',
  },
  {
    title: 'Équipement de qualité',
    text: 'Du matériel entretenu et renouvelé régulièrement, pour plonger sereinement.',
  },
  {
    title: 'Emplacement idéal',
    text: 'Un centre à Genève, à proximité de nombreux sites de plongée en lac.',
  },
  {
    title: 'Ambiance conviviale',
    text: 'Une équipe accueillante et une vie de club active toute l’année.',
  },
];

/** YouTube video ids shown in the “Vidéos” section. Leave empty to hide the section. */
export const VIDEOS: { id: string; title: string; tag?: string }[] = [
  { id: 'QsaiTspKEgI', title: 'Socorro / Revillagigedo Islands', tag: 'Mexique' },
  { id: '4KqV7lcQxh0', title: 'Île Maurice – Avril 2025', tag: 'Océan Indien' },
  { id: 'C0acy1beGd0', title: 'Bonaire, Caraïbes – Avril 2024', tag: 'Caraïbes' },
];
