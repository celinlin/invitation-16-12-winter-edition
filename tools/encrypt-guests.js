#!/usr/bin/env node
/* Chiffre la liste des invités pour des liens courts.
   Lit guests.local.json (local, ignoré par Git), ajoute à chaque invité un code et une clé s'ils manquent,
   écrit guests.enc.json (publié : uniquement du texte chiffré) et affiche les liens courts.
   Usage : node tools/encrypt-guests.js [adresse-du-site] */
const fs = require("fs");
const path = require("path");
const { webcrypto } = require("crypto");
const subtle = webcrypto.subtle;
const root = path.join(__dirname, "..");
const src = path.join(root, "guests.local.json");
const out = path.join(root, "guests.enc.json");
const site = (process.argv[2] || "https://celinlin.github.io/invitation-16-12-winter-edition/").replace(/\/?$/, "/");
const b64u = (buf) => Buffer.from(buf).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const fromB64u = (s) => Buffer.from(s.replace(/-/g, "+").replace(/_/g, "/"), "base64");

(async () => {
  const guests = JSON.parse(fs.readFileSync(src, "utf8"));
  const used = new Set(guests.map((g) => g.code).filter(Boolean));
  const enc = {};
  for (const g of guests) {
    if (!g.code) { do { g.code = b64u(webcrypto.getRandomValues(new Uint8Array(6))); } while (used.has(g.code)); used.add(g.code); }
    if (!g.key) g.key = b64u(webcrypto.getRandomValues(new Uint8Array(16)));
    const key = await subtle.importKey("raw", fromB64u(g.key), "AES-GCM", false, ["encrypt"]);
    const iv = webcrypto.getRandomValues(new Uint8Array(12));
    const payload = { p: g.prenom || "", n: g.nom || "", w: g.why || "", a: g.awaits || "", we: g.why_en || "", ae: g.awaits_en || "" };
    const ct = await subtle.encrypt({ name: "AES-GCM", iv }, key, new TextEncoder().encode(JSON.stringify(payload)));
    enc[g.code] = { iv: b64u(iv), ct: b64u(ct) };
  }
  fs.writeFileSync(src, JSON.stringify(guests, null, 2) + "\n");
  fs.writeFileSync(out, JSON.stringify(enc) + "\n");
  console.log(`guests.enc.json : ${guests.length} invité(s) chiffré(s)\n`);
  for (const g of guests) console.log(`${[g.prenom, g.nom].filter(Boolean).join(" ")}\n  ${site}?i=${g.code}.${g.key}\n`);
})();
