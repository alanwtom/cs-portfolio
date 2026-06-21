export interface Project {
  title: string;
  description: string;
  tech: string[];
  github: string;
  demo: string;
  detailedDescription: string;
  techStack: Record<string, string>;
  features: string[];
}

export const PROJECTS: Project[] = [
  {
    title: "Bug Bot",
    description:
      "discord bot for career development with resume resources, real time job and event tracking, and learning material recommendations",
    tech: ["Python", "Discord.py", "GCP", "Nox"],
    github: "https://github.com/innovateorange/DiscordBot",
    demo: "https://discord.gg/cvqbKxPtHE",
    detailedDescription:
      "student-focused career development bot with real-time job tracking, resume resources, and personalized learning recommendations",
    techStack: {
      Python: "core bot development",
      "Discord.py": "discord API integration",
      GCP: "cloud hosting & storage",
      Nox: "testing & automation",
    },
    features: [
      "real-time job tracking from multiple sources",
      "personalized resume feedback and templates",
      "curated learning material recommendations",
      "event notifications for career fairs and workshops",
    ],
  },
  {
    title: "Flow",
    description:
      "sleek browser extension that helps users maintain focus by blocking distracting elements while browsing",
    tech: ["JavaScript", "Chrome Extension API", "HTML", "CSS"],
    github: "https://github.com/alanwtom/Flow",
    demo: "https://chromewebstore.google.com/detail/flow/odenofhkafaeedoohodgdndpeeadpndg",
    detailedDescription:
      "browser extension that helps users maintain focus by intelligently blocking distracting elements while preserving core functionality",
    techStack: {
      JavaScript: "core extension logic",
      "Chrome Extension API": "browser integration",
      HTML: "popup interface structure",
      CSS: "styling & user interface",
    },
    features: [
      "intelligent content blocking algorithms",
      "customizable distraction filters",
      "minimal performance impact",
      "seamless user experience",
    ],
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
    company: "Micron Technology",
    role: "Software Engineer Intern",
    years: "Feb. 2025 – Present",
    description:
      "developing interactive C#/Unity simulations with 90% query reduction via custom caching and 60% UI overhead cut",
  },
  {
    company: "iSchool at Syracuse University",
    role: "NSF REU Researcher",
    years: "June 2025 – Aug. 2025",
    description:
      "engineered financial sentiment pipeline using FinBERT/Llama 3.1, analyzing 5K+ posts to validate market volatility correlations",
  },
  {
    company: "Data Lab at Syracuse University",
    role: "Undergraduate Researcher",
    years: "Aug. 2024 – Feb. 2025",
    description:
      "built Python evaluation pipeline for LLM memory interference testing, automating analysis of 300+ associations",
  },
  {
    company: "CuseHacks",
    role: "Former President",
    years: "Feb. 2024 – May 2025",
    description:
      "led Syracuse's largest student-run hackathon, orchestrating 40% YoY attendance growth, $10K+ in sponsorships, and a 15+ member leadership council",
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
