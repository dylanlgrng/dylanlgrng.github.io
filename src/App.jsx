import React, { useRef, useState, useEffect } from "react";
import { HashRouter, Routes, Route, Link, useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Plus, Minus, Mail, Linkedin, Phone, ArrowUpRight, Sun, Moon, Info } from "lucide-react";

const EMAIL_B64 = "bGFncmFuZ2VkeWxhbkBnbWFpbC5jb20=";

const CONTENT = {
  fr: {
    hero: { hello: "Bonjour je suis Dylan,", after: "UX Republic à Bordeaux." },
    labels: {
      about: "À propos", projects: "Projets", seeAll: "Voir tout", seeLess: "Voir moins",
      previousWork: "Expériences récentes", sayHello: "Dire bonjour", back: "Retour",
      info: "Ce site internet a été éco‑conçu par moi à Bordeaux en 2025, et il a été entièrement codé par GPT5."
    },
    about: {
      name: "Dylan Lagrange",
      role: "Product Designer",
      photo: "/images/portrait.jpg",
      bio: [
        "Actuellement Product Designer chez UX Republic à Bordeaux, en mission à la DSI de la MAIF.",
        "J’accompagne l’évolution des outils métiers avec les équipes projet, contribue au design system et participe aux réflexions sur nos pratiques (accessibilité, éco‑conception, intelligence artificielle)."
      ],
      previousWork: ["Kairos Agency (2021–2024) — Product designer en agence digitale"],
      contact: { linkedin: "https://www.linkedin.com/in/dylanlgrng", phone: "06.76.46.21.17" }
    },
    projects: []
  },
  en: {
    hero: { hello: "Hi, I’m Dylan,", after: "UX Republic in Bordeaux." },
    labels: {
      about: "About me", projects: "Projects", seeAll: "See all", seeLess: "See less",
      previousWork: "Previous work", sayHello: "Say hello", back: "Back",
      info: "This website was eco‑designed by me in Bordeaux in 2025 and fully coded by GPT5."
    },
    about: {
      name: "Dylan Lagrange",
      role: "Product Designer",
      photo: "/images/portrait.jpg",
      bio: [
        "Currently Product Designer at UX Republic in Bordeaux, on assignment with MAIF’s IT department.",
        "I help evolve internal tools with project teams, contribute to the design system, and join discussions on our practices (accessibility, eco‑design, AI)."
      ],
      previousWork: ["Kairos Agency (2021–2024) — Product designer in a digital agency"],
      contact: { linkedin: "https://www.linkedin.com/in/dylanlgrng", phone: "+33 6 76 46 21 17" }
    },
    projects: []
  }
};

