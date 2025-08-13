import React, { useRef, useState, useEffect } from "react";
import { HashRouter, Routes, Route, Link, useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Plus, Minus, Mail, Linkedin, Phone, ArrowUpRight, Sun, Moon, Info } from "lucide-react";

const EMAIL_B64 = "bGFncmFuZ2VkeWxhbkBnbWFpbC5jb20=";
const ease = [0.22, 1, 0.36, 1];

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
for (let i=1;i<=8;i++) {
  CONTENT.fr.projects.push({ id:"p"+i, title:["Refonte Back‑Office","Design System interne","Tableau de bord produit","Outil de gestion des stocks","Portail support","Pilotage des commandes","KIT UI éco‑conçu","Expérimentation IA"][i-1], image:`https://picsum.photos/seed/ux${i}/800/600`, summary:"Aperçu rapide du projet.", description:"Page projet à venir." });
  CONTENT.en.projects.push({ id:"p"+i, title:["Back‑office redesign","Internal design system","Product dashboard","Inventory management tool","Support portal","Order tracking","Eco‑designed UI kit","AI exploration"][i-1], image:`https://picsum.photos/seed/ux${i}/800/600`, summary:"Quick project overview.", description:"Project page coming soon." });
}

function getInitialLang(){ return (localStorage.getItem("lang") === "en") ? "en" : "fr"; }
function getInitialTheme(){ var s = localStorage.getItem("theme"); if (s === "dark" || s === "light") return s; var h = new Date().getHours(); return (h >= 7 && h < 19) ? "light" : "dark"; }

function SectionRow(props) {
  var label = props.label, rightAdornment = props.rightAdornment, isOpen = props.isOpen, onToggle = props.onToggle, children = props.children;
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
      <div className={"transition-all"}>
        {isOpen ? <div className="pb-8">{children}</div> : null}
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
  var [open, setOpen] = useState(false);
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
  var open = useState(null); var openVal = open[0]; var setOpen = open[1];
  var showAll = useState(false); var showAllVal = showAll[0]; var setShowAll = showAll[1];
  var closing = useState(false); var closingVal = closing[0]; var setClosing = closing[1];

  var heroWrapRef = useRef(null);
  var heroTextRef = useRef(null);
  var bgX = useState(0); var bgXVal = bgX[0]; var setBgX = bgX[1];
  var hovering = useState(false); var hoveringVal = hovering[0]; var setHovering = hovering[1];

  var dims = useState({ maxWidth: null, maxHeight: null }); var dimsVal = dims[0]; var setDims = dims[1];
  var spacePx = useState(0); var spacePxVal = spacePx[0]; var setSpacePx = spacePx[1];

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

  var projectsData = t.projects || [];

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
      // After expansion, set to auto to maintain layout
      setTimeout(function(){ if (!el) return; el.style.height = "auto"; }, 620);
      // Animate child cards staggered
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
      // compute reverse delays
      var cards = grid.querySelectorAll(".card-enter");
      var n = cards.length;
      for (var i=0;i<n;i++){ var d = (n-1-i)*60; cards[i].style.setProperty("--delayClose", d + "ms"); }
    }
    // set fixed height then collapse
    el.style.height = el.scrollHeight + "px";
    requestAnimationFrame(function(){
      el.classList.remove("open");
      el.style.height = "0px";
      el.style.clipPath = "inset(0% 0% 100% 0%)";
      el.style.filter = "blur(6px)";
      el.style.opacity = "0";
    });
    // After animations, actually unmount extras
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
      {showAllVal ? t.labels.seeLess : t.labels.seeAll}
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
            <IntroTitle lang={lang} hovering={hoveringVal} bgX={bgXVal} dims={dimsVal} spacePx={spacePxVal} heroRef={heroTextRef} />
          </div>
        </div>

        {/* À propos */}
        <SectionRow label={t.labels.about} isOpen={openVal === "about"} onToggle={function(){ setOpen(openVal === "about" ? null : "about"); }}>
          <div className="grid grid-cols-1 items-start gap-10 sm:grid-cols-[minmax(150px,180px)_1fr]">
            <div className="pr-4">
              <div className="rounded-[12px] overflow-visible">
                <img src={t.about.photo} alt={"Portrait de " + t.about.name} className="photo-square ring-1 ring-black/10 dark:ring-white/10" />
              </div>
            </div>
            <div className="space-y-8 overflow-hidden">
              <div>
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">{t.about.name}</h2>
                <p className="mt-1 text-sm sm:text-base text-black/60 dark:text-white/60">{t.about.role}</p>
              </div>
              <div className="space-y-4">
                {t.about.bio.map(function(p, i){ return (
                  <p key={i} className="max-w-prose text-sm sm:text-[1.02rem] leading-relaxed text-black/80 dark:text-white/80">{p}</p>
                );})}
              </div>
              <div className="flex flex-wrap gap-4">
                <button onClick={function(){ try { var a = atob(EMAIL_B64); window.location.href = "mailto:" + a; } catch(e){} }} className="inline-flex items-center gap-2 rounded-full border border-black/10 dark:border-white/10 px-4 py-2 text-sm font-medium shadow-sm hover:shadow-md transition bg-white/90 dark:bg-white/5 backdrop-blur">
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
                  {t.about.previousWork.map(function(line, idx){ return (<li key={idx}>• {line}</li>); })}
                </ul>
              </div>
            </div>
          </div>
        </SectionRow>

        {/* Projets */}
        <SectionRow
          label={t.labels.projects}
          rightAdornment={openVal === "projects" ? seeAllButton : null}
          isOpen={openVal === "projects"}
          onToggle={function(){ setOpen(openVal === "projects" ? null : "projects"); }}
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {(t.projects || []).slice(0,4).map(function(p){
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

            <div ref={extrasRef} className={"extras-container" + (showAllVal ? " open" : "")} style={{ height: "0px" }}>
              {showAllVal ? (
                <div ref={gridRef} className={"extras-grid" + (closingVal ? " closing" : " open")}>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 pt-6">
                    {(t.projects || []).slice(4).map(function(p, i, arr){
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
          </div>
        </SectionRow>
      </div>
    </main>
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
  var lang = useState(getInitialLang()); var langVal = lang[0]; var setLang = lang[1];
  var theme = useState(getInitialTheme()); var themeVal = theme[0]; var setTheme = theme[1];
  useEffect(function(){ localStorage.setItem("lang", langVal); }, [langVal]);
  useEffect(function(){ localStorage.setItem("theme", themeVal); var r = document.documentElement; if (themeVal === "dark") r.classList.add("dark"); else r.classList.remove("dark"); }, [themeVal]);

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home lang={langVal} setLang={setLang} theme={themeVal} setTheme={setTheme} />} />
        <Route path="/projects/:id" element={<ProjectPage lang={langVal} />} />
        <Route path="*" element={<Home lang={langVal} setLang={setLang} theme={themeVal} setTheme={setTheme} />} />
      </Routes>
    </HashRouter>
  );
}
