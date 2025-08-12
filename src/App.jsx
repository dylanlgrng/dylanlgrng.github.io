import React, { useMemo, useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, Link, useParams, useNavigate } from "react-router-dom";
import { Plus, Minus, ArrowUpRight, ChevronLeft } from "lucide-react";
import content from "./content/site.json";

// ---------- Helpers ----------
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
      {isOpen && <div className="pb-8">{children}</div>}
    </section>
  );
}

// Titre principal avec mot-clé dynamique : cycle pendant le survol (sans fade)
function IntroTitle({ designerFont, designerColor, dims, spacePx, heroRef }) {
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
          <span
            style={{
              fontFamily: designerFont
                ? `${designerFont}, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, 'Noto Sans', sans-serif`
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
  const [open, setOpen] = useState(null); // 'about' | 'projects' | null
  const [showAll, setShowAll] = useState(false);

  // Système de fontes : Mac + Windows (zéro webfont)
  const fontsMaster = useMemo(
    () => [
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, 'Noto Sans', sans-serif",
      "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      "'Helvetica Neue', Helvetica, Arial, 'Liberation Sans', sans-serif",
      "'Segoe UI', Tahoma, Verdana, Arial, sans-serif",
      "Verdana, Geneva, Tahoma, sans-serif",
      "'Gill Sans', 'Gill Sans MT', 'Trebuchet MS', Arial, sans-serif",
      "'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Arial, sans-serif",
      "'Times New Roman', Times, serif",
      "Georgia, 'Times New Roman', serif",
      "'Palatino Linotype', Palatino, serif",
      "Baskerville, 'Times New Roman', Times, serif",
      "Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
      "'Courier New', Courier, monospace",
      "'Brush Script MT', cursive",
      "'Comic Sans MS', 'Comic Sans', cursive",
    ],
    []
  );

  // Couleurs tendance
  const trendyColors = useMemo(
    () => [
      "#0ea5e9", // sky-500
      "#22c55e", // green-500
      "#a78bfa", // violet-400
      "#f43f5e", // rose-500
      "#f59e0b", // amber-500
      "#06b6d4", // cyan-500
      "#fb7185", // rose-400
      "#10b981", // emerald-500
      "#f97316", // orange-500
      "#14b8a6", // teal-500
      "#8b5cf6", // violet-500
      "#e11d48", // rose-600
    ],
    []
  );

  // État dynamique survol
  const [hoverFont, setHoverFont] = useState(undefined);
  const [hoverColor, setHoverColor] = useState(undefined);
  const cycleRef = useRef(null);

  // Mesures (évite les sauts)
  const heroRef = useRef(null);
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

      // Canvas measure
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const wFor = (stack, text) => {
        ctx.font = `500 ${sizePx}px ${stack}`;
        const m = ctx.measureText(text);
        const w = m.width;
        const h = (m.actualBoundingBoxAscent || sizePx * 0.8) + (m.actualBoundingBoxDescent || sizePx * 0.2);
        return { w, h };
      };

      let maxPDW = 0;
      let maxPDH = 0;
      fontsMaster.forEach((stack) => {
        const m = wFor(stack, phrasePD);
        if (m.w > maxPDW) maxPDW = m.w;
        if (m.h > maxPDH) maxPDH = m.h;
      });
      const mChez = wFor(systemStack, phraseChezWord);
      const aa = wFor(systemStack, "AA").w;
      const a_a = wFor(systemStack, "A A").w;
      const space = Math.max(0, Math.round(a_a - aa));

      setSpacePx(space);
      setDims({ maxWidth: Math.ceil(maxPDW + space + mChez.w), maxHeight: Math.ceil(maxPDH) });
    };

    measure();
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("resize", measure);
      if (cycleRef.current) clearInterval(cycleRef.current);
    };
  }, [fontsMaster]);

  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const onHeroEnter = () => {
    // si un timer existe déjà, on le nettoie
    if (cycleRef.current) clearInterval(cycleRef.current);
    // tick immédiat
    setHoverFont(pick(fontsMaster));
    setHoverColor(pick(trendyColors));
    // cycle toutes les 120ms pendant le survol
    cycleRef.current = setInterval(() => {
      setHoverFont(pick(fontsMaster));
      setHoverColor(pick(trendyColors));
    }, 120);
  };

  const onHeroLeave = () => {
    if (cycleRef.current) {
      clearInterval(cycleRef.current);
      cycleRef.current = null;
    }
    setHoverFont(undefined);
    setHoverColor(undefined);
  };

  const projectsData = content.projects || [];
  const about = content.about;

  const visibleProjects = useMemo(
    () => (showAll ? projectsData : projectsData.slice(0, 4)),
    [showAll, projectsData]
  );

  return (
    <main
      className="flex min-h-dvh flex-col font-light"
      style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, 'Noto Sans', sans-serif" }}
    >
      <div className="mx-auto mt-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="pb-4" onMouseEnter={onHeroEnter} onMouseLeave={onHeroLeave}>
          <IntroTitle designerFont={hoverFont} designerColor={hoverColor} dims={dims} spacePx={spacePx} heroRef={heroRef} />
        </div>

        {/* About me */}
        <SectionRow
          label="About me"
          isOpen={open === "about"}
          onToggle={() => setOpen(open === "about" ? null : "about")}
        >
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-[240px_1fr]">
            <img
              alt={`Portrait de ${about.name}`}
              className="aspect-square w-60 rounded-xl object-cover shadow-sm ring-1 ring-black/10"
              src={about.photo}
            />
            <div className="space-y-6 pr-2">
              <div>
                <h2 className="text-2xl font-medium tracking-tight">{about.name}</h2>
                <p className="text-sm text-black/60">{about.role}</p>
                {about.bio.map((p, i) => (
                  <p key={i} className="mt-3 max-w-prose text-sm sm:text-base text-black/80">{p}</p>
                ))}
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
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {about.skills.map((s) => (
                    <span key={s} className="rounded-full bg-black/[0.06] px-3 py-1 text-xs font-medium">{s}</span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-2 text-base font-medium">Mon objectif</h3>
                <p className="max-w-prose text-sm text-black/80">{about.objective}</p>
              </div>

              <div>
                <h3 className="mb-2 text-base font-medium">Contact</h3>
                <ul className="flex flex-wrap gap-4 text-sm">
                  <li><a href={`mailto:${about.contact.email}`} className="underline-offset-4 hover:underline">{about.contact.email}</a></li>
                  <li><a href={`tel:+33${about.contact.phone.replace(/\D/g,'')}`} className="underline-offset-4 hover:underline">{about.contact.phone}</a></li>
                  <li><a href={about.contact.linkedin} target="_blank" rel="noreferrer" className="underline-offset-4 hover:underline">LinkedIn</a></li>
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
              <button onClick={() => setShowAll((v) => !v)} className="text-sm underline-offset-4 hover:underline">
                {showAll ? "Voir moins" : "Voir tout"}
              </button>
            ) : null
          }
          isOpen={open === "projects"}
          onToggle={() => setOpen(open === "projects" ? null : "projects")}
        >
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {visibleProjects.map((p) => (
              <Link key={p.id} to={`/projects/${p.id}`} className="group block overflow-hidden rounded-xl border border-black/10 shadow-sm ring-1 ring-black/5 transition hover:shadow-md">
                <img src={p.image} alt={`aperçu ${p.title}`} className="aspect-[4/3] w-full object-cover" />
                <div className="flex items-center justify-between p-3">
                  <span className="text-sm font-medium">{p.title}</span>
                  <span className="text-xs text-black/60">{p.summary || ""}</span>
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
