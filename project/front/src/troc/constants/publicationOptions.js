export const PRODUCT_CATEGORIES = [
  "Vêtements (filles & garçons)",
  "Jeux et jouets",
  "Poussettes, porte-bébés et sièges auto",
  "Meubles et décoration",
  "Bain et change",
  "Sécurité bébé et enfant",
  "Allaitement et alimentation",
  "Sommeil et literie",
  "Santé et grossesse",
  "Autres articles pour bébé et enfant",
];

export const CONDITION_OPTIONS = [
  "Très bon état",
  "Bon état",
  "État correct",
  "Usure visible",
];

export const CITY_OPTIONS = ["Lille", "Paris", "Lyon", "Marseille", "Bordeaux"];

export const RADIUS_OPTIONS = ["1 km", "5 km", "10 km", "25 km", "50 km"];

export const PUBLISH_MODES = [
  {
    key: "SECOND_HAND",
    title: "Seconde main",
    description: "Je fixe un prix et je vends",
    icon: "sell",
    iconBackground: "bg-[#e8f2ff]",
    disabled: false,
  },
  {
    key: "LOCATION",
    title: "Location",
    description: "Je mets en location",
    icon: "schedule",
    iconBackground: "bg-[#fff4e7]",
    disabled: false,
  },
  {
    key: "TROC",
    title: "Troc",
    description: "J’échange contre un article",
    icon: "sync_alt",
    iconBackground: "bg-[#fff0f3]",
    disabled: false,
  },
];

export const AGE_RANGE_OPTIONS = [
  "0-6 mois",
  "6-12 mois",
  "1-3 ans",
  "3-6 ans",
  "6 ans et +",
];

export const WEIGHT_OPTIONS = [
  "0-9 kg",
  "9-15 kg",
  "15-22 kg",
  "22-36 kg",
  "36 kg et +",
];
