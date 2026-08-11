# gbresolin.com

Portfolio de Grégory Bresolin. Site statique Astro, hébergé chez o2switch,
déployé par GitHub Actions. Remplace un WordPress mis hors service en 2026.

## Commandes

```bash
npm run dev            # serveur local sur :4321
npm run build          # génère dist/
npm run preview        # sert dist/ pour vérifier le rendu réel
npm run check          # vérification des types Astro
npm run check:contenu  # échoue s'il reste des marqueurs TODO(contenu)
npm run deploy         # déploie en préproduction
npm run deploy:prod    # déploie en production, avec confirmation
```

## Ajouter ou modifier un projet

Un fichier Markdown par projet dans `src/content/projets/`. Le frontmatter est
validé par le schéma zod de `src/content.config.ts` — un champ manquant fait
échouer le build, c'est voulu. Le nom du fichier devient l'URL
(`isi-app.md` → `/projets/isi-app`).

`ordre` pilote la position dans la liste (croissant), `brouillon: true` retire
le projet du build sans le supprimer du dépôt.

Aucun code à toucher pour ajouter un projet.

## Conventions

- **Langue** : tout est en français, y compris les noms de composants, de
  variables et les commentaires. `Entete.astro`, pas `Header.astro`.
- **Contenu** : les coordonnées et informations de profil vivent dans
  `src/data/site.ts`, jamais en dur dans un composant.
- **Marqueurs** : `TODO(contenu)` signale un texte provisoire à remplacer.
  `npm run check:contenu` les recense et bloque le déploiement en production.
- **Styles** : Tailwind 4. Les tokens sont dans `src/styles/global.css` sous
  `@theme`. Les couleurs passent toujours par les variables sémantiques
  (`bg-surface`, `text-ink-soft`, `border-rule`) — jamais de valeur hexadécimale
  dans un composant, sinon le mode sombre casse.
- **Polices** : gérées par l'API Fonts d'Astro (`astro.config.mjs`), téléchargées
  au build et servies depuis le domaine. Ne pas ajouter de `<link>` vers Google
  Fonts : le site n'émet aucune requête tierce, et les mentions légales
  s'appuient là-dessus.
- **JavaScript** : le site n'en embarque aucun. Toute interactivité doit se
  justifier — c'est ce qui garantit la performance et l'absence de cookies.

## Déploiement

Manuel, depuis la machine de Grégory : `scripts/deploy.sh` construit le site
puis l'envoie en rsync SSH vers o2switch. La configuration vit dans
`.env.deploy`, non versionné (le dépôt est public) — modèle dans
`.env.deploy.example`.

La préproduction reçoit un `noindex` forcé. La production demande confirmation
et refuse de partir s'il reste des `TODO(contenu)`.

**Pourquoi pas de CI/CD :** o2switch protège le SSH par une liste blanche d'IP,
sans plages et limitée à cinq exceptions. Un runner GitHub Actions changeant
d'IP à chaque exécution, il faudrait l'autoriser puis la retirer via l'API
cPanel à chaque déploiement. Pour un site mis à jour de temps en temps, la
complexité n'en valait pas la peine. Si le besoin change, la bascule est
documentée côté o2switch.

## Pièges connus

- `public/.htaccess` porte les redirections 301 des anciennes URLs WordPress.
  Ne pas le supprimer : les liens vers les 3 anciens articles de blog
  retomberaient en 404.
- Le rsync utilise `--delete`. Les exclusions du workflow (`.well-known/`,
  `cgi-bin/`) protègent ce que cPanel dépose dans `public_html` — les retirer
  casserait le renouvellement du certificat SSL.
- Dans `@theme`, ne jamais nommer une variable de police `--font-display` si
  elle référence la variable Astro du même nom : cela crée une référence
  circulaire. Astro injecte `--ff-display` / `--ff-body`, le thème les
  réexpose sous `--font-display` / `--font-body`.
