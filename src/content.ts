// Everything on the site reads from this file. Edit text here, not in components.

export const profile = {
  name: "Gargi Pathak",
  first: "Gargi",
  pronouns: "she/her",
  location: "San Francisco, CA",
  school: "CS @ Texas Tech",
  email: "Gargipathak@gmail.com",
  linkedin: "https://www.linkedin.com/in/garrgipathak/",
  github: "", // add when available
  roles: [
    "building GPS for drones",
    "hackathon winner",
    "founder",
    "Girls Who Code president",
    "researcher",
    "matcha enthusiast",
  ],
  intro:
    "I build things for the moments that matter: wildfire relief, voice security, foot pain, even farms on Mars. Texas Tech CS, 4.0. Fueled by matcha.",
};

export const numbers: { value: number; suffix?: string; prefix?: string; decimals?: number; label: string }[] = [
  { value: 7, label: "hackathon wins" }, // resume says 7, LinkedIn headline says 5: confirm
  { value: 4.0, decimals: 1, label: "GPA at Texas Tech" },
  { value: 100, suffix: "+", label: "students mentored at Berkeley" },
  { value: 100, suffix: "K+", label: "user sessions made faster" },
  { value: 900, label: "residents represented as senator" },
  { value: 100, prefix: "Top ", label: "US intern (WayUp)" },
];

export type Visual = "quorum" | "voice" | "insole" | "mars" | "methane" | "none";

export type Hackathon = {
  id: string;
  project: string;
  tagline: string;
  story: string;
  stack: string[];
  visual: Visual;
  // Event details: fill these in as the hackathon history comes in.
  event?: string;
  date?: string;
  place?: string;
  prize?: string;
  result?: "WINNER" | "FINALIST" | "SHIPPED";
  link?: string;
};

export const hackathons: Hackathon[] = [
  {
    id: "resq",
    project: "ResQ",
    tagline: "GPS for drones, aid for the fire line.",
    story:
      "Started as a blockchain relief network that routes donations between fire stations and relief centers during wildfires, with real-time tracking and automatic ZIP-code matching. Now it's growing into GPS for drones.",
    stack: ["Midnight", "Ethereum", "React", "Node"],
    visual: "quorum",
    result: "SHIPPED", // change to "WINNER" once confirmed
  },
  {
    id: "resona",
    project: "Resona",
    tagline: "Your voice is the password, and it can't be faked.",
    story:
      "Voice biometric authentication that stops spoofing and impersonation. 94% model accuracy, trained on SageMaker, answering in under 200ms for banking, meetings and assistants.",
    stack: ["TensorFlow", "AWS SageMaker", "Cloudflare", "OAuth"],
    visual: "voice",
    result: "SHIPPED", // change to "WINNER" once confirmed
  },
  {
    id: "neurosole",
    project: "NeuroSole",
    tagline: "Why does walking have to hurt?",
    story:
      "An AI pipeline that turns foot scans into 3D-printed, eco-filament insoles, for flat feet, fracture recovery and pregnancy. A reusable Persona profile makes every next pair faster.",
    stack: ["Python", "3D modeling", "STL", "Commure"],
    visual: "insole",
    date: "Sep 2025",
    result: "SHIPPED", // change to "WINNER" once confirmed
  },
  {
    id: "terraengine",
    project: "TerraEngine",
    tagline: "Where could we grow food on Mars?",
    story:
      "An interactive Mars map that scores crop suitability with AI using NASA MOLA topography and THEMIS temperature data, then prices the logistics of getting there.",
    stack: ["Next.js", "Python", "NASA MOLA", "THEMIS"],
    visual: "mars",
    date: "Oct 2025",
    result: "SHIPPED", // change to "WINNER" once confirmed
  },
  {
    id: "project16",
    project: "Project-16",
    tagline: "Watching the planet breathe from orbit.",
    story:
      "Monitors and forecasts methane emissions from real-time satellite imagery covering 1000+ km², processed with Google Earth Engine.",
    stack: ["Django", "Earth Engine", "Google Cloud", "SQLite"],
    visual: "methane",
    result: "SHIPPED", // change to "WINNER" once confirmed
  },
];

