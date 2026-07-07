import React, { useRef, useState, useEffect } from "react";
import { flushSync } from "react-dom";
import { HashRouter, Routes, Route, Link, useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowLeft, Plus, Minus, Mail, Linkedin, Phone, ArrowUpRight, Sun, Moon, Info } from "lucide-react";

// Set right before navigating back to "/" so Home knows which single card's
// image should carry the shared view-transition-name (see Home below) — the
// other cards' images must stay unnamed, or they'd each spawn their own orphan
// transition layer and could stack in front of the one actually morphing.
var pendingHomeCardId = null;

function withViewTransition(navigate, to, activeEl) {
  if (document.startViewTransition) {
    // Mark the transition as active so the arriving page can skip its own
    // generic entrance fade (see .page-content usage below) — otherwise that
    // fade replays on top of the browser's own morph animation and every card
    // (not just the one being interacted with) flickers and re-settles.
    document.documentElement.classList.add("vt-active");
    var transition = document.startViewTransition(function () {
      flushSync(function () { navigate(to); });
    });
    transition.finished.finally(function () {
      document.documentElement.classList.remove("vt-active");
      if (activeEl) activeEl.style.viewTransitionName = "";
      pendingHomeCardId = null;
    });
  } else {
    navigate(to);
  }
}
function isPlainClick(e) {
  return !(e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey);
}

const EMAIL_B64 = "bGFncmFuZ2VkeWxhbkBnbWFpbC5jb20=";

const CONTENT = {
  fr: {
    labels: {
      about: "À propos", projects: "Projets",
      previousWork: "Expériences récentes", sayHello: "Dire bonjour", back: "Retour",
      prevProject: "Projet précédent", nextProject: "Projet suivant",
      info: "Éco‑conçu à Bordeaux en 2026 : aucun tracker ni script tiers, polices système (pas de police web à télécharger), hébergement 100 % statique sur GitHub Pages, bundle JavaScript minimal (React + une seule librairie d'icônes). Codé avec Claude Sonnet 5 (Anthropic)."
    },
    about: {
      name: "Dylan Lagrange",
      role: "Product Designer",
      photo: "/images/portrait.webp",
      bio: [
        "Actuellement Product Designer chez UX Republic à Bordeaux, en mission chez Skywise, filiale digitale d’Airbus, sur une solution de gestion des opérations sol.",
        "Au fil de mes missions, j’accompagne l’évolution des outils avec les équipes projet, contribue aux design systems et participe aux réflexions sur nos pratiques (accessibilité, éco‑conception, intelligence artificielle)."
      ],
      previousWork: [
        "MAIF (2024–2026) — Product designer en mission au sein de la DSI, transverse sur plusieurs squads (correspondance multicanal, gestion électronique des documents, téléphonie)",
        "Kairos Agency (2021–2024) — Product designer en agence digitale"
      ],
      contact: { linkedin: "https://www.linkedin.com/in/dylanlgrng", phone: "06.76.46.21.17" }
    },
    projects: []
  },
  en: {
    labels: {
      about: "About me", projects: "Projects",
      previousWork: "Previous work", sayHello: "Say hello", back: "Back",
      prevProject: "Previous project", nextProject: "Next project",
      info: "Eco‑designed in Bordeaux in 2026: no third‑party trackers or scripts, system fonts (no webfont to download), 100% static hosting on GitHub Pages, minimal JavaScript bundle (React + a single icon library). Coded with Claude Sonnet 5 (Anthropic)."
    },
    about: {
      name: "Dylan Lagrange",
      role: "Product Designer",
      photo: "/images/portrait.webp",
      bio: [
        "Currently Product Designer at UX Republic in Bordeaux, on assignment with Skywise, an Airbus digital services company, working on a ground operations management solution.",
        "Across my assignments, I help evolve tools with project teams, contribute to design systems, and join discussions on our practices (accessibility, eco‑design, AI)."
      ],
      previousWork: [
        "MAIF (2024–2026) — Product designer on assignment within the IT department, cross-squad (multichannel correspondence, document management, telephony)",
        "Kairos Agency (2021–2024) — Product designer in a digital agency"
      ],
      contact: { linkedin: "https://www.linkedin.com/in/dylanlgrng", phone: "+33 6 76 46 21 17" }
    },
    projects: []
  }
};

