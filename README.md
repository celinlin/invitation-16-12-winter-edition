# Invitation interactive — Intertech Talents · Paris · 16.12

Microsite statique : une enveloppe 3D qui s'ouvre, puis une invitation **personnelle par invité** (son nom, pourquoi on l'invite, ce qui l'attend), avec le bouton d'inscription Luma.

## Fichiers

| Fichier | Rôle |
|---|---|
| `content.js` | **Le seul fichier à éditer** : textes de la soirée, lien Luma, liste des invités |
| `index.html` | Structure (enveloppe, carte, logo officiel en SVG) |
| `styles.css` | Charte : palette, typographies, mise en page, mobile |
| `invitation.js` | Animation GSAP (ouverture, transition, compte à rebours, .ics, rejouer) |
| `liens.html` | Page interne : liste des liens personnels, avec un bouton pour copier chaque lien. **Ne pas la mettre en ligne** |
| `assets/` | Logo officiel (SVG vectorisé depuis le site) et favicon |

## Ajouter un invité

Dans `content.js`, ajoutez une entrée dans `guests` :

```js
{ id: "x7k2-prenom-nom", prenom: "Prénom", nom: "Nom",
  why: "Pourquoi cette personne est invitée.",
  awaits: "" }   // vide = texte par défaut
```

Son lien : `https://<domaine>/?pour=x7k2-prenom-nom` (ou `/#x7k2-prenom-nom`).
Ajoutez un petit préfixe aléatoire à l'`id` pour qu'on ne devine pas les liens des autres.
Sans identifiant (ou avec un identifiant inconnu), la page affiche une invitation générique, sans nom.

## Mettre en ligne

Aucune compilation à faire : déposez le dossier tel quel sur Vercel, Netlify, GitHub Pages ou n'importe quel hébergeur statique (sans `liens.html`).
Pour tester en local : `python3 -m http.server`, puis http://localhost:8000/?pour=fella-benabbas

## Règles du brief appliquées

Aucune adresse (« Un lieu très élégant au cœur de Paris »). Aucun nom ni nombre de speakers (« Les speakers seront bientôt annoncés »). Aucun prix (« Billet catering inclus »). Aucun nombre de participants (« Places limitées »). On dit « fireside chat », jamais « panel ». Les horaires exacts sont affichés, ainsi que « Aucun billet ne sera vendu sur place ».

## Polices

La charte utilise **Heading Now** et **Now**, qui sont payantes. En attendant leurs fichiers, le site utilise des équivalents Google Fonts : Antonio et Jost (plus JetBrains Mono pour les détails « tech »).
Pour passer aux polices officielles : déposez les `.woff2` dans `assets/fonts/` et décommentez le bloc `@font-face` en haut de `styles.css`.
