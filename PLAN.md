# Gargi Pathak — Portfolio Plan

**Concept: "The Build Log."** The site feels like a collection of physical objects. Hackathon wins are *tickets*, internships are *receipts that print her impact*, campus roles are *stamps in a passport*, research is a *lab notebook*, and honors are *foil cards in a hand*. The base look comes from dqnamo's Kitchen: warm off-white, soft cards, tactile objects and monospace accents. The motion comes from Forever Components: kinetic type, counters and visualizers.

A floating dock (like the Kitchen's bottom bar) holds navigation and the dark-mode toggle.

---

## Sources
- ✅ Resume PDF
- ✅ LinkedIn: experience, projects, honors, education, certifications
- ⏳ Hackathon history: Gargi/you will send it during the build. The section is **data-driven**, so each win is one entry in `content.ts`.
- 🔒 The resume's phone number is **not** published. Contact is email + LinkedIn (+ GitHub).

### Who she is (from LinkedIn)
- Headline: *"building GPS for drones : resQ | 5x Hackathon Winner | founder | creator"*. The resume says 7×, so the number comes from the hackathon data, not hardcoded text.
- San Francisco, CA · she/her · 11.7K followers · bio line *"I am doing matcha + yaps ❤️"*
- BS CS, **Texas Tech, 4.0**. Earlier: AS CS, Odessa College, 4.0. Also CodePath (Tech Interview Prep beta) and Stanford Online.
- Also a **professional singer**, with interests in finance, entrepreneurship and PR/communications.

---

## Sections & component mapping

### 1. Hero — "Hi, I'm Gargi."
| Element | Component | Source |
|---|---|---|
| Name drawn by hand | **Animated Signature** | Kitchen |
| Rotating line: `building GPS for drones → hackathon winner → founder → president → researcher` | **scramble-decode** | Forever |
| Background | **constellation-connect-lines**: dots that link up as the cursor moves | Forever |
| Location pill "📍 San Francisco · CS @ Texas Tech" | **availability-signal** | Forever |
| CTA "Open the log" | **Tactile Button** | Kitchen |

Copy: *"I build things for the moments that matter: wildfire relief, voice security, foot pain, even farms on Mars. Texas Tech CS, 4.0. Fueled by matcha."*

### 2. By the numbers
**odometer-countup** rolling to: `N` hackathon wins (from data) · `4.0` GPA · `100+` students mentored · `100K+` sessions sped up · `900` residents represented · `11.7K` LinkedIn community · `Top 100` US intern (WayUp).

### 3. Hackathon Journey — "The Tickets" (the main section)
- A horizontal **carousel-throw** of perforated **Ticket** cards (Kitchen), one per hackathon: event, city, date, team, prize, what she built. A **Stamp** ("WINNER" / "FINALIST") lands on each ticket as it reaches the center.
- An **arc-timeline** above it charts the run over time.
- Unlocking a win shows an **achievement-unlocked-pixel-trophy**.
- **Builds known so far**, each with its own small visual:

| Build | Story line | Visual |
|---|---|---|
| **ResQ** | Blockchain wildfire relief, now *GPS for drones*. Donations go straight from fire stations to relief centers, matched by ZIP code, on Midnight + Ethereum | **consensus-quorum-ring** + drone route on **hex-path-route** |
| **Resona** | Voice biometric auth: 94% accuracy, under 200ms, spoof-proof. Runs on SageMaker + Cloudflare + OAuth | **oscilloscope** waveform → **success-check** "voice verified · 187ms" |
| **NeuroSole** (Sep 2025) | AI turns foot scans into 3D-printed eco-filament insoles. Built for flat feet, recovery and pregnancy, with a reusable "Persona" profile | rotating 3D insole made with **depth-sorted-petals**-style CSS-3D layers |
| **TerraEngine** (Oct 2025) | Where can crops grow on Mars? Crop suitability scored with AI on NASA MOLA + THEMIS data, plus logistics costs | **wireframe-globe** recolored as Mars + **heatmap-ripple** suitability |
| **Project-16** | Methane emissions forecast from satellite imagery covering 1000+ km² | **streamgraph-drift** forecast |

### 4. Internship & Fellowship Journey — "Receipts"
A route through each stop (**paper-ribbon-route**, from navigation). At every stop a **Receipt Printer** (Kitchen) prints the impact as line items:

| When | Where | Receipt line items |
|---|---|---|
| May–Aug 2024 | **Betenbough Homes** · SWE Intern | Page load −20% · 100K+ sessions · legacy code untangled · C#/ASP.NET/MySQL/Angular |
| Jul–Sep 2024 | **Headstarter AI** · SWE Fellow | AI builds, team mgmt |
| Jul 2024–Mar 2025 | **WeCracked** · Back End Developer | backend + front-end leadership |
| Aug 2024 | 🏅 **WayUp Top 100 Intern in the USA** | gets a foil stamp on the receipt |
| Oct 2024–Jan 2025 | **Propel2Excel** Fellow | 26-week accelerator for FAANG/MBB/banking |
| Jan–May 2025 | **Kiechler Law Firm** · Web Developer | iOS + React Native scheduling app · type-safe OpenAPI |
| Jun–Aug 2025 | **LaunchX @ UC Berkeley** · Technology Intern | 100+ students · ran the maker-space · co-built the anxiety sleep mask (Arduino/Pi) |
| Oct 2025–May 2026 | **Texas Tech** · Research Assistant | AI for Wind Hazard |

Side chips: **Blockworks** Student Brand Ambassador (Permissionless IV), **BLACKBOX.AI** Mavericks Ambassador, **Next Shift Learning** (Google-funded cohort), **CodePath**.

The sleep mask gets a "breathing" **concentric-pulse**.

### 5. Research — "Lab Notebook"
Three research posters as **stacked-peeking-cards** with a **holographic-foil-card** on the award winner:
- **Corporate Social Advocacy** (2023): 🏆 *Outstanding Undergraduate Researcher* + *Winner, Impact Area: Economy* at URC, as a freshman
- **Harnessing Nature: Biomimetic Lighting** (2024): selected from 1,000 applicants, URC Day 1
- **Communication Strategies in Political Campaigns** (2024 election year): URC Day 2
- Ribbon: **TrUE Scholar**, promoted *Toreador → Matador*

The biomimetic lighting card glows softly using **aurora-ribbons**.

### 6. Campus Life — "The Passport"
Her Texas Tech story is huge, so it gets a passport spread. Each role is a **Stamp** (Kitchen), and they land one by one as you scroll:
- 👑 **President, Girls Who Code @ TTU** (2025–now): helping students turn code into startups; outreach in Lubbock and Amarillo
- 🎓 **President Select Ambassador** (2024–26)
- 🌍 **Global Guide, Office of International Affairs**: her story was featured on the Cultural Exchange site
- 🏠 **Community Advisor**, Chitwood/Weymouth + West Village
- 🏛 **SGA Senator** (First-Year Council) · **RHA Senator** for 900 residents
- 🧭 **Red Raider Orientation Leader**
- 🍽 **Hospitality Committee Advisor**: pitched a points-rewards system for the Transact dining app
- 💰 **Treasurer**, Geoscience Leadership Org for Women
- ⚙️ **Internal VP, SWE** · **Lead Education Officer, Web3 Acceleration Assoc.** · **GDSC** · **ACM-W**
- 🤝 **ConocoPhillips LYFE Mentor** · **Peer Mentor** → **TLI Best Mentor of the Year**
- 🎨 Math Banner Design Contest winner · Free Market Institute scholar

Tapping a stamp opens a short **tooltip-pop** story. On mobile the passport becomes a **swipe-card-stack**.

### 7. Honors — "Her Hand"
A fanned hand of **Playing Cards** (Kitchen) the visitor can thumb through, with **Iridescent Foil** on the rare cards:
♥ 4.0 GPA / Dean's Honor (19 credit hours) · ♦ President's Honor List ×3 · ♠ WayUp Top 100 Intern · ♣ URC Outstanding Researcher · 🃏 AWS Cloud Practitioner · 🃏 Azure AZ-900

### 8. Toolbox — `npm install gargi`
A **terminal → package-install** run that prints her stack: JS/TS, Python, C, C#, Java, Rust, Swift, Go · React, Next.js, Node, Express, Django, .NET, Angular, React Native · LangChain, TensorFlow, SageMaker · Docker, AWS, Azure, Cloudflare, MongoDB, MySQL.

### 9. Off the clock + Contact — "Side B"
- **Cassette Audio Player** (Kitchen): she's a professional singer, so **Side A** can be a clip of her singing and **Side B** a 20-sec "hi, I'm Gargi".
- Matcha corner: a **coffee-pot**-style loader restyled as a matcha whisk, with the line "currently: matcha + yaps".
- Email with **copy-checkmark**, LinkedIn/GitHub in a **magnify-dock**.
- Footer receipt: "Thanks for visiting · Built between Lubbock & SF".

---

## Tech
- **Next.js (App Router) + TypeScript + Tailwind + Framer Motion**, static export, deployed on Vercel.
- All text in **`content.ts`** (hackathons, receipts, stamps, cards), so new hackathons are a 5-line edit.
- Components are **rebuilt in-house, modelled on** both libraries. Forever's code is behind sign-in; if you have an account, we can use its exact source.
- Fonts: blackletter/serif display (Kitchen vibe), Inter for body, JetBrains Mono for tickets and receipts.
- Respects `prefers-reduced-motion`; mobile-first fallbacks for every horizontal or fanned layout.

## Build order
1. Scaffold, `content.ts`, layout, dock, theme
2. Hero + numbers
3. Tickets (with placeholder hackathons until the history arrives)
4. Receipts route
5. Lab notebook + passport + hand of cards
6. Toolbox + Side B contact
7. Mobile and reduced-motion pass, then deploy

## Still needed from you
1. **Hackathon history**: name, date, place, prize, team, project, links. Send it whenever.
2. Photos (headshot, hackathon/team photos) and an optional singing clip.
3. GitHub + demo/Devpost links.
4. Domain name.
5. Which Betenbough/Kiechler details to keep (they're on the resume but not on LinkedIn).
