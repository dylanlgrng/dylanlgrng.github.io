import React, { useMemo, useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, Link, useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Plus, Minus, Mail, Linkedin, Phone, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import content from "./content/site.json";

// Email obfuscation (base64)
const EMAIL_B64 = "bGFncmFuZ2VkeWxhbkBnbWFpbC5jb20="; // lagrangedylan@gmail.com
const openMailto = () => {
  try {
    const addr = atob(EMAIL_B64);
    window.location.href = `mailto:${addr}`;
  } catch {}
};

// ------------- Accordion Row (FR + animation) -------------
function SectionRow({ label, rightAdornment, isOpen, onToggle, children }) {
  return (
    <section className="border-t border-black/10">
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

// ------------- Hero Title with gradient on hover -------------
function IntroTitle({ gradientActive, dims, spacePx, heroRef }) {
  const { maxWidth, maxHeight } = dims || {};
  return (
    <h1 ref={heroRef} className="text-3xl sm:text-4xl md:text-5xl font-medium leading-[1.1] tracking-tight text-balance">
      Bonjour je suis Dylan,
      <br />
      <span
        className="inline-block align-baseline relative"
        style={{ width: maxWidth ? `${maxWidth}px` : undefined, height: maxHeight ? `${maxHeight}px` : undefined, lineHeight: "inherit" }}
      >
        <span className="invisible whitespace-nowrap" style={{ lineHeight: "inherit" }}>
          Product Designer chez
        </span>
        <span className="absolute left-0 top-0 whitespace-nowrap" style={{ lineHeight: "inherit" }}>
          <span className={gradientActive ? "gradient-text animate-gradient" : ""}>
            Product Designer
          </span>
          <span style={{ marginLeft: typeof spacePx === "number" ? `${spacePx}px` : undefined }}>chez</span>
        </span>
      </span>
      <br />
      UX Republic à Bordeaux.
    </h1>
  );
}

// ------------- Pages -------------
function Home() {
  const [open, setOpen] = useState(null); // 'about' | 'projects' | null
  const [showAll, setShowAll] = useState(false);
  const heroRef = useRef(null);
  const [gradientActive, setGradientActive] = useState(false);

  // Mesures anti-saut (sans changer de fonte)
  const [dims, setDims] = useState({ maxWidth: null, maxHeight: null });
  const [spacePx, setSpacePx] = useState(0);

  useEffect(() => {
    const phrasePD = "Product Designer";
    const phraseChezWord = "chez";
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
      const wChez = ctx.measureText(phraseChezWord).width;
      const wAA = ctx.measureText("AA").width;
      const wA_A = ctx.measureText("A A").width;
      const space = Math.max(0, Math.round(wA_A - wAA));
      setSpacePx(space);
      setDims({ maxWidth: Math.ceil(wPD + space + wChez), maxHeight: Math.ceil(hPD) });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const about = content.about;
  const projectsData = content.projects || [];
  const visibleProjects = useMemo(() => (showAll ? projectsData : projectsData.slice(0, 4)), [showAll, projectsData]);

  return (
    <main
      className="flex min-h-dvh flex-col font-light"
      style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, 'Noto Sans', sans-serif" }}
    >
      <div className="mx-auto mt-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="pb-4" onMouseEnter={() => setGradientActive(true)} onMouseLeave={() => setGradientActive(false)}>
          <IntroTitle gradientActive={gradientActive} dims={dims} spacePx={spacePx} heroRef={heroRef} />
        </div>

        {/* À propos */}
        <SectionRow
          label="À propos"
          isOpen={open === "about"}
          onToggle={() => setOpen(open === "about" ? null : "about")}
        >
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-[280px_1fr]">
            {/* Photo card */}
            <div className="rounded-2xl border border-black/10 p-2 shadow-sm ring-1 ring-black/5 bg-gradient-to-br from-black/[0.02] to-white">
              <img
                alt={`Portrait de ${about.name}`}
                className="aspect-square w-full rounded-xl object-cover"
                src={about.photo}
              />
              <div className="px-2 pb-2 pt-3">
                <div className="text-sm font-medium">{about.name}</div>
                <div className="text-xs text-black/60">{about.role}</div>
              </div>
            </div>

            {/* Content card */}
            <div className="rounded-2xl border border-black/10 p-5 shadow-sm ring-1 ring-black/5 bg-white/80 backdrop-blur-sm">
              {/* Accent bar */}
              <div className="h-1 w-16 rounded-full bg-gradient-to-r from-sky-500 via-violet-500 to-amber-500 mb-4"></div>

              {/* Bio */}
              <div className="space-y-3">
                {about.bio.map((p, i) => (
                  <p key={i} className="max-w-prose text-sm sm:text-base text-black/80">{p}</p>
                ))}
              </div>

              {/* Actions */}
              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  onClick={openMailto}
                  className="inline-flex items-center gap-2 rounded-xl border border-black/10 px-3 py-2 text-sm font-medium shadow-sm ring-1 ring-black/5 transition hover:shadow-md"
                >
                  <Mail size={16} />
                  Dire bonjour
                </button>
                <a
                  href={about.contact.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-black/10 px-3 py-2 text-sm font-medium shadow-sm ring-1 ring-black/5 transition hover:shadow-md"
                >
                  <Linkedin size={16} />
                  LinkedIn
                </a>
                <a
                  href={`tel:+33${about.contact.phone.replace(/\D/g,'')}`}
                  className="inline-flex items-center gap-2 rounded-xl border border-black/10 px-3 py-2 text-sm font-medium shadow-sm ring-1 ring-black/5 transition hover:shadow-md"
                >
                  <Phone size={16} />
                  {about.contact.phone}
                </a>
              </div>

              {/* Previous work */}
              <div className="mt-6 rounded-xl border border-black/10 p-4 bg-black/[0.02]">
                <h3 className="mb-2 text-base font-medium">Expériences précédentes</h3>
                <ul className="list-disc pl-5 text-sm text-black/80">
                  {(about.previousWork || []).map((line, idx) => (
                    <li key={idx}>{line}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </SectionRow>

        {/* Projets */}
        <SectionRow
          label="Projets"
          rightAdornment={
            open === "projects" ? (
              <button onClick={() => setShowAll((v) => !v)} className="text-sm underline-offset-4 hover:underline">
                {showAll ? "Voir moins" : "Voir tout"}
              </button>
            ) : null
          }
          isOpen={open === "projects"}
          onToggle={() => setOpen(open === "projects" ? null : "projects")}
        >
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {(visibleProjects || []).map((p) => (
              <Link key={p.id} to={`/projects/${p.id}`} className="group block overflow-hidden rounded-xl border border-black/10 shadow-sm ring-1 ring-black/5 transition hover:shadow-md">
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

function ProjectPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = (content.projects || []).find((p) => p.id === id);

  if (!project) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <button onClick={() => navigate(-1)} className="mb-6 inline-flex items-center gap-2 text-sm underline-offset-4 hover:underline">
          <ChevronLeft size={16} /> Retour
        </button>
        <p>Projet introuvable.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <button onClick={() => navigate(-1)} className="mb-6 inline-flex items-center gap-2 text-sm underline-offset-4 hover:underline">
        <ChevronLeft size={16} /> Retour
      </button>

      <h1 className="text-3xl font-semibold tracking-tight">{project.title}</h1>
      <p className="mt-2 text-black/60">{project.summary || ""}</p>
      <img src={project.image} alt="aperçu" className="mt-8 aspect-[16/9] w-full rounded-xl object-cover shadow-sm ring-1 ring-black/10" />
      <div className="prose prose-neutral max-w-none mt-6">
        <p>{project.description || "Description en cours de rédaction."}</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects/:id" element={<ProjectPage />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
