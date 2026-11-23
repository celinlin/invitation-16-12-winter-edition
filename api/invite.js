// Fonction serveur Vercel : renvoie UNIQUEMENT la fiche de l'invité demandé.
// La liste complète est dans la variable d'environnement GUESTS_JSON (Vercel → Settings → Environment Variables),
// jamais dans le dépôt GitHub ni dans le navigateur.
module.exports = (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Robots-Tag", "noindex");
  const id = String((req.query && req.query.pour) || "").trim().toLowerCase();
  if (!/^[a-z0-9-]{1,80}$/.test(id)) return res.status(404).json({});
  let guests = [];
  try { guests = JSON.parse(process.env.GUESTS_JSON || "[]"); } catch (e) { guests = []; }
  const g = Array.isArray(guests) ? guests.find((x) => String(x.id).toLowerCase() === id) : null;
  if (!g) return res.status(404).json({});
  return res.status(200).json({ prenom: g.prenom || "", nom: g.nom || "", why: g.why || "", awaits: g.awaits || "" });
};
