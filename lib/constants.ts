export interface Project {
  title: string;
  description: string;
  /** Drives both the row's chips and the modal's tech icons. */
  tech: string[];
  /**
   * Year work started, taken from the first commit in each repo rather than
   * guessed. Rendered benji.org style: shown once per group, blank on the
   * rows beneath it, so the eye reads the list as grouped by year.
   */
  year: string;
  github: string;
  demo: string;
  /** One sentence. The modal is a look at the thing, not an essay. */
  detailedDescription: string;
  /** Short bullets — a few words each, not sentences. */
  features: string[];
  /**
   * 2:1 screenshot in /public/images/projects. When absent the modal draws a
   * generated cover instead, so a project without a shot still looks
   * deliberate rather than broken.
   */
  shot?: string;
}

export const PROJECTS: Project[] = [
  {
    title: "Current",
    year: "2026",
    description: "sleek native macOS BitTorrent client",
    tech: ["Swift 6", "SwiftUI", "AppKit", "C++", "libtorrent", "Sparkle"],
    github: "https://github.com/alanwtom/current",
    demo: "https://current.alantom.dev",
    detailedDescription:
      "treats torrenting as background work: quiet when idle, informative when active, and reversible when it acts on its own.",
    features: [
      "one card per magnet decision",
      "seed policies that explain themselves",
      "storage budget, Trash-only deletes",
      "live menu bar panel",
      "full keyboard + command palette",
    ],
    shot: "current.webp",
  },
  {
    title: "Fwrd",
    year: "2026",
    description:
      "privacy-forward iOS app that automatically forwards SMS messages to Discord, Slack, and Telegram",
    tech: ["Swift", "SwiftUI", "iOS Extensions", "Webhooks"],
    github: "",
    demo: "https://fwrdsms.com",
    detailedDescription:
      "intercepts incoming SMS and forwards it to Discord, Slack or Telegram in real time.",
    features: [
      "automatic background forwarding",
      "Discord, Slack and Telegram webhooks",
      "filter by sender or keyword",
      "all processing stays on-device",
    ],
    shot: "fwrd.webp",
  },
  {
    title: "Bug Bot",
    year: "2025",
    description:
      "discord bot for career development with resume resources, real time job and event tracking, and learning material recommendations",
    tech: ["Python", "Discord.py", "GCP", "Nox"],
    github: "https://github.com/innovateorange/DiscordBot",
    demo: "https://discord.gg/cvqbKxPtHE",
    detailedDescription:
      "career development for students in one place: jobs, resumes and learning material, surfaced in the Discord they already use.",
    features: [
      "real-time job tracking",
      "resume feedback and templates",
      "curated learning recommendations",
      "career fair and workshop alerts",
    ],
  },
  {
    title: "Flow",
    year: "2025",
    description:
      "sleek browser extension that helps users maintain focus by blocking distracting elements while browsing",
    tech: ["JavaScript", "Chrome Extension API", "HTML", "CSS"],
    github: "https://github.com/alanwtom/Flow",
    demo: "https://chromewebstore.google.com/detail/flow/odenofhkafaeedoohodgdndpeeadpndg",
    detailedDescription:
      "blocks the distracting parts of a page without breaking the rest of it.",
    features: [
      "intelligent content blocking",
      "customizable distraction filters",
      "minimal performance impact",
    ],
    shot: "flow.webp",
  },
];

export const TYPEWRITER_TEXTS = [
  "I'm a Computer Science senior at Syracuse University.",
];

export interface Experience {
  company: string;
  role: string;
  years: string;
  description: string;
}

export const EXPERIENCES: Experience[] = [
  {
    company: "CuseHacks",
    role: "Former President",
    years: "2024–2026",
    description:
      "led Syracuse's largest hackathon, orchestrating 40% YoY attendance growth, $10K+ in sponsorships, and a team of 15+ members.",
  },
  {
    company: "Micron × SU",
    role: "Game Development Intern",
    years: "4 semesters · 2024–2026",
    description:
      "joint project building an educational game that teaches semiconductor manufacturing",
  },
  {
    company: "iSchool @ SU",
    role: "NSF REU Researcher",
    years: "2025",
    description:
      "engineered financial sentiment pipeline using FinBERT/Llama 3.1, analyzing Truth Social posts",
  },
  {
    company: "Data Lab @ SU",
    role: "Undergraduate Researcher",
    years: "2024–2025",
    description:
      "built Python evaluation pipeline for LLM memory interference testing, automating analysis of 300+ associations",
  },
];

export const EMAIL = "alanwtom@outlook.com";
export const GITHUB_URL = "https://github.com/alanwtom";
export const X_URL = "https://x.com/alantomdev";
export const THREADS_URL = "https://www.threads.com/@alantomdev";

// Animation constants
export const ANIMATION_DURATIONS = {
  FAST: 0.2,
  NORMAL: 0.3,
  SLOW: 0.5,
} as const;

export const ANIMATION_DELAYS = {
  SMALL: 0.1,
  MEDIUM: 0.2,
  LARGE: 0.3,
} as const;

export const COPY_FEEDBACK_DURATION = 2000;

export const TYPEWRITER_CONFIG = {
  SPEED: 16,
  PAUSE_DURATION: 200,
} as const;

/*
  Cache-buster appended to image URLs.

  These used to say `?v=${Date.now()}`, which meant the URL changed on
  every single render. The browser treated each one as a brand-new image
  and re-downloaded it, so the profile photo would visibly blank out and
  reload — and social platforms could never cache the OG preview, because
  the URL they scraped was different every time they looked.

  A fixed number does the job the timestamp was meant to do: bump this by
  hand when you actually replace one of the images in /public/images, and
  everyone gets the new file. Leave it alone otherwise.
*/
export const ASSET_VERSION = 3;