// Explicit project list (MAIF first)
CONTENT.fr.projects = [
  {
    id: "maif",
    title: "MAIF — Outils métiers & design system",
    image: "/images/maif-logo.svg",
    summary: "Évolution des outils métiers au sein de la DSI de la MAIF.",
    description: "Mission en cours au sein de la DSI de la MAIF (via UX Republic). Travail centré sur l’optimisation d’outils métiers : co-construction avec les équipes projet, contribution au design system, attention continue à l’accessibilité et à l’éco-conception, participation aux réflexions collectives (pratiques, outillage, IA)."
  },
  { id:"engagenow", title:"EngageNow — E-learning & back-office", image:"https://picsum.photos/seed/ux1/800/600", summary:"Refonte pour engager, simplifier et harmoniser.", description:"Plateforme e-learning WeNow/Kairos (BtoBtoU). Enjeux : faible rétention, complexité d’arborescence, wording, abandon en cours et incohérences (absence de DS). Solutions : simplification de l’interface, design system, contenus pédagogiques enrichis, gamification, vocabulaire clarifié; refonte accueil/fiches/suivi progression." },
  { id:"ninjae", title:"Ninjaé — Plateforme micro-entreprises (BPCE)", image:"https://picsum.photos/seed/ux2/800/600", summary:"Du cadrage à l’UI, un SaaS accessible et efficace.", description:"SaaS pour micro-entreprises. Recherche et ateliers, design system, UI desktop & mobile. Fonctionnalités clés : connexion bancaire, connexion URSSAF, partie commerciale (devis/factures/clients), pilotage (achats/recettes)." },
  { id:"kairos-blue", title:"Kairos Blue — CMS/LMS/EMS & Back-office", image:"https://picsum.photos/seed/ux3/800/600", summary:"Plateforme unifiée, éco-conçue et versionnée.", description:"Plateforme tout-en-un pour centraliser des fonctions agence. Design system robuste; collaboration dev/DA/commercial. Impacts : versionnage, réduction des temps de conception/développement, cohérence multi-supports; déploiements multiples." },
  { id:"mon-service-rh", title:"Mon Service RH — Plateforme & back-office", image:"https://picsum.photos/seed/ux4/800/600", summary:"Une solution RH pour TPE/PME, pensée durable.", description:"Plateforme financée par la Région NA pour WeJob : plateforme principale, espace prestataires/institutions, tunnel de paiement, BO sur-mesure. Parcours conçus avec une forte attention accessibilité (RGAA) et éco-conception." },
  { id:"ffbad", title:"FFBaD — Site fédéral & back-office", image:"https://picsum.photos/seed/ux5/800/600", summary:"Refonte pour Paris 2024, DS sur-mesure, BO éco-conçu.", description:"Objectifs : porte d’entrée de l’écosystème digital, attirer de nouveaux licenciés. Travail sur cibles/objectifs, parcours, structure, design system avec DA; back-office éco-conçu; nombreuses fonctionnalités (licenciés, clubs, boutique, presse…)." },
  { id:"pacte-onu", title:"Pacte mondial des Nations Unies — Site & espace membre", image:"https://picsum.photos/seed/ux6/800/600", summary:"Informer le public et outiller les membres.", description:"Conception d’un espace membre complet : partage de documents, annuaire, blog; travail sur l’accessibilité du site vitrine; forte collaboration marketing/dev." },
  { id:"finaqui", title:"Finaqui — Extranet & back-office", image:"https://picsum.photos/seed/ux7/800/600", summary:"Automatiser des workflows et fluidifier la collaboration.", description:"Extranet pour un fonds d’investissement régional : suivi de projets, candidatures, pitchs/décisions, permissions d’accès. Interviews/ateliers, wireframes/protos, UI; développement sur Kairos Blue." }
];

CONTENT.en.projects = [
  {
    id: "maif",
    title: "MAIF — Internal tools & design system",
    image: "/images/maif-logo.svg",
    summary: "Evolving internal tools within MAIF’s IT department.",
    description: "Ongoing assignment via UX Republic. Focus on internal tools, co-design with project teams, design-system contributions, accessibility & eco-design, and collective practice/AI discussions."
  },
  { id:"engagenow", title:"EngageNow — E-learning & back-office", image:"https://picsum.photos/seed/ux1/800/600", summary:"Refocus the experience to drive engagement.", description:"Simplified UI, design system, better pedagogy, gamification, clearer wording; redesigned home, course pages and progress." },
  { id:"ninjae", title:"Ninjaé — Micro-business platform (BPCE)", image:"https://picsum.photos/seed/ux2/800/600", summary:"From research to UI.", description:"Bank connection, URSSAF integration, quotes/invoices/CRM, finances & ledger." },
  { id:"kairos-blue", title:"Kairos Blue — CMS/LMS/EMS & admin", image:"https://picsum.photos/seed/ux3/800/600", summary:"Unified, eco-designed, versioned.", description:"Robust DS, faster delivery, coherent UX across clients." },
  { id:"mon-service-rh", title:"Mon Service RH — Platform & admin", image:"https://picsum.photos/seed/ux4/800/600", summary:"HR for SMBs with accessibility.", description:"Main platform, providers area, payment flow, custom back-office." },
  { id:"ffbad", title:"FFBaD — Federation site & admin", image:"https://picsum.photos/seed/ux5/800/600", summary:"Paris 2024 momentum + DS.", description:"User journeys, structure, DS; eco-designed back-office and rich features." },
  { id:"pacte-onu", title:"UN Global Compact — Site & member area", image:"https://picsum.photos/seed/ux6/800/600", summary:"Public info & member tools.", description:"Docs sharing, directory, blog; accessibility improvements." },
  { id:"finaqui", title:"Finaqui — Extranet & admin", image:"https://picsum.photos/seed/ux7/800/600", summary:"Automated workflows.", description:"Projects tracking, applications, pitches, permissions; built on Kairos Blue." }
];

