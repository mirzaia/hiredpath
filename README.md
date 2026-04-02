# HiredPath

A personal, browser-based study hub built for the **Sr. SDET II interview at Ajaib (Fintech)**. The app covers all five technical pillars of the interview, lets you track topic completion and confidence levels, and persists all progress locally in your browser — no backend required.

---

## What It Covers

| Module | Topics |
|--------|--------|
| 🏛️ Test Strategy & Architecture | Modern Test Pyramid, Shift-Left/Right, Test Data Management |
| 🌐 Backend & Microservices Testing | API Testing Deep Dive, Contract Testing (Pact), Async Message Queue Testing |
| ⚙️ Automation Engineering | Design Patterns (POM/Screenplay), SOLID in Test Code, Live Coding Prep |
| ⚡ Non-Functional Testing | Performance Engineering (k6/JMeter), Chaos Engineering, Security Testing (OWASP) |
| 🏗️ Infrastructure & DevOps | CI/CD Pipeline Design, Parallelization & Sharding, Observability |

Each topic contains:
- **Theory** — structured notes with code examples
- **Scenario Challenges** — real-world problem situations with hints and model answers
- **Interview Questions** — curated Q&A with reveal-on-click answers
- **Resources** — links to official docs, articles, and tools

---

## Features

- **Onboarding** — select your tech stacks (Java, Python, TypeScript, Kotlin) on first visit
- **Dashboard** — overview of all 5 modules with per-module circular progress indicators
- **Module view** — list of topics with completion checkboxes and confidence ratings
- **Topic view** — theory reader, scenario cards (expandable with hints + answers), question cards, and external links
- **Questions Bank** — filterable/searchable list of all 29 questions across all modules
- **Progress page** — overall stats, per-module breakdowns, and confidence distribution charts
- **Resources page** — curated links grouped by category (Courses, Docs, YouTube, Books, Tools)
- **Global search** — search topics and questions from the header bar
- **Progress persistence** — all state saved to `localStorage`; survives page refreshes

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 |
| Routing | React Router DOM v6 |
| Icons | Lucide React |
| Build tool | Vite 5 |
| Styling | Custom CSS (variables + glassmorphism, no UI library) |
| State | React Context + `useReducer` + `localStorage` |

---

## Project Structure

```
interview-preparation-platform/
├── index.html                  # Vite entry point
├── vite.config.js              # Vite config (port 5173, auto-open)
├── package.json
└── src/
    ├── main.jsx                # React root mount
    ├── App.jsx                 # BrowserRouter + route definitions
    ├── index.css               # Full design system (CSS variables, glassmorphism, utilities)
    │
    ├── data/                   # Static JSON content (no API needed)
    │   ├── modules.json        # All 5 modules → 14 topics → theory, scenarios, questions, links
    │   ├── techStacks.json     # Java, Python, TypeScript, Kotlin with tool lists
    │   └── externalResources.json  # Curated links grouped by category
    │
    ├── context/
    │   └── AppContext.jsx      # Global state + localStorage persistence + selector hooks
    │
    ├── components/
    │   ├── Layout.jsx          # App shell: Sidebar + Header + <Outlet />
    │   ├── Sidebar.jsx         # Navigation with per-module progress bars
    │   ├── Header.jsx          # Breadcrumb + global search with live results
    │   ├── ProgressBar.jsx     # Linear and circular progress variants (prop-driven)
    │   ├── ConfidenceRating.jsx    # 1–5 dot rating with color-coded labels
    │   ├── TopicCard.jsx       # Topic row: complete toggle + confidence + link to topic
    │   ├── ScenarioCard.jsx    # Expandable scenario with hints + answer reveal
    │   ├── QuestionCard.jsx    # Q&A card with complete toggle + answer reveal
    │   ├── ExternalLink.jsx    # Link card with platform icon (docs/blog/YouTube/etc.)
    │   ├── TechStackSelector.jsx   # Multi-select chip group for stack selection
    │   └── SearchBar.jsx       # Controlled text input with clear button
    │
    └── pages/
        ├── LandingPage.jsx     # Onboarding: tech stack selection + "Start Prep" CTA
        ├── DashboardPage.jsx   # Module grid with progress stats
        ├── ModulePage.jsx      # Topic list for a given module
        ├── TopicPage.jsx       # Full topic: theory + scenarios + questions + links + prev/next nav
        ├── QuestionsPage.jsx   # Searchable/filterable questions bank across all modules
        ├── ProgressPage.jsx    # Progress stats + module breakdown + confidence distribution
        └── ResourcesPage.jsx   # Curated external resources with search + category filter
```