// Projects (MAIF first)
CONTENT.fr.projects = [
  { id:"maif", title:"MAIF", tags:["Outils métiers","Design system"], image:"/images/logomaif.webp", summary:"Évolution des outils métiers au sein de la DSI de la MAIF.", description:"Mission en cours au sein de la DSI de la MAIF (via UX Republic). Travail centré sur l’optimisation d’outils métiers : co-construction avec les équipes projet, contribution au design system, attention continue à l’accessibilité et à l’éco-conception, participation aux réflexions collectives (pratiques, outillage, IA).",
    eyebrow:"Mission UX Republic",
    tagline:"Des outils du quotidien, repensés pour les équipes qui les utilisent chaque jour.",
    stats: [ { value:"3+", label:"Squads accompagnés" }, { value:"2026", label:"Mission en cours" }, { value:"100%", label:"Attention à l’accessibilité" } ],
    sections: [
      { heading:"Contexte", text:"Mission en cours au sein de la DSI de la MAIF, via UX Republic, sur plusieurs squads transverses : correspondance multicanal, gestion électronique des documents, téléphonie." },
      { heading:"Ma contribution", text:"Co-construction avec les équipes projet, contribution continue au design system, attention à l’accessibilité et à l’éco-conception à chaque étape." },
      { heading:"Vie d’équipe", text:"Participation aux réflexions collectives de l’équipe design : pratiques, outillage, intelligence artificielle." }
    ],
    closing:"Une collaboration continue, au service d’outils plus simples." },
  { id:"engagenow", title:"EngageNow", tags:["E-learning","Back-office"], image:"/images/engagenow.webp", summary:"Refonte pour engager, simplifier et harmoniser.", description:"Plateforme e-learning WeNow/Kairos (BtoBtoU). Enjeux : faible rétention, complexité d’arborescence, wording, abandon en cours et incohérences (absence de DS). Solutions : simplification de l’interface, design system, contenus pédagogiques enrichis, gamification, vocabulaire clarifié; refonte accueil/fiches/suivi progression.",
    eyebrow:"E-learning",
    tagline:"Apprendre ne devrait jamais donner envie d’abandonner.",
    stats: [ { value:"BtoBtoU", label:"Modèle de plateforme" }, { value:"3", label:"Parcours repensés" }, { value:"1", label:"Design system créé" } ],
    sections: [
      { heading:"Enjeux", text:"Plateforme e-learning WeNow/Kairos (BtoBtoU) : faible rétention, arborescence complexe, wording confus, abandons en cours de parcours et incohérences visuelles faute de design system." },
      { heading:"Solutions", text:"Simplification de l’interface, création d’un design system, contenus pédagogiques enrichis, gamification et vocabulaire clarifié." },
      { heading:"Résultats", text:"Refonte de l’accueil, des fiches de cours et du suivi de progression pour un parcours plus engageant." }
    ],
    closing:"Un parcours plus clair, du premier clic à la dernière leçon." },
  { id:"ninjae", title:"Ninjaé", tags:["Micro-entreprises","BPCE"], image:"/images/ninjae.webp", summary:"Du cadrage à l’UI, un SaaS accessible et efficace.", description:"SaaS pour micro-entreprises. Recherche et ateliers, design system, UI desktop & mobile. Fonctionnalités clés : connexion bancaire, connexion URSSAF, partie commerciale (devis/factures/clients), pilotage (achats/recettes).",
    eyebrow:"SaaS BPCE",
    tagline:"La paperasse des micro-entrepreneurs, enfin simplifiée.",
    stats: [ { value:"2", label:"Connexions bancaires automatisées" }, { value:"Desktop + Mobile", label:"UI pensée pour les deux" }, { value:"1", label:"Design system dédié" } ],
    sections: [
      { heading:"Contexte", text:"SaaS destiné aux micro-entrepreneurs, du cadrage à l’UI : recherche utilisateur, ateliers de conception, design system pour desktop et mobile." },
      { heading:"Fonctionnalités clés", text:"Connexion bancaire et URSSAF automatisées, partie commerciale (devis, factures, clients) et pilotage financier (achats, recettes)." },
      { heading:"Résultats", text:"Une plateforme accessible et efficace pensée pour simplifier le quotidien administratif des micro-entreprises." }
    ],
    closing:"Du cadrage à l’interface, une plateforme pensée pour durer." },
  { id:"kairos-blue", title:"Kairos Blue", tags:["CMS","LMS","EMS","Back-office"], image:"/images/kairosblue.webp", summary:"Plateforme unifiée, éco-conçue et versionnée.", description:"Plateforme tout-en-un pour centraliser des fonctions agence. Design system robuste; collaboration dev/DA/commercial. Impacts : versionnage, réduction des temps de conception/développement, cohérence multi-supports; déploiements multiples.",
    eyebrow:"Plateforme agence",
    tagline:"Un seul outil pour piloter toute une agence.",
    stats: [ { value:"4", label:"Briques unifiées (CMS/LMS/EMS/BO)" }, { value:"x2", label:"Vitesse de déploiement" }, { value:"Multi", label:"Clients déployés" } ],
    sections: [
      { heading:"Contexte", text:"Plateforme tout-en-un pensée pour centraliser les fonctions d’une agence digitale (CMS, LMS, EMS et back-office)." },
      { heading:"Approche", text:"Design system robuste construit en étroite collaboration entre développeurs, DA et équipes commerciales." },
      { heading:"Résultats", text:"Versionnage des composants, réduction des temps de conception et développement, cohérence multi-supports et déploiements multiples chez différents clients." }
    ],
    closing:"Un design system pensé pour grandir avec l’agence." },
  { id:"mon-service-rh", title:"Mon Service RH", tags:["RH","Back-office"], image:"/images/MSRH.webp", summary:"Une solution RH pour TPE/PME, pensée durable.", description:"Plateforme financée par la Région NA pour WeJob : plateforme principale, espace prestataires/institutions, tunnel de paiement, BO sur-mesure. Parcours conçus avec une forte attention accessibilité (RGAA) et éco-conception.",
    eyebrow:"Région Nouvelle-Aquitaine",
    tagline:"Les ressources humaines, accessibles à toutes les petites entreprises.",
    stats: [ { value:"RGAA", label:"Accessibilité au cœur du projet" }, { value:"3", label:"Espaces distincts" }, { value:"Éco-conçu", label:"Pensé pour durer" } ],
    sections: [
      { heading:"Contexte", text:"Plateforme financée par la Région Nouvelle-Aquitaine pour WeJob, à destination des TPE/PME : plateforme principale, espace prestataires/institutions et tunnel de paiement." },
      { heading:"Approche", text:"Back-office sur-mesure et parcours conçus avec une forte attention portée à l’accessibilité (RGAA) et à l’éco-conception." },
      { heading:"Résultats", text:"Une solution RH pensée pour durer, accessible au plus grand nombre." }
    ],
    closing:"Une plateforme pensée pour être utile, longtemps." },
  { id:"ffbad", title:"FFBaD", tags:["Site fédéral","Back-office"], image:"/images/ffbad.webp", summary:"Refonte pour Paris 2024, DS sur-mesure, BO éco-conçu.", description:"Objectifs : porte d’entrée de l’écosystème digital, attirer de nouveaux licenciés. Travail sur cibles/objectifs, parcours, structure, design system avec DA; back-office éco-conçu; nombreuses fonctionnalités (licenciés, clubs, boutique, presse…).",
    eyebrow:"Fédération Française de Badminton",
    tagline:"La porte d’entrée d’un sport en pleine dynamique olympique.",
    stats: [ { value:"2024", label:"Portée par Paris 2024" }, { value:"4+", label:"Univers fonctionnels" }, { value:"Éco-conçu", label:"Back-office sobre" } ],
    sections: [
      { heading:"Contexte", text:"Refonte du site fédéral à l’occasion de la dynamique Paris 2024 : porte d’entrée de tout l’écosystème digital et levier pour attirer de nouveaux licenciés." },
      { heading:"Approche", text:"Travail sur les cibles et objectifs, les parcours et la structure, design system construit avec la DA." },
      { heading:"Résultats", text:"Back-office éco-conçu et de nombreuses fonctionnalités : gestion des licenciés, des clubs, boutique en ligne, espace presse." }
    ],
    closing:"Un site à la hauteur de l’ambition olympique du badminton français." },
  { id:"pacte-onu", title:"Pacte mondial des Nations Unies", tags:["Site vitrine","Espace membre"], image:"/images/PMRF.webp", summary:"Informer le public et outiller les membres.", description:"Conception d’un espace membre complet : partage de documents, annuaire, blog; travail sur l’accessibilité du site vitrine; forte collaboration marketing/dev.",
    eyebrow:"Réseau France",
    tagline:"Informer, rassembler, outiller : un espace pour tout un réseau.",
    stats: [ { value:"1", label:"Espace membre complet" }, { value:"Annuaire", label:"+ documents + blog" }, { value:"A11y", label:"Accessibilité du site vitrine" } ],
    sections: [
      { heading:"Contexte", text:"Site vitrine et espace membre pour le Pacte mondial des Nations Unies, réseau français." },
      { heading:"Approche", text:"Conception d’un espace membre complet : partage de documents, annuaire des membres, blog. Attention particulière portée à l’accessibilité du site vitrine." },
      { heading:"Résultats", text:"Une collaboration étroite avec les équipes marketing et développement pour livrer un outil clair et accessible." }
    ],
    closing:"Un outil clair, pensé pour un réseau engagé." },
  { id:"finaqui", title:"Finaqui", tags:["Extranet","Back-office"], image:"/images/finaqui.webp", summary:"Automatiser des workflows et fluidifier la collaboration.", description:"Extranet pour un fonds d’investissement régional : suivi de projets, candidatures, pitchs/décisions, permissions d’accès. Interviews/ateliers, wireframes/protos, UI; développement sur Kairos Blue.",
    eyebrow:"Fonds d’investissement régional",
    tagline:"Suivre un investissement, de la candidature à la décision.",
    stats: [ { value:"Kairos Blue", label:"Développé sur notre plateforme" }, { value:"1", label:"Extranet centralisé" }, { value:"Fin", label:"Permissions d’accès" } ],
    sections: [
      { heading:"Contexte", text:"Extranet pour un fonds d’investissement régional : suivi de projets, candidatures, pitchs et décisions, gestion fine des permissions d’accès." },
      { heading:"Approche", text:"Interviews et ateliers avec les parties prenantes, wireframes et prototypes, UI finale." },
      { heading:"Résultats", text:"Développement sur la plateforme Kairos Blue, pour des workflows automatisés et une collaboration fluidifiée." }
    ],
    closing:"Des workflows automatisés, une collaboration fluidifiée." }
];
CONTENT.en.projects = [
  { id:"maif", title:"MAIF", tags:["Internal tools","Design system"], image:"/images/logomaif.webp", summary:"Evolving internal tools within MAIF’s IT department.", description:"Ongoing assignment via UX Republic. Focus on internal tools, co-design with project teams, design-system contributions, accessibility & eco-design, and collective practice/AI discussions.",
    eyebrow:"UX Republic assignment",
    tagline:"Everyday tools, rebuilt for the teams who rely on them every day.",
    stats: [ { value:"3+", label:"Squads supported" }, { value:"2026", label:"Ongoing assignment" }, { value:"100%", label:"Accessibility-first" } ],
    sections: [
      { heading:"Context", text:"Ongoing assignment within MAIF’s IT department, via UX Republic, across several cross-functional squads: multichannel correspondence, document management, telephony." },
      { heading:"My contribution", text:"Co-design with project teams, ongoing contributions to the design system, constant attention to accessibility and eco-design." },
      { heading:"Team life", text:"Taking part in the design team’s collective discussions: practices, tooling, and AI." }
    ],
    closing:"An ongoing collaboration, in service of simpler tools." },
  { id:"engagenow", title:"EngageNow", tags:["E-learning","Back-office"], image:"/images/engagenow.webp", summary:"Refocus the experience to drive engagement.", description:"Simplified UI, design system, better pedagogy, gamification, clearer wording; redesigned home, course pages and progress.",
    eyebrow:"E-learning",
    tagline:"Learning should never feel like giving up.",
    stats: [ { value:"BtoBtoU", label:"Platform model" }, { value:"3", label:"Journeys redesigned" }, { value:"1", label:"Design system built" } ],
    sections: [
      { heading:"Challenges", text:"WeNow/Kairos e-learning platform (BtoBtoU): low retention, complex navigation, confusing wording, drop-offs mid-course, and visual inconsistency without a design system." },
      { heading:"Solutions", text:"Simplified interface, a new design system, richer pedagogical content, gamification and clearer wording." },
      { heading:"Results", text:"Redesigned home page, course pages and progress tracking for a more engaging journey." }
    ],
    closing:"A clearer journey, from first click to final lesson." },
  { id:"ninjae", title:"Ninjaé", tags:["Micro-business","BPCE"], image:"/images/ninjae.webp", summary:"From research to UI.", description:"Bank connection, URSSAF integration, quotes/invoices/CRM, finances & ledger.",
    eyebrow:"BPCE SaaS",
    tagline:"Micro-business admin, finally made simple.",
    stats: [ { value:"2", label:"Automated bank connections" }, { value:"Desktop + Mobile", label:"UI designed for both" }, { value:"1", label:"Dedicated design system" } ],
    sections: [
      { heading:"Context", text:"SaaS for micro-businesses, from research to UI: user research, design workshops, and a design system for desktop and mobile." },
      { heading:"Key features", text:"Automated bank and URSSAF connections, a sales module (quotes, invoices, clients) and financial tracking (spending, revenue)." },
      { heading:"Results", text:"An accessible, efficient platform designed to simplify the daily admin of micro-businesses." }
    ],
    closing:"From scoping to screen, a platform built to last." },
  { id:"kairos-blue", title:"Kairos Blue", tags:["CMS","LMS","EMS","Admin"], image:"/images/kairosblue.webp", summary:"Unified, eco-designed, versioned.", description:"Robust DS, faster delivery, coherent UX across clients.",
    eyebrow:"Agency platform",
    tagline:"One tool to run an entire agency.",
    stats: [ { value:"4", label:"Unified modules (CMS/LMS/EMS/admin)" }, { value:"x2", label:"Faster deployments" }, { value:"Multi", label:"Client deployments" } ],
    sections: [
      { heading:"Context", text:"An all-in-one platform designed to centralize a digital agency’s functions (CMS, LMS, EMS and back-office)." },
      { heading:"Approach", text:"A robust design system built in close collaboration between developers, art directors and sales teams." },
      { heading:"Results", text:"Component versioning, faster design and development cycles, consistency across formats, and multiple client deployments." }
    ],
    closing:"A design system built to grow with the agency." },
  { id:"mon-service-rh", title:"Mon Service RH", tags:["HR","Admin"], image:"/images/MSRH.webp", summary:"HR for SMBs with accessibility.", description:"Main platform, providers area, payment flow, custom back-office.",
    eyebrow:"Nouvelle-Aquitaine region",
    tagline:"HR, made accessible to every small business.",
    stats: [ { value:"RGAA", label:"Accessibility at the core" }, { value:"3", label:"Distinct portals" }, { value:"Eco-designed", label:"Built to last" } ],
    sections: [
      { heading:"Context", text:"A platform funded by the Nouvelle-Aquitaine region for WeJob, aimed at SMBs: main platform, providers/institutions area and payment flow." },
      { heading:"Approach", text:"A custom back-office and user journeys designed with strong attention to accessibility (RGAA) and eco-design." },
      { heading:"Results", text:"An HR solution built to last, accessible to as many people as possible." }
    ],
    closing:"A platform built to stay useful, for a long time." },
  { id:"ffbad", title:"FFBaD", tags:["Federation site","Admin"], image:"/images/ffbad.webp", summary:"Paris 2024 momentum + DS.", description:"User journeys, structure, DS; eco-designed back-office and rich features.",
    eyebrow:"French Badminton Federation",
    tagline:"The gateway to a sport riding Olympic momentum.",
    stats: [ { value:"2024", label:"Powered by Paris 2024" }, { value:"4+", label:"Functional areas" }, { value:"Eco-designed", label:"Lightweight admin" } ],
    sections: [
      { heading:"Context", text:"Redesign of the federation’s site around the Paris 2024 momentum: the entry point to the whole digital ecosystem and a lever to attract new members." },
      { heading:"Approach", text:"Work on targets and objectives, user journeys and structure, a design system built with the art director." },
      { heading:"Results", text:"An eco-designed back-office and many features: member management, clubs, online shop, press area." }
    ],
    closing:"A site worthy of French badminton’s Olympic ambitions." },
  { id:"pacte-onu", title:"UN Global Compact", tags:["Showcase site","Member area"], image:"/images/PMRF.webp", summary:"Public info & member tools.", description:"Docs sharing, directory, blog; accessibility improvements.",
    eyebrow:"France network",
    tagline:"Inform, connect, equip: one space for a whole network.",
    stats: [ { value:"1", label:"Full member area" }, { value:"Directory", label:"+ docs + blog" }, { value:"A11y", label:"Showcase site accessibility" } ],
    sections: [
      { heading:"Context", text:"Showcase site and member area for the UN Global Compact France network." },
      { heading:"Approach", text:"Design of a full member area: document sharing, member directory, blog. Particular attention paid to the showcase site’s accessibility." },
      { heading:"Results", text:"Close collaboration with marketing and development teams to deliver a clear, accessible tool." }
    ],
    closing:"A clear tool, built for a committed network." },
  { id:"finaqui", title:"Finaqui", tags:["Extranet","Admin"], image:"/images/finaqui.webp", summary:"Automated workflows.", description:"Projects tracking, applications, pitches, permissions; built on Kairos Blue.",
    eyebrow:"Regional investment fund",
    tagline:"Tracking an investment, from application to decision.",
    stats: [ { value:"Kairos Blue", label:"Built on our platform" }, { value:"1", label:"Centralized extranet" }, { value:"Fine-grained", label:"Access permissions" } ],
    sections: [
      { heading:"Context", text:"Extranet for a regional investment fund: project tracking, applications, pitches and decisions, fine-grained access permissions." },
      { heading:"Approach", text:"Stakeholder interviews and workshops, wireframes and prototypes, final UI." },
      { heading:"Results", text:"Built on the Kairos Blue platform, for automated workflows and smoother collaboration." }
    ],
    closing:"Automated workflows, smoother collaboration." }
];

