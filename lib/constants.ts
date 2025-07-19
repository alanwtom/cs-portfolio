export interface Project {
  title: string
  description: string
  tech: string[]
  github: string
  demo: string
  detailedDescription: string
  techStack: Record<string, string>
  features: string[]
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
    github: "https://github.com/alantomw/Flow",
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
]

export const TYPEWRITER_TEXTS = [
  "I'm a computer science junior at Syracuse University.",
  "I lead CuseHacks, a student-run hackathon, and try to travel as much as possible!",
]

export const EMAIL = "alantomw@gmail.com"
export const GITHUB_URL = "https://github.com/alantomw"
export const LINKEDIN_URL = "https://linkedin.com/in/alantomw"
