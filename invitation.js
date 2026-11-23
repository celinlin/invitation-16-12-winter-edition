/* ==========================================================================
   INTERTECH TALENTS — Invitation interactive (GSAP)
   Le contenu vient de content.js ; ce fichier ne contient que la mise en scène.
   ========================================================================== */
(async function () {
  "use strict";

  const BASE = window.INVITATION;
  /* Langue : ?lang=en|fr, sinon le dernier choix du visiteur, sinon français */
  const pickLang = (v) => (v === "en" || v === "fr" ? v : null);
  let lang = pickLang(new URLSearchParams(location.search).get("lang"));
  if (!lang) { try { lang = pickLang(localStorage.getItem("it-lang")); } catch (e) {} }
  lang = lang || "fr";
  const bundle = (l) => l === "en"
    ? { ...BASE, event: { ...BASE.event, ...BASE.en.event }, rsvp: { ...BASE.rsvp, ...BASE.en.rsvp }, defaults: { ...BASE.defaults, ...BASE.en.defaults } }
    : BASE;
  let C = bundle(lang);
  let U = BASE.ui[lang];
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* ---------- 1. Invité ---------- */
  const params = new URLSearchParams(location.search);
  const token = (params.get("i") || "").trim();
  const rawId = (params.get("pour") || params.get("invite") || decodeURIComponent(location.hash.slice(1)) || C.defaultGuest || "").trim().toLowerCase();
  const g = decodeToken(token) || await loadGuest(rawId);

  /* Lien autonome : la fiche de l'invité est encodée dans le lien lui-même (?i=…),
     générée par liens.html. Aucune liste d'invités n'est stockée en ligne. */
  function decodeToken(t) {
    if (!t || t.length > 4000 || !/^[A-Za-z0-9_-]+$/.test(t)) return null;
    try {
      const b64 = t.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((t.length + 3) % 4);
      const bytes = Uint8Array.from(atob(b64), (ch) => ch.charCodeAt(0));
      const o = JSON.parse(new TextDecoder().decode(bytes));
      if (!o || !o.p) return null;
      const s = (v, n) => String(v || "").slice(0, n);
      return { prenom: s(o.p, 80), nom: s(o.n, 80), why: s(o.w, 600), awaits: s(o.a, 600), why_en: s(o.we, 600), awaits_en: s(o.ae, 600) };
    } catch (e) { return null; }
  }

  /* L'invité est demandé au serveur (api/invite) : seule sa fiche est renvoyée,
     la liste complète n'est jamais envoyée au navigateur.
     En local (sans serveur Vercel), on lit guests.local.json. */
  async function loadGuest(id) {
    if (!id || !/^[a-z0-9-]{1,80}$/.test(id)) return null;
    const pick = (x) => x && x.prenom ? { prenom: String(x.prenom), nom: String(x.nom || ""), why: String(x.why || ""), awaits: String(x.awaits || ""), why_en: String(x.why_en || ""), awaits_en: String(x.awaits_en || "") } : null;
    try {
      const r = await fetch(`api/invite?pour=${encodeURIComponent(id)}`, { cache: "no-store" });
      if (r.ok && (r.headers.get("content-type") || "").includes("json")) return pick(await r.json());
      if (r.status === 404 && (r.headers.get("content-type") || "").includes("json")) return null;
    } catch (e) {}
    try {
      const r = await fetch("guests.local.json", { cache: "no-store" });
      if (r.ok) { const list = await r.json(); return pick(list.find((x) => String(x.id).toLowerCase() === id)); }
    } catch (e) {}
    return null;
  }

  const fullName = g ? [g.prenom, g.nom].filter(Boolean).join(" ") : "";
  const fill = (t) => t.replace("{p}", g ? g.prenom : "").replace("{n}", fullName).replace("{d}", C.event.dateLong);
  let data, ticking = false;
  if (!g) document.documentElement.classList.add("is-generic");

  /* ---------- 2. Rendu (textContent uniquement : aucun HTML injecté) ---------- */
  const tl = $("#timeline"), chips = $("#chips");
  function render() {
    C = bundle(lang); U = BASE.ui[lang];
    const en = lang === "en";
    data = {
      event: C.event, rsvp: C.rsvp, defaults: C.defaults, ui: U,
      guest: {
        prenomOrGeneric: g ? g.prenom : U.genericCover,
        fullName: g ? fullName : U.genericName,
        fullNameOrGeneric: g ? fullName : U.genericRecipient,
        why: (g && (en ? g.why_en : g.why)) || C.defaults.why,
        awaits: (g && (en ? g.awaits_en : g.awaits)) || C.defaults.awaits,
        code: C.event.dateShort,
        hint: fill(g ? U.hintGuest : U.hint)
      },
      a11y: { openLabel: fill(g ? U.openLabelGuest : U.openLabel) }
    };
    const get = (path) => path.split(".").reduce((o, k) => (o == null ? o : o[k]), data);
    $$("[data-bind]").forEach((el) => { const v = get(el.dataset.bind); if (v != null && typeof v !== "object") el.textContent = v; });
    tl.textContent = "";
    C.event.program.forEach((p) => {
      const li = document.createElement("li"); li.className = "step";
      const t = document.createElement("span"); t.className = "step-time"; t.textContent = p.time;
      const l = document.createElement("span"); l.className = "step-label"; l.textContent = p.label;
      li.append(t, l); tl.appendChild(li);
    });
    chips.textContent = "";
    C.event.facts.forEach((f) => { const li = document.createElement("li"); li.textContent = f; chips.appendChild(li); });
    document.documentElement.lang = lang;
    document.title = fill(g ? U.docTitleGuest : U.docTitle);
    $$(".lang-btn").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.lang === lang)));
    if (ticking) tick();
  }
  render();

  $$(".lang-btn").forEach((b) => b.addEventListener("click", () => {
    if (b.dataset.lang === lang) return;
    lang = b.dataset.lang;
    try { localStorage.setItem("it-lang", lang); } catch (e) {}
    const targets = [$(".scene"), $("#card")];
    gsap.to(targets, { autoAlpha: .35, duration: .18, ease: "power1.out", onComplete() {
      render();
      gsap.to(targets, { autoAlpha: 1, duration: .3, ease: "power1.out", clearProps: "opacity,visibility" });
    } });
  }));

  const logoTpl = $("#tpl-logo");
  $$("[data-logo]").forEach((el) => {
    const svg = logoTpl.content.firstElementChild.cloneNode(true);
    if (el.closest(".card, .env-pocket")) { svg.setAttribute("aria-hidden", "true"); svg.removeAttribute("role"); }
    el.appendChild(svg);
  });

  const rsvpBtn = $("#rsvpBtn");
  rsvpBtn.href = C.rsvp.url;
  $("#heroCta").href = C.rsvp.url;

  /* ---------- Compte à rebours vers l'ouverture des portes ---------- */
  const doors = new Date(C.event.doorsISO).getTime();
  const end = new Date(C.event.endISO).getTime();
  const cdEls = {}; $$("[data-cd]").forEach((el) => (cdEls[el.dataset.cd] = el));
  const cdBox = $("#countdown"), cdTitle = $("#cdTitle");
  const pad = (n) => String(n).padStart(2, "0");
  function tick() {
    const now = Date.now();
    if (now >= end) { cdBox.hidden = true; return; }
    if (now >= doors) { cdBox.classList.add("is-live"); cdTitle.textContent = U.countdownLive; return; }
    let s = Math.floor((doors - now) / 1000);
    const d = Math.floor(s / 86400); s -= d * 86400;
    const h = Math.floor(s / 3600); s -= h * 3600;
    const m = Math.floor(s / 60); s -= m * 60;
    cdEls.d.textContent = pad(d); cdEls.h.textContent = pad(h); cdEls.m.textContent = pad(m); cdEls.s.textContent = pad(s);
  }
  tick(); setInterval(tick, 1000); ticking = true;

  /* ---------- Ajout au calendrier (.ics généré localement) ---------- */
  $("#icsBtn").addEventListener("click", () => {
    const fmt = (d) => new Date(d).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const esc = (t) => String(t).replace(/([,;\\])/g, "\\$1").replace(/\n/g, "\\n");
    const desc = [
      C.event.club, "",
      ...C.event.program.map((p) => `${p.time} — ${p.label}`), "",
      C.event.noTickets, `${C.rsvp.label} : ${C.rsvp.url}`
    ].join("\n");
    const ics = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Intertech Talents//Invitation//FR", "CALSCALE:GREGORIAN", "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      `UID:intertech-1612-${(g && g.id) || "invite"}@intertech-talents.com`,
      `DTSTAMP:${fmt(Date.now())}`,
      `DTSTART:${fmt(C.event.doorsISO)}`, `DTEND:${fmt(C.event.endISO)}`,
      `SUMMARY:${esc(C.event.calendarTitle)}`, `LOCATION:${esc(C.event.calendarLocation)}`,
      `DESCRIPTION:${esc(desc)}`, `URL:${C.rsvp.url}`,
      "BEGIN:VALARM", "TRIGGER:-PT2H", "ACTION:DISPLAY", "DESCRIPTION:Intertech Talents — portes à 18h30, fermeture à 19h15", "END:VALARM",
      "END:VEVENT", "END:VCALENDAR"
    ].join("\r\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
    link.download = "intertech-talents-16-decembre.ics";
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(link.href), 2000);
  });

  /* ---------- 3. Éléments ---------- */
  const envelope = $("#envelope"), envStage = $("#envStage"), envTilt = $("#envTilt");
  const seal = $("#seal"), card = $("#card"), cover = $(".cover", card);
  const openBtn = $("#openBtn"), hint = $("#hint"), hintLine = $(".hint-line");
  const reading = $("#reading"), slot = $("#slot"), scene = $("#scene");
  const recipient = $(".recipient"), shadow = $(".env-shadow"), live = $("#live");
  const replayBtn = $("#replayBtn"), guestName = $("#guestName");

  // Sans GSAP (CDN bloqué) : on affiche directement la carte.
  if (!window.gsap) {
    envelope.style.visibility = "visible";
    openBtn.addEventListener("click", () => {
      slot.appendChild(card); card.classList.add("is-full");
      scene.style.display = "none"; reading.style.visibility = "visible"; reading.removeAttribute("aria-hidden");
      cover.style.display = "none"; guestName.focus();
    });
    replayBtn.addEventListener("click", () => location.reload());
    return;
  }

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

  let opened = false, busy = false;
  let floatTween, hintTween, master;

  /* ---------- 4. Entrée ---------- */
  function intro() {
    gsap.set(envelope, { visibility: "visible" });
    gsap.set(seal, { autoAlpha: 1, scale: 1, y: 0, rotation: 0 });
    gsap.set(card, { yPercent: 0 });

    if (reduce.matches) {
      gsap.fromTo([envStage, hint], { autoAlpha: 0 }, { autoAlpha: 1, duration: .5 });
      openBtn.disabled = false;
      return;
    }

    const t = gsap.timeline({ defaults: { ease: "expo.out" } });
    t.fromTo(envStage, { autoAlpha: 0, y: 60, rotationX: 18, scale: .94 },
      { autoAlpha: 1, y: 0, rotationX: 0, scale: 1, duration: 1.6 })
     .fromTo(shadow, { autoAlpha: 0, scale: .7 }, { autoAlpha: 1, scale: 1, duration: 1.4 }, "<.1")
     .fromTo(seal, { autoAlpha: 0, scale: 1.35 }, { autoAlpha: 1, scale: 1, duration: .7, ease: "back.out(1.6)" }, "-=.95")
     .fromTo(recipient, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: .9 }, "<.1")
     .fromTo(hint, { autoAlpha: 0, y: 10 }, { autoAlpha: .85, y: 0, duration: .9 }, "-=.5")
     .add(() => { openBtn.disabled = false; idle(); });
  }

  let holoTween;
  function idle() {
    holoTween = gsap.fromTo(card, { "--px": .2, "--py": .3 }, { "--px": .8, "--py": .65, duration: 5, ease: "sine.inOut", yoyo: true, repeat: -1 });
    floatTween = gsap.to(envelope, { y: -6, duration: 2.8, ease: "sine.inOut", yoyo: true, repeat: -1 });
    gsap.to(shadow, { scale: .94, autoAlpha: .8, duration: 2.8, ease: "sine.inOut", yoyo: true, repeat: -1 });
    hintTween = gsap.fromTo(hintLine, { backgroundPosition: "0 0", scaleX: .4, transformOrigin: "0 50%" },
      { scaleX: 1, duration: 1.6, ease: "power2.inOut", yoyo: true, repeat: -1 });
  }

  /* ---------- 5. Inclinaison au survol (desktop) ---------- */
  const tiltX = gsap.quickTo(envTilt, "rotationX", { duration: .8, ease: "power3.out" });
  const tiltY = gsap.quickTo(envTilt, "rotationY", { duration: .8, ease: "power3.out" });
  const sheen = $("#sheen");
  /* Pointeur ou doigt → reflets holographiques.
     Sur l'enveloppe : la carte sort un peu et s'illumine (inclinaison 3D à la souris uniquement).
     Sur l'invitation ouverte : l'hologramme couvre toute la carte et suit le point de contact. */
  let relax;
  const cardTiltX = gsap.quickTo(card, "rotationX", { duration: .7, ease: "power3.out" });
  const cardTiltY = gsap.quickTo(card, "rotationY", { duration: .7, ease: "power3.out" });
  function holoAt(x, y, isMouse) {
    if (reduce.matches || busy) return;
    clearTimeout(relax);
    if (!opened) {
      const r = envTilt.getBoundingClientRect();
      sheen.style.setProperty("--mx", `${((x - r.left) / r.width) * 100}%`);
      sheen.style.setProperty("--my", `${((y - r.top) / r.height) * 100}%`);
      const cr = card.getBoundingClientRect();
      const over = x > cr.left && x < cr.right && y > cr.top && y < r.bottom;
      holoTween && holoTween.pause();
      gsap.to(card, {
        "--px": gsap.utils.clamp(0, 1, (x - cr.left) / cr.width),
        "--py": gsap.utils.clamp(0, 1, (y - cr.top) / (r.bottom - cr.top)),
        "--hov": over ? 1 : .3, yPercent: over ? -16 : 0,
        duration: .7, ease: "power3.out", overwrite: "auto"
      });
      // l'enveloppe penche vers le pointeur ou le doigt
      tiltY(gsap.utils.clamp(-9, 9, ((x - (r.left + r.width / 2)) / (r.width / 2)) * 9));
      tiltX(gsap.utils.clamp(-8, 8, (-(y - (r.top + r.height / 2)) / (r.height / 2)) * 8));
      if (!isMouse) relax = setTimeout(() => {
        gsap.to(card, { "--hov": 0, yPercent: 0, duration: 1, ease: "power3.out", overwrite: "auto" });
        tiltX(0); tiltY(0);
        holoTween && holoTween.resume();
      }, 1200);
    } else {
      const r = card.getBoundingClientRect();
      gsap.to(card, {
        "--px": gsap.utils.clamp(0, 1, (x - r.left) / r.width),
        "--py": gsap.utils.clamp(0, 1, (y - r.top) / r.height),
        "--hov": 1, duration: .6, ease: "power3.out", overwrite: "auto"
      });
      // la carte ouverte penche en 3D autour de la zone visible à l'écran
      const vh = window.innerHeight, cy = vh / 2;
      gsap.set(card, { transformPerspective: 1400, transformOrigin: `50% ${cy - r.top}px` });
      cardTiltY(gsap.utils.clamp(-6, 6, ((x - (r.left + r.width / 2)) / (r.width / 2)) * 6));
      cardTiltX(gsap.utils.clamp(-5, 5, (-(y - cy) / cy) * 5));
      relax = setTimeout(() => {
        gsap.to(card, { "--hov": .15, duration: 1.4, ease: "power2.out" });
        cardTiltX(0); cardTiltY(0);
      }, isMouse ? 1600 : 900);
    }
  }
  window.addEventListener("pointermove", (e) => holoAt(e.clientX, e.clientY, e.pointerType === "mouse"), { passive: true });
  window.addEventListener("pointerdown", (e) => { if (e.pointerType !== "mouse") holoAt(e.clientX, e.clientY, false); }, { passive: true });
  window.addEventListener("touchmove", (e) => { const t = e.touches[0]; if (t) holoAt(t.clientX, t.clientY, false); }, { passive: true });
  document.addEventListener("pointerleave", () => {
    if (opened) { if (!busy) { cardTiltX(0); cardTiltY(0); } return; }
    gsap.to(card, { "--hov": 0, yPercent: 0, duration: .8, ease: "power3.out", overwrite: "auto" });
    holoTween && holoTween.resume();
  });

  /* ---------- 6. Ouverture ---------- */
  function open() {
    if (opened || busy) return;
    opened = busy = true;
    clearTimeout(relax);
    openBtn.disabled = true;
    floatTween && floatTween.kill();
    hintTween && hintTween.kill();
    holoTween && holoTween.kill();
    gsap.killTweensOf(shadow);
    tiltX(0); tiltY(0);

    if (reduce.matches) {
      // Version sobre : fondu enchaîné, sans 3D.
      gsap.timeline()
        .to([envStage, hint], { autoAlpha: 0, duration: .35 })
        .add(() => { placeCardInReading(); gsap.set(cover, { autoAlpha: 0 }); })
        .fromTo(card, { autoAlpha: 0 }, { autoAlpha: 1, duration: .45 })
        .add(finish);
      return;
    }

    const mobile = window.innerWidth < 600;
    master = gsap.timeline({ defaults: { ease: "power2.inOut" } });
    master
      // le visiteur « appuie » sur le cachet
      .to(hint, { autoAlpha: 0, y: 8, duration: .35, ease: "power1.out" }, 0)
      .to(envelope, { y: 0, duration: .3, ease: "power2.out" }, 0)
      .to(seal, { scale: .9, duration: .16, ease: "power2.in" }, 0)
      .to(seal, { scale: 1.06, duration: .22, ease: "power2.out" }, .16)
      // le cachet s'efface, un reflet traverse l'hologramme
      .to(seal, { autoAlpha: 0, scale: .85, duration: .4, ease: "power2.in" }, .34)
      .to(card, { "--px": 1, "--py": .2, "--hov": 1, duration: .9, ease: "power2.inOut", overwrite: "auto" }, .2)
      .to(card, { "--hov": 0, duration: .8, ease: "power2.out" }, 1.1)
      .to(recipient, { autoAlpha: 0, duration: .5 }, .4)
      // un seul mouvement continu : l'enveloppe glisse vers le bas pendant que la carte en sort entièrement…
      .to(envTilt, { rotationX: 0, rotationY: 0, duration: .5, ease: "power2.out", overwrite: "auto" }, 0)
      .to(envStage, { y: mobile ? "46vh" : "52vh", duration: 1.0, ease: "power2.in" }, .35)
      .to(card, { yPercent: -114, duration: .95, ease: "power2.in" }, .3)
      // …puis elle s'agrandit dans le même élan, sans temps d'arrêt
      .add(toReading, 1.25);
  }

  function placeCardInReading() {
    gsap.set(card, { yPercent: 0, y: 0, x: 0 });
    slot.appendChild(card);
    card.classList.add("is-full");
    gsap.set(reading, { visibility: "visible", autoAlpha: 1 });
    reading.removeAttribute("aria-hidden");
    reading.scrollTop = 0;
  }

  function toReading() {
    // FLIP manuel : la carte quitte l'enveloppe et s'agrandit jusqu'à sa place de lecture.
    gsap.killTweensOf(card, "yPercent");
    const r0 = card.getBoundingClientRect();
    placeCardInReading();
    const reveals = $$(".reveal", card);
    gsap.set(reveals, { autoAlpha: 0, y: 10 });

    const rF = card.getBoundingClientRect();           // position finale (haut de la carte, fixe)
    card.classList.add("is-expanding");                // contenu long masqué pendant l'agrandissement
    const visibleH = Math.min(rF.height, window.innerHeight - rF.top + 40);
    const dx = (r0.left + r0.width / 2) - (rF.left + rF.width / 2);

    gsap.set(card, { yPercent: 0, width: r0.width, height: r0.height, x: dx, y: r0.top - rF.top, zIndex: 20, borderRadius: 4 });

    const t = gsap.timeline();
    t.to(card, { width: rF.width, height: visibleH, x: 0, y: 0, borderRadius: 6, duration: 1.1, ease: "power2.out" }, 0)
     .add(() => card.classList.remove("is-expanding"))
     .set(card, { clearProps: "width,height,zIndex,borderRadius,transform" })
     .to(cover, { autoAlpha: 0, duration: .3, ease: "power1.in" }, .8)
     .to(envStage, { y: "+=30vh", autoAlpha: 0, duration: .5, ease: "power1.in", overwrite: "auto" }, 0)
     // les informations se révèlent
     .to(reveals, { autoAlpha: 1, y: 0, duration: .7, ease: "power3.out", stagger: .04 }, 1.0)
     .add(finish);
  }

  function finish() {
    busy = false;
    scene.setAttribute("aria-hidden", "true");
    scene.style.visibility = "hidden";
    live.textContent = fill(g ? U.liveGuest : U.live);
    guestName.focus({ preventScroll: true });
  }

  /* ---------- 7. Rejouer ---------- */
  function replay() {
    if (busy) return;
    busy = true;
    gsap.to(reading, {
      autoAlpha: 0, duration: reduce.matches ? .3 : .6, ease: "power2.inOut",
      onComplete() {
        reading.setAttribute("aria-hidden", "true");
        card.classList.remove("is-full");
        envelope.insertBefore(card, $(".env-pocket", envelope));
        gsap.set([card, cover, ...$$(".reveal", card)], { clearProps: "all" });
        gsap.set([envStage, envTilt, envelope, seal, recipient, shadow, hint], { clearProps: "transform,opacity,visibility" });
        gsap.set(card, { "--px": .3, "--py": .35, "--hov": 0 });
        scene.removeAttribute("aria-hidden");
        scene.style.visibility = "";
        opened = false; busy = false;
        intro();
        openBtn.focus({ preventScroll: true });
      }
    });
  }

  /* ---------- 8. Événements ---------- */
  openBtn.disabled = true;
  openBtn.addEventListener("click", open);
  replayBtn.addEventListener("click", replay);

  const start = () => intro();
  if (document.fonts && document.fonts.ready) {
    Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1200))]).then(start);
  } else start();
})();