function getInitialLang(){ return (localStorage.getItem("lang") === "en") ? "en" : "fr"; }
function getInitialTheme(){ var s = localStorage.getItem("theme"); if (s === "dark" || s === "light") return s; var h = new Date().getHours(); return (h >= 7 && h < 19) ? "light" : "dark"; }

function SectionRow(props) {
  var label = props.label, rightAdornment = props.rightAdornment, isOpen = props.isOpen, onToggle = props.onToggle, children = props.children;
  var boxRef = React.useRef(null);
  var innerRef = React.useRef(null);
  var mountedState = useState(isOpen); var mounted = mountedState[0]; var setMounted = mountedState[1];
  var openClassState = useState(isOpen ? "open" : ""); var openClass = openClassState[0]; var setOpenClass = openClassState[1];
  var hState = useState(isOpen ? "auto" : 0); var h = hState[0]; var setH = hState[1];

  useEffect(function(){
    if (isOpen) {
      if (!mounted) setMounted(true);
      requestAnimationFrame(function(){
        var el = boxRef.current, inner = innerRef.current; if (!el || !inner) return;
        el.classList.add("open");
        setOpenClass("open");
        el.style.height = "0px";
        var target = inner.scrollHeight;
        setH(target + "px");
        setTimeout(function(){ if (!boxRef.current) return; setH("auto"); }, 560);
      });
    } else {
      var el2 = boxRef.current, inner2 = innerRef.current; if (!el2 || !inner2) { setMounted(false); setOpenClass(""); setH(0); return; }
      var current = inner2.offsetHeight;
      setH(current + "px");
      requestAnimationFrame(function(){
        el2.classList.remove("open");
        setOpenClass("");
        setH("0px");
      });
      setTimeout(function(){ setMounted(false); }, 580);
    }
  }, [isOpen]);

  return (
    <section className="border-t border-black/10 dark:border-white/10">
      <header className="flex items-center gap-4 py-3 text-base sm:text-lg">
        <button className="flex-1 text-left font-medium tracking-tight focus:outline-none" aria-expanded={isOpen} onClick={onToggle}>
          {label}
        </button>
        <div className="mr-2 hidden sm:block">{rightAdornment}</div>
        <button onClick={onToggle} aria-label={isOpen ? (label + " — réduire") : (label + " — développer")} className="ml-auto inline-flex items-center justify-center p-1 opacity-70 transition hover:opacity-100 focus:outline-none">
          {isOpen ? <Minus size={18} /> : <Plus size={18} />}
        </button>
      </header>
      <div ref={boxRef} className={"accordion " + openClass} style={{ height: h }}>
        <div ref={innerRef}>
          {mounted ? <div className="pb-8">{children}</div> : null}
        </div>
      </div>
    </section>
  );
}

function IntroTitle(props) {
  var dims = props.dims, spacePx = props.spacePx, heroRef = props.heroRef, bgX = props.bgX, hovering = props.hovering, lang = props.lang;
  var t = CONTENT[lang];
  var maxWidth = dims && dims.maxWidth; var maxHeight = dims && dims.maxHeight;
  return (
    <h1 ref={heroRef} className="text-3xl sm:text-4xl md:text-5xl font-medium leading-[1.1] tracking-tight">
      {t.hero.hello}
      <br />
      <span className="inline-block align-baseline relative" style={{ width: maxWidth ? (maxWidth + "px") : undefined, height: maxHeight ? (maxHeight + "px") : undefined, lineHeight: "inherit" }}>
        <span className="invisible whitespace-nowrap" style={{ lineHeight: "inherit" }}>
          Product Designer {lang === "fr" ? "chez" : "at"}
        </span>
        <span className="absolute left-0 top-0 whitespace-nowrap" style={{ lineHeight: "inherit" }}>
          <span className={hovering ? "gradient-text" : ""} style={hovering ? { backgroundPosition: (bgX + "% 50%") } : { color: "currentColor" }}>
            Product Designer
          </span>
          <span style={{ marginLeft: (typeof spacePx === "number") ? (spacePx + "px") : undefined }}>
            {lang === "fr" ? "chez" : "at"}
          </span>
        </span>
      </span>
      <br />
      {t.hero.after}
    </h1>
  );
}

