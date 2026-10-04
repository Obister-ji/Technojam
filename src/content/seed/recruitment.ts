import type { RecruitmentCycle } from "@/lib/content/types";
import { S } from "./sources";

const REPO = "https://github.com/technojam/TJ-TASKS-2026";
const folder = (name: string) => `${REPO}/tree/HEAD/${name}`;

export const recruitmentCycles: RecruitmentCycle[] = [
  {
    slug: "recruitment-2026",
    year: 2026,
    title: "Recruitment 2026",
    status: "closed",
    summary:
      "Task submissions for the 2026 fresher recruitment closed on 7 September 2026. The next cycle will be announced on our channels.",
    openingDate: "2026-08-23",
    deadline: "2026-09-07",
    eligibility: ["Freshers (first-year students) — the 2026 tasks were published for fresher interviews."],
    tracks: [
      { title: "AI", domainSlug: "ai", description: "NLP basics → perceptron → CNN in PyTorch → real-time voice agent.", tasksUrl: folder("AI") },
      { title: "App Development", domainSlug: "app", description: "Calculator → notes app with local storage → GitHub profile explorer.", tasksUrl: folder("App-Development") },
      { title: "Blockchain", domainSlug: "blockchain", description: "On-chain identity → first Solana program → mini decentralised marketplace.", tasksUrl: folder("Blockchain-Tasks") },
      { title: "DSA", domainSlug: "dsa", description: "Six problems across three levels, graded on correctness, complexity and reasoning.", tasksUrl: folder("DSA") },
      { title: "DevOps", domainSlug: "devops", description: "Git workflow → Linux + Nginx automation → Dockerise and deploy a Node app.", tasksUrl: folder("DevOps") },
      { title: "Game Development", domainSlug: "game-dev", description: "Pong → Flappy Bird → top-down survival game.", tasksUrl: folder("Game-Development") },
      { title: "Robotics & IoT", domainSlug: "robotics-iot", description: "Arduino safety alerts → smart barrier → ESP32 telemetry over MQTT.", tasksUrl: folder("Robotics-IOT") },
      { title: "System Design", domainSlug: "system-design", description: "Flash sale inventory → food delivery platform → multi-region payments.", tasksUrl: folder("System-Design") },
      { title: "UI / UX", domainSlug: "ui-ux", description: "Portfolio → mobile app UX and prototype → animated product experience.", tasksUrl: REPO },
      { title: "Vibe Coding", domainSlug: "vibe-coding", description: "Terminal bio-card → over-engineered 3D calculator → agentic full-stack chaos.", tasksUrl: folder("Vibe-Coding-Task") },
      { title: "Web Development", domainSlug: "web", description: "Responsive site → full-stack CRUD task manager → collaborative project management app.", tasksUrl: folder("Web-Development") },
    ],
    tasksRepository: REPO,
    applicationUrl: "https://forms.gle/Pp9qxDu4Nvt1GAED9",
    instructions: [
      "Pick a domain and read its README — tasks are levelled from easy to hard.",
      "Create a GitHub repository named TJ-Tasks-2026-<Your_Name>.",
      "Add a README explaining your approach and algorithm, with screenshots of your output. It is compulsory.",
      "Submissions are only valid through GitHub — share your repository link through the submission form before the deadline.",
    ],
    timeline: [
      { label: "Task repository published", date: "2026-08-23" },
      { label: "Submission deadline", date: "2026-09-07" },
      { label: "Fresher interviews", note: "Shortlisted candidates are interviewed." },
    ],
    faq: [
      {
        question: "Do I need prior experience?",
        answer:
          "No. Every domain starts with an easy task. What matters is that you finish what you pick, explain your thinking in the README, and keep going.",
      },
      {
        question: "How do I submit?",
        answer:
          "Through GitHub: your own repository named TJ-Tasks-<year>-<Your_Name> with a README, then the link via the form in the task repository.",
      },
      {
        question: "When does the next recruitment open?",
        answer:
          "It hasn't been announced. For reference, task deadlines were 16 October in 2024, 15 October in 2025 and 7 September in 2026 — follow our Instagram, LinkedIn or Discord to hear first.",
      },
      {
        question: "Where can I ask questions?",
        answer: "On Discord or Instagram (@teamtechnojam), or email the club.",
      },
    ],
    contact: { label: "@teamtechnojam on Instagram", url: "https://www.instagram.com/teamtechnojam/" },
    verification: S.tasks2026,
  },
  {
    slug: "recruitment-2025",
    year: 2025,
    title: "Auditions 2025",
    status: "closed",
    summary: "Tasks for the TechnoJam Auditions 2025, submitted through GitHub.",
    deadline: "2025-10-15",
    eligibility: [],
    tracks: [],
    tasksRepository: "https://github.com/technojam/TJ-TASKS-2025",
    instructions: [],
    timeline: [{ label: "Submission deadline", date: "2025-10-15" }],
    faq: [],
    verification: S.github,
  },
  {
    slug: "recruitment-2024",
    year: 2024,
    title: "Auditions 2024",
    status: "closed",
    summary: "Tasks for the TechnoJam Auditions 2024, submitted through GitHub.",
    deadline: "2024-10-16",
    eligibility: [],
    tracks: [],
    tasksRepository: "https://github.com/technojam/TJ-TASKS-2024",
    instructions: [],
    timeline: [{ label: "Submission deadline", date: "2024-10-16" }],
    faq: [],
    verification: S.github,
  },
];