### Route map

| URL | Page |
|-----|------|
| `/` | Landing (redirects to `/dashboard` if onboarding is done) |
| `/dashboard` | Dashboard |
| `/module/:moduleId` | Module topics list |
| `/module/:moduleId/topic/:topicId` | Topic detail |
| `/questions` | Questions bank |
| `/progress` | Progress tracker |
| `/resources` | Resources hub |

---

## State Management

All state lives in `AppContext.jsx` using `useReducer`. The following is persisted to `localStorage` under the key `interview-prep-state`:

| Key | Type | Description |
|-----|------|-------------|
| `onboardingDone` | `boolean` | Whether the landing page has been completed |
| `selectedStacks` | `string[]` | IDs of chosen tech stacks |
| `topicProgress` | `{ [topicId]: { completed, confidence } }` | Per-topic completion and confidence (1–5) |
| `completedQuestions` | `string[]` | IDs of answered questions |

**Selector hooks** exported from `AppContext.jsx`:

```js
useApp()                    // { state, dispatch } — raw access
useModuleProgress(topics)   // { completed, total, pct } — for a module's topics array
useTopicState(topicId)      // { completed, confidence, toggle, setConfidence }
useQuestionState(questionId) // { isCompleted, toggle }
```

---

## Setup & Running

### Prerequisites

- **Node.js** v18 or newer
- **npm** v9 or newer

Check your versions:
```bash
node --version
npm --version
```

### 1. Install dependencies

```bash
npm install
```

> Dependencies are already installed if `node_modules/` exists in the project directory.

### 2. Start the development server

```bash
npm run dev
```

The browser will open automatically at `http://localhost:5173`.

### 3. Build for production

```bash
npm run build
```

Output is written to `dist/`. The build is a fully static site — host it on any static server (Netlify, Vercel, GitHub Pages, nginx).

### 4. Preview the production build locally

After building, start a local server to serve the `dist/` output:

```bash
npm run preview
```

Opens at `http://localhost:4173`. This is the built app — use this to verify the production bundle before deploying.

---

## Adding Content

All content lives in `src/data/modules.json`. The structure is:

```json
{
  "id": "module-id",
  "title": "Module Title",
  "icon": "🔥",
  "color": "#6366f1",
  "topics": [
    {
      "id": "topic-id",
      "title": "Topic Title",
      "summary": "One-line description",
      "theory": "Markdown-like text with **bold**, bullet lists, and ```code blocks```",
      "scenarios": [
        {
          "id": "s1",
          "title": "Scenario Title",
          "difficulty": "easy | medium | hard",
          "description": "The situation to solve",
          "hints": ["hint 1", "hint 2"],
          "answer": "Model answer text"
        }
      ],
      "questions": [
        {
          "id": "q1",
          "question": "Interview question text",
          "answer": "Answer text"
        }
      ],
      "links": [
        {
          "title": "Link title",
          "url": "https://...",
          "platform": "docs | blog | youtube | course | leetcode"
        }
      ]
    }
  ]
}
```

No code changes are required — just edit the JSON and the UI reflects the update immediately.

---

## Design System

The CSS design system in `src/index.css` uses custom properties for full theming control:

| Token | Value | Use |
|-------|-------|-----|
| `--bg-primary` | `#0a0e1a` | Page background |
| `--glass-bg` | `rgba(255,255,255,0.04)` | Card surfaces |
| `--accent-primary` | `#6366f1` (indigo) | Primary buttons, active states |
| `--accent-secondary` | `#22d3ee` (cyan) | Links, secondary accents |
| `--color-success` | `#10b981` | Completed states |
| `--color-warning` | `#f59e0b` | Medium difficulty, warnings |
| `--color-error` | `#ef4444` | Hard difficulty, errors |

Cards use `backdrop-filter: blur(16px)` for the glassmorphism effect. All module colors are individually set in `modules.json` and threaded through components via props.