function getInitialLang(){ return (localStorage.getItem("lang") === "en") ? "en" : "fr"; }
function getInitialTheme(){
  var s = localStorage.getItem("theme");
  if (s === "dark" || s === "light") return s;
  return (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) ? "dark" : "light";
}

function SectionRow(props) {
  var { label, rightAdornment, isOpen, onToggle, children } = props;

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
      <div className={"accordion" + (isOpen ? " open" : "")}>
        <div className="accordion-inner">
          <div className="accordion-content pb-8">{children}</div>
        </div>
      </div>
    </section>
  );
}

function MagneticWord({ text }) {
  var lettersRef = useRef([]);
  var basePosRef = useRef([]);
  var rafRef = useRef(null);
  var mouseRef = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    var radius = 90;
    var strength = 0.55;

    function measure() {
      basePosRef.current = lettersRef.current.map(function (el) {
        if (!el) return null;
        var prevTransform = el.style.transform;
        if (prevTransform) el.style.transform = "";
        var r = el.getBoundingClientRect();
        if (prevTransform) el.style.transform = prevTransform;
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      });
    }

    function update() {
      rafRef.current = null;
      var letters = lettersRef.current;
      var positions = basePosRef.current;
      for (var i = 0; i < letters.length; i++) {
        var el = letters[i];
        var pos = positions[i];
        if (!el || !pos) continue;
        var dx = mouseRef.current.x - pos.x;
        var dy = mouseRef.current.y - pos.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < radius) {
          var pull = 1 - dist / radius;
          var tx = dx * strength * pull;
          var ty = dy * strength * pull;
          var skew = Math.max(-8, Math.min(8, dx * pull * 0.06));
          var scale = 1 + pull * 0.22;
          el.style.transform = "translate(" + tx.toFixed(1) + "px," + ty.toFixed(1) + "px) scale(" + scale.toFixed(3) + ") skewX(" + skew.toFixed(1) + "deg)";
        } else if (el.style.transform) {
          el.style.transform = "";
        }
      }
    }

    function schedule() {
      if (rafRef.current == null) rafRef.current = requestAnimationFrame(update);
    }
    function onMove(e) {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      schedule();
    }
    function onLeave() {
      mouseRef.current = { x: -9999, y: -9999 };
      schedule();
    }

    measure();
    var resettleId = setTimeout(measure, 500);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, { passive: true });

    // The About/Projects accordions don't resize <main> itself (it's flex with
    // an auto-margin group, so the box height stays put) — they just shift the
    // hero up or down inside it, which ResizeObserver can't see. What DOES fire
    // is the accordion's own CSS transition finishing, so listen for that.
    window.addEventListener("transitionend", measure);

    return function () {
      clearTimeout(resettleId);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure);
      window.removeEventListener("transitionend", measure);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <span className="magnetic-word">
      {text.split("").map(function (ch, i) {
        return (
          <span key={i} ref={function (el) { lettersRef.current[i] = el; }} className="magnetic-letter" style={{ "--i": i }}>
            {ch === " " ? " " : ch}
          </span>
        );
      })}
    </span>
  );
}

