import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
// zod vient d'astro/zod : le `z` réexporté par astro:content est déprécié.
import { z } from 'astro/zod';

/**
 * Un fichier Markdown par projet dans src/content/projets/.
 * Ajouter un projet = ajouter un fichier, aucun code à toucher.
 */
const projets = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projets' }),
  schema: z.object({
    titre: z.string(),
    /** Une phrase, affichée dans la liste de la page d'accueil. */
    resume: z.string(),
    annee: z.string(),
    /** Cadre l'engagement : salarié, projet personnel, mission… */
    role: z.string(),
    statut: z.enum(['en cours', 'livré', 'archivé']),
    stack: z.array(z.string()),
    /** Plus le nombre est petit, plus le projet remonte dans la liste. */
    ordre: z.number(),
    vedette: z.boolean().default(false),
    lien: z.string().url().optional(),
    /** Un brouillon reste dans le dépôt mais n'est pas publié. */
    brouillon: z.boolean().default(false),
  }),
});

export const collections = { projets };
