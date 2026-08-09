# Build prompt — Seed42.tech

> Paste this into Claude Code as the opening instruction. Keep `seed42-especificacion-proyecto.md` in the repo root as the reference document; this file is the executable brief.

---

## Your role

You are building the v1 of **Seed42.tech**, a free Spanish-language platform where Colombian high school students (ages 15–17) learn AI by doing interactive exercises in the browser. It launches on **20 August 2026** with beta testing immediately after, so favor shipping a narrow thing that works over a broad thing that half-works.

**All user-facing copy is in Spanish.** All code, comments, variable names, commit messages, and conversation with me are in English.

---

## Non-negotiable constraints

Read these first. They are the constraints that will silently break the project if you ignore them.

1. **A pooled Postgres connection string is mandatory.** Vercel serverless opens one connection per invocation. Thirty students entering the site simultaneously in a classroom is the real load pattern that will exhaust a raw connection limit. Use Neon or Supabase with the pooler endpoint.
2. **Module content lives in MDX files in the repo, never in the database.** The database stores only users, progress, submissions, events, and leaderboard rows.
3. **Everything must work on a phone at 380px wide, on Slow 4G.** A large share of the audience's primary computing device is a phone. Every interactive must be operable with a thumb — if a widget needs precision mouse work, redesign it.
4. **No installation, ever.** Nothing the student does requires setting up an environment. Pyodide is loaded client-side and lazily, only on modules that need it.
5. **Every interactive responds in under 100ms.**
6. **Spanish runs ~20% longer than English.** Design every button, label, and card with that headroom or you will fight text overflow for the whole project.
7. **`prefers-reduced-motion` is respected everywhere.**

---

## Stack

| Layer | Choice |
|---|---|
| Language | TypeScript, strict mode |
| Framework | Next.js, App Router |
| Hosting | Vercel free tier |
| Database | PostgreSQL on Neon or Supabase, **pooled connection** |
| ORM | Drizzle (preferred) or Prisma |
| Auth | Supabase Auth or Clerk — **Google sign-in only**, no email/password |
| Content | MDX in `/content/modules/` |
| Styling | Tailwind, with the design tokens below defined as CSS variables |
| Charts / viz | D3 for the math; canvas above ~500 points |
| Animation | Framer Motion |
| Python execution | Pyodide (WASM, client-side, lazy-loaded) |
| Analytics | Vercel Analytics + an `events` table |

Do not add libraries beyond this list without asking me first.

---

## Design system

The visual direction is approved and locked. It is a **futuristic minimal dashboard** aesthetic: charcoal panels, violet accent, softly rounded cards, generous whitespace. Dark mode is the default; light mode is a first-class variant, not a courtesy — school projectors, printed handouts, and press screenshots all need it.

### Color tokens

Define these as CSS variables on `:root` and `[data-theme="light"]`.

**Dark (default)**
```
--bg:      #0D0D12
--panel:   #16161D
--sub:     #1D1D26
--text:    #EDEDF2
--muted:   #8B8B99
--border:  rgba(255,255,255,0.07)
```

**Light**
```
--bg:      #F2F2F6
--panel:   #FFFFFF
--sub:     #F6F6FA
--text:    #16161C
--muted:   #61616E
--border:  rgba(20,20,28,0.08)
```

**Accents**
```
--accent:       #7F77DD   violet — actionable elements ONLY
--accent-hover: #9A93EA   (dark) / #534AB7 (light)
--accent-deep:  #534AB7   violet text on light surfaces
--success:      #5DCAA5   (dark) / #1D9E75 (light)
--fail:         #ED93B1   (dark) / #D4537E (light)   used on "break it" screens
--warn:         #EF9F27   (dark) / #BA7517 (light)   competition, deadlines
```

**Accent rule:** violet is reserved for things the student can touch. The moment it appears as decoration it stops carrying meaning.

### Typography

- One grotesk for display and body: **Geist Sans** (fallback Inter)
- Monospace for data, code, and axis labels: **Geist Mono** (fallback JetBrains Mono)
- **Only two weights: 400 and 500.** Nothing heavier.