export type Receipt = {
  id: string;
  when: string;
  company: string;
  role: string;
  city: string;
  lines: [string, string][];
  total: string;
  badge?: string;
};

export const receipts: Receipt[] = [
  {
    id: "betenbough",
    when: "May – Aug 2024",
    company: "Betenbough Homes",
    role: "Software Engineering Intern",
    city: "Lubbock, TX",
    lines: [
      ["Page load time", "−20%"],
      ["User sessions served", "100K+"],
      ["Legacy spaghetti code", "untangled"],
      ["API migration", "led"],
      ["Stack", "C# · ASP.NET · MySQL · Angular"],
    ],
    total: "faster homes, happier buyers",
  },
  {
    id: "headstarter",
    when: "Jul – Sep 2024",
    company: "Headstarter AI",
    role: "Software Engineering Fellow",
    city: "Hybrid",
    lines: [
      ["AI apps shipped", "weekly"],
      ["Team management", "✓"],
    ],
    total: "building at startup speed",
    badge: "WayUp Top 100 Intern · Aug 2024",
  },
  {
    id: "wecracked",
    when: "Jul 2024 – Mar 2025",
    company: "WeCracked",
    role: "Back End Developer",
    city: "Remote",
    lines: [
      ["Backend services", "built"],
      ["Front-end leadership", "✓"],
    ],
    total: "9 months of shipping",
  },
  {
    id: "p2e",
    when: "Oct 2024 – Jan 2025",
    company: "Propel2Excel",
    role: "Fellow",
    city: "Remote",
    lines: [
      ["Accelerator length", "26 weeks"],
      ["Target", "FAANG · MBB · banks"],
    ],
    total: "opening doors for non-target schools",
  },
  {
    id: "kiechler",
    when: "Jan – May 2025",
    company: "Kiechler Law Firm",
    role: "Web Developer",
    city: "Houston, TX",
    lines: [
      ["Scheduling app", "shipped"],
      ["Platforms", "iOS + React Native"],
      ["API contracts", "type-safe (OpenAPI)"],
      ["Stack", "Swift · TypeScript"],
    ],
    total: "clients book in seconds",
  },
  {
    id: "launchx",
    when: "Jun – Aug 2025",
    company: "LaunchX @ UC Berkeley",
    role: "Technology Intern",
    city: "Berkeley, CA",
    lines: [
      ["Students mentored", "100+"],
      ["Workshops", "Python · C++ · Arduino · Pi · 3D print"],
      ["Maker-space", "run end to end"],
      ["Anxiety sleep mask", "co-built"],
    ],
    total: "a summer of prototypes",
  },
  {
    id: "ttu-research",
    when: "Oct 2025 – May 2026",
    company: "Texas Tech University",
    role: "Research Assistant",
    city: "Lubbock, TX",
    lines: [["Topic", "AI for Wind Hazard"]],
    total: "teaching models to read the wind",
  },
];

export const sideQuests = [
  "Blockworks · Student Brand Ambassador",
  "BLACKBOX.AI · Mavericks Ambassador",
  "Next Shift Learning · Google-funded cohort",
  "CodePath · Tech Interview Prep beta",
  "Stanford Online",
];

export const research = [
  {
    title: "Corporate Social Advocacy & Its Implications in the World",
    year: "2023",
    note: "Outstanding Undergraduate Researcher + Winner, Impact Area: Economy. As a freshman.",
    award: true,
  },
  {
    title: "Harnessing Nature: Biomimetic Lighting",
    year: "2024",
    note: "Selected from 1,000 applicants to present on Day 1 of the Undergraduate Research Conference.",
    award: false,
  },
  {
    title: "Communication Strategies in Political Campaigns",
    year: "2024",
    note: "Election-year research on how campaigns craft messages and mobilize voters. Presented on Day 2.",
    award: false,
  },
];

