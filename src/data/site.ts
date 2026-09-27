/* ============================================================
  CONTENU DU SITE — Eglise des Envoyés de Jésus-Christ
   ------------------------------------------------------------
   👉 Système de mise à jour simple :
   TOUT le texte, les images, les programmes, les annonces
   et les annexes sont centralisés dans ce fichier.
   Modifiez simplement les valeurs ci-dessous pour mettre le
   site à jour (aucune connaissance technique avancée requise).
   ============================================================ */

/** Construit une URL d'image Pexels à la taille souhaitée. */
export const img = (id: number, w: number, h: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=${w}&h=${h}`;

export const church = {
  name: "Eglise des Envoyés de Jésus-Christ",
  shortName: "EEJ-C",
  tagline: "Christ en vous, l'espérance de la gloire",
  verseRef: "Colossiens 1:27",
  founded: 2000,
  apostle: {
    name: "Rev. Apôtre LE BRAVE",
    role: "Fondateur & Pasteur Principal",
    photo: img(6275777, 900, 1100),
  },
  contact: {
    address: "Rue des Laurier, Gbenyedzi Alaglo — Lomé, Togo",
    addressShort: "Alaglo, Lomé",
    phone: "+228 90 10 72 00",
    phone2: "+228 07 00 00 00 00",
    email: "arnaudgadji675@gmail.com",
    hours: "Secrétariat : Lun–Ven, 9h00 – 17h00",
  },
  social: {
    facebook: "https://facebook.com",
    youtube: "https://youtube.com",
    tiktok: "https://tiktok.com",
    instagram: "https://instagram.com",
  },
};

export type NavItem = { label: string; href: string };
export const navItems: NavItem[] = [
  { label: "Accueil", href: "#accueil" },
  { label: "À propos", href: "#apropos" },
  // { label: "Messages", href: "#messages" },
  { label: "Programmes", href: "#programmes" },
  { label: "En direct", href: "#direct" },
  { label: "Annexes", href: "#annexes" },
  { label: "Contact", href: "#contact" },
];

export type Slide = {
  image: string;
  kicker: string;
  title: string;
  text: string;
};
export const slides: Slide[] = [
  {
    image: img(36425621, 1920, 1280),
    kicker: "Bienvenue à EEJ-C",
    title: "Une famille, une foi, une mission",
    text: "Rejoignez une communauté vivante où la Parole de Dieu transforme des vies, restaure les cœurs et édifie des destins.",
  },
  {
    image: img(30550589, 1920, 1280),
    kicker: "Louange & Adoration",
    title: "Élevez la gloire de Dieu",
    text: "Des cultes vibrants, une louange passionnée et la présence puissante de l'Esprit Saint au milieu de nous.",
  },
  {
    image: img(13908967, 1920, 1280),
    kicker: "Intercession & Prière",
    title: "Une maison de prière pour les nations",
    text: "Confiez-nous vos sujets de prière : Dieu exauce et accomplit de grandes choses par la foi.",
  },
];

export const heroStats = [
  { value: 20, suffix: "+", label: "Années de ministère" },
  { value: 12, suffix: "", label: "Annexes" },
  { value: 12000, suffix: "+", label: "Fidèles" },
  { value: 3, suffix: "", label: "Pays" },
];

export const about = {
  intro:
    "L'Église des Envoyés de Jésus Christ est une communauté chrétienne fondée en 2000 sur l'appel d'annoncer la bonne nouvelle à toutes les nations. Née d'un petit groupe de prière à Lomé, elle est aujourd'hui une famille de plus de 12 000 fidèles répartis dans plusieurs annexes.",
  historyTitle: "Notre histoire",
  history:
    "Tout a commencé dans un modeste salon, autour de l'Apôtre LE BRAVE et de quelques âmes affamées de Dieu. De cette communion naquit une vision claire : annoncer un Christ vivant, sauver les perdus, guérir les blessés et former des disciples. Au fil des années, l'œuvre s'est étendue au-delà des frontières, plantant des annexes au Togo, en Afrique de l'Ouest et auprès de la diaspora.",
  visionTitle: "Notre vision",
  vision:
    "« Voir toute personne transformée par l'Évangile, équipée pour son appel et envoyée pour impacter sa génération. » Nous croyons en une Église rayonnante, ungido de l'Esprit et engagée dans l'amour du prochain.",
  missionTitle: "Notre mission",
  mission:
    "Annoncer la grâce de Dieu, faire de toutes les nations des disciples, intercéder pour les malades et les affligés, et démontrer l'amour de Christ par des actions concrètes envers les plus vulnérables.",
  apostleMessageTitle: "Le mot de l'Apôtre",
  apostleMessage:
    "Bien-aimés, vous êtes chez vous à EEJ-C. Ici, peu importe votre passé : la grâce de Dieu vous accueille telle que vous êtes pour vous transformer en ce que Dieu a prévu. Venez tels que vous êtes, repartez transformés. Que la paix, la joie et la puissance du Saint-Esprit accompagnent chacun de vos pas.",
};

export type Value = { icon: string; title: string; text: string };
export const values: Value[] = [
  {
    icon: "book",
    title: "La Parole",
    text: "La Bible est notre référence absolue. Tout enseignement est ancré dans la vérité des Écritures.",
  },
  {
    icon: "heart",
    title: "L'Amour",
    text: "Nous accueillons chacun sans jugement, dans l'amour sincère du Christ.",
  },
  {
    icon: "flame",
    title: "La Prière",
    text: "Une Église qui prie est une Église qui triomphe. La prière est notre respiration.",
  },
  {
    icon: "users",
    title: "La Communion",
    text: "La famille avant tout : solidarité, entraide et fraternité entre fidèles.",
  },
];

export type Message = {
  title: string;
  date: string;
  duration: string;
  excerpt: string;
  image: string;
  scripture: string;
};
export const messages: Message[] = [
  {
    title: "Le pouvoir de la foi qui déplace les montagnes",
    date: "2 mars 2026",
    duration: "42 min",
    excerpt:
      "Une foi vivante ne regarde pas aux circonstances mais à la fidélité de Dieu. Découvrez les principes bibliques pour activer une foi qui obtient des résultats.",
    image: img(8735581, 800, 600),
    scripture: "Matthieu 17:20",
  },
  {
    title: "Marcher dans la lumière de ta destinée",
    date: "23 février 2026",
    duration: "38 min",
    excerpt:
      "Dieu a un plan précis pour votre vie. Cet enseignement vous aide à identifier votre appel et à avancer avec assurance vers votre destinée.",
    image: img(5199810, 800, 600),
    scripture: "Jérémie 29:11",
  },
  {
    title: "La prière qui obtient des réponses",
    date: "16 février 2026",
    duration: "46 min",
    excerpt:
      "Pourquoi certaines prières semblent-elles rester sans réponse ? Apprenez les clés d'une prière efficace, persévérante et conforme à la volonté de Dieu.",
    image: img(6663862, 800, 600),
    scripture: "Jacques 5:16",
  },
  {
    title: "Être rempli du Saint-Esprit",
    date: "9 février 2026",
    duration: "51 min",
    excerpt:
      "Le baptême du Saint-Esprit est un don pour aujourd'hui. Une plongée dans les fruits et les dons spirituels pour une vie chrétienne puissante.",
    image: img(7520079, 800, 600),
    scripture: "Actes 1:8",
  },
  {
    title: "Le pardon, clé de la délivrance",
    date: "2 février 2026",
    duration: "35 min",
    excerpt:
      "Le non-pardon est une prison. Découvrez comment libérer votre cœur, retrouver la paix et marcher dans une véritable liberté spirituelle.",
    image: img(34232886, 800, 600),
    scripture: "Éphésiens 4:32",
  },
  {
    title: "Les principes du Royaume pour prospérer",
    date: "26 janvier 2026",
    duration: "44 min",
    excerpt:
      "Dieu désire prospérer son peuple pour en faire une bénédiction. Des principes bibliques sur le travail, la gestion et la semence.",
    image: img(12044265, 800, 600),
    scripture: "3 Jean 1:2",
  },
];

export type Schedule = { day: string; title: string; time: string; icon: string };
export const schedule: Schedule[] = [
  { day: "Dimanche", title: "Culte de célébration", time: "07h00 & 17h30", icon: "sun" },
  { day: "Lundi", title: "Etude biblique", time: "17h30", icon: "book" },
  { day: "Mercredi", title: "Culte de délivrance & prière", time: "9h00", icon: "flame" },
  { day: "Vendredi", title: "Veillée de prière", time: "23h00 – 03h00", icon: "moon" },
];

export type Announcement = { date: string; tag: string; title: string; text: string };
export const announcements: Announcement[] = [
  {
    date: "15–22 juin 2026",
    tag: "Campagne",
    title: "Campagne d'évangélisation « Vague de Gloire »",
    text: "7 jours de puissance, de miracles et de saluts. Invitez vos proches ! Lieu : Temple central de Cocody.",
  },
  {
    date: "12 juillet 2026",
    tag: "Conférence",
    title: "Congrès international des pasteurs & leaders",
    text: "Un rassemblement de leaders venus de plusieurs pays. Inscriptions ouvertes auprès du secrétariat.",
  },
  {
    date: "Dimanche prochain",
    tag: "Baptême",
    title: "Célébration du baptême par immersion",
    text: "Vous souhaitez obéir au Seigneur par le baptême ? Inscrivez-vous à l'accueil après le culte.",
  },
  {
    date: "En cours",
    tag: "Solidarité",
    title: "Collecte pour les veuves et les orphelins",
    text: "Vos dons en nature et en espèces permettent de soutenir des familles dans le besoin. Merci de votre générosité.",
  },
];

export type LivePlatform = {
  name: string;
  handle: string;
  url: string;
  desc: string;
  color: string;
  icon: string;
};
export const livePlatforms: LivePlatform[] = [
  {
    name: "Facebook Live",
    handle: "@Egliseeejc",
    url: church.social.facebook,
    desc: "Suivez chaque culte en direct sur notre page Facebook et partagez la Parole.",
    color: "#1877F2",
    icon: "facebook",
  },
  {
    name: "YouTube",
    handle: "EEJ-C TV",
    url: church.social.youtube,
    desc: "Retrouvez nos enseignements en HD et rediffusez les cultes à tout moment.",
    color: "#FF0000",
    icon: "youtube",
  },
  {
    name: "TikTok Live",
    handle: "@eejc.officiel",
    url: church.social.tiktok,
    desc: "Des extraits puissants et des lives pour la jeune génération.",
    color: "#000000",
    icon: "tiktok",
  },
];

export type Annex = {
  id: number;
  name: string;
  city: string;
  address: string;
  pastor: string;
  phone: string;
  schedule: string;
  lat: number;
  lng: number;
  directionsDestination?: string;
  googleProfileUrl: string;
  isHQ?: boolean;
};
export const annexes: Annex[] = [
  {
    id: 1,
    name: "Canaa Cité des Envoyés (Siège)",
    city: "annexeEEJC",
    address: "Rue des Lauriers",
    pastor: "Apôtre Rev. LE BRAVE",
    phone: "90107200",
    schedule: "Dim. 09h00 & 17h30",
    lat: 6.164518797036827,
    lng: 1.3268359653440691,
    directionsDestination: "Rue des Lauriers, Gbenyedzi Alaglo, Lomé, Togo",
    googleProfileUrl:
      "https://business.google.com/n/229278163236567155/profile?fid=14629878135772036486",
    isHQ: true,
  },
  {
    id: 2,
    name: "Annexe de Yopougon",
    city: "Yopougon",
    address: "Avenue 14, Yopougon Selmer",
    pastor: "Pasteur à EEJ-C",
    phone: "+225 07 11 22 33 44",
    schedule: "Dim. 09h00",
    lat: 5.339,
    lng: -4.083,
    googleProfileUrl:
      "https://business.google.com/n/229278163236567155/profile?fid=14629878135772036486",
  },
  {
    id: 3,
    name: "Annexe de Treichville",
    city: "Treichville",
    address: "Boulevard Roume, Treichville",
    pastor: "Pasteur à EEJ-C",
    phone: "+225 07 22 33 44 55",
    schedule: "Dim. 09h00",
    lat: 5.296,
    lng: -4.011,
    googleProfileUrl:
      "https://business.google.com/n/229278163236567155/profile?fid=14629878135772036486",
  },
  {
    id: 4,
    name: "Annexe d'Abobo",
    city: "Abobo",
    address: "Rue des Artisans, Abobo-Baoulé",
    pastor: "Pasteur à EEJ-C",
    phone: "+225 07 33 44 55 66",
    schedule: "Dim. 09h00",
    lat: 5.424,
    lng: -4.017,
    googleProfileUrl:
      "https://business.google.com/n/229278163236567155/profile?fid=14629878135772036486",
  },
  {
    id: 5,
    name: "Annexe de Marcory",
    city: "Marcory",
    address: "Rue du Canal, Marcory Zone 4",
    pastor: "Pasteur à EEJ-C",
    phone: "+225 07 44 55 66 77",
    schedule: "Dim. 09h00",
    lat: 5.300,
    lng: -4.0085,
    googleProfileUrl:
      "https://business.google.com/n/229278163236567155/profile?fid=14629878135772036486",
  },
  {
    id: 6,
    name: "Annexe de Port-Bouët",
    city: "Port-Bouët",
    address: "Rond-point Aéroport, Port-Bouët",
    pastor: "Pasteur à EEJ-C",
    phone: "+225 07 55 66 77 88",
    schedule: "Dim. 09h00",
    lat: 5.261,
    lng: -3.993,
    googleProfileUrl:
      "https://business.google.com/n/229278163236567155/profile?fid=14629878135772036486",
  },
];

export const faqs = [
  {
    q: "À quelle heure ont lieu les cultes ?",
    a: "Le culte principal de célébration a lieu le dimanche à 09h00 et 11h30 au Temple central. Les annexes célèbrent le dimanche à 09h00.",
  },
  {
    q: "Comment puis-je devenir membre ?",
    a: "Rendez-vous à l'accueil après un culte ou écrivez-nous via le formulaire de contact. Un parcours d'intégration vous accueillera.",
  },
  {
    q: "Proposez-vous un accompagnement spirituel ?",
    a: "Oui. Nos pasteurs et conseillers sont disponibles pour la prière, le conseil et l'accompagnement. Contactez le secrétariat.",
  },
];