| Element | Size | Weight | Tracking |
|---|---|---|---|
| Hero display | 40px desktop / 30px mobile | 500 | −0.03em |
| Section h1 | 28px | 500 | −0.025em |
| h2 | 20px | 500 | −0.02em |
| Body | **17px minimum** | 400 | 0 |
| Secondary body | 15px | 400 | 0 |
| Label / chip | 12.5px | 400 | 0 |
| Large metric | 22px | 500 | −0.02em |

### Shape and space

```
radius: controls 9px · cards 12px · panels 14px · outer container 16px
border: 0.5px — never 1px, never 2px
metric grid: 4 cols desktop / 2 cols mobile, gap 11px
vertical rhythm in rem (1, 1.5, 2) · internal spacing in px (8, 12, 16, 22)
```

### Signature element

**The progress heatmap** — a grid of violet cells at varying intensity. It appears on the landing page, in the student dashboard, and (simplified) in the logo. It is the one motif that repeats across the whole system and it is what makes the product feel authored rather than assembled. Build it as a reusable component early.

### Motion

Purposeful only: screen transitions, animation on data changes so the student sees the *change* rather than just the result, and a subtle celebration on module completion. Nothing decorative, nothing looping.

### Voice

Spanish, **tuteo**, sentence case everywhere, no terminal punctuation on labels and headings, active voice with the verb first ("Empezar módulo", not "Inicio de módulo"). Never write "simplemente", "fácil", or "solo tienes que" — they presume and condescend. Errors say what happened and what to do, with no apology and no "Error:" prefix. Empty screens are an invitation to act, not an apology.

---

## Information architecture

```
/                     landing page
/modulos              module index with progress
/modulos/[slug]       module player (screen-by-screen)
/competencia          competition rules, submission, leaderboard
/talleres             workshops page for schools and teachers
/perfil               student dashboard: progress heatmap, streak, artifacts
/login                Google sign-in
```

**The first module is playable without an account.** The signup prompt appears only after the student completes module 01, at the moment they have something to lose.

**The leaderboard link is persistent in the nav from day one**, visible even to a student on module 02. Seeing peers' names is aspirational pressure that pulls people through the middle modules, where drop-off concentrates.

---

## The module player — the core of the product

Every module is 6–10 screens following one fixed rhythm. Build this once as a template; all ten modules fill the same skeleton. Consistency lets students stop learning the interface and start learning the content.

| Screen | Purpose |
|---|---|
| 1. Hook | An interactive with minimal instruction. No theory yet |
| 2. Reveal | Name what they just did |
| 3–5. Build | Progressively harder interactions, **one new element each**. Under ~80 words of text per screen |
| 6. Break it | Make the thing fail deliberately. This is where learning consolidates |
| 7. Project | The applied task, 10–15 min, produces an artifact |
| 8. Reflection | One question in their own words, plus what's next |

### The single most important design principle

Copy Brilliant's actual mechanic: **the student manipulates something before they are told what it means.** They get a control, they move it, something changes, they form a hypothesis, and *then* the text names the concept. The explanation is the payoff, not the setup.

Practically: **every module opens with something to touch, not a paragraph to read.** If a student can scroll past the interactive without engaging with it, the module has failed. One idea per screen. Short screens, forward button, constant sense of progress.

Never end on a dead screen — always a clear next action.

### Interactive primitives

Build a small set of composable React components, **not ten bespoke widgets**. This is what makes adding module 11 cheap later.

```
<ScatterPlot>      points, optional decision boundary
<DraggableLine>    fit-the-line with live error readout
<LabelingTask>     student labels items, model trains on their labels
<TrainingViz>      live accuracy/loss as a model trains
<DataTable>        editable cells with a data-quality meter
<Slider>           labeled, thumb-friendly, min 44px touch target
<NetworkBuilder>   add/remove layers, watch the boundary bend
<TokenPredictor>   next-token probability bars
```

---

## Curriculum

Ten modules, ~30 minutes each, one project apiece.

