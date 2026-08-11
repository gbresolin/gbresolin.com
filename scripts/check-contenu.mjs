#!/usr/bin/env node
/**
 * Garde-fou de publication.
 *
 * Le site est construit avec des marqueurs TODO(contenu) là où il manque du
 * texte définitif. Ce script les recense et sort en erreur s'il en reste, pour
 * qu'un déploiement en production ne puisse pas emporter des placeholders.
 *
 *   npm run check:contenu
 */

import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const RACINE = new URL('..', import.meta.url).pathname;
const CIBLES = ['src'];
const IGNORES = new Set(['node_modules', 'dist', '.astro', '.git']);
const MARQUEUR = /TODO\(contenu\)/;

async function* fichiers(dossier) {
  for (const entree of await readdir(dossier, { withFileTypes: true })) {
    if (IGNORES.has(entree.name)) continue;
    const chemin = join(dossier, entree.name);
    if (entree.isDirectory()) yield* fichiers(chemin);
    else yield chemin;
  }
}

const trouvailles = [];

for (const cible of CIBLES) {
  for await (const chemin of fichiers(join(RACINE, cible))) {
    const contenu = await readFile(chemin, 'utf8');
    if (!MARQUEUR.test(contenu)) continue;

    contenu.split('\n').forEach((ligne, i) => {
      if (MARQUEUR.test(ligne)) {
        trouvailles.push({
          fichier: relative(RACINE, chemin),
          ligne: i + 1,
          extrait: ligne.trim().slice(0, 90),
        });
      }
    });
  }
}

if (trouvailles.length === 0) {
  console.log('✓ Aucun marqueur TODO(contenu) — le contenu est prêt à publier.');
  process.exit(0);
}

console.error(
  `\n✗ ${trouvailles.length} marqueur(s) TODO(contenu) encore présent(s) :\n`
);
for (const t of trouvailles) {
  console.error(`  ${t.fichier}:${t.ligne}`);
  console.error(`    ${t.extrait}`);
}
console.error(
  '\nCes emplacements attendent du texte définitif. Complétez-les avant de' +
    ' publier,\nou lancez le build sans ce contrôle si vous déployez en' +
    ' préproduction.\n'
);
process.exit(1);
