---
titre: Isi-APP
resume: SaaS multi-modules pour piloter un système d'information — ticketing, gestion de projet, parc et entités — avec un espace prestataire multi-clients.
annee: '2019 — aujourd’hui'
role: Associé et développeur salarié, ISI-APP
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

Je travaille sur Isi-APP depuis **2019**. À l'époque, le produit était
développé au sein d'ISI-DSI, la société de services du groupe. En 2023, le
groupe a séparé ses deux métiers — le service d'un côté, l'édition de l'autre —
et ISI-APP est devenue une société à part entière. Le produit, lui, n'a pas
changé de mains : c'est le même, poursuivi sans rupture.

Le logiciel porte une promesse simple : **la boîte à outils française pour
piloter et simplifier votre SI**.

Concrètement, c'est une plateforme SaaS multi-modules qui couvre la gestion
d'un système d'information de bout en bout : **ticketing**, **gestion de
projet**, **gestion de parc**, et **gestion des entités et des adresses**.
Plutôt que d'empiler quatre outils qui ne se parlent pas, tout vit dans la même
base et le même référentiel.

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

<!-- TODO(contenu) : c'est la partie qui vaut le plus cher, et c'est celle
     dont je n'ai pas la matière. Quelques pistes de ce qui m'intéresse :

     - Comment le cloisonnement multi-clients est-il appliqué ? Scoping global
       sur les requêtes, base par client, policies Laravel, middleware ?
       Et pourquoi cette approche plutôt qu'une autre ?
     - Comment les modules sont-ils séparés dans le code ? Modules Laravel,
       packages, simple découpage par domaine ?
     - Livewire plutôt qu'une SPA : qu'est-ce que ça a fait gagner, et
       qu'est-ce que ça a coûté ?
     - Le modèle de droits : rôles, permissions fines, les deux ? Comment
       évite-t-on qu'il devienne ingérable en grandissant ? -->

## Arbitrages

<!-- TODO(contenu) : ce que vous avez volontairement écarté et ce que ça a
     coûté. Par exemple : un module repoussé, une dette assumée sur un point
     précis, un choix de simplicité qui limite aujourd'hui. Un projet sans
     arbitrage raconté sonne faux. -->

## Résultat

<!-- TODO(contenu) : où en est la plateforme aujourd'hui. Nombre de modules en
     production, clients ou prestataires utilisateurs, volume de tickets
     traités, ancienneté du plus vieux client. Un chiffre vérifiable vaut mieux
     que trois adjectifs — et si les chiffres sont confidentiels, une phrase
     qualitative honnête vaut mieux qu'un chiffre flou. -->

## Mon rôle

Je suis **associé d'ISI-APP**, et j'y travaille comme **développeur salarié**.
Je n'ai pas quitté le code en devenant associé : je porte le produit sur le
plan technique et je participe aux décisions de la société.

Sept ans sur la même plateforme, c'est une position particulière — on ne livre
pas puis on s'en va, on vit avec ce qu'on a construit et on le reprend quand
il a vieilli.

<!-- TODO(contenu) : préciser le périmètre concret si tu veux aller plus loin —
     conception, encadrement, revue de code, mise en production, relation
     client. Ce qui relève de toi personnellement. -->
