# Invitation interactive — Intertech Talents · Paris · 16.12

Microsite : une enveloppe d'où dépasse une carte holographique, puis une invitation **personnelle par invité** (son nom, pourquoi on l'invite, ce qui l'attend), avec le bouton de réservation Luma.

## Confidentialité : la liste des invités n'est pas dans ce dépôt

- **En ligne (Vercel)** : la liste est dans la variable d'environnement `GUESTS_JSON`. La fonction `api/invite.js` ne renvoie que la fiche de l'invité demandé. Le navigateur ne reçoit jamais la liste complète.
- **En local** : la liste est dans `guests.local.json`, ignoré par Git (`.gitignore`) et par Vercel (`.vercelignore`).

## Liens courts (recommandé)

Après chaque modification de `guests.local.json`, lancez :

```bash
node tools/encrypt-guests.js
```

Le script attribue à chaque invité un code et une clé, écrit `guests.enc.json` (fiches chiffrées, publiées avec le site) et affiche les liens courts : `…/?i=CODE.CLÉ`. Le fichier publié est illisible sans la clé, qui n'existe que dans le lien de chaque invité. Poussez ensuite `guests.enc.json` sur GitHub. `liens.html` affiche aussi ces liens courts.

## Liens autonomes (GitHub Pages ou tout hébergement statique)

`liens.html` génère pour chaque invité un lien de la forme `?i=…` qui contient sa fiche (prénom, nom, pourquoi, ce qui l'attend) encodée dans l'URL. Aucune liste n'est stockée en ligne : seule la personne qui a son lien voit son invitation. Ces liens fonctionnent sur GitHub Pages, sans serveur.

## Fichiers

| Fichier | Rôle |
|---|---|
| `content.js` | Textes de la soirée et lien Luma (aucune donnée d'invité) |
| `guests.local.json` | **Local uniquement** : la liste des invités |
| `api/invite.js` | Fonction Vercel : renvoie la fiche d'un seul invité |
| `index.html`, `styles.css`, `invitation.js` | Le site et l'animation (GSAP) |
| `liens.html` | **Local uniquement** : liste des liens personnels, avec un bouton pour copier chaque lien |
| `assets/` | Logo officiel (SVG) et favicon |

## Ajouter un invité

1. Ajoutez une entrée dans `guests.local.json` :

```json
{ "id": "x7k2-prenom-nom", "prenom": "Prénom", "nom": "Nom",
  "why": "Pourquoi cette personne est invitée.", "awaits": "" }
```

`awaits` vide = texte par défaut. L'`id` ne doit contenir que des minuscules, des chiffres et des tirets. Ajoutez un petit préfixe aléatoire pour qu'on ne devine pas les liens.

2. Mettez à jour la variable `GUESTS_JSON` sur Vercel : **Project → Settings → Environment Variables**. Collez-y tout le contenu de `guests.local.json`, puis redéployez. Avec la CLI Vercel :

```bash
vercel env rm GUESTS_JSON production -y
```

```bash
vercel env add GUESTS_JSON production < guests.local.json
```

```bash
vercel --prod
```

Le lien de l'invité : `https://<projet>.vercel.app/?pour=x7k2-prenom-nom`. Sans identifiant (ou avec un identifiant inconnu), la page affiche une invitation générique, sans nom.

## Tester en local

```bash
python3 -m http.server 8000
```

Puis ouvrez http://localhost:8000/?pour=<id> et http://localhost:8000/liens.html

## Règles du brief appliquées

Aucune adresse (« Un lieu très élégant au cœur de Paris »). Aucun nom ni nombre de speakers (« Les speakers seront bientôt annoncés »). Aucun prix (« Billet catering inclus »). Aucun nombre de participants (« Places limitées »). On dit « fireside chat », jamais « panel ». Les horaires exacts sont affichés, ainsi que « Aucun billet ne sera vendu sur place ».

## Polices

La charte utilise **Heading Now** et **Now**, qui sont payantes. En attendant leurs fichiers, le site utilise des équivalents Google Fonts : Antonio et Jost.
Pour passer aux polices officielles : déposez les `.woff2` dans `assets/fonts/` et décommentez le bloc `@font-face` en haut de `styles.css`.
