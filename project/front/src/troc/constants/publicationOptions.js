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

export const PUBLISH_MODES = [
  {
    key: "SECOND_HAND",
    title: "Seconde main",
    description: "Je fixe un prix et je vends",
    icon: "🏷️",
    disabled: false,
  },
  {
    key: "LOCATION",
    title: "Location",
    description: "Je mets en location",
    icon: "⏱️",
    disabled: true,
  },
  {
    key: "TROC",
    title: "Troc",
    description: "J’échange contre un article",
    icon: "↔",
    disabled: false,
  },
];
