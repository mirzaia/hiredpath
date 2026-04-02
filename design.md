# HiredPath: Comprehensive Design & Architecture Blueprint

This document specifies the exact design language, layout grids, components, and styling conventions for the **HiredPath** application. It serves as the single source of truth for UI/UX developers to maintain consistency across the project.

---

## 1. Design Philosophy
HiredPath is modeled heavily on enterprise-grade developer tooling platforms and modern CI/CD dashboards (specifically the NVQA Automation Dashboard). The UI prioritizes:
- **High Information Density with High Legibility:** Clean typography and deliberate use of whitespace to present complex syllabus information without visual clutter.
- **Card-Based Architecture:** Logical groupings of content separated into discrete "surface" cards floating above a muted canvas.
- **Micro-Interactions over Macro-Animations:** Fluid, snappy hover states and instant feedback loops rather than sluggish page transitions.
- **Atomic Styling:** Pure, utility-first CSS via **Tailwind CSS v3**.

---

## 2. Global Token System

### 2.1 Color Palette
Colors are strictly mapped to the Tailwind CSS palette to manage scale.

| Semantic Role | Tailwind Primitive | Hex Code | Usage |
| :--- | :--- | :--- | :--- |
| **App Background** | `slate-50` | `#f8fafc` | The vast majority of the "empty" space on the page. |
| **Surface (Cards)**| `white` | `#ffffff` | Background for panels, interactive cards, and inputs. |
| **Primary Accent** | `orange-500`| `#f97316` | Main CTAs, primary branding, and highlighted progress. |
| **Secondary Accnt**| `sky-500` | `#0ea5e9` | Secondary charts, secondary branding loops. |
| **Header Nav** | `slate-900` | `#0f172a` | The sticky Top Navigation background. |
| **Primary Text** | `slate-900` | `#0f172a` | Headers `<h1>` to `<h6>` and high-contrast labels. |
| **Body/Muted Text**| `slate-500` | `#64748b` | Paragraphs, descriptions, empty states. |
| **Borders/Lines** | `slate-200` | `#e2e8f0` | Dividers and thin card borders. |

**State Colors:**
- **Success:** `emerald-500` (`#10b981`) -> Used for "Completed" topics and checkmarks.
- **Warning:** `amber-500` (`#f59e0b`) -> Used for intermediate confidence levels.
- **Error/Low:** `red-500` (`#ef4444`) -> Low confidence / failed states.

### 2.2 Typography
- **Font Stack:** Native system fonts (`-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`).
- **Headings Matrix:**
  - `h1`: `text-3xl font-bold` (or larger `text-4xl sm:text-5xl lg:text-6xl` on Landing Pages).
  - `h2`: `text-xl font-bold`.
  - `h3`: `text-base font-bold`.
- **Text Body:** `text-sm text-slate-500 leading-relaxed`.
- **Labels / Overlines:** `text-xs font-bold uppercase tracking-wider text-slate-400`.

### 2.3 Shadow & Elevation
- **Base Level (Canvas):** `No shadow`, `bg-slate-50`.
- **Level 1 (Cards):** `shadow-sm` on `.glass-card`.
- **Level 2 (Hover State):** `hover:shadow-md hover:-translate-y-0.5` applied via transitions.
- **Level 3 (Dropdowns):** `shadow-xl border border-slate-200` for search autocomplete menus.

---

## 3. UI Component Library

### 3.1 Buttons (`.btn`)
All buttons share a base class of inline-flex alignment, gap spacing, rounding, and fonts.
- **Primary (`.btn-primary`):** `bg-orange-500 text-white hover:bg-orange-600 shadow-sm`.
- **Secondary (`.btn-secondary`):** `bg-white border text-slate-700 hover:bg-slate-50 border-slate-200`.
- **Ghost (`.btn-ghost`):** `bg-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100`.

### 3.2 Cards (`.glass-card`)
- **Structure:** `bg-white border border-slate-200 rounded-xl shadow-sm`.
- **Interactive Variant:** Combine with `transition-all hover:bg-slate-50 group` to allow child elements (like chevrons) to animate when the card is hovered.

### 3.3 Progress Bars (`<ProgressBar />`)
Two distinct visualization variants exist:
- **Circular Data Visualization:** An SVG-based radial stroke.
  - Base ring: `stroke-[#e2e8f0]` with `stroke-width` relative to the size.
  - Progress ring: Inherits module color (e.g. orange, cyan, emerald), `transition-all duration-700 ease-out`.
  - Inner text: Centers using `absolute inset-0 flex items-center`.
