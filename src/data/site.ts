/**
 * Informations centralisées du site.
 * Un seul endroit à modifier quand une coordonnée change.
 */
export const site = {
  nom: 'Grégory Bresolin',
  prenom: 'Grégory',
  patronyme: 'Bresolin',
  role: 'Développeur fullstack',
  // TODO(contenu) : intitulé de poste exact chez ISI-APP (et mention éventuelle
  // du rôle dans la création de la société).
  poste: 'ISI-APP',
  societe: {
    nom: 'ISI-APP',
    groupe: 'ISI-Groupe',
    depuis: '2023',
    activite: 'édition de logiciel',
    produit: 'La boîte à outils française pour piloter et simplifier votre SI',
  },
  localisation: 'Lyon',
  url: 'https://www.gbresolin.com',
  email: 'contact@gbresolin.com',
  description:
    'Développeur fullstack à Lyon. Applications métier Laravel, conçues et déployées avec Claude Code.',
  liens: {
    // Compte personnel. Le compte Grego01600 est le compte professionnel et
    // n'a pas vocation à apparaître ici.
    github: 'https://github.com/gbresolin',
    linkedin: 'https://www.linkedin.com/in/gregory-bresolin-74a51b167/',
  },
} as const;

/** Sections de la one-page, source unique pour la navigation et les ancres. */
export const sections = [
  { id: 'a-propos', libelle: 'À propos' },
  { id: 'methode', libelle: 'Méthode' },
  { id: 'projets', libelle: 'Projets' },
  { id: 'contact', libelle: 'Contact' },
] as const;
