import React, { useMemo, useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, Link, useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Plus, Minus, Mail, Linkedin, Phone, ArrowUpRight, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import i18n from "./content/site.json";

// Email obfuscation (base64)
const EMAIL_B64 = "bGFncmFuZ2VkeWxhbkBnbWFpbC5jb20="; // lagrangedylan@gmail.com
const openMailto = () => {
  try {
    const addr = atob(EMAIL_B64);
    window.location.href = `mailto:${addr}`;
  } catch {}
};

// Persisted toggles
const getInitialLang = () => {
  const saved = localStorage.getItem("lang");
  return saved === "en" ? "en" : "fr";
};
const getInitialTheme = () => {
  const saved = localStorage.getItem("theme");
  if (saved === "dark" || saved === "light") return saved;
  // default to light
  return "light";
};

// ------------- Accordion Row -------------
function SectionRow({ label, rightAdornment, isOpen, onToggle, children }) {
  return (
    <section className="border-t border-black/10 dark:border-white/10">
      <header className="flex items-center gap-4 py-3 text-base sm:text-lg">
        <button
          className="flex-1 text-left font-medium tracking-tight focus:outline-none"
          aria-expanded={isOpen}
          onClick={onToggle}
        >
          {label}
        </button>
        <div className="mr-2 hidden sm:block">{rightAdornment}</div>
        <button
          onClick={onToggle}
          aria-label={isOpen ? `${label} — réduire` : `${label} — développer`}
          className="ml-auto inline-flex items-center justify-center p-1 opacity-70 transition hover:opacity-100 focus:outline-none"
        >
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

// ------------- Hero Title with mouse-driven gradient -------------
function IntroTitle({ dims, spacePx, heroRef, bgX, lang }) {
  const t = i18n[lang];
  const { maxWidth, maxHeight } = dims || {};
  return (
    <h1 ref={heroRef} className="text-3xl sm:text-4xl md:text-5xl font-medium leading-[1.1] tracking-tight text-balance">
      {t.hero.hello}
      <br />
      <span
        className="inline-block align-baseline relative"
        style={{ width: maxWidth ? `${maxWidth}px` : undefined, height: maxHeight ? `${maxHeight}px` : undefined, lineHeight: "inherit" }}
      >
        <span className="invisible whitespace-nowrap" style={{ lineHeight: "inherit" }}>
          Product Designer {lang === "fr" ? "chez" : "at"}
        </span>
        <span className="absolute left-0 top-0 whitespace-nowrap" style={{ lineHeight: "inherit" }}>
          <span
            className="gradient-text"
            style={{ backgroundPosition: `${bgX}% 50%` }}
          >
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

// ------------- Pages -------------
function Home({ lang }) {
  const t = i18n[lang];
  const [open, setOpen] = useState(null); // 'about' | 'projects' | null
  const [showAll, setShowAll] = useState(false);

  // Mouse-driven gradient position
  const heroWrapRef = useRef(null);
  const heroRef = useRef(null);
  const [bgX, setBgX] = useState(0);

  const [dims, setDims] = useState({ maxWidth: null, maxHeight: null });
  const [spacePx, setSpacePx] = useState(0);

  useEffect(() => {
    const phrasePD = "Product Designer";
    const word = lang === "fr" ? "chez" : "at";
    const measure = () => {
      const systemStack = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, 'Noto Sans', sans-serif";
      const sizePx = (() => {
        const h = heroRef.current;
        if (!h) return 48;
        const cs = window.getComputedStyle(h);
        return Math.round(parseFloat(cs.fontSize) || 48);
      })();
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      ctx.font = `500 ${sizePx}px ${systemStack}`;
      const wPD = ctx.measureText(phrasePD).width;
      const hPD = (ctx.measureText(phrasePD).actualBoundingBoxAscent || sizePx * 0.8) + (ctx.measureText(phrasePD).actualBoundingBoxDescent || sizePx * 0.2);
      const wWord = ctx.measureText(word).width;
      const wAA = ctx.measureText("AA").width;
      const wA_A = ctx.measureText("A A").width;
      const space = Math.max(0, Math.round(wA_A - wAA));
      setSpacePx(space);
      setDims({ maxWidth: Math.ceil(wPD + space + wWord), maxHeight: Math.ceil(hPD) });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [lang]);

  const about = t.about;
  const projectsData = t.projects || [];
  const visibleProjects = useMemo(() => (showAll ? projectsData : projectsData.slice(0, 4)), [showAll, projectsData]);

  const onMouseMoveHero = (e) => {
    const rect = heroWrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width;
    const clamped = Math.max(0, Math.min(1, x));
    setBgX(Math.round(clamped * 100));
  };
  const onMouseLeaveHero = () => setBgX(0);

  return (
    <main
      className="flex min-h-dvh flex-col font-light"
      style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, 'Noto Sans', sans-serif" }}
    >
      {/* tiny toggles are rendered in App header */}
      <div ref={heroWrapRef} onMouseMove={onMouseMoveHero} onMouseLeave={onMouseLeaveHero} className="mx-auto mt-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="pb-4">
          <IntroTitle lang={lang} bgX={bgX} dims={dims} spacePx={spacePx} heroRef={heroRef} />
        </div>

        {/* À propos - Airy layout */}
        <SectionRow
          label={t.labels.about}
          isOpen={open === "about"}
          onToggle={() => setOpen(open === "about" ? null : "about")}
        >
          <div className="grid grid-cols-1 items-start gap-10 sm:grid-cols-[minmax(220px,280px)_1fr]">
            <figure className="space-y-4">
              <img
                alt={`Portrait de ${about.name}`}
                className="aspect-square w-full rounded-2xl object-cover shadow-sm ring-1 ring-black/10 dark:ring-white/10"
                src={about.photo}
              />
              <figcaption className="text-sm text-black/60 dark:text-white/60">
                {about.name} — {about.role}
              </figcaption>
            </figure>

            <div className="space-y-6">
              <div className="space-y-3">
                {about.bio.map((p, i) => (
                  <p key={i} className="max-w-prose text-sm sm:text-base text-black/80 dark:text-white/80">{p}</p>
                ))}
              </div>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={openMailto}
                  className="inline-flex items-center gap-2 rounded-full border border-black/10 dark:border-white/10 px-4 py-2 text-sm font-medium shadow-sm hover:shadow-md transition bg-white/90 dark:bg-white/5 backdrop-blur"
                >
                  <Mail size={16} />
                  {t.labels.sayHello}
                </button>
                <a
                  href={about.contact.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-black/10 dark:border-white/10 px-4 py-2 text-sm font-medium shadow-sm hover:shadow-md transition bg-white/90 dark:bg-white/5 backdrop-blur"
                >
                  <Linkedin size={16} />
                  LinkedIn
                </a>
                <a
                  href={`tel:+33${(about.contact.phone || "").replace(/\D/g,'')}`}
                  className="inline-flex items-center gap-2 rounded-full border border-black/10 dark:border-white/10 px-4 py-2 text-sm font-medium shadow-sm hover:shadow-md transition bg-white/90 dark:bg-white/5 backdrop-blur"
                >
                  <Phone size={16} />
                  {about.contact.phone}
                </a>
              </div>

              <div className="pt-2">
                <h3 className="mb-2 text-base font-medium">{t.labels.previousWork}</h3>
                <ul className="space-y-1 text-sm text-black/70 dark:text-white/70">
                  {(about.previousWork || []).map((line, idx) => (
                    <li key={idx}>• {line}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </SectionRow>

        {/* Projets - Cards keep the card look */}
        <SectionRow
          label={t.labels.projects}
          rightAdornment={
            open === "projects" ? (
              <button onClick={() => setShowAll((v) => !v)} className="text-sm underline-offset-4 hover:underline">
                {showAll ? t.labels.seeLess : t.labels.seeAll}
              </button>
            ) : null
          }
          isOpen={open === "projects"}
          onToggle={() => setOpen(open === "projects" ? null : "projects")}
        >
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {(visibleProjects || []).map((p) => (
              <Link key={p.id} to={`/projects/${p.id}`} className="group block overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 shadow-sm ring-1 ring-black/5 dark:ring-white/5 transition hover:shadow-md bg-white dark:bg-neutral-900">
                <img src={p.image} alt={`aperçu ${p.title}`} className="aspect-[4/3] w-full object-cover" />
                <div className="flex items-center justify-between p-3">
                  <span className="text-sm font-medium">{p.title}</span>
                  <ArrowUpRight className="opacity-60 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" size={16} />
                </div>
              </Link>
            ))}
          </div>
        </SectionRow>
      </div>
    </main>
  );
}

function ProjectPage({ lang }) {
  const t = i18n[lang];
  const navigate = useNavigate();
  const { id } = useParams();
  const project = (t.projects || []).find((p) => p.id === id);

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
  const [lang, setLang] = useState(getInitialLang());
  const [theme, setTheme] = useState(getInitialTheme());

  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [theme]);

  const toggleLang = () => setLang((l) => (l === "fr" ? "en" : "fr"));
  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <BrowserRouter>
      {/* Tiny, discreet toggles in top-right */}
      <div className="fixed right-4 top-3 z-50 flex items-center gap-3 text-xs opacity-80 hover:opacity-100 transition">
        <button onClick={toggleLang} className="rounded-full border border-black/10 dark:border-white/10 px-2 py-1 bg-white/70 dark:bg-white/10 backdrop-blur-sm">
          {lang === "fr" ? "EN" : "FR"}
        </button>
        <button onClick={toggleTheme} className="rounded-full border border-black/10 dark:border-white/10 p-1.5 bg-white/70 dark:bg-white/10 backdrop-blur-sm">
          {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
        </button>
      </div>

      <Routes>
        <Route path="/" element={<Home lang={lang} />} />
        <Route path="/projects/:id" element={<ProjectPage lang={lang} />} />
        <Route path="*" element={<Home lang={lang} />} />
      </Routes>
    </BrowserRouter>
  );
}
