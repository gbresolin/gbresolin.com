#!/usr/bin/env node
/**
 * Génère public/og.png — l'image affichée quand un lien du site est partagé
 * sur LinkedIn, Slack, WhatsApp ou X.
 *
 *   node scripts/generer-og.mjs
 *
 * À relancer si le nom, le rôle ou la palette changent. Le résultat est
 * versionné : le site n'a pas besoin de savoir la fabriquer au build.
 *
 * Prérequis : les polices Instrument Serif et Inter installées côté système
 * (~/.fonts + fc-cache). Sans elles, le rendu retombe sur une serif générique.
 */

import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';

const LARGEUR = 1200;
const HAUTEUR = 630;

// Reprise exacte des tokens de src/styles/global.css.
const SURFACE = '#faf9f7';
const INK = '#16150f';
const INK_SOFT = '#5d594f';
const RULE = '#e2ded4';
const ACCENT = '#9c3d17';

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${LARGEUR}" height="${HAUTEUR}" viewBox="0 0 ${LARGEUR} ${HAUTEUR}">
  <rect width="${LARGEUR}" height="${HAUTEUR}" fill="${SURFACE}"/>

  <!-- Filet d'accent en pied, rappel de la barre du site -->
  <rect x="0" y="${HAUTEUR - 8}" width="${LARGEUR}" height="8" fill="${ACCENT}"/>

  <text x="80" y="250" font-family="Instrument Serif" font-size="118" fill="${INK}">Grégory Bresolin</text>

  <line x1="80" y1="310" x2="${LARGEUR - 80}" y2="310" stroke="${RULE}" stroke-width="2"/>

  <text x="80" y="378" font-family="Inter" font-size="38" font-weight="500" fill="${INK}">Lead developer Laravel</text>

  <text x="80" y="440" font-family="Inter" font-size="30" fill="${INK_SOFT}">Je conçois, j'arbitre et je livre des applications métier —</text>
  <text x="80" y="484" font-family="Inter" font-size="30" fill="${INK_SOFT}">de la première ligne jusqu'à la mise en production.</text>

  <text x="80" y="556" font-family="Inter" font-size="24" fill="#8d887c" letter-spacing="2">gbresolin.com</text>
</svg>`;

const png = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
await writeFile(new URL('../public/og.png', import.meta.url), png);

const { width, height } = await sharp(png).metadata();
console.log(`✓ public/og.png — ${width}×${height}, ${(png.length / 1024).toFixed(0)} Ko`);
