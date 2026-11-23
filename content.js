/* ==========================================================================
   INTERTECH TALENTS — Contenu de l'invitation
   --------------------------------------------------------------------------
   C'est le SEUL fichier à modifier pour changer les textes ou les invités.

   Lien personnel d'un invité :  https://<votre-domaine>/?pour=<id>
   (ou, si l'hébergeur ignore les paramètres :  https://<votre-domaine>/#<id>)
   Sans identifiant, la page affiche une invitation générique (sans nom).

   Règles du brief respectées ici (ne pas les casser en éditant) :
   - jamais d'adresse ni d'arrondissement → « Un lieu très élégant au cœur de Paris »
   - jamais de nom de speaker non confirmé, ni de nombre de speakers
     → « Les speakers seront bientôt annoncés »
   - jamais de prix → « Billet catering inclus »
   - jamais de nombre de participants → « Places limitées »
   - « fireside chat », jamais « panel »
   ========================================================================== */

window.INVITATION = {
  // Invité affiché quand l'URL ne précise personne ("" = invitation générique).
  defaultGuest: "",

  event: {
    eyebrow: "Invitation personnelle",
    title: "Paris · 16.12",
    dateLong: "Mercredi 16 décembre 2026",
    // Pour le compte à rebours et l'ajout au calendrier (heure de Paris)
    doorsISO: "2026-12-16T18:30:00+01:00",
    endISO: "2026-12-16T23:00:00+01:00",
    calendarTitle: "Intertech Talents — Paris · 16.12",
    calendarLocation: "Paris (adresse envoyée aux personnes dont la place est confirmée)",
    place: "Un lieu très élégant au cœur de Paris",
    placeNote: "Adresse envoyée uniquement aux personnes dont la place est confirmée.",
    club: "Le social club des top tech operators et founders, 700+ membres entre Paris et San Francisco.",
    stage: "Fireside chat : les speakers seront bientôt annoncés.",
    program: [
      { time: "18h30", label: "Ouverture des portes et networking" },
      { time: "19h15", label: "Fermeture des portes — plus d'entrée après" },
      { time: "19h30", label: "Fireside chat, jusqu'à 21h" },
      { time: "21h", label: "Cocktail networking, jusqu'à 23h" }
    ],
    facts: ["Sur invitation", "Places limitées", "Billet catering inclus"],
    noTickets: "Aucun billet ne sera vendu sur place.",
    signature: "Le batch Winter 2026"
  },

  rsvp: {
    heading: "Prenez votre billet",
    label: "Réserver ma place",
    url: "https://luma.com/pii2o25a",
    heroLabel: "Réserver ma place",
    note: "Les places sont limitées et partent vite."
  },

  /* Texte utilisé quand l'invité n'a pas de champ personnalisé,
     et pour l'invitation générique (sans ?pour=…). */
  defaults: {
    greeting: "Bonjour,",
    intro: "Le mercredi 16 décembre, Intertech Talents réunit à Paris les top tech operators et founders : tech sales, produit, engineering, data, marketing, com. Une soirée pour rencontrer vos homologues et vos futurs collègues, avec un fireside chat et beaucoup de networking.",
    why: "Parce que les meilleures conversations naissent quand on réunit les bonnes personnes dans la même pièce, et que vous en faites partie.",
    awaits: "Du networking dès 18h30, un fireside chat de 19h30 à 21h, puis un cocktail networking jusqu'à 23h, dans un lieu très élégant au cœur de Paris. Billet catering inclus."
  },

  /* ------------------------------------------------------------------------
     INVITÉS — une entrée par personne.
     id      : identifiant dans l'URL (minuscules, sans espace). Pour éviter
               qu'on devine les liens, ajoutez un suffixe aléatoire, ex. "c7k2-camille".
     prenom  : affiché en grand sur l'enveloppe et la carte.
     nom     : facultatif.
     why     : pourquoi cette personne est invitée (2–3 phrases max).
     awaits  : ce qui l'attend (facultatif → texte par défaut sinon).
     ⚠️ Les deux entrées ci-dessous sont des EXEMPLES fictifs : à remplacer.
     ------------------------------------------------------------------------ */
  guests: [
    {
      id: "fella-benabbas",
      prenom: "Fella",
      nom: "Benabbas",
      why: "Parce que cette soirée vous ressemble : des top tech operators et founders réunis pour de vraies conversations, loin des formats impersonnels. On tient à vous compter parmi nous le 16 décembre.",
      awaits: ""
    },
    {
      id: "exemple-camille",
      prenom: "Camille",
      nom: "Exemple",
      why: "Votre parcours en produit et votre énergie à faire grandir les équipes autour de vous sont exactement ce qui fait la richesse de cette communauté. On aimerait vous avoir dans la pièce.",
      awaits: "Des échanges avec des Head of Product et des founders qui vivent les mêmes défis que vous, un fireside chat pour prendre de la hauteur, et un cocktail pour prolonger les conversations jusqu'à 23h."
    },
    {
      id: "exemple-sacha",
      prenom: "Sacha",
      nom: "Exemple",
      why: "Vous faites partie des personnes qui construisent la tech sales de demain. On pense que vos rencontres du 16 décembre pourraient compter — dans les deux sens.",
      awaits: ""
    }
  ]
};
