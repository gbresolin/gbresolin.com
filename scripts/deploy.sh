#!/usr/bin/env bash
#
# Déploiement de gbresolin.com vers o2switch.
#
#   npm run deploy            → préproduction
#   npm run deploy:prod       → production (avec confirmation)
#   npm run deploy -- --dry   → simulation, rien n'est écrit sur le serveur
#
# La configuration vit dans .env.deploy, jamais versionné.
# Voir .env.deploy.example pour le modèle.

set -euo pipefail

RACINE="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$RACINE"

CIBLE="preproduction"
DRY=""

for arg in "$@"; do
  case "$arg" in
    --prod) CIBLE="production" ;;
    --dry) DRY="--dry-run" ;;
    *) echo "Option inconnue : $arg" >&2; exit 1 ;;
  esac
done

# --- Configuration ----------------------------------------------------------

if [ ! -f .env.deploy ]; then
  echo "✗ Fichier .env.deploy absent." >&2
  echo "  Copiez .env.deploy.example en .env.deploy et renseignez-le." >&2
  exit 1
fi

# shellcheck disable=SC1091
set -a; source .env.deploy; set +a

for var in SSH_HOTE SSH_UTILISATEUR CHEMIN_PREPRODUCTION CHEMIN_PRODUCTION; do
  if [ -z "${!var:-}" ]; then
    echo "✗ Variable $var manquante dans .env.deploy" >&2
    exit 1
  fi
done

SSH_PORT="${SSH_PORT:-22}"
CLE="${SSH_CLE:-$HOME/.ssh/id_ed25519_o2switch}"

if [ "$CIBLE" = "production" ]; then
  DESTINATION="$CHEMIN_PRODUCTION"
else
  DESTINATION="$CHEMIN_PREPRODUCTION"
fi

# Un chemin vide enverrait le site dans le dossier de connexion et le --delete
# y détruirait tout. On refuse aussi la racine par précaution.
case "$DESTINATION" in
  ""|"/"|"~"|"~/") echo "✗ Chemin de destination dangereux : « $DESTINATION »" >&2; exit 1 ;;
esac

# --- Contrôles --------------------------------------------------------------

echo "▸ Cible      : $CIBLE"
echo "▸ Destination: $SSH_UTILISATEUR@$SSH_HOTE:$DESTINATION"
[ -n "$DRY" ] && echo "▸ Mode       : simulation (aucune écriture)"
echo

if [ "$CIBLE" = "production" ]; then
  # La préproduction est justement faite pour relire les textes provisoires ;
  # la production, non.
  echo "▸ Vérification du contenu…"
  npm run --silent check:contenu

  if [ -z "$DRY" ]; then
    read -r -p "Déployer en PRODUCTION sur $SSH_HOTE ? [oui/N] " reponse
    [ "$reponse" = "oui" ] || { echo "Annulé."; exit 0; }
  fi
fi

# --- Construction -----------------------------------------------------------

echo "▸ Construction du site…"
npm run --silent build

if [ ! -f dist/index.html ]; then
  echo "✗ dist/index.html absent : le build a échoué." >&2
  exit 1
fi

# La préproduction est servie sur une URL publique : elle ne doit jamais être
# indexée, sinon elle concurrence le site réel dans les résultats de recherche.
if [ "$CIBLE" = "preproduction" ]; then
  echo "▸ Interdiction de l'indexation…"
  printf 'User-agent: *\nDisallow: /\n' > dist/robots.txt
  find dist -name '*.html' -exec \
    sed -i 's|</head>|<meta name="robots" content="noindex, nofollow"></head>|' {} +
fi

# --- Envoi ------------------------------------------------------------------

echo "▸ Envoi vers o2switch…"

# --delete garde la cible propre, mais effacerait ce qu'Apache et cPanel y
# déposent. Les exclusions protègent notamment le renouvellement du
# certificat Let's Encrypt.
rsync -rlvz --checksum --delete $DRY \
  --exclude '.well-known/' \
  --exclude 'cgi-bin/' \
  --exclude '.htpasswd' \
  --exclude '.user.ini' \
  -e "ssh -p $SSH_PORT -i $CLE" \
  dist/ \
  "$SSH_UTILISATEUR@$SSH_HOTE:$DESTINATION/"

echo
if [ -n "$DRY" ]; then
  echo "✓ Simulation terminée — rien n'a été modifié sur le serveur."
else
  echo "✓ Déploiement $CIBLE terminé."
fi