export const stamps: { icon: string; title: string; org: string; when: string; story: string }[] = [
  { icon: "♛", title: "President", org: "Girls Who Code @ TTU", when: "2025 – now", story: "Helping students turn code into startups, with outreach across Lubbock and Amarillo." },
  { icon: "★", title: "President Select Ambassador", org: "Texas Tech", when: "2024 – 26", story: "Leads student ambassadors, gives tours and helps families decide Tech is home." },
  { icon: "◎", title: "Global Guide", org: "Office of International Affairs", when: "2023 – 25", story: "Mentors international students. Her own story was featured on the Cultural Exchange site." },
  { icon: "⌂", title: "Community Advisor", org: "Chitwood/Weymouth", when: "2023 – 25", story: "Built a welcoming hall: events, mediation and support for residents." },
  { icon: "§", title: "SGA Senator", org: "First-Year Council", when: "2022 – 23", story: "Pushed for mental-health resources, better labs and a revamped career fair." },
  { icon: "¶", title: "RHA Senator", org: "Complex Council", when: "2023", story: "Voice for 900 residents. Planned events for 50+ residents to boost wellbeing." },
  { icon: "➚", title: "Orientation Leader", org: "Red Raider Orientation", when: "2024", story: "Ran high-energy icebreakers and campus tours for new Red Raiders." },
  { icon: "✦", title: "Internal VP", org: "Society of Women Engineers", when: "", story: "Keeps the chapter running from the inside." },
  { icon: "⬡", title: "Lead Education Officer", org: "Web3 Acceleration Assoc.", when: "", story: "Teaches blockchain basics to new builders." },
  { icon: "$", title: "Treasurer", org: "Geoscience Leadership Org. for Women", when: "2023 – 24", story: "Ran budgets, fundraising and grant campaigns." },
  { icon: "☕", title: "Hospitality Advisor", org: "Campus Dining Committee", when: "2024 – 25", story: "Compared prices with off-campus receipts and pitched a points-rewards system for the dining app." },
  { icon: "♥", title: "LYFE Mentor", org: "ConocoPhillips × TTU", when: "2024 – 26", story: "One-on-one mentoring that turned a struggling mentee's grades around." },
  { icon: "✿", title: "Best Mentor of the Year", org: "Tech Leadership Institute", when: "", story: "Went from mentee to the institute's mentor of the year." },
  { icon: "⚑", title: "TrUE Scholar", org: "Toreador → Matador", when: "2023 – 26", story: "Promoted within Texas Tech's undergraduate research program." },
];

export const cards: { rank: string; suit: string; title: string; detail: string; foil?: boolean }[] = [
  { rank: "A", suit: "♥", title: "4.0 GPA", detail: "Dean's Honor with a 19-credit semester", foil: true },
  { rank: "K", suit: "♦", title: "President's Honor List", detail: "Three semesters" },
  { rank: "Q", suit: "♠", title: "Top 100 Intern", detail: "WayUp, USA · 2024", foil: true },
  { rank: "J", suit: "♣", title: "Outstanding Researcher", detail: "Undergraduate Research Conference 2023" },
  { rank: "10", suit: "♦", title: "AWS Cloud Practitioner", detail: "Certified", foil: true },
  { rank: "9", suit: "♠", title: "Azure AZ-900", detail: "Certified", foil: true },
];

export const stack = [
  "javascript", "typescript", "python", "c", "csharp", "java", "rust", "swift", "go",
  "react", "next", "node", "express", "django", "dotnet", "angular", "react-native",
  "langchain", "tensorflow", "sagemaker", "docker", "aws", "azure", "cloudflare", "mongodb", "mysql",
];
