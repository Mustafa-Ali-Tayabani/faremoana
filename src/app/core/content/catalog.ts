import { CatalogNode } from '../models/content.models';

/**
 * Site catalogue: every category and course page, in menu order.
 * Routes and the main navigation are generated from this tree.
 *
 * Copy below is placeholder text — replace it with the final content.
 */

const course = (path: string, label: string, extra: Partial<CatalogNode> = {}): CatalogNode => ({
  path,
  label,
  kind: 'course',
  ...extra,
});

const LOISIR = '/formations-loisirs';

export const CATALOG: CatalogNode[] = [
  {
    path: LOISIR,
    label: 'Plongée loisir',
    title: 'Formations loisirs',
    kind: 'category',
    intro: [
      'Que vous fassiez vos premières bulles ou que vous souhaitiez aller plus loin, nos formations loisirs couvrent tous les niveaux PADI.',
      'Choisissez votre parcours ci-dessous : enfants, débutants, avancés, spécialités ou remise à niveau.',
    ],
    listTitle: 'Nos parcours',
    heroImage: 'images/heroes/formations-loisirs.webp',
    chartImage: { src: 'images/misc/padi-pathway.webp', alt: 'Parcours de formation PADI', width: 768 },
    children: [
      {
        path: `${LOISIR}/enfants`,
        label: 'Enfants',
        title: 'Formations enfants',
        kind: 'category',
        heroImage: 'images/heroes/enfants.webp',
        intro: [
          'Des programmes ludiques et encadrés pour faire découvrir le monde sous-marin aux plus jeunes, en piscine et en toute sécurité.',
        ],
        listTitle: 'Brevets Enfants',
        children: [
          course(`${LOISIR}/enfants/padi-bubblemaker`, 'PADI Bubblemaker'),
          course(`${LOISIR}/enfants/padi-seal-team`, 'PADI Seal Team'),
          course(`${LOISIR}/enfants/padi-master-seal-team`, 'PADI Master Seal Team'),
        ],
      },
      {
        path: `${LOISIR}/debutants`,
        label: 'Débutants',
        title: 'Formations débutants',
        kind: 'category',
        heroImage: 'images/heroes/default.webp',
        introImages: [{ src: 'images/misc/padi-elearning-logo.webp', alt: 'PADI eLearning', width: 270 }],
        intro: [
          'Vous n’avez jamais plongé ? C’est le bon endroit pour commencer.',
          'Nous proposons toute l’année plusieurs cursus pour débuter, du baptême en piscine jusqu’au premier brevet autonome.',
          'La partie théorique peut se faire à votre rythme grâce au PADI eLearning.',
        ],
        listTitle: 'Brevets Débutants',
        children: [
          course(
            `${LOISIR}/debutants/padi-discover-scuba-diving-piscine-initiation`,
            'PADI Discover Scuba Diving (Piscine)',
            { title: 'PADI Discover Scuba Diving (Piscine) – Initiation' },
          ),
          course(
            `${LOISIR}/debutants/padi-discover-scuba-diving-lac-initiation`,
            'PADI Discover Scuba Diving (Lac)',
            { title: 'PADI Discover Scuba Diving (Lac) – Initiation' },
          ),
          course(`${LOISIR}/debutants/padi-scuba-diver`, 'PADI Scuba Diver'),
          course(`${LOISIR}/debutants/padi-open-water-diver`, 'PADI Open Water Diver'),
        ],
      },
      {
        path: `${LOISIR}/avances`,
        label: 'Avancés',
        title: 'Formations avancées',
        kind: 'category',
        heroImage: 'images/heroes/avances.webp',
        introImages: [{ src: 'images/misc/padi-elearning-logo.webp', alt: 'PADI eLearning', width: 270 }],
        intro: [
          'Déjà certifié ? Gagnez en expérience, en autonomie et en confiance avec nos formations de niveau avancé.',
        ],
        listTitle: 'Brevets Avancés',
        children: [
          course(`${LOISIR}/avances/padi-dld-plongee-guidee`, 'PADI DLD (Plongée Guidée)'),
          course(`${LOISIR}/avances/padi-adventure-diver`, 'PADI Adventure Diver'),
          course(`${LOISIR}/avances/padi-advanced-open-water-diver`, 'PADI Advanced Open Water Diver'),
          course(`${LOISIR}/avances/padi-rescue-diver`, 'PADI Rescue Diver'),
          course(`${LOISIR}/padi-master-scuba-diver`, 'PADI Master Scuba Diver'),
        ],
      },
      {
        path: `${LOISIR}/specialites-padi`,
        label: 'Spécialités PADI',
        kind: 'category',
        heroImage: 'images/heroes/specialites.webp',
        introImages: [{ src: 'images/misc/padi-elearning-logo.webp', alt: 'PADI eLearning', width: 270 }],
        intro: [
          'Les spécialités vous permettent d’approfondir un domaine précis de la plongée : nitrox, flottabilité, nuit, épave, altitude…',
        ],
        listTitle: 'Spécialités',
        children: [
          course(`${LOISIR}/specialites-padi/padi-enriched-air-diver-nitrox`, 'PADI Enriched Air Diver (Nitrox)'),
          course(`${LOISIR}/specialites-padi/padi-combinaison-etanche`, 'PADI Combinaison étanche'),
          course(`${LOISIR}/specialites-padi/padi-orientation-sous-marine`, 'PADI Orientation sous-marine'),
          course(`${LOISIR}/specialites-padi/padi-maitrise-de-la-flottabilite`, 'PADI Maîtrise de la flottabilité'),
          course(`${LOISIR}/specialites-padi/padi-plongee-profonde`, 'PADI Plongée Profonde'),
          course(`${LOISIR}/specialites-padi/padi-plongee-de-nuit`, 'PADI Plongée de nuit'),
          course(
            `${LOISIR}/specialites-padi/padi-recherche-et-recuperation-dobjets`,
            'PADI Recherche et récup. d’objets',
            { title: 'PADI Recherche et récupération d’objets' },
          ),
          course(`${LOISIR}/specialites-padi/padi-plongee-en-altitude`, 'PADI Plongée en altitude'),
          course(`${LOISIR}/specialites-padi/padi-plongee-sous-glace`, 'PADI Plongée sous glace'),
          course(`${LOISIR}/specialites-padi/padi-parachute-de-palier`, 'PADI Parachute de palier'),
          course(`${LOISIR}/specialites-padi/padi-plongee-sur-epave`, 'PADI Plongée sur épave'),
        ],
      },
      {
        path: `${LOISIR}/remise-a-niveau`,
        label: 'Remise à niveau',
        kind: 'category',
        heroImage: 'images/heroes/remise-a-niveau.webp',
        introImages: [{ src: 'images/misc/padi-elearning-logo.webp', alt: 'PADI eLearning', width: 270 }],
        intro: ['Vous n’avez pas plongé depuis un moment ? Reprenez vos marques avec un encadrement adapté.'],
        listTitle: 'Remise à niveau',
        children: [
          course(`${LOISIR}/remise-a-niveau/padi-reactivate-piscine`, 'PADI ReActivate (Piscine)'),
          course(`${LOISIR}/remise-a-niveau/refresh-en-lac`, 'Refresh en Lac'),
        ],
      },
      {
        path: `${LOISIR}/theorie-en-ligne-e-learning`,
        label: 'Théorie en ligne e-Learning',
        kind: 'page',
        title: 'Théorie en ligne e-Learning',
        heroImage: 'images/heroes/elearning.webp',
        intro: [
          'Avec le PADI eLearning, vous étudiez la théorie de votre formation en ligne, où et quand vous le souhaitez.',
          'Vous arrivez ensuite au centre prêt pour la pratique : piscine et plongées en milieu naturel.',
        ],
        sections: [
          {
            heading: 'Comment ça marche ?',
            bullets: [
              'Inscrivez-vous auprès du centre pour recevoir votre accès',
              'Suivez les modules sur ordinateur, tablette ou smartphone',
              'Téléchargez les contenus pour étudier hors connexion',
              'Planifiez ensuite vos sessions pratiques avec nous',
            ],
          },
        ],
        feature: {
          logo: 'images/misc/padi-elearning-logo.webp',
          photo: 'images/misc/elearning-photo.webp',
          ctaLabel: 'Commencer maintenant',
          ctaLink: 'https://www.padi.com/fr/padi-elearning',
        },
      },
    ],
  },
  {
    path: '/formations-pro',
    label: 'Plongée Pro',
    title: 'Formations professionnelles',
    kind: 'category',
    heroImage: 'images/heroes/formations-pro.webp',
    introImages: [{ src: 'images/misc/pro-image.webp', alt: 'PADI Pro', width: 420 }],
    intro: ['Faites de votre passion un métier : du Divemaster à l’instructeur, nous organisons des IDC tout au long de l’année.'],
    listTitle: 'Brevets Pro',
    children: [
      course('/formations-pro/padi-divemaster', 'PADI Divemaster'),
      course('/formations-pro/padi-open-water-scuba-instructor-idc', 'PADI Open Water Scuba Instructor'),
      course('/formations-pro/padi-master-scuba-diver-trainer', 'PADI Master Scuba Diver Trainer'),
      course('/formations-pro/padi-idc-staff-instructor', 'PADI IDC Staff Instructor'),
    ],
  },
  {
    path: '/formations-tec',
    label: 'Plongée Tec',
    title: 'Formations Tec',
    kind: 'category',
    heroImage: 'images/heroes/formations-tec.webp',
    introImages: [{ src: 'images/misc/tec-banner.webp', alt: 'PADI TecRec', width: 220 }],
    chartImage: { src: 'images/misc/tec-flowchart.webp', alt: 'Parcours PADI TecRec', width: 900 },
    intro: ['Découvrez la plongée technique : décompression, mélanges et configurations avancées.'],
    listTitle: 'Brevets Tec',
    children: [
      course('/formations-tec/padi-discover-tec-diving', 'PADI Discover Tec Diving'),
      course('/formations-tec/padi-tec-40', 'PADI Tec 40'),
      course('/formations-tec/padi-tec-45', 'PADI Tec 45'),
      course('/formations-tec/padi-tec-50', 'PADI Tec 50'),
      course('/formations-tec/padi-tec-trimix-65', 'PADI Trimix 65'),
      course('/formations-tec/padi-tec-trimix', 'PADI Trimix Diver'),
      course('/formations-tec/padi-tec-sidemount', 'PADI Tec Sidemount'),
      course('/formations-tec/padi-tec-gas-blender-nitrox', 'PADI Gas Blender Nitrox'),
    ],
  },
  {
    path: '/secourisme',
    label: 'Secourisme',
    kind: 'category',
    heroImage: 'images/heroes/secourisme.webp',
    introImages: [{ src: 'images/misc/secourisme-image.webp', alt: 'PADI Emergency First Response', width: 320 }],
    intro: ['Apprenez les gestes qui sauvent, sous l’eau comme à terre.'],
    listTitle: 'Formations secourisme',
    children: [
      course('/secourisme/padi-emergency-first-response', 'PADI Emergency First Response'),
      course('/secourisme/padi-oxygen-provider', 'PADI Oxygen Provider'),
      course('/secourisme/padi-efr-instructor', 'PADI EFR Instructor'),
    ],
  },
  {
    path: '/voyages',
    label: 'Voyages',
    title: 'Nos voyages',
    kind: 'page',
    heroImage: 'images/heroes/voyages.webp',
    intro: ['Partez plonger avec le club dans les plus belles destinations du monde.'],
    cards: 'voyages',
  },
  {
    path: '/evenements',
    label: 'Évènements',
    kind: 'page',
  },
  {
    path: '/services',
    label: 'Services',
    kind: 'page',
    heroImage: 'images/heroes/services.webp',
    cards: 'children',
    children: [
      {
        path: '/services/le-club',
        label: 'Le Club',
        kind: 'page',
        layout: 'detail',
        eyebrow: 'SERVICES',
        image: 'images/misc/club-logo.webp',
        cardImage: 'images/heroes/club.webp',
        heroImage: 'images/heroes/club.webp',
        cardText: 'Rejoins le club et partage sorties, voyages et moments conviviaux avec d’autres passionnés.',
        intro: [
          'Le club Fare Moana réunit plongeurs, familles et amis autour de sorties, de voyages et de moments conviviaux tout au long de l’année.',
        ],
        sections: [
          {
            heading: 'Les avantages du club',
            bullets: [
              'Sorties club en lac et en mer',
              'Tarifs préférentiels sur la location de matériel',
              'Réductions sur les formations et les voyages',
              'Accès aux entraînements en piscine',
              'Évènements et soirées du club',
            ],
          },
        ],
        priceBox: {
          title: 'COTISATION ANNUELLE',
          rows: [
            { label: 'Individuelle', amount: 'CHF 120' },
            { label: 'En duo', amount: 'CHF 200' },
          ],
          cta: { label: 'Formulaire d’inscription', link: '/contact' },
        },
        showElearning: true,
      },
      {
        path: '/services/gonflage',
        label: 'Gonflage',
        kind: 'page',
        image: 'images/services/gonflage.webp',
        heroImage: 'images/heroes/gonflage.webp',
        cardText: 'Gonflage Air 230 et 300 bars pendant les heures d’ouverture.',
        intro: [
          'Pendant les heures d’ouverture, nous gonflons vos bouteilles de plongée à l’air, en 230 ou 300 bars.',
          'Contactez-nous pour vérifier la disponibilité avant de passer au centre.',
        ],
        priceBox: {
          title: 'GONFLAGE À L’UNITÉ AIR',
          rows: [
            { label: 'Gonflage 230 b. moins de 5 litres', amount: 'CHF 6' },
            { label: 'Gonflage 230 b. 5 à 15 litres', amount: 'CHF 12' },
            { label: 'Gonflage 230 b. plus de 15 litres', amount: 'CHF 15' },
            { label: 'Gonflage 300 b. 1 à 24 litres', amount: 'CHF 15' },
          ],
          cta: { label: 'Contactez-nous', link: '/contact' },
        },
        showElearning: true,
      },
      {
        path: '/services/location',
        label: 'Location',
        kind: 'page',
        image: 'images/services/location.webp',
        heroImage: 'images/heroes/location.webp',
        cardText: 'Location de matériel de plongée loisir : tout ce dont vous avez besoin pour plonger.',
        sections: [
          {
            heading: 'LE MATÉRIEL DE PLONGÉE',
            paragraphs: [
              'Tout le matériel nécessaire pour plonger est disponible à la location : équipement complet ou pièces à l’unité.',
            ],
          },
          {
            heading: 'DES CONDITIONS SUR MESURE',
            paragraphs: ['Location à la journée, au week-end ou à la semaine. Pensez à réserver à l’avance pour les périodes chargées.'],
          },
          {
            heading: 'LES AVANTAGES DU CLUB',
            paragraphs: ['Les membres du club bénéficient d’un rabais de 50 % sur la location de matériel.'],
          },
        ],
        priceTable: {
          title: 'LOCATION MATÉRIEL DE PLONGÉE',
          columns: ['', 'Articles', 'Jour', 'Week-end', '1 semaine'],
          rows: [
            ['01', 'Gilet', 'CHF 20', 'CHF 30', 'CHF 50'],
            ['02', 'Détendeur, octopus, manomètre et profondimètre', 'CHF 25', 'CHF 35', 'CHF 60'],
            ['03', 'Combinaison humide', 'CHF 20', 'CHF 30', 'CHF 50'],
            ['04', 'Combinaison étanche, cagoule, tuyau, gants étanches compris', 'CHF 80', 'CHF 120', 'CHF 200'],
            ['05', 'Sous-combinaison', 'CHF 10', 'CHF 15', 'CHF 30'],
            ['06', 'Gants étanches', 'CHF 10', 'CHF 20', 'CHF 40'],
            ['07', 'Ordinateur', 'CHF 10', 'CHF 20', 'CHF 50'],
            ['08', 'Lampe', 'CHF 20', 'CHF 30', 'CHF 50'],
            ['09', 'Premier étage supplémentaire', 'CHF 10', 'CHF 15', 'CHF 25'],
            ['10', 'Équipement complet humide (N° 01-02-03-11-17)', 'CHF 80', 'CHF 100', 'CHF 130'],
            ['11', 'Plombs et ceinture', 'CHF 10', 'CHF 15', 'CHF 25'],
            ['12', 'Masque et tuba', 'CHF 10', 'CHF 15', 'CHF 30'],
            ['13', 'Palmes', 'CHF 5', 'CHF 10', 'CHF 20'],
            ['14', 'Chaussons', 'CHF 5', 'CHF 10', 'CHF 20'],
            ['15', 'Gants', 'CHF 5', 'CHF 10', 'CHF 20'],
            ['16', 'PMT complet (N° 12 à 15)', 'CHF 20', 'CHF 30', 'CHF 80'],
            ['17', 'Bouteille Air', 'CHF 15', 'CHF 25', 'CHF 40'],
            ['18', 'Parachute de palier', 'CHF 15', 'CHF 20', 'CHF 50'],
            ['19', 'Adaptateur DIN/INT', 'CHF 5', 'CHF 8', 'CHF 15'],
          ],
        },
      },
      {
        path: '/services/partenaires',
        label: 'Partenaires',
        title: 'Partenaires',
        heroTitle: 'Partenaires',
        kind: 'page',
        image: 'images/services/partenaires.webp',
        heroImage: 'images/heroes/partenaires.webp',
        cardText: 'Les organisations et marques avec lesquelles nous travaillons.',
        partners: [
          { name: 'INTO THE BLUE', text: 'Partenaire pour les formations et l’accompagnement des futurs professionnels.', logo: 'images/partners/into-the-blue.webp' },
          { name: 'PADI', text: 'Organisme de formation à la plongée le plus répandu au monde.', url: 'https://www.padi.com', logo: 'images/partners/padi.webp' },
          { name: 'DAN EUROPE', text: 'Assurance et assistance médicale spécialisées pour les plongeurs.', url: 'https://www.daneurope.org', logo: 'images/partners/dan.webp' },
          { name: 'AQUALUNG', text: 'Fabricant de matériel de plongée.', url: 'https://www.aqualung.com', logo: 'images/partners/aqualung.webp' },
          { name: 'PISCINE DE THÔNEX', text: 'Bassin utilisé pour nos cours et entraînements en milieu protégé.', logo: 'images/partners/thonex.webp' },
          { name: 'ABYSSWORLD', text: 'Agence spécialisée dans les voyages plongée.', url: 'https://www.abyssworld.com', logo: 'images/partners/abyssworld.webp' },
          { name: 'ULTRAMARINA', text: 'Voyagiste spécialisé dans les séjours et croisières plongée.', url: 'https://www.ultramarina.com', logo: 'images/partners/ultramarina.webp' },
        ],
      },
      { path: '/contact', label: 'Contact', kind: 'page' },
    ],
  },
];
