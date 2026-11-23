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
    dateShort: "16.12.2026",
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
    signature: "Intertech Talents · Édition Winter 2026"
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
     INVITÉS : la liste n'est PAS dans ce fichier (ni dans GitHub).
     - En ligne : variable d'environnement Vercel GUESTS_JSON, lue par api/invite.js
       qui ne renvoie que l'invité demandé.
     - En local : fichier guests.local.json (ignoré par Git).
     Format d'un invité : { "id", "prenom", "nom", "why", "awaits" } — voir README.
     ------------------------------------------------------------------------ */

  /* ------------------------------------------------------------------------
     TEXTES DE L'INTERFACE (FR / EN)
     ------------------------------------------------------------------------ */
  ui: {
    fr: {
      why: "Pourquoi vous", awaits: "Ce qui vous attend", date: "Date", place: "Lieu",
      countdown: "Ouverture des portes dans", d: "jours", h: "heures", m: "min", s: "sec",
      countdownLive: "C'est ce soir — portes ouvertes depuis 18h30, fermeture à 19h15",
      program: "Déroulé", ics: "Ajouter au calendrier", replay: "Revoir l'ouverture", for: "Pour",
      hint: "Ouvrir votre invitation", hintGuest: "{p}, ouvrez votre invitation",
      openLabel: "Ouvrir votre invitation", openLabelGuest: "Ouvrir l'invitation de {n}",
      genericCover: "Invitation", genericName: "Votre invitation", genericRecipient: "Vous",
      docTitle: "Votre invitation — Intertech Talents", docTitleGuest: "{p}, votre invitation — Intertech Talents",
      live: "Invitation ouverte. Soirée du {d}.", liveGuest: "Invitation de {n} ouverte. Soirée du {d}."
    },
    en: {
      why: "Why you", awaits: "What awaits you", date: "Date", place: "Venue",
      countdown: "Doors open in", d: "days", h: "hours", m: "min", s: "sec",
      countdownLive: "It's tonight — doors opened at 6:30 PM, they close at 7:15 PM",
      program: "Schedule", ics: "Add to calendar", replay: "Replay the opening", for: "For",
      hint: "Open your invitation", hintGuest: "{p}, open your invitation",
      openLabel: "Open your invitation", openLabelGuest: "Open {n}'s invitation",
      genericCover: "Invitation", genericName: "Your invitation", genericRecipient: "You",
      docTitle: "Your invitation — Intertech Talents", docTitleGuest: "{p}, your invitation — Intertech Talents",
      live: "Invitation opened. Evening of {d}.", liveGuest: "{n}'s invitation opened. Evening of {d}."
    }
  },

  /* ------------------------------------------------------------------------
     VERSION ANGLAISE : remplace les textes français quand on choisit EN.
     ------------------------------------------------------------------------ */
  en: {
    event: {
      eyebrow: "Personal invitation",
      dateLong: "Wednesday, December 16, 2026",
      place: "A very elegant venue in the heart of Paris",
      placeNote: "The address is sent only to guests whose seat is confirmed.",
      club: "The social club for top tech operators and founders, 700+ members between Paris and San Francisco.",
      stage: "Fireside chat: speakers will be announced soon.",
      program: [
        { time: "6:30 PM", label: "Doors open and networking" },
        { time: "7:15 PM", label: "Doors close — no entry after" },
        { time: "7:30 PM", label: "Fireside chat, until 9 PM" },
        { time: "9 PM", label: "Networking cocktail, until 11 PM" }
      ],
      facts: ["By invitation", "Limited seats", "Catering included"],
      noTickets: "No tickets will be sold at the door.",
      signature: "Intertech Talents · Winter Edition 2026",
      calendarLocation: "Paris (address sent to guests whose seat is confirmed)"
    },
    rsvp: {
      heading: "Get your ticket",
      label: "Book my seat",
      heroLabel: "Book my seat",
      note: "Seats are limited and going fast."
    },
    defaults: {
      greeting: "Hello,",
      intro: "On Wednesday, December 16, Intertech Talents brings together top tech operators and founders in Paris: tech sales, product, engineering, data, marketing, comms. An evening to meet your peers and future colleagues, with a fireside chat and plenty of networking.",
      why: "Because the best conversations happen when the right people are in the same room, and you are one of them.",
      awaits: "Networking from 6:30 PM, a fireside chat from 7:30 to 9 PM, then a networking cocktail until 11 PM, in a very elegant venue in the heart of Paris. Catering included."
    }
  }
};
