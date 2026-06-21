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
    title: "Fwrd",
    description:
      "privacy-first iOS app that forwards SMS messages to Discord, Slack, and Telegram",
    tech: ["Swift", "SwiftUI", "iOS Extensions", "Webhooks"],
    github: "",
    demo: "https://fwrdsms.com",
    detailedDescription:
      "Fwrd is a privacy-first iOS application designed to securely intercept and forward incoming SMS messages to platforms like Discord, Slack, and Telegram in real-time.",
    techStack: {
      Swift: "core application logic",
      SwiftUI: "native iOS interface development",
      "iOS Extensions": "message interception filtering capabilities",
      "Webhook API": "real-time forwarding to messaging services",
    },
    features: [
      "automatic background forwarding of SMS",
      "secure webhooks for Discord, Slack, and Telegram",
      "custom filtering rules based on sender or keywords",
      "privacy-first architecture with all processing on-device",
    ],
  },
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