function getGreeting(lang) {
  var d = new Date();
  var h = d.getHours(), m = d.getMinutes();
  var isLunch = h === 12 && m < 30;
  var isEvening = h >= 18 || h < 5;
  if (lang === "fr") {
    if (isLunch) return { prefix: "Bon appétit, je suis", suffix: "," };
    if (isEvening) return { prefix: "Bonsoir je suis", suffix: "," };
    return { prefix: "Bonjour je suis", suffix: "," };
  }
  if (isLunch) return { prefix: "Bon appétit, I’m", suffix: "," };
  if (isEvening) return { prefix: "Good evening, I’m", suffix: "," };
  return { prefix: "Hi, I’m", suffix: "," };
}

function IntroTitle({ lang }) {
  var t = CONTENT[lang];
  var greeting = getGreeting(lang);
  return (
    <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium leading-[1.1] tracking-tight">
      {greeting.prefix}{" "}
      <a href={t.about.contact.linkedin} target="_blank" rel="noreferrer" className="hover:underline underline-offset-4">Dylan</a>{greeting.suffix}
      <br />
      <MagneticWord text="Product Designer" /> {lang === "fr" ? "chez" : "at"}
      <br />
      UX Republic {lang === "fr" ? "à" : "in"}{" "}
      <a href="https://www.google.com/maps/search/?api=1&query=Bordeaux" target="_blank" rel="noreferrer" className="hover:underline underline-offset-4">Bordeaux</a>.
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
      <button onClick={() => setLang(lang === "fr" ? "en" : "fr")} className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/10 backdrop-blur-sm">
        {lang === "fr" ? "EN" : "FR"}
      </button>
      <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/10 backdrop-blur-sm">
        {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
      </button>
      <div ref={tooltipRef} className="relative">
        <button onClick={() => setOpen(!open)} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)} aria-label="Info" className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/10 backdrop-blur-sm">
          <Info size={14} />
        </button>
        {open ? (
          <div className="tooltip-in absolute right-0 z-50 mt-2 w-64 sm:w-80 rounded-md border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900 px-3 py-2 text-left text-[11px] leading-relaxed shadow-lg ring-1 ring-black/5 dark:ring-white/5">
            {t.labels.info}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Home({ lang, setLang, theme, setTheme, open, setOpen }) {
  var t = CONTENT[lang];
  var navigate = useNavigate();
  // Read once at mount: if this render was triggered by a view-transition-driven
  // navigation, skip the generic page-content entrance fade (the browser's own
  // shared-element morph already handles the arrival, and playing both at once
  // is what causes the other cards to flicker/move).
  var skipEntranceRef = useRef(document.documentElement.classList.contains("vt-active"));
  // Read once at mount: which card (if any) we're arriving from when coming
  // back from a project page — only that one gets the shared transition name.
  var activeCardIdRef = useRef(pendingHomeCardId);

  return (
    <main className={(skipEntranceRef.current ? "" : "page-content ") + "flex min-h-dvh flex-col font-light"} style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, 'Noto Sans', sans-serif" }}>
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 pt-4">
        <TopRightControls lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} />
      </div>

      <div className="mx-auto mt-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="pb-4 select-none">
          <IntroTitle lang={lang} />
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
          isOpen={open === "projects"}
          onToggle={() => setOpen(open === "projects" ? null : "projects")}
        >
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {(t.projects || []).map((p) => (
              <div key={p.id} className="h-full">
                <Link
                  to={"/projects/" + p.id}
                  onClick={(e) => {
                    if (!isPlainClick(e)) return;
                    e.preventDefault();
                    var imgEl = e.currentTarget.querySelector("img");
                    if (imgEl) imgEl.style.viewTransitionName = "project-img-" + p.id;
                    withViewTransition(navigate, "/projects/" + p.id, imgEl);
                  }}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 shadow-sm ring-1 ring-black/5 dark:ring-white/5 transition bg-white dark:bg-neutral-900"
                >
                  <img
                    src={p.image}
                    alt={"aperçu " + p.title}
                    style={p.id === activeCardIdRef.current ? { viewTransitionName: "project-img-" + p.id } : undefined}
                    className="aspect-[4/3] w-full object-cover"
                  />
                  <div className="flex flex-1 items-start justify-between gap-2 p-3">
                    <span className="line-clamp-2 min-h-[2.75rem] text-sm font-medium leading-snug">{p.title}</span>
                    <ArrowUpRight className="mt-0.5 shrink-0 opacity-60 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" size={16} />
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </SectionRow>
      </div>
    </main>
  );
}

function ProjectPage({ lang }) {
  var t = CONTENT[lang];
  var navigate = useNavigate();
  var params = useParams();
  var id = params.id;
  var list = t.projects || [];
  var index = list.findIndex(p => p.id === id);
  var project = index >= 0 ? list[index] : null;
  var skipEntranceRef = useRef(document.documentElement.classList.contains("vt-active"));

  if (!project) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <button onClick={() => withViewTransition(navigate, "/")} className="mb-6 inline-flex items-center gap-2 rounded-full border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur-sm">
          <ArrowLeft size={16} /> {t.labels.back}
        </button>
        <p>Not found.</p>
      </div>
    );
  }

  var prev = list[(index - 1 + list.length) % list.length];
  var next = list[(index + 1) % list.length];

  return (
    <div
      key={id}
      className="min-h-dvh w-full border border-white bg-white dark:border-neutral-950 dark:bg-neutral-950"
    >
      <div className={skipEntranceRef.current ? "" : "page-content"}>
        <div className="mx-auto max-w-4xl px-4 pt-16">
          <div className="mb-6 flex items-center justify-between">
            <button onClick={() => { pendingHomeCardId = project.id; withViewTransition(navigate, "/"); }} className="inline-flex items-center gap-2 rounded-full border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur-sm">
              <ArrowLeft size={16} /> {t.labels.back}
            </button>
            <div className="flex items-center gap-3">
              <Link
                to={"/projects/" + prev.id}
                onClick={(e) => { if (!isPlainClick(e)) return; e.preventDefault(); withViewTransition(navigate, "/projects/" + prev.id); }}
                aria-label={t.labels.prevProject}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/10 backdrop-blur-sm"
              >
                <ChevronLeft size={16} />
              </Link>
              <Link
                to={"/projects/" + next.id}
                onClick={(e) => { if (!isPlainClick(e)) return; e.preventDefault(); withViewTransition(navigate, "/projects/" + next.id); }}
                aria-label={t.labels.nextProject}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/10 backdrop-blur-sm"
              >
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>

          {/* Hero */}
          <div className="max-w-2xl pb-10 pt-4 text-left sm:pb-14 sm:pt-8">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">{project.title}</h1>
            {project.tagline ? (
              <p className="mt-2 max-w-xl text-lg leading-relaxed text-black/60 dark:text-white/60 sm:text-xl">{project.tagline}</p>
            ) : null}
          </div>

          {/* Hero image, floating on a soft backdrop */}
          <div className="relative">
            <div className="absolute inset-6 -z-10 rounded-[2.5rem] bg-black/[0.03] blur-2xl dark:bg-white/[0.04]" aria-hidden="true" />
            <img
              src={project.image}
              alt="aperçu"
              style={{ viewTransitionName: "project-img-" + project.id }}
              className="aspect-[16/10] w-full rounded-[1.75rem] object-cover shadow-2xl shadow-black/10 ring-1 ring-black/5 dark:shadow-black/40 dark:ring-white/10"
            />
          </div>

          {/* Big statement */}
          <div className="mx-auto max-w-2xl py-16 text-center sm:py-24">
            <p className="text-2xl font-semibold leading-snug tracking-tight sm:text-3xl md:text-4xl">{project.summary}</p>
          </div>
        </div>

        {/* Stats band — full-bleed, tinted, to break the page into an Apple-like rhythm */}
        {(project.stats || []).length ? (
          <div className="border-y border-black/10 bg-black/[0.02] dark:border-white/10 dark:bg-white/[0.03]">
            <div className="mx-auto grid max-w-4xl grid-cols-1 divide-y divide-black/10 px-4 dark:divide-white/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {project.stats.map((s, i) => (
                <div key={i} className="px-2 py-10 text-center sm:py-14">
                  <p className="text-4xl font-semibold tracking-tight sm:text-5xl">{s.value}</p>
                  <p className="mt-3 text-sm text-black/50 dark:text-white/50">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* Detail sections, spec-sheet style */}
        {(project.sections || []).length ? (
          <div className="mx-auto max-w-4xl px-4">
            <div className="space-y-14 py-16 sm:space-y-20 sm:py-24">
              {project.sections.map((s, i) => (
                <div key={i} className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,220px)_1fr] sm:gap-12">
                  <h2 className="text-sm font-medium uppercase tracking-[0.15em] text-black/40 dark:text-white/40">{s.heading}</h2>
                  <p className="max-w-prose text-xl leading-relaxed tracking-tight sm:text-2xl">{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* Closing statement band */}
        {project.closing ? (
          <div className="border-y border-black/10 bg-black/[0.02] dark:border-white/10 dark:bg-white/[0.03]">
            <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:py-24">
              <p className="mx-auto max-w-lg text-2xl font-semibold tracking-tight sm:text-3xl">{project.closing}</p>
            </div>
          </div>
        ) : null}

        {/* Closing visual */}
        <div className="mx-auto max-w-4xl px-4 py-16">
          <img
            src={project.image}
            alt="aperçu"
            className="aspect-[21/9] w-full rounded-[1.75rem] object-cover ring-1 ring-black/5 dark:ring-white/10"
          />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  var [lang, setLang] = useState(getInitialLang());
  var [theme, setTheme] = useState(getInitialTheme());
  var [open, setOpen] = useState(null);
  useEffect(() => { localStorage.setItem("lang", lang); }, [lang]);
  useEffect(() => { localStorage.setItem("theme", theme); var r = document.documentElement; if (theme === "dark") r.classList.add("dark"); else r.classList.remove("dark"); }, [theme]);

  var contentKey = lang + "-" + theme;

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home key={contentKey} lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} open={open} setOpen={setOpen} />} />
        <Route path="/projects/:id" element={<ProjectPage key={contentKey} lang={lang} />} />
        <Route path="*" element={<Home key={contentKey} lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} open={open} setOpen={setOpen} />} />
      </Routes>
    </HashRouter>
  );
}
