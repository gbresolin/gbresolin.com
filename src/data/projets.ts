import { getCollection, type CollectionEntry } from 'astro:content';

export type Projet = CollectionEntry<'projets'>;

/**
 * Projets publiables, triés. Les brouillons sont exclus du build.
 * Utilisé par la page d'accueil et par getStaticPaths des pages projet, pour
 * que les deux voient exactement la même liste dans le même ordre.
 */
export async function getProjetsPublies(): Promise<Projet[]> {
  const projets = await getCollection('projets', ({ data }) => !data.brouillon);
  return projets.sort((a, b) => a.data.ordre - b.data.ordre);
}
