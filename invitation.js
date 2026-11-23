/* ==========================================================================
   INTERTECH TALENTS — Invitation interactive (GSAP)
   Le contenu vient de content.js ; ce fichier ne contient que la mise en scène.
   ========================================================================== */
(function () {
  "use strict";

  const C = window.INVITATION;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* ---------- 1. Invité ---------- */
  const params = new URLSearchParams(location.search);
  const rawId = (params.get("pour") || params.get("invite") || params.get("i") || decodeURIComponent(location.hash.slice(1)) || C.defaultGuest || "").trim().toLowerCase();
  const g = C.guests.find((x) => x.id.toLowerCase() === rawId) || null;

  const fullName = g ? [g.prenom, g.nom].filter(Boolean).join(" ") : "";
  const code = C.event.dateShort;
  const data = {
    event: C.event,
    rsvp: C.rsvp,
    defaults: C.defaults,
    guest: {
      prenomOrGeneric: g ? g.prenom : "Invitation",
      fullName: g ? fullName : "Votre invitation",
      fullNameOrGeneric: g ? fullName : "Vous",
      greeting: g ? `${g.prenom},` : C.defaults.greeting,
      why: (g && g.why) || C.defaults.why,
      awaits: (g && g.awaits) || C.defaults.awaits,
      code,
      hint: g ? `${g.prenom}, ouvrez votre invitation` : "Ouvrir votre invitation"
    },
    a11y: { openLabel: g ? `Ouvrir l'invitation de ${fullName}` : "Ouvrir votre invitation" }
  };
  if (!g) document.documentElement.classList.add("is-generic");
  if (g) document.title = `${g.prenom}, votre invitation — Intertech Talents`;

  /* ---------- 2. Rendu (textContent uniquement : aucun HTML injecté) ---------- */
  const get = (path) => path.split(".").reduce((o, k) => (o == null ? o : o[k]), data);
  $$("[data-bind]").forEach((el) => { const v = get(el.dataset.bind); if (v != null) el.textContent = v; });

  const logoTpl = $("#tpl-logo");
  $$("[data-logo]").forEach((el) => {
    const svg = logoTpl.content.firstElementChild.cloneNode(true);
    if (el.closest(".card, .env-pocket")) { svg.setAttribute("aria-hidden", "true"); svg.removeAttribute("role"); }
    el.appendChild(svg);
  });

  const tl = $("#timeline");
  C.event.program.forEach((p) => {
    const li = document.createElement("li");
    li.className = "step";
    const t = document.createElement("span"); t.className = "step-time"; t.textContent = p.time;
    const l = document.createElement("span"); l.className = "step-label"; l.textContent = p.label;
    li.append(t, l); tl.appendChild(li);
  });
  const chips = $("#chips");
  C.event.facts.forEach((f) => { const li = document.createElement("li"); li.textContent = f; chips.appendChild(li); });

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
    if (now >= doors) { cdBox.classList.add("is-live"); cdTitle.textContent = "C'est ce soir — portes ouvertes depuis 18h30, fermeture à 19h15"; return; }
    let s = Math.floor((doors - now) / 1000);
    const d = Math.floor(s / 86400); s -= d * 86400;
    const h = Math.floor(s / 3600); s -= h * 3600;
    const m = Math.floor(s / 60); s -= m * 60;
    cdEls.d.textContent = pad(d); cdEls.h.textContent = pad(h); cdEls.m.textContent = pad(m); cdEls.s.textContent = pad(s);
  }
  tick(); setInterval(tick, 1000);

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
  const flap = $("#flap"), seal = $("#seal"), card = $("#card"), cover = $(".cover", card);
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
    gsap.set(flap, { rotationX: 0, zIndex: 4 });
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

  function idle() {
    floatTween = gsap.to(envelope, { y: -6, duration: 2.8, ease: "sine.inOut", yoyo: true, repeat: -1 });
    gsap.to(shadow, { scale: .94, autoAlpha: .8, duration: 2.8, ease: "sine.inOut", yoyo: true, repeat: -1 });
    hintTween = gsap.fromTo(hintLine, { backgroundPosition: "0 0", scaleX: .4, transformOrigin: "0 50%" },
      { scaleX: 1, duration: 1.6, ease: "power2.inOut", yoyo: true, repeat: -1 });
  }

  /* ---------- 5. Inclinaison au survol (desktop) ---------- */
  const tiltX = gsap.quickTo(envTilt, "rotationX", { duration: .8, ease: "power3.out" });
  const tiltY = gsap.quickTo(envTilt, "rotationY", { duration: .8, ease: "power3.out" });
  const sheen = $("#sheen");
  function onMove(e) {
    if (opened || reduce.matches || !finePointer.matches) return;
    const r = envTilt.getBoundingClientRect();
    sheen.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
    sheen.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
    const dx = (e.clientX - (r.left + r.width / 2)) / window.innerWidth;
    const dy = (e.clientY - (r.top + r.height / 2)) / window.innerHeight;
    tiltY(gsap.utils.clamp(-7, 7, dx * 14));
    tiltX(gsap.utils.clamp(-6, 6, -dy * 12));
  }
  window.addEventListener("pointermove", onMove, { passive: true });

  /* ---------- 6. Ouverture ---------- */
  function open() {
    if (opened || busy) return;
    opened = busy = true;
    openBtn.disabled = true;
    floatTween && floatTween.kill();
    hintTween && hintTween.kill();
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
      // le cachet se détache et accompagne le rabat
      .to(seal, { autoAlpha: 0, scale: .85, duration: .4, ease: "power2.in" }, .34)
      // 1. le rabat se déplie
      .to(flap, { rotationX: 180, duration: 1.05, ease: "power3.inOut" }, .36)
      .set(flap, { zIndex: 1 }, .36 + 1.05 * .5)
      .to(recipient, { autoAlpha: 0, duration: .5 }, .5)
      // léger recul de l'enveloppe pour laisser respirer la carte
      .to(envStage, { y: mobile ? "8vh" : "10vh", scale: mobile ? .94 : .9, duration: 1.3, ease: "power3.inOut" }, 1.0)
      // 2–3. la carte apparaît puis glisse hors de l'enveloppe
      .to(card, { yPercent: -66, duration: 1.15, ease: "power3.inOut" }, 1.15)
      // 4. elle rejoint sa position de lecture
      .add(toReading, 2.2);
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
    t.to(card, { width: rF.width, height: visibleH, x: 0, y: 0, borderRadius: 6, duration: 1.15, ease: "power3.inOut" }, 0)
     .add(() => card.classList.remove("is-expanding"))
     .set(card, { clearProps: "width,height,zIndex,borderRadius,transform" })
     .to(cover, { autoAlpha: 0, duration: .28, ease: "power1.in" }, 1.05)
     .to(envStage, { y: "40vh", autoAlpha: 0, duration: .9, ease: "power2.in" }, .05)
     // 5. les informations se révèlent
     .to(reveals, { autoAlpha: 1, y: 0, duration: .8, ease: "power3.out", stagger: .045 }, 1.28)
     .add(finish);
  }

  function finish() {
    busy = false;
    scene.setAttribute("aria-hidden", "true");
    scene.style.visibility = "hidden";
    live.textContent = g ? `Invitation de ${fullName} ouverte. Soirée du ${C.event.dateLong}.` : `Invitation ouverte. Soirée du ${C.event.dateLong}.`;
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
