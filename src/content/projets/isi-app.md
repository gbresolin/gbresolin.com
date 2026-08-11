---
titre: Isi-APP
resume: SaaS multi-modules pour piloter un système d'information — ticketing, gestion de projet, parc et entités — avec un espace prestataire multi-clients.
annee: '2019 — aujourd’hui'
role: Lead developer, ISI-APP
statut: en cours
stack:
  - Laravel
  - Livewire
  - Alpine.js
  - Tailwind CSS
  - MySQL
ordre: 1
vedette: true
brouillon: false
---

> **Relecture à faire.** Ce texte est rédigé à partir de tes réponses, mais il
> reste à valider — et surtout à confirmer avec ISI-APP avant publication :
> captures, chiffres et noms de clients.

## Contexte

Isi-APP a démarré en **2019**, à deux, sans code existant. Un ami lançait sa
société, je l'ai suivi en quittant douze ans de freelance, avec une ambition
qui n'a pas bougé depuis : construire une plateforme de pilotage du système
d'information **incontournable et 100 % française**.

Le logiciel porte cette promesse : **la boîte à outils française pour piloter
et simplifier votre SI**. La souveraineté n'y est pas un argument commercial
ajouté après coup — elle était dans le cahier des charges dès la première
ligne, et elle contraint les choix techniques.

Sept ans plus tard, l'équipe a grandi et le produit couvre le **ticketing**,
la **gestion de projet**, la **gestion de parc** et la **gestion des entités
et des adresses**. Plutôt que d'empiler quatre outils qui ne se parlent pas,
tout vit dans la même base et le même référentiel.

## Contraintes

Deux difficultés structurent le projet, et ce sont elles qui déterminent
l'essentiel des choix techniques.

**Maintenir plusieurs modules dans un même produit.** Chaque module a son
métier, son vocabulaire et son rythme d'évolution, mais tous partagent le même
référentiel d'entités. Faire évoluer l'un sans casser les autres suppose des
frontières nettes et un socle commun réellement commun — pas quatre
applications déguisées en une seule.

**L'espace prestataire.** Un prestataire gère plusieurs clients, et doit les
piloter depuis une seule interface sans jamais voir ce qui ne le regarde pas.
C'est la contrainte la plus exigeante du produit : elle impose une gestion des
droits rigoureuse sur **chaque accès**, à la croisée de trois dimensions —
l'utilisateur, le client sur lequel il intervient, et le module concerné.

Sur ce type de cloisonnement, il n'existe pas de demi-réussite : une seule
fuite entre deux clients et c'est la confiance dans le produit qui tombe.

## Décisions d'architecture

### Le cloisonnement ne pouvait pas être implicite

Base mutualisée, et filtrage explicite concentré dans la couche Service. Deux
approches plus séduisantes sur le papier ont été écartées.

**Une base par client.** Écartée pour son coût opérationnel : plus de deux
cents modèles à migrer autant de fois qu'il y a de clients, et surtout des
besoins transverses — pilotage, facturation, support, connecteurs — qui
seraient tous devenus des agrégations entre bases. Beaucoup de complexité pour
aucune contrepartie à notre échelle.

**Un scope global appliqué automatiquement à chaque requête.** Écartée pour une
raison plus intéressante, et c'est l'arbitrage central du produit : *le tenant
courant n'est pas une valeur unique*. Selon l'écran, la portée pertinente est
l'entité seule, une filiale, une entité et toutes ses filles, ou la relation
entre un prestataire et le client sur lequel il intervient. Un scope unique
aurait dû être désactivé sur une grande partie des requêtes — c'est-à-dire la
pire configuration possible : une garantie affichée mais pas tenue, avec la
fausse sécurité qui va avec.

Le choix a donc été de rendre le filtrage **visible sur chaque requête** et de
le concentrer en un seul endroit, plutôt que de le rendre invisible et
contournable partout.

Ce que ça coûte, sans enrobage : la garantie devient conventionnelle plutôt que
structurelle. Elle repose sur la centralisation, la revue et les tests — pas
sur le langage. Un socle qui appliquerait le cloisonnement par défaut, avec une
sortie explicite et traçable pour les accès transverses légitimes, offrirait la
même souplesse avec un défaut sûr. C'est la direction dans laquelle le produit
évolue.

### Le découplage est porté par la donnée, pas par le code

Dans ce produit, « module » a deux sens qu'il faut séparer.

Le **module commercial** est une ligne en base : le périmètre d'abonnement d'un
client. L'activer ne demande aucun déploiement, et les accès sont vérifiés au
niveau des routes.

