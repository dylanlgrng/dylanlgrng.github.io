import React, { useMemo, useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, Link, useParams, useNavigate } from "react-router-dom";
import { Plus, Minus, ArrowUpRight, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ---------- Data ----------
const skills = [
  "Product Design",
  "UX Design",
  "UI Design",
  "Accessibilité",
  "Design System",
  "Éco‑conception",
  "Workshop",
];

const projectsData = Array.from({ length: 12 }).map((_, i) => {
  const n = i + 1;
  return {
    id: `projet-${n}`,
    title: `Projet ${n < 10 ? `0${n}` : n}`,
    image: `https://picsum.photos/seed/dylan-${n}/960/600`,
  };
});

// ---------- Layout Helpers ----------
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
          aria-label={isOpen ? `${label} – réduire` : `${label} – développer`}
          className="ml-auto inline-flex items-center justify-center p-1 opacity-70 transition hover:opacity-100 focus:outline-none"
        >
          {isOpen ? <Minus size={18} /> : <Plus size={18} />}
        </button>
      </header>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0, y: 8 }}
            animate={{ height: "auto", opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: 8 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div className="pb-8">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function IntroTitle({ designerFont, designerColor, dims, spacePx, heroRef }) {
  const { maxWidth, maxHeight } = dims || {};
  return (
    <h1 ref={heroRef} className="text-3xl sm:text-4xl md:text-5xl font-medium leading-[1.1] tracking-tight text-balance">
      Bonjour je suis Dylan,
      <br />
      {/* Wrapper largeur/hauteur fixes pour éviter tout saut */}
      <span
        className="inline-block align-baseline relative"
        style={{ width: maxWidth ? `${maxWidth}px` : undefined, height: maxHeight ? `${maxHeight}px` : undefined, lineHeight: "inherit" }}
      >
        {/* Fantôme pour conserver la baseline et l'espacement naturel */}
        <span className="invisible whitespace-nowrap" style={{ lineHeight: "inherit" }}>
          Product Designer chez
        </span>
        {/* Overlay, inline pur */}
        <span
          className="absolute left-0 top-0 whitespace-nowrap"
          style={{ lineHeight: "inherit" }}
        >
          <span
            style={{
              fontFamily: designerFont
                ? `${designerFont}, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif`
                : undefined,
              color: designerColor,
            }}
          >
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

// ---------- Pages ----------
function Home() {
  const [open, setOpen] = useState(null); // "about" | "projects" | null
  const [showAll, setShowAll] = useState(false);

  // Polices (stacks système + quelques familles usuelles)
  const fontsMaster = useMemo(
    () => [
      "Transducer, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif",
      "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
      "System UI, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, 'Apple Color Emoji', 'Segoe UI Emoji'",
      "Manrope, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial",
      "Space Grotesk, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial",
      "Work Sans, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial",
      "'Times New Roman', Times, serif",
      "Georgia, serif",
      "'Courier New', Courier, monospace",
      "'Comic Sans MS', 'Comic Sans', cursive",
      "'Brush Script MT', cursive",
      "'Lucida Handwriting', cursive",
      "'Apple Chancery', cursive",
      "'IBM Plex Sans', system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    ],
    []
  );

  // Palette "tendance" (sans animation)
  const trendyColors = useMemo(
    () => [
      "#0ea5e9", // sky-500
      "#22c55e", // green-500
      "#a78bfa", // violet-400
      "#f43f5e", // rose-500
      "#f59e0b", // amber-500
      "#06b6d4", # # cyan-500
      "#fb7185", # # rose-400
      "#10b981", # # emerald-500
      "#f97316", # # orange-500
      "#14b8a6", # # teal-500
      "#8b5cf6", # # violet-500
      "#e11d48", # # rose-600
    ],
    []
  );

  // État "une fois par survol"
  const [hoverFont, setHoverFont] = useState(undefined);
  const [hoverColor, setHoverColor] = useState(undefined);

  // Mesures de largeur/hauteur
  const heroRef = useRef(null);
  const [dims, setDims] = useState({ maxWidth: null, maxHeight: null });
  const [spacePx, setSpacePx] = useState(0);

  useEffect(() => {
    const phrasePD = "Product Designer";
    const phraseChezWord = "chez";

    const measureWidthCanvas = (family, sizePx = 48, weight = 500, text = phrasePD) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return { w: 0, h: 0 };
      ctx.font = `${weight} ${sizePx}px ${family}`;
      const m = ctx.measureText(text);
      const w = m.width;
      const h = (m.actualBoundingBoxAscent || sizePx * 0.8) + (m.actualBoundingBoxDescent || sizePx * 0.2);
      return { w, h };
    };

    const measureSpacePx = (family, sizePx = 48, weight = 500) => {
      const aa = measureWidthCanvas(family, sizePx, weight, "AA").w;
      const a_a = measureWidthCanvas(family, sizePx, weight, "A A").w;
      return Math.max(0, Math.round(a_a - aa));
    };

    const measureAll = () => {
      const baseStack = "Transducer, Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif";
      const sizePx = (() => {
        const h = heroRef.current;
        if (!h) return 48;
        const cs = window.getComputedStyle(h);
        return Math.round(parseFloat(cs.fontSize) || 48);
      })();

      let maxPDW = 0;
      let maxPDH = 0;
      fontsMaster.forEach((stack) => {
        const m = measureWidthCanvas(stack, sizePx, 500, phrasePD);
        if (m.w > maxPDW) maxPDW = m.w;
        if (m.h > maxPDH) maxPDH = m.h;
      });

      const mChez = measureWidthCanvas(baseStack, sizePx, 500, phraseChezWord);
      const space = measureSpacePx(baseStack, sizePx, 500);
      setSpacePx(space);
      setDims({ maxWidth: Math.ceil(maxPDW + space + mChez.w), maxHeight: Math.ceil(maxPDH) });
    };

    measureAll();
    window.addEventListener("resize", measureAll);
    return () => window.removeEventListener("resize", measureAll);
  }, [fontsMaster]);

  // Handlers (pas d'animation, set instantané)
  const onHeroEnter = () => {
    const font = fontsMaster[Math.floor(Math.random() * fontsMaster.length)];
    const color = trendyColors[Math.floor(Math.random() * trendyColors.length)];
    setHoverFont(font);
    setHoverColor(color);
  };
  const onHeroLeave = () => {
    setHoverFont(undefined);
    setHoverColor(undefined);
  };

  const visibleProjects = useMemo(
    () => (showAll ? projectsData : projectsData.slice(0, 4)),
    [showAll]
  );

  return (
    <main
      className="flex min-h-dvh flex-col font-light"
      style={{
        fontFamily:
          "Transducer, Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif",
      }}
    >
      {/* Titre + sections collés en bas */}
      <div className="mx-auto mt-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="pb-4" onMouseEnter={onHeroEnter} onMouseLeave={onHeroLeave}>
          <IntroTitle
            designerFont={hoverFont}
            designerColor={hoverColor}
            dims={dims}
            spacePx={spacePx}
            heroRef={heroRef}
          />
        </div>

        {/* About me */}
        <SectionRow
          label="About me"
          isOpen={open === "about"}
          onToggle={() => setOpen(open === "about" ? null : "about")}
        >
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-[240px_1fr]">
            <img
              alt="Portrait de Dylan (exemple)"
              className="aspect-square w-60 rounded-xl object-cover shadow-sm ring-1 ring-black/10"
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop"
            />
            <div className="space-y-6 pr-2">
              <div>
                <h2 className="text-2xl font-medium tracking-tight">Dylan Lagrange</h2>
                <p className="text-sm text-black/60">Product Designer</p>
                <p className="mt-3 max-w-prose text-sm sm:text-base text-black/80">
                  Je crée des interfaces au design soigné et réfléchi, en mettant les utilisateurs au premier plan
                  dans les équipes de développeurs et de créatifs.
                </p>
                <a
                  href="#"
                  className="mt-3 inline-flex items-center gap-2 border-b border-transparent pb-0.5 text-sm font-medium hover:border-black/50"
                >
                  Mon CV <ArrowUpRight size={16} />
                </a>
              </div>

              <div>
                <h3 className="mb-2 text-base font-medium">Mes compétences</h3>
                <p className="max-w-prose text-sm text-black/80">
                  Mon Master en UX Design et mon expérience en agence m'ont permis d'être un designer polyvalent.
                  Passionné et autonome, j'ai développé une expertise complète, de la recherche à la réalisation.
                  Mon approche intègre une veille constante et des formations pour suivre l'évolution continue du domaine.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {skills.map((s) => (
                    <span key={s} className="rounded-full bg-black/[0.06] px-3 py-1 text-xs font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-2 text-base font-medium">Mon objectif</h3>
                <p className="max-w-prose text-sm text-black/80">
                  Concevoir des produits qui répondent aux attentes des utilisateurs et qui soutiennent les objectifs
                  des entreprises.
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-base font-medium">Contact</h3>
                <ul className="flex flex-wrap gap-4 text-sm">
                  <li>
                    <a href="mailto:lagrangedylan@gmail.com" className="underline-offset-4 hover:underline">lagrangedylan@gmail.com</a>
                  </li>
                  <li>
                    <a href="tel:+33676462117" className="underline-offset-4 hover:underline">06.76.46.21.17</a>
                  </li>
                  <li>
                    <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer" className="underline-offset-4 hover:underline">LinkedIn</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </SectionRow>

        {/* Projects */}
        <SectionRow
          label="Projects"
          rightAdornment={
            open === "projects" ? (
              <button
                onClick={() => setShowAll((v) => !v)}
                className="text-sm underline-offset-4 hover:underline"
              >
                {showAll ? "Voir moins" : "Voir tout"}
              </button>
            ) : null
          }
          isOpen={open === "projects"}
          onToggle={() => setOpen(open === "projects" ? null : "projects")}
        >
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {visibleProjects.map((p) => (
              <Link
                key={p.id}
                to={`/projects/${p.id}`}
                className="group block overflow-hidden rounded-xl border border-black/10 shadow-sm ring-1 ring-black/5 transition hover:shadow-md"
              >
                <img src={p.image} alt="aperçu de projet" className="aspect-[4/3] w-full object-cover" />
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
  const project = projectsData.find((p) => p.id === id);

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
      <p className="mt-2 text-black/60">Page projet en cours de construction. Revenez bientôt ✌️</p>
      <img
        src={project.image}
        alt="aperçu"
        className="mt-8 aspect-[16/9] w-full rounded-xl object-cover shadow-sm ring-1 ring-black/10"
      />
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
