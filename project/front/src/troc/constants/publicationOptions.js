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
  "Neuf",
  "Très bon état",
  "Bon état",
  "État correct",
  "Usé",
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
  { label: "0-6 mois", value: "0-6" },
  { label: "6-12 mois", value: "6-12" },
  { label: "1-3 ans", value: "12-36" },
  { label: "3-6 ans", value: "36-72" },
  { label: "6 ans et +", value: "72-99" },
];

export const WEIGHT_OPTIONS = [
  { label: "0-9 kg", value: "0-9" },
  { label: "9-15 kg", value: "9-15" },
  { label: "15-22 kg", value: "15-22" },
  { label: "22-36 kg", value: "22-36" },
  { label: "36 kg et +", value: "36-50" },
];
