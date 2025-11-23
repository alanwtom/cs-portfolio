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
  "I'm a Computer Science junior at Syracuse University.",
];

export const EMAIL = "alanwtom@outlook.com";
export const GITHUB_URL = "https://github.com/alanwtom";
export const LINKEDIN_URL = "https://www.linkedin.com/in/alan-tom/";

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