- **Linear Progress:**
  - Track: `w-full h-2 bg-slate-200 rounded-full`.
  - Fill: `h-full rounded-full transition-all duration-500 ease-out`.

### 3.4 Breadcrumbs
Located in the secondary layer of the `<Header>`.
- **Container:** `bg-slate-800 text-slate-300 px-4 py-2 text-xs font-medium`.
- **Active Node:** Drops mute, sets to `text-white font-semibold`.
- **Separator:** Forward slashes `/` with `opacity-50`.

---

## 4. Layout Architecture

### 4.1 Shell System (`<Layout>`)
- **Container:** The app sits within a strict column flow.
- **Global Constraints:** Instead of full-bleed layouts, content is constrained to `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` to ensure ultra-wide monitors do not stretch lists uncomfortably.

### 4.2 Top Navigation Header (`<Header>`)
The header is split into two visual tiers:
1. **Primary Navigation (`h-16`, `bg-slate-900`):**
   - **Left:** Brand Logo (HiredPath with orange accent).
   - **Center (hidden on mobile):** NavLinks (Dashboard, Tests, Progress, Resources). Active links sit inside a `bg-slate-700` pill.
   - **Right:** Search Bar (dark mode styling `bg-slate-800 text-slate-200`) and the global Settings icon.
2. **Context Layer (`py-2`, `bg-slate-800`):**
   - Contextual breadcrumbs indicating exact depth.

---

## 5. View Specifications

### 5.1 Landing Page (`/`)
- **Hero Treatment:** Utilizes oversized typography, a subtle radial gradient background, and a faint `.bg-grid` overlay via a linear-gradient pattern on `slate-200`.
- **Module Chips:** Small, colorful pills (`rounded-full border border-[module-color]`) representing the syllabus.
- **Stack Selector:** High-contrast `chip` buttons. Active states get a `shadow-sm` and a subtle 15% opacity background of their branding color.

### 5.2 Dashboard (`/dashboard`)
- **KPI Summary Row:** Three `glass-card` elements displaying `Overall Progress`, `Questions Answered`, and `Modules Active`. They feature an icon nested in a heavily rounded wrapper (e.g., `rounded-full bg-cyan-100 text-cyan-600`).
- **Module Grid:** Adheres to CSS Grid `lg:grid-cols-3`. Each ModuleCard utilizes the `group` pseudo-class trigger to perform icon micro-scaling on hover.

### 5.3 Module Detail Page (`/module/:id`)
- **Hero Card:** A large, padded `glass-card` housing the Circular Progress bar, total KPI stats, and a massive background-tinted module icon.
- **Topic List:** A vertical list of `TopicCard`s wrapped in a unified `border-slate-200 rounded-xl overflow-hidden` container. Each card has a bottom-border separator, removed on the `isLast` element.

### 5.4 Topic Detail
- **Metadata Flexbox:** A dense row of data (Confidence metrics, Completion toggles, and breadcrumbs) sitting clearly above technical Markdown or code blocks.
- **Content Panes:** Any code blocks or markdown (`.theory-content`) must inherit `bg-slate-900` syntax highlighting bounds to pop against the white page base.

---

## 6. Motion & Animations
- **Staggered Orchestration:** Pages resolving arrays (like Dashboard Module cards) use `animate-slide-up` with CSS `animation-delay` offsets (`.stagger-1`, `.stagger-2`) to create a cascading entrance.
- **Micro-interactions:**
  - Topic Card Arrows hover state: `group-hover:translate-x-1`.
  - Icon blocks: `group-hover:scale-105`.
  - SVG Renders: Circular progress rings have a `transition-all duration-700 ease-out` on their `stroke-dashoffset` to elegantly close the ring rather than snapping open.

---

## 7. Icons
We exclusively rely on **Lucide React**. 
- Scaling: Generally `w-4 h-4` for inline text support, `w-7 h-7` for major visual indicators (like Dashboard KPIs).
- Stroke: We rely on the Lucide default stroke weight (2px).

---

## 8. Development Rules
1. **No External CSS files for scoping.** All per-component styles must be described in `.jsx` using standard Tailwind notation.
2. **Dynamic Colors:** When injecting dynamic colors from the `modules.json` file (e.g., `moduleColor="#FF0000"`), utilize the inline `style={{ color: moduleColor, backgroundColor: \`\${moduleColor}15\` }}` pattern, as Tailwind compilation cannot predict arbitrary, undefined hex loops easily without explicit safelisting. Otherwise, rely strictly on standard primitives (`text-orange-500`).
