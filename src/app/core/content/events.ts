import { EventItem, PastVideo } from '../models/content.models';

/**
 * Club outings (Évènements) and trips (Voyages), in the order shown on the original site.
 * Titles, dates, links, photos and map places match faremoana.ch; descriptions are placeholders.
 */
export const EVENTS: EventItem[] = [
  {
    path: "/evenements/sortie-club-chateau-de-chillon",
    title: "Sortie club Chillon",
    cardTitle: [
      "Sortie club",
      "Chillon"
    ],
    dateLabel: "Dimanche 01 Février 2026",
    kind: "sortie",
    image: "images/events/card-sortie-club-chateau-de-chillon.webp",
    gallery: [
      "images/events/sortie-club-chateau-de-chillon-1.webp",
      "images/events/sortie-club-chateau-de-chillon-2.webp",
      "images/events/sortie-club-chateau-de-chillon-3.webp",
      "images/events/sortie-club-chateau-de-chillon-4.webp",
      "images/events/sortie-club-chateau-de-chillon-5.webp",
      "images/events/sortie-club-chateau-de-chillon-6.webp"
    ],
    location: "château de Chillon",
    intro: [
      "Sortie plongée du club — Chillon. Rendez-vous sur place."
    ],
    details: [
      "Chillon",
      "1 journée",
      "Dimanche 01 Février 2026"
    ],
    included: [
      "1 plongée depuis le bord",
      "Sécurité surface"
    ],
    notIncluded: [
      "Déplacement jusqu’au site",
      "Location de matériel (possible au centre)",
      "Repas"
    ],
    conditions: [
      "Plongeur certifié, niveau adapté au site",
      "Gratuit pour les membres du club (hors location de matériel)",
      "Les accompagnants sont les bienvenus"
    ]
  },
  {
    path: "/evenements/sortie-plongee-st-disdille",
    title: "Sortie club St Disdille",
    cardTitle: [
      "Sortie club",
      "St Disdille"
    ],
    dateLabel: "Dimanche 22 mars 2026",
    kind: "sortie",
    image: "images/events/card-sortie-plongee-st-disdille.webp",
    gallery: [
      "images/events/sortie-plongee-st-disdille-1.webp",
      "images/events/sortie-plongee-st-disdille-2.webp",
      "images/events/sortie-plongee-st-disdille-3.webp",
      "images/events/sortie-plongee-st-disdille-4.webp",
      "images/events/sortie-plongee-st-disdille-5.webp",
      "images/events/sortie-plongee-st-disdille-6.webp"
    ],
    location: "102 Avenue de St-Disdille",
    intro: [
      "Sortie plongée du club — St Disdille. Rendez-vous sur place."
    ],
    details: [
      "St Disdille",
      "1 journée",
      "Dimanche 22 mars 2026"
    ],
    included: [
      "1 plongée depuis le bord",
      "Sécurité surface"
    ],
    notIncluded: [
      "Déplacement jusqu’au site",
      "Location de matériel (possible au centre)",
      "Repas"
    ],
    conditions: [
      "Plongeur certifié, niveau adapté au site",
      "Gratuit pour les membres du club (hors location de matériel)",
      "Les accompagnants sont les bienvenus"
    ]
  },
  {
    path: "/evenements/sortie-plongee-a-tougues",
    title: "Sortie club Tougues",
    cardTitle: [
      "Sortie club",
      "Tougues"
    ],
    dateLabel: "Dimanche 12 avril 2026",
    kind: "sortie",
    image: "images/events/card-sortie-plongee-a-tougues.webp",
    gallery: [
      "images/events/sortie-plongee-a-tougues-1.webp",
      "images/events/sortie-plongee-a-tougues-2.webp",
      "images/events/sortie-plongee-a-tougues-3.webp",
      "images/events/sortie-plongee-a-tougues-4.webp",
      "images/events/sortie-plongee-a-tougues-5.webp",
      "images/events/sortie-plongee-a-tougues-6.webp"
    ],
    location: "2623 Rue du Port Tougues 74140 Chens-sur-Léman France",
    intro: [
      "Sortie plongée du club — Tougues. Rendez-vous sur place."
    ],
    details: [
      "Tougues",
      "1 journée",
      "Dimanche 12 avril 2026"
    ],
    included: [
      "1 plongée depuis le bord",
      "Sécurité surface"
    ],
    notIncluded: [
      "Déplacement jusqu’au site",
      "Location de matériel (possible au centre)",
      "Repas"
    ],
    conditions: [
      "Plongeur certifié, niveau adapté au site",
      "Gratuit pour les membres du club (hors location de matériel)",
      "Les accompagnants sont les bienvenus"
    ]
  },
  {
    link: "/formations-pro/padi-open-water-scuba-instructor-idc",
    title: "IDC 2026 Deviens instructeur",
    cardTitle: [
      "IDC 2026",
      "Deviens instructeur"
    ],
    dateLabel: "Mars 2026",
    kind: "sortie",
    image: "images/events/card-padi-open-water-scuba-instructor-idc.webp"
  },
  {
    link: "/secourisme/padi-efr-instructor",
    title: "Secourisme EFR Instructeur",
    cardTitle: [
      "Secourisme",
      "EFR Instructeur"
    ],
    dateLabel: "Mars 2026",
    kind: "sortie",
    image: "images/events/card-padi-efr-instructor.webp"
  },
  {
    title: "Net’Léman Grand nettoyage du lac",
    cardTitle: [
      "Net’Léman",
      "Grand nettoyage du lac"
    ],
    dateLabel: "Dimanche 3 Mai 2026",
    kind: "sortie",
    image: "images/events/card-grand-nettoyage-du-lac.webp"
  },
  {
    path: "/evenements/sortie-club-gorges-areuse",
    title: "Sortie club Areuse",
    cardTitle: [
      "Sortie club",
      "Areuse"
    ],
    dateLabel: "Dimanche 7 juin 2026",
    kind: "sortie",
    image: "images/events/card-sortie-club-gorges-areuse.webp",
    gallery: [
      "images/events/sortie-club-gorges-areuse-1.webp",
      "images/events/sortie-club-gorges-areuse-2.webp",
      "images/events/sortie-club-gorges-areuse-3.webp",
      "images/events/sortie-club-gorges-areuse-4.webp"
    ],
    location: "Gorge de l'areuse",
    intro: [
      "Sortie plongée du club — Areuse. Rendez-vous sur place."
    ],
    details: [
      "Areuse",
      "1 journée",
      "Dimanche 7 juin 2026"
    ],
    included: [
      "1 plongée depuis le bord",
      "Sécurité surface"
    ],
    notIncluded: [
      "Déplacement jusqu’au site",
      "Location de matériel (possible au centre)",
      "Repas"
    ],
    conditions: [
      "Plongeur certifié, niveau adapté au site",
      "Gratuit pour les membres du club (hors location de matériel)",
      "Les accompagnants sont les bienvenus"
    ]
  },
  {
    path: "/evenements/sortie-plongee-hermance",
    title: "Sortie club Hermance",
    cardTitle: [
      "Sortie club",
      "Hermance"
    ],
    dateLabel: "Dimanche 5 juillet 2026",
    kind: "sortie",
    image: "images/events/card-sortie-plongee-hermance.webp",
    gallery: [
      "images/events/sortie-plongee-hermance-1.webp",
      "images/events/sortie-plongee-hermance-2.webp",
      "images/events/sortie-plongee-hermance-3.webp",
      "images/events/sortie-plongee-hermance-4.webp",
      "images/events/sortie-plongee-hermance-5.webp",
      "images/events/sortie-plongee-hermance-6.webp"
    ],
    location: "Quai d'Hermance",
    intro: [
      "Sortie plongée du club — Hermance. Rendez-vous sur place."
    ],
    details: [
      "Hermance",
      "1 journée",
      "Dimanche 5 juillet 2026"
    ],
    included: [
      "1 plongée depuis le bord",
      "Sécurité surface"
    ],
    notIncluded: [
      "Déplacement jusqu’au site",
      "Location de matériel (possible au centre)",
      "Repas"
    ],
    conditions: [
      "Plongeur certifié, niveau adapté au site",
      "Gratuit pour les membres du club (hors location de matériel)",
      "Les accompagnants sont les bienvenus"
    ]
  },
  {
    link: "https://faremoana.ch/womensdiveday/",
    title: "PADI Women’s Dive Day",
    cardTitle: [
      "PADI",
      "Women’s Dive Day"
    ],
    dateLabel: "Samedi 18 Juillet 2026",
    kind: "sortie",
    image: "images/events/card-womensdiveday.webp"
  },
  {
    path: "/evenements/sortie-plongee-boudry",
    title: "Sortie club Boudry",
    cardTitle: [
      "Sortie club",
      "Boudry"
    ],
    dateLabel: "Dimanche 30 août 2026",
    kind: "sortie",
    image: "images/events/card-sortie-plongee-boudry.webp",
    gallery: [
      "images/events/sortie-plongee-boudry-1.webp",
      "images/events/sortie-plongee-boudry-2.webp",
      "images/events/sortie-plongee-boudry-3.webp",
      "images/events/sortie-plongee-boudry-4.webp",
      "images/events/sortie-plongee-boudry-5.webp",
      "images/events/sortie-plongee-boudry-6.webp"
    ],
    location: "Route du Lac 2015 Boudry",
    intro: [
      "Sortie plongée du club — Boudry. Rendez-vous sur place."
    ],
    details: [
      "Boudry",
      "1 journée",
      "Dimanche 30 août 2026"
    ],
    included: [
      "1 plongée depuis le bord",
      "Sécurité surface"
    ],
    notIncluded: [
      "Déplacement jusqu’au site",
      "Location de matériel (possible au centre)",
      "Repas"
    ],
    conditions: [
      "Plongeur certifié, niveau adapté au site",
      "Gratuit pour les membres du club (hors location de matériel)",
      "Les accompagnants sont les bienvenus"
    ]
  },
  {
    path: "/evenements/sortie-plongee-quai-de-vevey",
    title: "Sortie club Quai Vevey",
    cardTitle: [
      "Sortie club",
      "Quai Vevey"
    ],
    dateLabel: "Dimanche 8 novembre 2026",
    kind: "sortie",
    image: "images/events/card-sortie-plongee-quai-de-vevey.webp",
    onHome: true,
    homeImage: "images/events/vevey.webp",
    homeDateLabel: "Dim. 08 Novembre 2026",
    gallery: [
      "images/events/sortie-plongee-quai-de-vevey-1.webp",
      "images/events/sortie-plongee-quai-de-vevey-2.webp",
      "images/events/sortie-plongee-quai-de-vevey-3.webp",
      "images/events/sortie-plongee-quai-de-vevey-4.webp",
      "images/events/sortie-plongee-quai-de-vevey-5.webp",
      "images/events/sortie-plongee-quai-de-vevey-6.webp"
    ],
    location: "46.459612, 6.842151",
    intro: [
      "Sortie plongée du club — Quai Vevey. Rendez-vous sur place à 10h00."
    ],
    details: [
      "Quai Vevey",
      "1 journée",
      "Dimanche 8 novembre 2026 - 10h00"
    ],
    included: [
      "1 plongée depuis le bord",
      "Sécurité surface"
    ],
    notIncluded: [
      "Déplacement jusqu’au site",
      "Location de matériel (possible au centre)",
      "Repas"
    ],
    conditions: [
      "Plongeur certifié, niveau adapté au site",
      "Gratuit pour les membres du club (hors location de matériel)",
      "Les accompagnants sont les bienvenus"
    ]
  },
  {
    path: "/evenements/sortie-plongee-a-rivaz",
    title: "Sortie club Rivaz Gare",
    cardTitle: [
      "Sortie club",
      "Rivaz Gare"
    ],
    dateLabel: "Dimanche 6 décembre 2026",
    kind: "sortie",
    image: "images/events/card-sortie-plongee-a-rivaz.webp",
    onHome: true,
    homeImage: "images/events/rivaz.webp",
    homeDateLabel: "Dim. 6 Décembre 2026",
    gallery: [
      "images/events/sortie-plongee-a-rivaz-1.webp",
      "images/events/sortie-plongee-a-rivaz-2.webp",
      "images/events/sortie-plongee-a-rivaz-3.webp",
      "images/events/sortie-plongee-a-rivaz-4.webp",
      "images/events/sortie-plongee-a-rivaz-5.webp",
      "images/events/sortie-plongee-a-rivaz-6.webp"
    ],
    location: "Route du Lac 1 1071 Rivaz Suisse",
    intro: [
      "Sortie plongée du club — Rivaz Gare. Rendez-vous sur place à 09h00."
    ],
    details: [
      "Rivaz Gare",
      "1 journée",
      "Dimanche 6 décembre 2026 - 09h00"
    ],
    included: [
      "1 plongée depuis le bord",
      "Sécurité surface"
    ],
    notIncluded: [
      "Déplacement jusqu’au site",
      "Location de matériel (possible au centre)",
      "Repas"
    ],
    conditions: [
      "Plongeur certifié, niveau adapté au site",
      "Gratuit pour les membres du club (hors location de matériel)",
      "Les accompagnants sont les bienvenus"
    ]
  },
  {
    path: "/voyages/sejour-plongee-philippines",
    title: "Safari plongée Philippines",
    cardTitle: [
      "Safari plongée",
      "Philippines"
    ],
    dateLabel: "11 au 25 Octobre 2026",
    kind: "voyage",
    image: "images/events/card-sejour-plongee-philippines.webp",
    onHome: true,
    homeImage: "images/events/philippines.webp",
    homeDateLabel: "Du 11 au 25 Octobre 2026",
    prices: [
      {
        label: "Plongeur",
        amount: "CHF 3’894"
      },
      {
        label: "Supplément chambre individuelle",
        amount: "CHF 790"
      }
    ],
    price: "CHF 3’699",
    gallery: [
      "images/events/sejour-plongee-philippines-1.webp",
      "images/events/sejour-plongee-philippines-2.webp",
      "images/events/sejour-plongee-philippines-3.webp",
      "images/events/sejour-plongee-philippines-4.webp",
      "images/events/sejour-plongee-philippines-5.webp",
      "images/events/sejour-plongee-philippines-6.webp"
    ],
    location: "Philippines",
    intro: [
      "Safari plongée philippines avec le club. Programme détaillé et inscriptions auprès du centre."
    ],
    details: [
      "Philippines",
      "15 jours / 14 nuits",
      "11 au 25 Octobre 2026"
    ],
    included: [
      "Plongées selon le programme",
      "Encadrement par le centre"
    ],
    notIncluded: [
      "Transport",
      "Assurance plongée et annulation",
      "Dépenses personnelles"
    ],
    conditions: [
      "Plongeur certifié, niveau selon les sites",
      "Assurance plongée obligatoire",
      "Places limitées : inscription conseillée au plus tôt"
    ]
  },
  {
    path: "/voyages/week-end-au-lac-de-blausee",
    title: "Week-end au Lac de Blausee",
    cardTitle: [
      "Week-end au",
      "Lac de Blausee"
    ],
    dateLabel: "28 au 29 Novembre 2026",
    kind: "voyage",
    image: "images/events/card-week-end-au-lac-de-blausee.webp",
    onHome: true,
    homeImage: "images/events/blausee.webp",
    homeDateLabel: "Du 28 au 29 Nov. 2026",
    gallery: [
      "images/events/week-end-au-lac-de-blausee-1.webp",
      "images/events/week-end-au-lac-de-blausee-2.webp",
      "images/events/week-end-au-lac-de-blausee-3.webp",
      "images/events/week-end-au-lac-de-blausee-4.webp",
      "images/events/week-end-au-lac-de-blausee-5.webp",
      "images/events/week-end-au-lac-de-blausee-6.webp"
    ],
    location: "Naturpark Blausee, 3717 Blausee-Mitholz",
    intro: [
      "Week-end au lac de blausee avec le club. Programme détaillé et inscriptions auprès du centre."
    ],
    details: [
      "Lac de Blausee",
      "Week-end",
      "28 au 29 Novembre 2026"
    ],
    included: [
      "Plongées selon le programme",
      "Encadrement par le centre"
    ],
    notIncluded: [
      "Transport",
      "Assurance plongée et annulation",
      "Dépenses personnelles"
    ],
    conditions: [
      "Plongeur certifié, niveau selon les sites",
      "Assurance plongée obligatoire",
      "Places limitées : inscription conseillée au plus tôt"
    ]
  },
  {
    path: "/voyages/week-end-sous-glace-lac-de-taney",
    title: "Week-end sous glace Lac de Taney",
    cardTitle: [
      "Week-end sous glace",
      "Lac de Taney"
    ],
    dateLabel: "26 au 28 février 2027",
    kind: "voyage",
    image: "images/events/card-week-end-sous-glace-lac-de-taney.webp",
    gallery: [
      "images/events/week-end-sous-glace-lac-de-taney-1.webp",
      "images/events/week-end-sous-glace-lac-de-taney-2.webp",
      "images/events/week-end-sous-glace-lac-de-taney-3.webp",
      "images/events/week-end-sous-glace-lac-de-taney-4.webp",
      "images/events/week-end-sous-glace-lac-de-taney-5.webp",
      "images/events/week-end-sous-glace-lac-de-taney-6.webp"
    ],
    location: "lac de Taney",
    intro: [
      "Week-end sous glace lac de taney avec le club. Programme détaillé et inscriptions auprès du centre."
    ],
    details: [
      "Lac de Taney",
      "Week-end",
      "26 au 28 février 2027"
    ],
    included: [
      "Plongées selon le programme",
      "Encadrement par le centre"
    ],
    notIncluded: [
      "Transport",
      "Assurance plongée et annulation",
      "Dépenses personnelles"
    ],
    conditions: [
      "Plongeur certifié, niveau selon les sites",
      "Assurance plongée obligatoire",
      "Places limitées : inscription conseillée au plus tôt"
    ]
  },
  {
    path: "/voyages/week-end-plongee-saint-mandrier",
    title: "Week-end plongée Saint Mandrier",
    cardTitle: [
      "Week-end plongée",
      "Saint Mandrier"
    ],
    dateLabel: "9 au 12 Septembre 2027",
    kind: "voyage",
    image: "images/events/card-week-end-plongee-saint-mandrier.webp",
    gallery: [
      "images/events/week-end-plongee-saint-mandrier-1.webp",
      "images/events/week-end-plongee-saint-mandrier-2.webp",
      "images/events/week-end-plongee-saint-mandrier-3.webp",
      "images/events/week-end-plongee-saint-mandrier-4.webp",
      "images/events/week-end-plongee-saint-mandrier-5.webp",
      "images/events/week-end-plongee-saint-mandrier-6.webp"
    ],
    location: "saint mandrier",
    intro: [
      "Week-end plongée saint mandrier avec le club. Programme détaillé et inscriptions auprès du centre."
    ],
    details: [
      "Saint Mandrier",
      "4 jours",
      "9 au 12 Septembre 2027"
    ],
    included: [
      "Plongées selon le programme",
      "Encadrement par le centre"
    ],
    notIncluded: [
      "Transport",
      "Assurance plongée et annulation",
      "Dépenses personnelles"
    ],
    conditions: [
      "Plongeur certifié, niveau selon les sites",
      "Assurance plongée obligatoire",
      "Places limitées : inscription conseillée au plus tôt"
    ]
  }
];

export const EVENT_VIDEOS: PastVideo[] = [
  { id: 'uTStog_y4HM', caption: 'PADI Women’s Dive Day' },
  { id: 'SVqh_-Suzag', caption: 'Baptêmes Casques Scaphandres' },
  { id: 'IN4VCpWlrRc', caption: 'Pour les enfants du Centre Corail des HUG' },
];

export const VOYAGE_VIDEOS: PastVideo[] = [
  { id: '4KqV7lcQxh0', caption: 'Ile Maurice - Avril 2025' },
  { id: 'C0acy1beGd0', caption: 'Bonaire, Caraïbes - Avril 2024' },
  { id: 'GqNucOMUGes', caption: 'Plongée sous glace - Val Thorens, Février 2024' },
];