function TopRightControls(props) {
  var lang = props.lang, setLang = props.setLang, theme = props.theme, setTheme = props.setTheme;
  var t = CONTENT[lang];
  var openState = useState(false); var open = openState[0]; var setOpen = openState[1];
  var tooltipRef = useRef(null);
  useEffect(function(){
    function onDocClick(e){ if (!tooltipRef.current) return; if (!tooltipRef.current.contains(e.target)) setOpen(false); }
    document.addEventListener("click", onDocClick);
    return function(){ document.removeEventListener("click", onDocClick); };
  }, []);
  return (
    <div className="relative flex items-center justify-end gap-3 text-xs opacity-80 hover:opacity-100 transition">
      <button onClick={function(){ setLang(lang === "fr" ? "en" : "fr"); }} className="rounded-full border border-black/10 dark:border-white/10 px-2 py-1 bg-white/70 dark:bg-white/10 backdrop-blur-sm">
        {lang === "fr" ? "EN" : "FR"}
      </button>
      <button onClick={function(){ setTheme(theme === "dark" ? "light" : "dark"); }} className="rounded-full border border-black/10 dark:border-white/10 p-1.5 bg-white/70 dark:bg-white/10 backdrop-blur-sm">
        {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
      </button>
      <div ref={tooltipRef} className="relative">
        <button onClick={function(){ setOpen(!open); }} onMouseEnter={function(){ setOpen(true); }} onMouseLeave={function(){ setOpen(false); }} aria-label="Info" className="rounded-full border border-black/10 dark:border-white/10 p-1.5 bg-white/70 dark:bg-white/10 backdrop-blur-sm">
          <Info size={14} />
        </button>
        {open ? (
          <div className="absolute right-0 z-50 mt-2 rounded-md border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900 px-3 py-2 text-[11px] shadow-lg ring-1 ring-black/5 dark:ring-white/5 whitespace-nowrap">
            {t.labels.info}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Home(props) {
  var lang = props.lang, setLang = props.setLang, theme = props.theme, setTheme = props.setTheme;
  var t = CONTENT[lang];
  var openState = useState(null); var openVal = openState[0]; var setOpen = openState[1];
  var showAllState = useState(false); var showAllVal = showAllState[0]; var setShowAll = showAllState[1];
  var closingState = useState(false); var closingVal = closingState[0]; var setClosing = closingState[1];

  var heroWrapRef = useRef(null);
  var heroTextRef = useRef(null);
  var bgXState = useState(0); var bgX = bgXState[0]; var setBgX = bgXState[1];
  var hoveringState = useState(false); var hovering = hoveringState[0]; var setHovering = hoveringState[1];

  var dimsState = useState({ maxWidth: null, maxHeight: null }); var dims = dimsState[0]; var setDims = dimsState[1];
  var spacePxState = useState(0); var spacePx = spacePxState[0]; var setSpacePx = spacePxState[1];

  useEffect(function(){
    var phrasePD = "Product Designer";
    var word = lang === "fr" ? "chez" : "at";
    function measure(){
      var system = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, 'Noto Sans', sans-serif";
      var h = heroTextRef.current;
      var cs = h ? window.getComputedStyle(h) : null;
      var sizePx = cs ? Math.round(parseFloat(cs.fontSize) || 48) : 48;
      var canvas = document.createElement("canvas");
      var ctx = canvas.getContext("2d");
      ctx.font = "500 " + sizePx + "px " + system;
      var wPD = ctx.measureText(phrasePD).width;
      var mAA = ctx.measureText("AA");
      var mA_A = ctx.measureText("A A");
      var space = Math.max(0, Math.round(mA_A.width - mAA.width));
      setSpacePx(space);
      var ascent = ctx.measureText(phrasePD).actualBoundingBoxAscent || sizePx * 0.8;
      var descent = ctx.measureText(phrasePD).actualBoundingBoxDescent || sizePx * 0.2;
      setDims({ maxWidth: Math.ceil(wPD + space + ctx.measureText(word).width), maxHeight: Math.ceil(ascent + descent) });
    }
    measure(); window.addEventListener("resize", measure);
    return function(){ window.removeEventListener("resize", measure); };
  }, [lang]);

  function onMouseMoveHero(e){
    var rect = heroWrapRef.current && heroWrapRef.current.getBoundingClientRect();
    if (!rect) return;
    var x = (e.clientX - rect.left) / rect.width;
    var clamped = Math.max(0, Math.min(1, x));
    setBgX(Math.round(clamped * 100));
  }

  var extrasRef = useRef(null);
  var gridRef = useRef(null);

  function openExtras() {
    setClosing(false);
    setShowAll(true);
    requestAnimationFrame(function(){
      var el = extrasRef.current; if (!el) return;
      el.classList.add("open");
      el.style.height = el.scrollHeight + "px";
      setTimeout(function(){ if (!el) return; el.style.height = "auto"; }, 620);
      var grid = gridRef.current; if (grid) grid.classList.add("open"); 
    });
  }

  function closeExtras() {
    var el = extrasRef.current; var grid = gridRef.current;
    if (!el) { setShowAll(false); return; }
    setClosing(true);
    if (grid) {
      grid.classList.remove("open");
      grid.classList.add("closing");
      var cards = grid.querySelectorAll(".card-enter");
      var n = cards.length;
      for (var i=0;i<n;i++){ var d = (n-1-i)*60; cards[i].style.setProperty("--delayClose", d + "ms"); }
    }
    el.style.height = el.scrollHeight + "px";
    requestAnimationFrame(function(){
      el.classList.remove("open");
      el.style.height = "0px";
      el.style.clipPath = "inset(0% 0% 100% 0%)";
      el.style.filter = "blur(6px)";
      el.style.opacity = "0";
    });
    var totalDelay = 400 + (grid ? (grid.querySelectorAll(".card-enter").length - 1) * 60 : 0);
    setTimeout(function(){
      setShowAll(false);
      setClosing(false);
      if (grid) grid.classList.remove("closing");
      if (el) { el.style.height = "0px"; }
    }, totalDelay + 80);
  }

  var seeAllButton = (
    <button onClick={function(){ showAllVal ? closeExtras() : openExtras(); }} className="text-sm underline-offset-4 hover:underline">
      {showAllVal ? CONTENT[lang].labels.seeLess : CONTENT[lang].labels.seeAll}
    </button>
  );

  return (
    <main className="flex min-h-dvh flex-col font-light" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, 'Noto Sans', sans-serif" }}>
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 pt-4">
        <TopRightControls lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} />
      </div>

      <div className="mx-auto mt-auto w-full max-w-6xl px-4 sm:px-6">
        <div ref={heroWrapRef} className="pb-4 select-none" onMouseEnter={function(){ setHovering(true); }} onMouseMove={onMouseMoveHero} onMouseLeave={function(){ setHovering(false); }}>
          <div ref={heroTextRef}>
            <IntroTitle lang={lang} hovering={hovering} bgX={bgX} dims={dims} spacePx={spacePx} heroRef={heroTextRef} />
          </div>
        </div>

        <SectionRow label={CONTENT[lang].labels.about} isOpen={openVal === "about"} onToggle={function(){ setOpen(openVal === "about" ? null : "about"); }}>
          <div className="grid grid-cols-1 items-start gap-10 sm:grid-cols-[minmax(150px,180px)_1fr]">
            <div className="pr-4">
              <div className="rounded-[12px] overflow-visible">
                <img src={CONTENT[lang].about.photo} alt={"Portrait de " + CONTENT[lang].about.name} className="photo-square ring-1 ring-black/10 dark:ring-white/10" />
              </div>
            </div>
            <div className="space-y-8 overflow-hidden">
              <div>
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">{CONTENT[lang].about.name}</h2>
                <p className="mt-1 text-sm sm:text-base text-black/60 dark:text-white/60">{CONTENT[lang].about.role}</p>
              </div>
              <div className="space-y-4">
                {CONTENT[lang].about.bio.map(function(p, i){ return (
                  <p key={i} className="max-w-prose text-sm sm:text-[1.02rem] leading-relaxed text-black/80 dark:text-white/80">{p}</p>
                );})}
              </div>
              <div className="flex flex-wrap gap-4">
                <button onClick={function(){ try { var a = atob(EMAIL_B64); window.location.href = "mailto:" + a; } catch(e){} }} className="inline-flex items-center gap-2 rounded-full border border-black/10 dark:border-white/10 px-4 py-2 text-sm font-medium shadow-sm hover:shadow-md transition bg-white/90 dark:bg-white/5 backdrop-blur">
                  <Mail size={16} /> {CONTENT[lang].labels.sayHello}
                </button>
                <a href={CONTENT[lang].about.contact.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-black/10 dark:border-white/10 px-4 py-2 text-sm font-medium shadow-sm hover:shadow-md transition bg-white/90 dark:bg-white/5 backdrop-blur">
                  <Linkedin size={16} /> LinkedIn
                </a>
                <a href={"tel:+33" + (CONTENT[lang].about.contact.phone || "").replace(/\D/g,'')} className="inline-flex items-center gap-2 rounded-full border border-black/10 dark:border-white/10 px-4 py-2 text-sm font-medium shadow-sm hover:shadow-md transition bg-white/90 dark:bg-white/5 backdrop-blur">
                  <Phone size={16} /> {CONTENT[lang].about.contact.phone}
                </a>
              </div>
              <div>
                <h3 className="mb-2 text-base font-medium">{CONTENT[lang].labels.previousWork}</h3>
                <ul className="space-y-1 text-sm text-black/70 dark:text-white/70">
                  {CONTENT[lang].about.previousWork.map(function(line, idx){ return (<li key={idx}>• {line}</li>); })}
                </ul>
              </div>
            </div>
          </div>
        </SectionRow>

        <SectionRow
          label={CONTENT[lang].labels.projects}
          rightAdornment={openVal === "projects" ? seeAllButton : null}
          isOpen={openVal === "projects"}
          onToggle={function(){ setOpen(openVal === "projects" ? null : "projects"); }}
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {(CONTENT[lang].projects || []).slice(0,4).map(function(p){
                return (
                  <div key={p.id} className="block">
                    <Link to={"/projects/" + p.id} className="group block overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 shadow-sm ring-1 ring-black/5 dark:ring-white/5 transition bg-white dark:bg-neutral-900">
                      <img src={p.image} alt={"aperçu " + p.title} className="aspect-[4/3] w-full object-cover" />
                      <div className="flex items-center justify-between p-3">
                        <span className="text-sm font-medium">{p.title}</span>
                        <ArrowUpRight className="opacity-60 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" size={16} />
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>

            <Extras showAll={showAllVal} setShowAll={setShowAll} closing={closingVal} setClosing={setClosing} projects={(CONTENT[lang].projects || []).slice(4)} />
          </div>
        </SectionRow>
      </div>
    </main>
  );
}

function Extras(props){
  var showAll = props.showAll, setShowAll = props.setShowAll, closing = props.closing, setClosing = props.setClosing, projects = props.projects;
  var extrasRef = useRef(null);
  var gridRef = useRef(null);

  useEffect(function(){
    var el = extrasRef.current, grid = gridRef.current;
    if (!el) return;
    if (showAll) {
      el.classList.add("open");
      el.style.height = el.scrollHeight + "px";
      setTimeout(function(){ if (!el) return; el.style.height = "auto"; }, 620);
      if (grid) grid.classList.add("open");
    } else {
      if (!grid) return;
      // trigger reverse-stagger then collapse
      grid.classList.remove("open");
      grid.classList.add("closing");
      var cards = grid.querySelectorAll(".card-enter");
      var n = cards.length;
      for (var i=0;i<n;i++){ var d = (n-1-i)*60; cards[i].style.setProperty("--delayClose", d + "ms"); }
      el.style.height = el.scrollHeight + "px";
      requestAnimationFrame(function(){
        el.classList.remove("open");
        el.style.height = "0px";
        el.style.clipPath = "inset(0% 0% 100% 0%)";
        el.style.filter = "blur(6px)";
        el.style.opacity = "0";
      });
      var totalDelay = 400 + (n > 0 ? (n-1)*60 : 0);
      setTimeout(function(){
        if (grid) grid.classList.remove("closing");
      }, totalDelay + 80);
    }
  }, [showAll]);

  return (
    <div ref={extrasRef} className={"extras-container" + (showAll ? " open" : "")} style={{ height: "0px" }}>
      {showAll ? (
        <div ref={gridRef} className={"extras-grid" + (closing ? " closing" : " open")}>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 pt-6">
            {projects.map(function(p, i, arr){
              var delay = i * 60; var delayRev = (arr.length - 1 - i) * 60;
              return (
                <div key={p.id} className="card-enter" style={{ "--delay": delay + "ms", "--delayClose": delayRev + "ms" }}>
                  <Link to={"/projects/" + p.id} className="group block overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 shadow-sm ring-1 ring-black/5 dark:ring-white/5 transition bg-white dark:bg-neutral-900">
                    <img src={p.image} alt={"aperçu " + p.title} className="aspect-[4/3] w-full object-cover" />
                    <div className="flex items-center justify-between p-3">
                      <span className="text-sm font-medium">{p.title}</span>
                      <ArrowUpRight className="opacity-60 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" size={16} />
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ProjectPage(props) {
  var lang = props.lang;
  var t = CONTENT[lang];
  var navigate = useNavigate();
  var params = useParams();
  var id = params.id;
  var project = (t.projects || []).find(function(p){ return p.id === id; });
  if (!project) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <button onClick={function(){ navigate(-1); }} className="mb-6 inline-flex items-center gap-2 text-sm underline-offset-4 hover:underline">
          <ChevronLeft size={16} /> {t.labels.back}
        </button>
        <p>Not found.</p>
      </div>
    );
  }
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <button onClick={function(){ navigate(-1); }} className="mb-6 inline-flex items-center gap-2 text-sm underline-offset-4 hover:underline">
        <ChevronLeft size={16} /> {t.labels.back}
      </button>
      <h1 className="text-3xl font-semibold tracking-tight">{project.title}</h1>
      <p className="mt-2 text-black/60 dark:text-white/60">{project.summary || ""}</p>
      <img src={project.image} alt="aperçu" className="mt-8 aspect-[16/9] w-full rounded-2xl object-cover shadow-sm ring-1 ring-black/10 dark:ring-white/10" />
      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <p>{project.description || ""}</p>
      </div>
    </div>
  );
}

export default function App() {
  var langState = useState((localStorage.getItem("lang") === "en") ? "en" : "fr"); var lang = langState[0]; var setLang = langState[1];
  var themeState = useState((function(){ var s = localStorage.getItem("theme"); if (s === "dark" || s === "light") return s; var h = new Date().getHours(); return (h >= 7 && h < 19) ? "light" : "dark"; })()); var theme = themeState[0]; var setTheme = themeState[1];
  useEffect(function(){ localStorage.setItem("lang", lang); }, [lang]);
  useEffect(function(){ localStorage.setItem("theme", theme); var r = document.documentElement; if (theme === "dark") r.classList.add("dark"); else r.classList.remove("dark"); }, [theme]);

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} />} />
        <Route path="/projects/:id" element={<ProjectPage lang={lang} />} />
        <Route path="*" element={<Home lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} />} />
      </Routes>
    </HashRouter>
  );
}