Le **module de code** est une convention d'organisation : routes, composants et
services regroupés par domaine.

Le découplage réel est donc porté par la donnée, pas par le code — et pour un
SaaS où chaque client a un périmètre différent, c'est le bon endroit. Le
catalogue est éditable à chaud, sans build conditionnel ni artefact par client.

Le revers est net : aucune frontière n'est vérifiée par un outil. Rien
n'empêche techniquement un domaine d'aller chercher dans un autre, et ce
couplage se contrôle en revue, donc imparfaitement. Passer à de vrais packages
n'aurait de sens que pour réutiliser un domaine hors de cette application, ou
pour donner à des équipes distinctes des cycles de release séparés. Ce n'est
pas la situation : la surcouche coûterait plus qu'elle ne rapporterait.

### Livewire plutôt qu'une SPA

Près de huit cents composants Livewire, plus de deux mille vues, et aucun
framework front.

**Ce que ça a fait gagner.** Le gain principal découle directement du point
précédent : sans API dédiée à l'interface, le modèle de droits et le filtrage
ne s'appliquent qu'à un seul endroit, côté serveur. Une SPA aurait imposé de
réexposer tout ce modèle en API et de le resécuriser endpoint par endpoint —
exactement la surface où une fuite entre clients serait apparue. Sur un produit
dont la difficulté centrale *est* le cloisonnement, ce n'est pas un détail.

S'y ajoutent une seule compétence à staffer au lieu de deux, pas de contrat
d'API à maintenir en double, et une vraie vitesse sur les écrans de gestion :
un socle de tables génériques produit tri, filtres, export et actions de masse
en quelques fichiers. Sur une application dont l'enjeu est le nombre d'écrans,
c'est décisif.

**Ce que ça a coûté.** Chaque interaction est un aller-retour réseau : sur les
écrans denses, cela se voit, et il faut arbitrer en permanence entre réactivité
et volume d'échanges. L'état vit côté serveur, ce qui demande une discipline
quotidienne plutôt qu'un réglage. Le JavaScript revient malgré tout dès qu'il
faut de l'interactivité fine, mais dispersé dans les vues au lieu d'être
structuré. Les tests d'interface passent par des tests de bout en bout, plus
lents et plus fragiles que des tests de composants. Et aucune API réutilisable
n'existe en sous-produit : le jour où une application mobile deviendra
nécessaire, elle sera à construire.

Le vrai coût, cela dit, n'est pas Livewire : c'est le **double paradigme**. Du
Livewire moderne cohabite avec un héritage plus ancien, et c'est cette
hétérogénéité — pas le framework — qui pèse le plus au quotidien.

**Le verdict.** Pour un ERP B2B multi-clients où le facteur limitant est le
volume d'écrans et la complexité du modèle de droits, et non la fluidité de
l'animation, le compromis est le bon. Une SPA aurait exigé une équipe front
dédiée et une API complète en préalable. Ce qu'on paie en échange est réel et
identifiable, ce qui est la seule chose qu'on demande à un arbitrage.

## Arbitrages

Trois choix qu'on assume, et ce qu'ils coûtent :

- **La sécurité du cloisonnement est conventionnelle**, portée par la
  centralisation et la revue plutôt que par le langage. En échange, chaque
  requête dit ce qu'elle filtre, au lieu de dépendre d'un mécanisme invisible
  qu'on aurait passé son temps à désactiver.
- **Aucune frontière technique entre domaines.** Le couplage se contrôle en
  revue. On y gagne un déploiement unique et zéro surcouche de versionnage.
- **Pas d'API pour l'interface.** On y gagne un modèle de droits appliqué en
  un seul endroit ; on y perd une API qu'il faudra construire le jour où un
  autre client en aura besoin.

## Résultat

<!-- TODO(contenu) : où en est la plateforme aujourd'hui. Nombre de modules en
     production, clients ou prestataires utilisateurs, volume de tickets
     traités, ancienneté du plus vieux client. Un chiffre vérifiable vaut mieux
     que trois adjectifs — et si les chiffres sont confidentiels, une phrase
     qualitative honnête vaut mieux qu'un chiffre flou. -->

## Mon rôle

Je suis **lead developer** sur la plateforme : j'encadre l'équipe, je relis le
code, et je porte les décisions techniques du produit.

Sept ans sur la même plateforme, c'est une position particulière — on ne livre
pas puis on s'en va, on vit avec ce qu'on a construit et on le reprend quand
il a vieilli.
