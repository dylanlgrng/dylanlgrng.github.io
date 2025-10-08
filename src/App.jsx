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

// Projects (MAIF first)
CONTENT.fr.projects = [
  { id:"maif", title:"MAIF — Outils métiers & design system", image:"/images/logomaif.png", summary:"Évolution des outils métiers au sein de la DSI de la MAIF.", description:"Mission en cours au sein de la DSI de la MAIF (via UX Republic). Travail centré sur l’optimisation d’outils métiers : co-construction avec les équipes projet, contribution au design system, attention continue à l’accessibilité et à l’éco-conception, participation aux réflexions collectives (pratiques, outillage, IA)." },
  { id:"engagenow", title:"EngageNow — E-learning & back-office", image:"https://picsum.photos/seed/ux1/800/600", summary:"Refonte pour engager, simplifier et harmoniser.", description:"Plateforme e-learning WeNow/Kairos (BtoBtoU). Enjeux : faible rétention, complexité d’arborescence, wording, abandon en cours et incohérences (absence de DS). Solutions : simplification de l’interface, design system, contenus pédagogiques enrichis, gamification, vocabulaire clarifié; refonte accueil/fiches/suivi progression." },
  { id:"ninjae", title:"Ninjaé — Plateforme micro-entreprises (BPCE)", image:"https://picsum.photos/seed/ux2/800/600", summary:"Du cadrage à l’UI, un SaaS accessible et efficace.", description:"SaaS pour micro-entreprises. Recherche et ateliers, design system, UI desktop & mobile. Fonctionnalités clés : connexion bancaire, connexion URSSAF, partie commerciale (devis/factures/clients), pilotage (achats/recettes)." },
  { id:"kairos-blue", title:"Kairos Blue — CMS/LMS/EMS & Back-office", image:"https://picsum.photos/seed/ux3/800/600", summary:"Plateforme unifiée, éco-conçue et versionnée.", description:"Plateforme tout-en-un pour centraliser des fonctions agence. Design system robuste; collaboration dev/DA/commercial. Impacts : versionnage, réduction des temps de conception/développement, cohérence multi-supports; déploiements multiples." },
  { id:"mon-service-rh", title:"Mon Service RH — Plateforme & back-office", image:"https://picsum.photos/seed/ux4/800/600", summary:"Une solution RH pour TPE/PME, pensée durable.", description:"Plateforme financée par la Région NA pour WeJob : plateforme principale, espace prestataires/institutions, tunnel de paiement, BO sur-mesure. Parcours conçus avec une forte attention accessibilité (RGAA) et éco-conception." },
  { id:"ffbad", title:"FFBaD — Site fédéral & back-office", image:"https://picsum.photos/seed/ux5/800/600", summary:"Refonte pour Paris 2024, DS sur-mesure, BO éco-conçu.", description:"Objectifs : porte d’entrée de l’écosystème digital, attirer de nouveaux licenciés. Travail sur cibles/objectifs, parcours, structure, design system avec DA; back-office éco-conçu; nombreuses fonctionnalités (licenciés, clubs, boutique, presse…)." },
  { id:"pacte-onu", title:"Pacte mondial des Nations Unies — Site & espace membre", image:"https://picsum.photos/seed/ux6/800/600", summary:"Informer le public et outiller les membres.", description:"Conception d’un espace membre complet : partage de documents, annuaire, blog; travail sur l’accessibilité du site vitrine; forte collaboration marketing/dev." },
  { id:"finaqui", title:"Finaqui — Extranet & back-office", image:"https://picsum.photos/seed/ux7/800/600", summary:"Automatiser des workflows et fluidifier la collaboration.", description:"Extranet pour un fonds d’investissement régional : suivi de projets, candidatures, pitchs/décisions, permissions d’accès. Interviews/ateliers, wireframes/protos, UI; développement sur Kairos Blue." }
];
CONTENT.en.projects = [
  { id:"maif", title:"MAIF — Internal tools & design system", image:"/images/logomaif.png", summary:"Evolving internal tools within MAIF’s IT department.", description:"Ongoing assignment via UX Republic. Focus on internal tools, co-design with project teams, design-system contributions, accessibility & eco-design, and collective practice/AI discussions." },
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
  var { label, rightAdornment, isOpen, onToggle, children } = props;
  var boxRef = useRef(null);
  var innerRef = useRef(null);
  var [height, setHeight] = useState(isOpen ? "auto" : "0px");
  var roRef = useRef(null);

  useEffect(() => {
    const el = boxRef.current, inner = innerRef.current;
    if (!el || !inner) return;

    if (roRef.current) { try { roRef.current.disconnect(); } catch(e){} }
    if (isOpen) {
      const ro = new ResizeObserver(() => {
        if (!boxRef.current || !innerRef.current) return;
        const target = inner.scrollHeight;
        if (el.style.height !== "auto") setHeight(target + "px");
      });
      ro.observe(inner);
      roRef.current = ro;
    }

    function onEnd(e){
      if (e.target !== el || e.propertyName !== "height") return;
      if (isOpen) setHeight("auto");
    }
    el.addEventListener("transitionend", onEnd);
    return () => {
      if (roRef.current) { try { roRef.current.disconnect(); } catch(e){} roRef.current = null; }
      el.removeEventListener("transitionend", onEnd);
    };
  }, [isOpen]);

  useEffect(() => {
    const el = boxRef.current, inner = innerRef.current;
    if (!el || !inner) return;

    if (isOpen) {
      el.classList.add("open");
      requestAnimationFrame(() => {
        el.style.height = "0px";
        requestAnimationFrame(() => { setHeight(inner.scrollHeight + "px"); });
      });
    } else {
      const current = inner.offsetHeight;
      setHeight(current + "px");
      el.classList.remove("open");
      requestAnimationFrame(() => { setHeight("0px"); });
    }
  }, [isOpen]);

  return (
    <section className="border-t border-black/10 dark:border-white/10">
      <header className="flex items-center gap-4 py-3 text-base sm:text-lg">
        <button className="flex-1 text-left font-medium tracking-tight focus:outline-none" aria-expanded={isOpen} onClick={onToggle}>
          {label}
        </button>
        <div className="mr-2">{rightAdornment}</div>
        <button onClick={onToggle} aria-label={isOpen ? (label + " — réduire") : (label + " — développer")} className="ml-auto inline-flex items-center justify-center p-1 opacity-70 transition hover:opacity-100 focus:outline-none">
          {isOpen ? <Minus size={18} /> : <Plus size={18} />}
        </button>
      </header>
      <div ref={boxRef} className={"accordion" + (isOpen ? " open" : "")} style={{ height }}>
        <div ref={innerRef} className="accordion-inner"><div className="pb-8">{children}</div></div>
      </div>
    </section>
  );
}

