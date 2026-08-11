/**
 * Informations centralisées du site.
 * Un seul endroit à modifier quand une coordonnée change.
 */
export const site = {
  nom: 'Grégory Bresolin',
  prenom: 'Grégory',
  patronyme: 'Bresolin',
  // « Lead » plutôt que « fullstack » : fullstack dit l'étendue, lead dit le
  // niveau de responsabilité — encadrement, revue, arbitrage.
  role: 'Lead developer Laravel',
  // La qualité d'associé est volontairement absente du site tant que le sujet
  // n'a pas été vu avec les co-associés d'ISI-APP.
  poste: 'Lead developer chez ISI-APP',
  /** Premier statut professionnel : webmaster freelance à son compte. */
  debutCarriere: 2007,
  societe: {
    nom: 'ISI-APP',
    groupe: 'ISI-Groupe',
    site: 'https://isi-app.com',
    /** Année d'arrivée sur le produit, pas de création de la société (2023). */
    depuisProduit: '2019',
    activite: 'édition de logiciel',
    produit: 'La boîte à outils française pour piloter et simplifier votre SI',
  },
  localisation: 'Lyon',
  url: 'https://www.gbresolin.com',
  email: 'contact@gbresolin.com',
  description:
    'Lead developer à Lyon. Applications métier Laravel, de la première ligne jusqu’à la mise en production.',
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
