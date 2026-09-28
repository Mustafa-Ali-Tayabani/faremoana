import { SocialLink } from '../models/content.models';

export const SITE = {
  name: 'Fare Moana',
  tagline: 'Centre de plongée PADI 5* IDC à Genève',
  logo: 'images/brand/logo.webp',
  badge: 'images/brand/padi-5-star-idc.webp',
  hours: 'Lundi au dimanche 09h00 à 19h00',
  address: ['FARE MOANA', 'PADI 5 STAR IDC', 'Chemin de Marcelly 8', '1226 Thônex I Suisse'],
  mapsUrl: 'https://www.google.com/maps?q=Chemin+de+Marcelly+8,+1226+Th%C3%B4nex',
  phone: { label: '+41 (0)76 493 89 15', href: 'tel:+41764938915' },
  email: 'info@faremoana.ch',
  youtubeChannel: 'https://www.youtube.com/@FareMoana',
  copyrightHolder: 'Fare Moana Sàrl',
} as const;

export const SOCIAL_LINKS: SocialLink[] = [
  { network: 'facebook', label: 'Facebook', url: 'https://www.facebook.com/faremoana2' },
  { network: 'youtube', label: 'Youtube', url: 'https://www.youtube.com/@FareMoana' },
  { network: 'instagram', label: 'Instagram', url: 'https://www.instagram.com/faremoana' },
  { network: 'tiktok', label: 'Tiktok', url: 'https://www.tiktok.com/@faremoana' },
];