function IntroTitle({ dims, spacePx, heroRef, bgX, hovering, lang }) {
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

function TopRightControls({ lang, setLang, theme, setTheme }) {
  var t = CONTENT[lang];
  var [open, setOpen] = useState(false);
  var tooltipRef = useRef(null);
  useEffect(function(){
    function onDocClick(e){ if (!tooltipRef.current) return; if (!tooltipRef.current.contains(e.target)) setOpen(false); }
    document.addEventListener("click", onDocClick);
    return function(){ document.removeEventListener("click", onDocClick); };
  }, []);
  return (
    <div className="relative flex items-center justify-end gap-3 text-xs opacity-80 hover:opacity-100 transition">
      <button onClick={() => setLang(lang === "fr" ? "en" : "fr")} className="rounded-full border border-black/10 dark:border-white/10 px-2 py-1 bg-white/70 dark:bg-white/10 backdrop-blur-sm">
        {lang === "fr" ? "EN" : "FR"}
      </button>
      <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="rounded-full border border-black/10 dark:border-white/10 p-1.5 bg-white/70 dark:bg-white/10 backdrop-blur-sm">
        {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
      </button>
      <div ref={tooltipRef} className="relative">
        <button onClick={() => setOpen(!open)} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)} aria-label="Info" className="rounded-full border border-black/10 dark:border-white/10 p-1.5 bg-white/70 dark:bg-white/10 backdrop-blur-sm">
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

function Home({ lang, setLang, theme, setTheme }) {
  var t = CONTENT[lang];
  var [open, setOpen] = useState(null);
  var [showAll, setShowAll] = useState(false);

  var heroWrapRef = useRef(null);
  var heroTextRef = useRef(null);
  var [bgX, setBgX] = useState(0);
  var [hovering, setHovering] = useState(false);
  var [dims, setDims] = useState({ maxWidth: null, maxHeight: null });
  var [spacePx, setSpacePx] = useState(0);

  useEffect(() => {
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
    return () => window.removeEventListener("resize", measure);
  }, [lang]);

  function onMouseMoveHero(e){
    var rect = heroWrapRef.current && heroWrapRef.current.getBoundingClientRect();
    if (!rect) return;
    var x = (e.clientX - rect.left) / rect.width;
    var clamped = Math.max(0, Math.min(1, x));
    setBgX(Math.round(clamped * 100));
  }

  return (
    <main className="flex min-h-dvh flex-col font-light" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, 'Noto Sans', sans-serif" }}>
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 pt-4">
        <TopRightControls lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} />
      </div>

      <div className="mx-auto mt-auto w-full max-w-6xl px-4 sm:px-6">
        <div ref={heroWrapRef} className="pb-4 select-none" onMouseEnter={() => setHovering(true)} onMouseMove={onMouseMoveHero} onMouseLeave={() => setHovering(false)}>
          <div ref={heroTextRef}>
            <IntroTitle lang={lang} hovering={hovering} bgX={bgX} dims={dims} spacePx={spacePx} heroRef={heroTextRef} />
          </div>
        </div>

        <SectionRow label={t.labels.about} isOpen={open === "about"} onToggle={() => setOpen(open === "about" ? null : "about")}>
          <div className="grid grid-cols-1 items-start gap-10 sm:grid-cols-[minmax(150px,200px)_1fr]">
            <div className="pr-4">
              <img src={t.about.photo} alt={"Portrait de " + t.about.name} className="photo-square ring-1 ring-black/10 dark:ring-white/10" />
            </div>
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">{t.about.name}</h2>
                <p className="mt-1 text-sm sm:text-base text-black/60 dark:text-white/60">{t.about.role}</p>
              </div>
              <div className="space-y-4">
                {t.about.bio.map((p, i) => (
                  <p key={i} className="max-w-prose text-sm sm:text-[1.02rem] leading-relaxed text-black/80 dark:text-white/80">{p}</p>
                ))}
              </div>
              <div className="flex flex-wrap gap-4">
                <button onClick={() => { try { var a = atob(EMAIL_B64); window.location.href = "mailto:" + a; } catch(e){} }} className="inline-flex items-center gap-2 rounded-full border border-black/10 dark:border-white/10 px-4 py-2 text-sm font-medium shadow-sm hover:shadow-md transition bg-white/90 dark:bg-white/5 backdrop-blur">
                  <Mail size={16} /> {t.labels.sayHello}
                </button>
                <a href={t.about.contact.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-black/10 dark:border-white/10 px-4 py-2 text-sm font-medium shadow-sm hover:shadow-md transition bg-white/90 dark:bg-white/5 backdrop-blur">
                  <Linkedin size={16} /> LinkedIn
                </a>
                <a href={"tel:+33" + (t.about.contact.phone || "").replace(/\D/g,'')} className="inline-flex items-center gap-2 rounded-full border border-black/10 dark:border-white/10 px-4 py-2 text-sm font-medium shadow-sm hover:shadow-md transition bg-white/90 dark:bg-white/5 backdrop-blur">
                  <Phone size={16} /> {t.about.contact.phone}
                </a>
              </div>
              <div>
                <h3 className="mb-2 text-base font-medium">{t.labels.previousWork}</h3>
                <ul className="space-y-1 text-sm text-black/70 dark:text-white/70">
                  {t.about.previousWork.map((line, idx) => (<li key={idx}>• {line}</li>))}
                </ul>
              </div>
            </div>
          </div>
        </SectionRow>

        <SectionRow
          label={t.labels.projects}
          rightAdornment={open === "projects" ? (
            <button onClick={() => setShowAll(!showAll)} className="text-sm underline-offset-4 hover:underline">
              {showAll ? t.labels.seeLess : t.labels.seeAll}
            </button>
          ) : null}
          isOpen={open === "projects"}
          onToggle={() => setOpen(open === "projects" ? null : "projects")}
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {(t.projects || []).slice(0,4).map((p) => (
                <div key={p.id}>
                  <Link to={"/projects/" + p.id} className="group block overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 shadow-sm ring-1 ring-black/5 dark:ring-white/5 transition bg-white dark:bg-neutral-900">
                    <img src={p.image} alt={"aperçu " + p.title} className="aspect-[4/3] w-full object-cover" />
                    <div className="flex items-center justify-between p-3">
                      <span className="text-sm font-medium">{p.title}</span>
                      <ArrowUpRight className="opacity-60 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" size={16} />
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            <Extras show={showAll} items={(t.projects || []).slice(4)} />
          </div>
        </SectionRow>
      </div>
    </main>
  );
}

function Extras({ show, items }){
  const ref = useRef(null);
  const grid = useRef(null);

    useEffect(() => {
    const el = ref.current, g = grid.current;
    if (!el) return;

    if (show) {
+     // 🔧 IMPORTANT : enlever les styles inline qui masquent le contenu
+     el.style.removeProperty('clip-path');
+     el.style.removeProperty('filter');
+     el.style.removeProperty('opacity');

      el.classList.add("open");
      if (g) {
        g.classList.add("open");
        g.classList.remove("closing");
        const cards = g.querySelectorAll(".card");
        for (let i=0;i<cards.length;i++) cards[i].style.setProperty("--d", (i*60)+"ms");
      }
      requestAnimationFrame(() => {
        el.style.height = "0px";
        requestAnimationFrame(() => {
          const inner = el.firstElementChild;
          const target = inner ? inner.scrollHeight : 0;
          el.style.height = target + "px";
          function onEnd(e){
            if (e.target !== el || e.propertyName !== "height") return;
            el.style.height = "auto";
            el.removeEventListener("transitionend", onEnd);
          }
          el.addEventListener("transitionend", onEnd);
        });
      });
    } else {
      if (g) {
        g.classList.remove("open");
        g.classList.add("closing");
        const cards = g.querySelectorAll(".card");
        for (let i=0;i<cards.length;i++) cards[i].style.setProperty("--dc", ((cards.length-1-i)*60)+"ms");
      }
      const inner = el.firstElementChild;
      const cur = inner ? inner.scrollHeight : 0;
      el.style.height = cur + "px";
      requestAnimationFrame(() => {
        el.classList.remove("open");
        el.style.height = "0px";
        el.style.clipPath = "inset(0% 0% 100% 0%)";
        el.style.filter = "blur(6px)";
        el.style.opacity = "0";
      });
    }
  }, [show, items && items.length]);

  function onImgLoad(){
    const el = ref.current; if (!el) return;
    if (el.classList.contains("open") && el.style.height !== "auto") {
      const inner = el.firstElementChild;
      const target = inner ? inner.scrollHeight : 0;
      el.style.height = target + "px";
    }
  }

  return (
    <div ref={ref} className={"extras" + (show ? " open" : "")} style={{ height: "0px" }}>
      {show ? (
        <div ref={grid} className="extras-grid open">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 pt-6">
            {items.map((p,i) => (
              <div key={p.id} className="card">
                <Link to={"/projects/" + p.id} className="group block overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 ring-1 ring-black/5 dark:ring-white/5 transition bg-white dark:bg-neutral-900">
                  <img src={p.image} alt={"aperçu " + p.title} onLoad={onImgLoad} className="aspect-[4/3] w-full object-cover" />
                  <div className="flex items-center justify-between p-3">
                    <span className="text-sm font-medium">{p.title}</span>
                    <ArrowUpRight className="opacity-60 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" size={16} />
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ProjectPage({ lang }) {
  var t = CONTENT[lang];
  var navigate = useNavigate();
  var params = useParams();
  var id = params.id;
  var project = (t.projects || []).find(p => p.id === id);
  if (!project) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <button onClick={() => navigate(-1)} className="mb-6 inline-flex items-center gap-2 text-sm underline-offset-4 hover:underline">
          <ChevronLeft size={16} /> {t.labels.back}
        </button>
        <p>Not found.</p>
      </div>
    );
  }
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <button onClick={() => navigate(-1)} className="mb-6 inline-flex items-center gap-2 text-sm underline-offset-4 hover:underline">
        <ChevronLeft size={16} /> {t.labels.back}
      </button>
      <h1 className="text-3xl font-semibold tracking-tight">{project.title}</h1>
      <p className="mt-2 text-black/60 dark:text-white/60">{project.summary || ""}</p>
      <img src={project.image} alt="aperçu" className="mt-8 aspect-[16/9] w-full rounded-2xl object-cover ring-1 ring-black/10 dark:ring-white/10" />
      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <p>{project.description || ""}</p>
      </div>
    </div>
  );
}

export default function App() {
  var [lang, setLang] = useState(getInitialLang());
  var [theme, setTheme] = useState(getInitialTheme());
  useEffect(() => { localStorage.setItem("lang", lang); }, [lang]);
  useEffect(() => { localStorage.setItem("theme", theme); var r = document.documentElement; if (theme === "dark") r.classList.add("dark"); else r.classList.remove("dark"); }, [theme]);

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
