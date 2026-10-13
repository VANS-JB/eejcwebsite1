/* ============================================================
  CONTENU DU SITE — Église des Envoyés de Jésus-Christ
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

export const imgSrcSet = (id: number, width: number, height: number) =>
  [480, 768, 1280, 1920]
    .map((size) => `${img(id, size, Math.round((size * height) / width))} ${size}w`)
    .join(", ");

export const church = {
  name: "Église des Envoyés de Jésus-Christ",
  shortName: "EEJ-C",
  tagline: "Christ en vous, l'espérance de la gloire",
  verseRef: "Colossiens 1:27",
  founded: 2000,
  apostle: {
     name: "Rév. Apôtre LE BRAVE",
    role: "Fondateur et pasteur principal",
    photo: img(6275777, 900, 1100),
  },
  contact: {
    address: "Rue des Lauriers, Gbenyedzi Alaglo — Lomé, Togo",
    addressShort: "Alaglo, Lomé",
    phone: "+228 90 10 72 00",
    phone2: "+228 07 00 00 00 00",
    email: "arnaudgadji675@gmail.com",
    hours: "Secrétariat : du lundi au vendredi, de 9 h à 17 h",
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
  imageSrcSet: string;
  kicker: string;
  title: string;
  text: string;
};
export const slides: Slide[] = [
  {
    image: img(36425621, 1920, 1280),
    imageSrcSet: imgSrcSet(36425621, 1920, 1280),
    kicker: "Bienvenue à EEJ-C",
    title: "Une famille, une foi, une mission",
    text: "Rejoignez une communauté vivante où la Parole de Dieu transforme des vies, restaure les cœurs et édifie des destins.",
  },
  {
    image: img(30550589, 1920, 1280),
    imageSrcSet: imgSrcSet(30550589, 1920, 1280),
    kicker: "Louange et adoration",
    title: "Élevez la gloire de Dieu",
    text: "Des cultes vibrants, une louange passionnée et la présence puissante de l'Esprit Saint au milieu de nous.",
  },
  {
    image: img(13908967, 1920, 1280),
    imageSrcSet: imgSrcSet(13908967, 1920, 1280),
    kicker: "Intercession et prière",
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
    "L'Église des Envoyés de Jésus-Christ est une communauté chrétienne fondée en 2000 avec pour mission d'annoncer la bonne nouvelle à toutes les nations. Née d'un petit groupe de prière à Lomé, elle est aujourd'hui une famille de plus de 12 000 fidèles répartis dans plusieurs annexes.",
  historyTitle: "Notre histoire",
  history:
    "Tout a commencé dans un modeste salon, autour de l'Apôtre LE BRAVE et de quelques âmes affamées de Dieu. De cette communion naquit une vision claire : annoncer un Christ vivant, sauver les perdus, guérir les blessés et former des disciples. Au fil des années, l'œuvre s'est étendue au-delà des frontières, plantant des annexes au Togo, en Afrique de l'Ouest et auprès de la diaspora.",
  visionTitle: "Notre vision",
  vision:
    "« Voir toute personne transformée par l'Évangile, équipée pour son appel et envoyée pour avoir un impact sur sa génération. » Nous croyons en une Église rayonnante, remplie de l'Esprit et engagée dans l'amour du prochain.",
  missionTitle: "Notre mission",
  mission:
    "Annoncer la grâce de Dieu, faire de toutes les nations des disciples, intercéder pour les malades et les personnes affligées, et démontrer l'amour du Christ par des actions concrètes en faveur des plus vulnérables.",
  apostleMessageTitle: "Le mot de l'Apôtre",
  apostleMessage:
    "Bien-aimés, vous êtes chez vous à EEJ-C. Ici, peu importe votre passé : la grâce de Dieu vous accueille comme vous êtes et vous transforme pour vous conduire vers ce que Dieu a prévu pour vous. Venez tels que vous êtes, repartez transformés. Que la paix, la joie et la puissance du Saint-Esprit accompagnent chacun de vos pas.",
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
      "Dieu désire faire prospérer son peuple pour en faire une bénédiction. Découvrez des principes bibliques portant sur le travail, la gestion et la semence.",
    image: img(12044265, 800, 600),
    scripture: "3 Jean 1:2",
  },
];

export type Schedule = { day: string; title: string; time: string; icon: string };
export const schedule: Schedule[] = [
  { day: "Dimanche", title: "Culte de célébration", time: "7 h et 17 h 30", icon: "sun" },
  { day: "Lundi", title: "Étude biblique", time: "17 h 30", icon: "book" },
  { day: "Mercredi", title: "Culte de délivrance et de prière", time: "9 h", icon: "flame" },
  { day: "Vendredi", title: "Veillée de prière", time: "23 h – 3 h", icon: "moon" },
];

export type Announcement = { date: string; tag: string; title: string; text: string };
export const announcements: Announcement[] = [
  {
    date: "15–22 juin 2026",
    tag: "Campagne",
    title: "Campagne d'évangélisation « Vague de Gloire »",
    text: "7 jours de puissance, de miracles et de vies transformées. Invitez vos proches ! Lieu : Temple central de Cocody.",
  },
  {
    date: "12 juillet 2026",
    tag: "Conférence",
    title: "Congrès international des pasteurs et des leaders",
    text: "Un rassemblement de leaders venus de plusieurs pays. Inscriptions ouvertes auprès du secrétariat.",
  },
  {
    date: "Dimanche prochain",
    tag: "Baptême",
    title: "Célébration du baptême par immersion",
    text: "Vous souhaitez obéir au Seigneur par le baptême ? Inscrivez-vous à l’accueil après le culte.",
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
    desc: "Retrouvez nos enseignements en HD et regardez les cultes en rediffusion à tout moment.",
    color: "#FF0000",
    icon: "youtube",
  },
  {
    name: "TikTok Live",
    handle: "@eejc.officiel",
    url: church.social.tiktok,
    desc: "Des extraits inspirants et des diffusions en direct pour la jeune génération.",
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
  googleProfileUrl?: string;
  isHQ?: boolean;
};
export const annexes: Annex[] = [
  {
    id: 1,
    name: "Canaan, Cité des Envoyés (siège)",
    city: "annexeEEJC",
    address: "Rue des Lauriers",
    pastor: "Rév. Apôtre KOUDJINO Ayao Raphael",
    phone: "90107200",
    schedule: "Dim. 7 h et 17 h 30",
    lat: 6.164518797036827,
    lng: 1.3268359653440691,
    directionsDestination: "Rue des Lauriers, Gbenyedzi Alaglo, Lomé, Togo",
    googleProfileUrl:
      "https://business.google.com/n/229278163236567155/profile?fid=14629878135772036486",
    isHQ: true,
  },
  {
    id: 3,
    name: "EEJ-C, Adétikopé, Camp des Envoyés",
    city: "Adétikopé",
    address: "Lomé, Adétikopé",
    pastor: "Past. AYIH Amegnigan Ghislain",
    phone: "+228 90 05 07 52",
    schedule: "Dim. 9 h",
    lat: 6.3368074,
    lng: 1.2334895747993468,
    directionsDestination: "EEJ-C, Adétikopé, Camp des Envoyés, Lomé, Togo",
  },
  {
    id: 4,
    name: "EEJ-C, Agoè Temple du Calvaire",
    city: "Agoè Koffi Panou",
    address: "Agoè Koffi Panou, Kitidjan, Lomé",
    pastor: "Past. BOSSOU Athanas",
    phone: "+228 90 23 24 66",
    schedule: "Dim. 9 h",
    lat: 6.217409626414917,
    lng: 1.2207555083287767,
    directionsDestination: "Église des Envoyés de Jésus-Christ (EEJ-C), Agoè Temple du Calvaire, Agoè Koffi Panou, Kitidjan, Lomé",
  },
  {
    id: 5,
    name: "EEJ-C, Kpémé, Temple d’Israël",
    city: "Kpémé",
    address: "6G86+6CW, Kpémé",
    pastor: "Past. EKPE Maurice",
    phone: "+228 90 22 24 79",
    schedule: "Dim. 9 h",
    lat: 6.2156171140890075,
    lng: 1.5100769744150653,
    directionsDestination: "Église des Envoyés de Jésus-Christ (EEJ-C), Kpémé, Temple d’Israël, 6G86+6CW, Kpémé",
  },
  {
    id: 6,
    name: "EEJ-C Temple des Disciples",
    city: "Bè Pa de Souza",
    address: "46MR+94C Bè Pa de Souza, Rue des Verveines, Lomé",
    pastor: "Past. AMENOUPOU Robert",
    phone: "+228 90 07 04 47",
    schedule: "Dim. 9 h",
    lat: 6.133427325542622,
    lng: 1.2398979866195368,
    directionsDestination: "Église des Envoyés de Jésus-Christ (EEJ-C), Temple des Disciples, 46MR+94C Bè Pa de Souza, Rue des Verveines, Lomé",
  },
  {
    id: 7,
    name: "EEJ-C Adidogomé, Temple de la Gloire",
    city: "Adidogomé",
    address: "646W+8PH, Adidogomé, Lomé",
    pastor: "Past. DZIDOPE Marcos",
    phone: "+228 92 48 74 87",
    schedule: "Dim. 9 h",
    lat: 6.210826163296158,
    lng: 1.0747713409938267,
    directionsDestination: "Église des Envoyés de Jésus-Christ (EEJ-C), Adidogomé, Temple de la Gloire, 646W+8PH, Adidogomé, Lomé",
  },
  {
    id: 8,
    name: "EEJ-C Temple des Vainqueurs, Aného",
    city: "Aného",
    address: "7J56+QG6, Abalokondji, Aného",
    pastor: "Past. TETOU Yadoko",
    phone: "+228 97 08 16 40",
    schedule: "Dim. 9 h",
    lat: 6.232974914276599,
    lng: 1.4104330491138848,
    directionsDestination: "Église des Envoyés de Jésus-Christ (EEJ-C), Temple des Vainqueurs, Aného, 7J56+QG6, Abalokondji",
  },
  {
    id: 2,
    name: "Adamavo, Temple de la Victoire (EEJ-C)",
    city: "Baguida",
    address: "Adamavo, Baguida",
    pastor: "Past. COMEDJA Agoutie Akouété",
    phone: "+228 99 59 86 13",
    schedule: "Dim. 9 h",
    lat: 6.177395267403738,
    lng: 1.3130585756070143,
    directionsDestination: "Adamavo, Temple de la Victoire (EEJ-C), Adamavo, Baguida",
  },
];

export const faqs = [
  {
    q: "À quelle heure ont lieu les cultes ?",
    a: "Le culte principal de célébration a lieu le dimanche à 7 h et à 11 h 30 au Temple central. Les annexes célèbrent le dimanche à 9 h.",
  },
  {
    q: "Comment puis-je devenir membre ?",
    a: "Rendez-vous à l’accueil après un culte ou écrivez-nous via le formulaire de contact. Nous vous accompagnerons dans votre parcours d’intégration.",
  },
  {
    q: "Proposez-vous un accompagnement spirituel ?",
    a: "Oui. Nos pasteurs et conseillers sont disponibles pour la prière, le conseil et l’accompagnement. Contactez le secrétariat.",
  },
];