| # | Slug | Title | Project |
|---|---|---|---|
| 01 | `que-es-la-ia` | ¿Qué es la IA? | Classify 10 examples as AI / not AI and defend the reasoning |
| 02 | `para-que-sirve` | ¿Para qué sirve la IA? | Find one AI application affecting Colombia and break it down |
| 03 | `los-datos-son-todo` | Los datos son todo | Clean a deliberately broken CSV of Colombian data |
| 04 | `ensenar-con-ejemplos` | Enseñar con ejemplos | Label 30 items, watch a model train live, watch it fail on what they underrepresented |
| 05 | `la-linea-que-predice` | La línea que predice | Drag a line to fit Bogotá housing prices, then compare to the optimum |
| 06 | `como-se-si-sirve` | ¿Cómo sé si mi modelo sirve? | Given two models with identical accuracy, decide which is worse and why |
| 07 | `sesgo-y-responsabilidad` | Sesgo y responsabilidad | Audit a model for bias and propose a fix |
| 08 | `redes-sin-miedo` | Redes neuronales sin miedo | Build a net that separates a spiral dataset |
| 09 | `la-ia-que-habla` | La IA que habla | Prompt engineering challenge, plus find and document a hallucination |
| 10 | `tu-primera-competencia` | Tu primera competencia | Submit a baseline to the real competition before leaving the module |

### Curriculum notes for you

- **Modules 03 and 06 are the ones that feel boring and the ones that determine who finishes the competition.** Their projects must be the most interactive of the set to compensate. Do not let them degrade into reading screens.
- Datasets are Colombian wherever possible: Bogotá transit times, coffee harvest yields, Liga BetPlay results, Medellín air quality. This converts "this is a foreign thing" into "this is about my country."
- Module 09 is the social media magnet — make it visually striking, it will be screen-recorded.

---

## Data model

```
users        id, google_id, email, display_name, created_at
progress     user_id, module_slug, screen_index, completed_at
submissions  user_id, module_slug, artifact (jsonb), created_at
events       user_id (nullable), name, payload (jsonb), created_at
competition  user_id, score, submitted_at, notebook_url, category
```

**Instrument from day one.** Log `module_started`, `screen_advanced`, `module_completed`, `project_submitted` into `events`. Retrofitting analytics after the beta means the beta produces no data, and the beta is the whole point of the August 20 launch.

The metrics that matter: module completion rate, 7-day return rate, workshop→site conversion. Total signups is the number that flatters and doesn't inform — don't build a dashboard around it.

---

## Build order

Work in this sequence and check in with me at the end of each phase.

**Phase 1 — Foundation.** Next.js + TypeScript scaffold, design tokens as CSS variables, dark/light theming, typography scale, base layout and nav, deployed to Vercel with a working pooled database connection. Nothing else.

**Phase 2 — The player.** The module screen framework with the 6–10 screen rhythm, forward/back navigation, progress persistence, and module 01 fully built end to end in MDX. This is the phase that proves the concept — take the time here.

**Phase 3 — Primitives.** The interactive component library above, built generically, with module 03 and module 04 as the proving cases.

**Phase 4 — Content.** Modules 02, 05–10. By now writing a module should be writing an MDX file, not building features. If it isn't, stop and fix Phase 2.

**Phase 5 — Surrounding pages.** Landing page (with a live interactive in the hero — the hero *is* the product demo, not a screenshot of one), competition page with native leaderboard, workshops page, profile dashboard with the progress heatmap.

**Phase 6 — Ship prep.** Offline static build of modules 01–03 for a USB stick (school wifi will fail), OG image at 1200×630, favicon, Slow 4G throttled testing, keyboard focus states, reduced-motion pass.

---

## Definition of done for v1

- A student on a phone, on a bad connection, with no account and no prior coding experience, can complete module 01 and want to start module 02.
- Ten modules exist, each with a working project.
- Progress persists across sessions.
- The leaderboard shows real submissions.
- The site loads acceptably throttled to Slow 4G.
- Both light and dark variants are presentable — including on a projector.

---

## How to work with me

- Ask before adding a dependency, changing the design tokens, or expanding scope.
- If something in this brief conflicts with something you find while building, tell me rather than resolving it silently.
- Prefer the smaller, quieter option. "Too cluttered" is the most common note.
- Keep commits small and messages descriptive.
- When a phase is done, tell me what you'd cut and what you'd add if we had one more week.

---

## Explicitly out of scope for v1

User-generated content · teacher dashboards · certificates · a native mobile app · multi-language · forums · gamified currency · video lessons · Kaggle API integration (the leaderboard is native to the site for v1).

Every one of these is a plausible v2 and a fatal v1. If I ask for one mid-build, remind me of this list.
