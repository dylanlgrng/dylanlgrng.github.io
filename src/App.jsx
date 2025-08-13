import React, { useMemo, useState, useEffect, useRef } from "react";
import { HashRouter, Routes, Route, Link, useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Plus, Minus, Mail, Linkedin, Phone, ArrowUpRight, Sun, Moon, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import i18n from "./content/site.json";

const EMAIL_B64 = "bGFncmFuZ2VkeWxhbkBnbWFpbC5jb20=";

const getInitialLang = () => (localStorage.getItem("lang") === "en" ? "en" : "fr");
const getInitialTheme = () => { const s = localStorage.getItem("theme"); if (s === "dark" || s === "light") return s; const h = new Date().getHours(); return (h >= 7 && h < 19) ? "light" : "dark"; };

function SectionRow({ label, rightAdornment, isOpen, onToggle, children }) {
  return (
    <section className="border-t border-black/10 dark:border-white/10">
      <header className="flex items-center gap-4 py-3 text-base sm:text-lg">
        <button className="flex-1 text-left font-medium tracking-tight focus:outline-none" aria-expanded={isOpen} onClick={onToggle}>
          {label}
        </button>
        <div className="mr-2 hidden sm:block">{rightAdornment}</div>
        <button onClick={onToggle} aria-label={isOpen ? `${label} — réduire` : `${label} — développer`} className="ml-auto inline-flex items-center justify-center p-1 opacity-70 transition hover:opacity-100 focus:outline-none">
          {isOpen ? <Minus size={18} /> : <Plus size={18} />}
        </button>
      </header>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0, y: 8, filter: "blur(6px)" }}
            animate={{ height: "auto", opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ height: 0, opacity: 0, y: 8, filter: "blur(6px)" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: "hidden" }}
          >
            <motion.div
              initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
              animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
              exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="pb-8">{children}</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function IntroTitle({ dims, spacePx, heroRef, bgX, hovering, lang }) {
  const t = i18n[lang];
  const maxWidth = dims && dims.maxWidth; const maxHeight = dims && dims.maxHeight;
  return (
    <h1 ref={heroRef} className="text-3xl sm:text-4xl md:text-5xl font-medium leading-[1.1] tracking-tight text-balance">
      {t.hero.hello}
      <br />
      <span className="inline-block align-baseline relative" style={{ width: maxWidth ? `${maxWidth}px` : undefined, height: maxHeight ? `${maxHeight}px` : undefined, lineHeight: "inherit" }}>
        <span className="invisible whitespace-nowrap" style={{ lineHeight: "inherit" }}>
          Product Designer {lang === "fr" ? "chez" : "at"}
        </span>
        <span className="absolute left-0 top-0 whitespace-nowrap" style={{ lineHeight: "inherit" }}>
          <span className={hovering ? "gradient-text" : ""} style={hovering ? { backgroundPosition: `${bgX}% 50%` } : { color: "currentColor" }}>
            Product Designer
          </span>
          <span style={{ marginLeft: typeof spacePx === "number" ? `${spacePx}px` : undefined }}>
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
  const t = i18n[lang];
  const [open, setOpen] = useState(false);
  const tooltipRef = useRef(null);
  useEffect(() => {
    const onDocClick = (e) => { if (!tooltipRef.current) return; if (!tooltipRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
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
        <AnimatePresence>
          {open ? (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-0 z-50 mt-2 rounded-md border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900 px-3 py-2 text-[11px] shadow-lg ring-1 ring-black/5 dark:ring-white/5 whitespace-nowrap"
            >
              {t.labels.info}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Home({ lang, setLang, theme, setTheme }) {
  const t = i18n[lang];
  const [open, setOpen] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const heroWrapRef = useRef(null);
  const heroTextRef = useRef(null);
  const [bgX, setBgX] = useState(0);
  const [hovering, setHovering] = useState(false);

  const [dims, setDims] = useState({ maxWidth: null, maxHeight: null });
  const [spacePx, setSpacePx] = useState(0);

  useEffect(() => {
    const phrasePD = "Product Designer";
    const word = lang === "fr" ? "chez" : "at";
    const measure = () => {
      const system = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, 'Noto Sans', sans-serif";
      const h = heroTextRef.current;
      const cs = h ? window.getComputedStyle(h) : null;
      const sizePx = cs ? Math.round(parseFloat(cs.fontSize) || 48) : 48;
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      ctx.font = "500 " + sizePx + "px " + system;
      const wPD = ctx.measureText(phrasePD).width;
      const mAA = ctx.measureText("AA");
      const mA_A = ctx.measureText("A A");
      const space = Math.max(0, Math.round(mA_A.width - mAA.width));
      setSpacePx(space);
      const ascent = ctx.measureText(phrasePD).actualBoundingBoxAscent || sizePx * 0.8;
      const descent = ctx.measureText(phrasePD).actualBoundingBoxDescent || sizePx * 0.2;
      setDims({ maxWidth: Math.ceil(wPD + space + ctx.measureText(word).width), maxHeight: Math.ceil(ascent + descent) });
    };
    measure(); window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [lang]);

  const projectsData = t.projects || [];

  const onMouseMoveHero = (e) => {
    const rect = heroWrapRef.current && heroWrapRef.current.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width;
    const clamped = Math.max(0, Math.min(1, x));
    setBgX(Math.round(clamped * 100));
  };

  const projSectionRef = useRef(null);
  useEffect(() => {
    if (showAll) {
      requestAnimationFrame(() => {
        const sec = projSectionRef.current; if (!sec) return;
        const rect = sec.getBoundingClientRect();
        const overflow = rect.bottom - window.innerHeight;
        if (overflow > 0) window.scrollBy({ top: overflow + 24, behavior: "smooth" });
      });
    }
  }, [showAll]);

  const ease = [0.22, 1, 0.36, 1];

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
                {t.about.bio.map((p, i) => (
                  <p key={i} className="max-w-prose text-sm sm:text-[1.02rem] leading-relaxed text-black/80 dark:text-white/80">{p}</p>
                ))}
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
          <div ref={projSectionRef}>
            {function(){
              const first = (projectsData || []).slice(0,4);
              const extra = (projectsData || []).slice(4);
              const extraLen = extra.length;
              return (
                <motion.div layout className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {first.map((p) => (
                    <motion.div key={p.id} layout transition={{ duration: 0.45, ease }}>
                      <Link to={`/projects/${p.id}`} className="group block overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 shadow-sm ring-1 ring-black/5 dark:ring-white/5 transition bg-white dark:bg-neutral-900">
                        <img src={p.image} alt={"aperçu " + p.title} className="aspect-[4/3] w-full object-cover" />
                        <div className="flex items-center justify-between p-3">
                          <span className="text-sm font-medium">{p.title}</span>
                          <ArrowUpRight className="opacity-60 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" size={16} />
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                  <AnimatePresence initial={false} mode="popLayout">
                    {showAll ? extra.map((p, i) => (
                      <motion.div key={p.id}
                        layout
                        initial={{ opacity: 0, y: 16, scale: 0.985, filter: "blur(6px)", clipPath: "inset(0% 0% 100% 0%)" }}
                        animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)", clipPath: "inset(0% 0% 0% 0%)" }}
                        exit={{ opacity: 0, y: -14, scale: 0.985, filter: "blur(6px)", clipPath: "inset(0% 0% 100% 0%)" }}
                        transition={{ duration: 0.54, ease, delay: Math.min(i * 0.06, 0.48) }}
                      >
                        <Link to={`/projects/${p.id}`} className="group block overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 shadow-sm ring-1 ring-black/5 dark:ring-white/5 transition bg-white dark:bg-neutral-900">
                          <img src={p.image} alt={"aperçu " + p.title} className="aspect-[4/3] w-full object-cover" />
                          <div className="flex items-center justify-between p-3">
                            <span className="text-sm font-medium">{p.title}</span>
                            <ArrowUpRight className="opacity-60 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" size={16} />
                          </div>
                        </Link>
                      </motion.div>
                    )) : extra.map((p, i) => (
                      <motion.div key={"exit-" + p.id}
                        layout
                        initial={false}
                        animate={false}
                        exit={{ opacity: 0, y: -14, scale: 0.985, filter: "blur(6px)", clipPath: "inset(0% 0% 100% 0%)" }}
                        transition={{ duration: 0.5, ease, delay: Math.min((extraLen - 1 - i) * 0.06, 0.48) }}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>
              );
            }()}
          </div>
        </SectionRow>
      </div>
    </main>
  );
}

function ProjectPage({ lang }) {
  const t = i18n[lang];
  const navigate = useNavigate();
  const params = useParams();
  const id = params.id;
  const project = (t.projects || []).find(function(p){ return p.id === id; });
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
      <img src={project.image} alt="aperçu" className="mt-8 aspect-[16/9] w-full rounded-2xl object-cover shadow-sm ring-1 ring-black/10 dark:ring-white/10" />
      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <p>{project.description || ""}</p>
      </div>
    </div>
  );
}

export default function App() {
  const [lang, setLang] = useState((localStorage.getItem("lang") === "en") ? "en" : "fr");
  const [theme, setTheme] = useState((function(){ const s = localStorage.getItem("theme"); if (s === "dark" || s === "light") return s; const h = new Date().getHours(); return (h >= 7 && h < 19) ? "light" : "dark"; })());
  useEffect(function(){ localStorage.setItem("lang", lang); }, [lang]);
  useEffect(function(){ localStorage.setItem("theme", theme); const r = document.documentElement; if (theme === "dark") r.classList.add("dark"); else r.classList.remove("dark"); }, [theme]);

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
        {/* Projets */}
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
          <div ref={projSectionRef}>
            {function(){
              const first = (projectsData || []).slice(0,4);
              const extra = (projectsData || []).slice(4);
              const ease = [0.22, 1, 0.36, 1];
              const stagger = 0.06;

              const cardVariants = {
                hidden: { opacity: 0, y: 22, scale: 0.985, rotateX: 6, filter: "blur(6px)", clipPath: "inset(0% 0% 100% 0%)" },
                show: (c) => ({
                  opacity: 1, y: 0, scale: 1, rotateX: 0, filter: "blur(0px)", clipPath: "inset(0% 0% 0% 0%)",
                  transition: { duration: 0.58, ease: ease, delay: Math.min((c && c.i ? c.i : 0) * stagger, 0.48) }
                }),
                hide: (c) => ({
                  opacity: 0, y: -18, scale: 0.975, rotateX: -4, filter: "blur(6px)", clipPath: "inset(0% 0% 100% 0%)",
                  transition: { duration: 0.5, ease: ease, delay: Math.min(((c && c.total ? c.total : 0) - 1 - (c && c.i ? c.i : 0)) * stagger, 0.48) }
                }),
              };

              return (
                <motion.div layout className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {first.map((p) => (
                    <motion.div key={p.id} layout transition={{ duration: 0.45, ease }}>
                      <Link to={`/projects/${p.id}`} className="group block overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 shadow-sm ring-1 ring-black/5 dark:ring-white/5 transition bg-white dark:bg-neutral-900">
                        <img src={p.image} alt={`aperçu ${p.title}`} className="aspect-[4/3] w-full object-cover" />
                        <div className="flex items-center justify-between p-3">
                          <span className="text-sm font-medium">{p.title}</span>
                          <ArrowUpRight className="opacity-60 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" size={16} />
                        </div>
                      </Link>
                    </motion.div>
                  ))}

                  <AnimatePresence initial={false} mode="popLayout">
                    {showAll ? extra.map((p, i) => (
                      <motion.div key={p.id}
                        layout
                        variants={cardVariants}
                        initial="hidden"
                        animate="show"
                        exit="hide"
                        custom={{ i: i, total: extra.length }}
                        style={{ transformPerspective: 1000 }}
                      >
                        <Link to={`/projects/${p.id}`} className="group block overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 shadow-sm ring-1 ring-black/5 dark:ring-white/5 transition bg-white dark:bg-neutral-900">
                          <img src={p.image} alt={`aperçu ${p.title}`} className="aspect-[4/3] w-full object-cover" />
                          <div className="flex items-center justify-between p-3">
                            <span className="text-sm font-medium">{p.title}</span>
                            <ArrowUpRight className="opacity-60 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" size={16} />
                          </div>
                        </Link>
                      </motion.div>
                    )) : null}
                  </AnimatePresence>
                </motion.div>
              );
            }()}
          </div>
        </SectionRow>

