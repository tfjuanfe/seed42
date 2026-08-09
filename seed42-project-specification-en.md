# Seed42.tech — Project and design specification

**Version:** 1.0
**Date:** 9 August 2026
**Status:** Design approved — ready for implementation
**Author:** Founder, Seed42.tech

> Note: user-facing strings (module titles, buttons, labels) are quoted in Spanish throughout, because Spanish is the product language. Everything else is in English.

---

## 1. Executive summary

Seed42.tech is a Colombian, free, Spanish-language platform where high school students learn artificial intelligence by building it: ten interactive 30-minute modules, each with its own project, plus a Kaggle-style competition with real prizes and in-person workshops in schools.

The project is inspired by IOAI 2026 (Kazakhstan) and the alem.ai programs, adapting that model to the Colombian context.

### 1.1 The problem

Nearly all quality AI education for teenagers is in English and assumes three things a large share of Colombian students don't have: a personal computer, stable internet, and prior exposure to programming. Platzi is in Spanish but paid and adult-oriented. Kaggle Learn is free but in English and intimidating for a beginner.

### 1.2 The wedge

The genuinely underserved slot: **Spanish, teenage-appropriate, zero-install, free.** That is the position Seed42 occupies.

### 1.3 The name

`seed = 42` is the most-repeated line of code in machine learning — the reproducibility seed. To someone in the field it's an immediate signal of belonging; to an outsider it's simply *seed*, something planted in young minds. Double meaning, short, memorable.

**Official pronunciation:** "sid cuarenta y dos". Must be used consistently across workshops, video, and social.

### 1.4 The three channels

| Channel | Function | Weakness it covers |
|---|---|---|
| Web platform | Scale, content, competition | — |
| In-person workshops | Retention and trust | The platform alone doesn't retain |
| Social media | Discovery | Workshops alone don't scale |

Each channel compensates for the others' weakness. The platform is the primary channel; workshops are the one supporting activity; social documents what's already being done.

---

## 2. MVP scope

### 2.1 The core loop

1. A visitor arrives and can try the first challenge **without creating an account**.
2. Picks a module → gets a short explanation (2–3 min read, in Spanish, one visual).
3. Solves an interactive task **in the browser**, with no installation or setup.
4. Gets immediate feedback plus an explanation of *why*.
5. Sees progress and streak, and is pushed toward the next module.

### 2.2 In scope for v1

- 10 complete modules with one project each
- Google authentication
- Persistent per-user progress
- Competition page with leaderboard
- Workshops page for schools
- Landing page
- Real responsive design (mobile-first in consumption)

### 2.3 Out of scope for v1

User-generated content · teacher dashboards · certificates · native mobile app · multi-language · forums · gamified currency · video lessons. Every one is a plausible v2 and a fatal v1.

### 2.4 Metrics that matter

- **Module completion rate** — do they finish?
- **7-day return rate** — does it stick?
- **Workshop → site conversion** — does in-person translate to online?

Total signups is deliberately ignored: it's the number that flatters and doesn't inform.

---

## 3. Tech stack

| Layer | Choice | Reason |
|---|---|---|
| Language | TypeScript | Set by founder |
| Framework | Next.js (App Router) | Set by founder |
| Hosting | Vercel, free tier | Set by founder |
| Database | PostgreSQL via **Neon** or **Supabase** | More generous free tier than Vercel Postgres, and **connection pooler included** |
| ORM | Prisma or Drizzle | With a *pooled* connection string from day one |
| Auth | Supabase Auth or Clerk, **Google only** | Every Colombian student has a school Google account. No email/password: recovery flows are an unnecessary support burden |
| Content | **MDX in the repository** | Versioned, reviewable, and lets you write a new module in a text editor without building an admin panel |
| Code execution | **Pyodide** (WASM, client-side) | Zero backend cost, no security surface, works with cold functions |
| Visualization | D3 for the math, canvas above ~500 points | |
| Animation | Framer Motion | |
| Analytics | Vercel Analytics + own `events` table | |

### 3.1 Critical risk: database connections

Vercel serverless functions open one connection per invocation. **Thirty students entering at the same time in a classroom is exactly the spike that exhausts a raw Postgres connection limit.** The pooler is not optional.

### 3.2 The database stores only

`users` · `progress` · `submissions` · `events` · `leaderboard`

Module content **never** goes into the database.

### 3.3 Performance requirements

- Test the site throttled to **Slow 4G** before launch. That is the real median user.
- Pyodide is lazy-loaded, and only on modules that need it; warn about data usage.
- Offline static build of the first three modules, carryable on a USB stick, for when school wifi fails (it will).
- Every interaction must respond in **under 100 ms**.

---

## 4. Curriculum — 10 modules

Each module runs ~30 minutes and has exactly one project.

| # | Title | Concept | Project |
|---|---|---|---|
| 01 | ¿Qué es la IA? | Definition and limits | Classify 10 examples as AI / not AI and defend the criteria |
| 02 | ¿Para qué sirve la IA? | Real applications | Find one application affecting Colombia and break it down |
| 03 | Los datos son todo | Garbage in, garbage out | Clean a deliberately broken Colombian CSV |
| 04 | Enseñar con ejemplos | Supervised classification | Label 30 items, train live, watch the model fail on what they underrepresented |
| 05 | La línea que predice | Regression | Drag a line over Bogotá housing prices and compare against the optimum |
| 06 | ¿Cómo sé si mi modelo sirve? | Train/test, metrics | Given two models with identical accuracy, decide which is worse and why |
| 07 | Sesgo y responsabilidad | Bias and consequences | Audit a model and propose a fix |
| 08 | Redes neuronales sin miedo | Neurons, layers, weights | Build a net that separates a spiral dataset |
| 09 | La IA que habla | LLMs, tokens, hallucination | Prompting challenge + document a hallucination |
| 10 | Tu primera competencia | Full pipeline | Submit a real baseline to the competition before leaving the module |

### 4.1 Curriculum notes

- **Modules 03 and 06 are the ones that feel boring and the ones that determine who finishes the competition.** They stay, but their projects must be the most interactive of the set to compensate.
- **Module 09 is the social media magnet.** It should be screen-recorded and clipped heavily.
- All datasets are Colombian wherever possible: Bogotá transit times, coffee harvests, Liga BetPlay results, Medellín air quality. This converts "this is a foreign thing" into "this is about my country."
- **Optional module 11:** *Cómo seguir aprendiendo* — free Spanish-language resources, the IOAI and olympiad pathway, university programs in Colombia. Cheap to build, high value: it turns a completed course into a life direction.

### 4.2 Real cost of content

A single high-quality interactive challenge — pedagogy, dataset, feedback logic, testing with real students — takes **6 to 10 hours**. Twelve challenges is a semester of work. That isn't a reason not to do it; it's a reason to plan for it and not be demoralized in week 5 when you're on challenge four.

---

## 5. Module structure — the repeating pattern

Every module is 6–10 screens with this fixed rhythm:

| Screen | Purpose |
|---|---|
| **1. Hook** | An interactive with minimal instruction. "Drag these points into two groups." No theory yet |
| **2. Reveal** | Name what they just did. "That's called classification" |
| **3–5. Build** | Progressively harder interactions, each introducing **one** new element. Text under ~80 words per screen |
| **6. Break it** | Make the thing fail deliberately. This is where learning consolidates; it's the screen every course skips |
| **7. Project** | The applied task, 10–15 min, produces an artifact |
| **8. Reflection** | One question in their own words + what's next |

### 5.1 The Brilliant lesson

Brilliant's actual mechanic isn't "pretty visuals" — it's that **the student manipulates something before being told what it means.** You get a control, you move it, something changes, you form a hypothesis, and *then* the text names the concept you just discovered. The explanation is the payoff, not the setup.

Practical consequence: **every module opens with something to touch, not a paragraph to read.** If a student can scroll past the interactive without engaging, the module has failed.

Second principle worth copying: **one idea per screen.** Short screens, forward button, constant sense of progress. It's also mobile-survival design.

### 5.2 Invariant rules

- The skeleton is **identical** across all ten modules. Consistency lets the student stop learning the interface and start learning the content — and lets the author build a module by filling a template instead of designing from scratch.
- Never end on a dead screen. Always a clear next action.
- The leaderboard link is persistent in the nav from day one, visible even to someone on module 02. Seeing peers' names on a board is aspirational pressure that pulls people through the middle modules, where drop-off concentrates.

---

## 6. Interactives by module

Interaction type is matched to the concept; one widget is not reused everywhere.

| Module | Interaction pattern |
|---|---|
| 03 Data | Direct table manipulation. Click a bad cell, fix it, watch a quality meter rise. Then train on dirty vs. clean and see the accuracy gap |
| 04 Classification | Student-as-labeler. They label 30 items, the model trains live in front of them, and fails on an underrepresented case they created themselves. Personal failure is unforgettable |
| 05 Regression | Draggable line over a scatter plot with a live error bar. Their line vs. the optimal line, side by side |
| 06 Evaluation | Two animated model "personalities" tested on unseen data; the overfitted one visibly collapses. The memorizer vs. the learner |
| 07 Bias | A slider governing a group's representation; outcomes shift visibly as it moves. Consequence made mechanical |
| 08 Networks | Simplified TensorFlow Playground clone. Add a layer, watch the decision boundary bend |
| 09 LLMs | Live token-by-token prediction with probability bars. Watching the next-word distribution is genuinely revelatory for a teenager who thinks it's magic |

### 6.1 Cross-cutting rule

Every interactive must respond in under 100 ms and **must work with a thumb.** If a widget needs precision mouse work, it gets redesigned.

### 6.2 Implementation

Built as a small set of composable React primitives — `<ScatterPlot>`, `<DraggableLine>`, `<LabelingTask>`, `<TrainingViz>` — **not** as ten bespoke components. This is what makes adding module 11 cheap later.

---

## 7. Approved visual direction — "futuristic minimal"

**Approved: Option 3.** Reference: Sapphire UI. Charcoal panels, violet accent, softly rounded cards, and an iridescent form as the single visual centerpiece.

The strategic move: **show the product on the landing page.** An in-page preview of the student dashboard with the progress heatmap, so the visitor sees the thing they'll get.

**The risk being taken:** it's a dashboard aesthetic wrapped around a course. It only stays honest if the progress and streak surfaces are built early. **Empty dashboards read as vapor.**

### 7.1 Color tokens

#### Dark mode (default)

| Token | Hex | Use |
|---|---|---|
| `--bg` | `#0D0D12` | Page background |
| `--panel` | `#16161D` | In-flow card |
| `--sub` | `#1D1D26` | Secondary surface, chips |
| `--text` | `#EDEDF2` | Primary text |
| `--muted` | `#8B8B99` | Supporting text |
| `--border` | `rgba(255,255,255,0.07)` | Default hairline |

#### Light mode

| Token | Hex | Use |
|---|---|---|
| `--bg` | `#F2F2F6` | Page background |
| `--panel` | `#FFFFFF` | In-flow card |
| `--sub` | `#F6F6FA` | Secondary surface, chips |
| `--text` | `#16161C` | Primary text |
| `--muted` | `#61616E` | Supporting text |
| `--border` | `rgba(20,20,28,0.08)` | Default hairline |

#### Accents (both modes)

| Token | Dark hex | Light hex | Meaning |
|---|---|---|---|
| `--accent` | `#7F77DD` | `#7F77DD` | Violet. **Actionable elements only** |
| `--accent-hover` | `#9A93EA` | `#534AB7` | |
| `--accent-deep` | `#534AB7` | `#534AB7` | Violet text on light surfaces |
| `--success` | `#5DCAA5` | `#1D9E75` | Correct, completed |
| `--fail` | `#ED93B1` | `#D4537E` | "Break it" screens and errors |
| `--warn` | `#EF9F27` | `#BA7517` | Warning, competition |

**Accent rule:** violet is reserved for what the student can touch. If it appears as decoration, it stops meaning anything.

**Dark mode is the default** — it's what the audience expects from anything technical, and it makes data visualizations pop. **But light mode is first-class, not a courtesy:** a school projector, a printed handout, and a press screenshot all want the white version.

### 7.2 Typography

| Role | Font | Notes |
|---|---|---|
| Display + body | **Geist Sans** (fallback: Inter) | A single grotesk for all text |
| Data and code | **Geist Mono** (fallback: JetBrains Mono) | Metrics, code, axis labels |

Scale:

| Element | Size | Weight | Tracking |
|---|---|---|---|
| Hero display | 40px (desktop) / 30px (mobile) | 500 | −0.03em |
| Section h1 | 28px | 500 | −0.025em |
| h2 | 20px | 500 | −0.02em |
| Body | **17px minimum** | 400 | 0 |
| Secondary body | 15px | 400 | 0 |
| Label / chip | 12.5px | 400 | 0 |
| Large metric | 22px | 500 | −0.02em |

**Only two weights: 400 and 500.** Nothing heavier.

**Critical typographic detail for Spanish:** Spanish runs roughly 20% longer than English. Buttons, labels, and cards are designed with that headroom or you fight text overflow for the whole project.

### 7.3 Shape and space

| Property | Value |
|---|---|
| Radius, controls | `9px` |
| Radius, cards | `12px` |
| Radius, panels | `14px` |
| Radius, outer container | `16px` |
| Border | `0.5px` — never 1px, never 2px |
| Metric grid | 4 columns desktop, 2 mobile, `gap: 11px` |
| Vertical rhythm | rem (1, 1.5, 2) |
| Internal spacing | px (8, 12, 16, 22) |

### 7.4 Motion

Purposeful only: screen transitions, animation on data changes so the student sees the *change* rather than just the result, and a subtle celebration on module completion. Nothing decorative or looping. **Always respect `prefers-reduced-motion`.**

### 7.5 Signature element

**The progress heatmap.** A grid of violet cells at varying intensity, appearing on the landing page, in the student dashboard, and — simplified — in the logo. It's the one piece that repeats across the whole system and it's what makes the product feel authored rather than assembled.

---

## 8. Identity — logo

### 8.1 Recommended mark

**42 monogram** — "42" in white inside a violet superellipse square.

| Property | Value |
|---|---|
| Container | 104×104, `rx="30"` (≈28.8% of the side) |
| Fill | `#7F77DD` (violet) or `#16161C` (dark mono) |
| Digits | 46px, weight 500, `#FFFFFF`, centered, baseline at y=70 |

**Live alternative: Píxel** — the cell grid forming a seedling. Shares DNA with the dashboard heatmap, which makes the whole system feel authored. **Requires a simplified favicon variant**: drop the low-opacity cells and keep only the eight solid ones, because they mush together at 16px.

*Decision pending from the founder. The rest of the system works with either.*

### 8.2 The wordmark does more work than the mark

`seed42` in the grotesk with tight tracking (−0.015em), and `.tech` dropped to muted grey. It's honestly the strongest asset in the lockup. **If time is short, ship the wordmark alone and add the mark in September.**

Optional descender: *Escuela de IA*, 11px, in `--muted`.

### 8.3 One-ink requirement

Workshop handouts get photocopied in black and white, and some sponsor decks need a mono version. Both the monogram and Píxel work flat.

### 8.4 Files required before launch

- `logo.svg` — mark alone
- `logo-lockup.svg` — horizontal, mark + wordmark
- `logo-512.png` — social profiles
- `favicon.ico` — 32px
- `og-image.png` — **1200×630**

The last is the one everyone forgets and the one that appears every time someone shares the site over WhatsApp — which will be the main distribution channel among students.

---

## 9. Voice and copy

- **Sentence case everywhere.** Buttons, headings, tabs, labels.
- **No terminal punctuation** on labels and headings. Helper text does take a period.
- **Active voice, verb first.** "Empezar módulo", not "Inicio de módulo".
- **Tuteo** (informal second person). The audience is 15–17 and allergic to being talked down to. Address them as capable, not as children.
- Avoid: "simplemente", "fácil", "solo tienes que" — they presume and condescend.
- Errors say what happened and what to do. No "Error:" prefix, no apology.
- Empty screens are an invitation, not an apology.

---

## 10. Kaggle competition

**Prize pool: 500,000 COP.**

### 10.1 Recommended structure

Splitting purely by rank (250/150/100) rewards the three students who already knew Python — probably not the intended outcome. Carve out a portion for a category that rewards the actual mission:

- Best-documented notebook
- Best newcomer with no prior coding experience
- Best solution from a public school

It costs nothing extra and **changes who believes they can win.**

### 10.2 Payment mechanism — solve early, not on 1 September

Nequi or Daviplata are simplest, but **minors will need a guardian's account.** That gets confirmed **at registration**, not at payout time.

If a sponsor covers the prizes, gift cards or equipment may be easier than cash — and a laptop or tablet for a first-place student who doesn't have one is worth more than 250,000 COP, in both impact and story.

### 10.3 Location

**Native site leaderboard** for v1. Kaggle requires an account, is entirely in English, and assumes notebook fluency: for a student who just learned what a model is, it's a wall. Kaggle is the graduation destination for the top 5% — a stated aspiration, not a v1 feature.

---

## 11. Timeline

### 10–20 August — Build v1 + beta

- Working platform with content, frontend, and open beta
- **Recruit the 10–15 beta testers BEFORE the 10th.** Names and WhatsApp contacts ready, so the moment v1 is up you're receiving feedback, not still recruiting
- Mix: 2–3 who already code, the rest with zero background. The zero-background group is where the real findings are
- **Watch at least three of them go through module 01 in silence**, screen shared or in person. Twenty minutes of quiet observation reveals more than any feedback form
- Prepare outreach assets during this window — sponsor deck, school one-pager, press kit — so the 21st starts with sending, not writing

### 21–30 August — Outreach

- **The competition launches here, not later.** If it closes 1 September, participants need a week minimum. Announce and open submissions on the 21st so the competition itself becomes the story being pitched. A live leaderboard with real students on it is far more compelling to a journalist or sponsor than a description of a website
- Sponsorship with **specific asks**, not general ones: hosting credits, prizes for the top three, or funding a workshop day. "We need 500,000 COP for prizes" gets a yes far more often than "we're seeking sponsorship." Priority: MinTIC programs, Ruta N in Medellín, and the CSR arms of Bancolombia, Rappi, and Grupo Éxito
- **Schools: contact teachers directly** — *profesores de tecnología e informática* — not administrations. Administration is a months-long process; a motivated teacher is a two-week process. Offer a free 90-minute workshop with a fixed date, not an open-ended partnership

### 1 September — Competition close

A closing ceremony, even if it's just an Instagram Live announcing winners. It creates a moment, gives press a dated hook, and gives participants something to share — the cheapest acquisition channel there is. Publish the winning notebooks as learning material: free content that also validates the students publicly.

### 2–30 September — Outreach and documentation

- **Reframe documentation as a public impact report**, not an internal record: numbers, student quotes, screenshots, what worked and what didn't. That single artifact serves simultaneously as sponsor pitch, press attachment, credential with schools, and personal record. Write it as you go, not at month's end
- **Colombian media:** El Tiempo's tech section, Semana's education coverage, La República, Bogotá regional outlets. The angle that lands is *"Colombian student builds a free AI school for Colombian students"*, not "new educational platform launches"
- **Alumni cohort:** invite the 5–10 strongest participants to co-write module 11 or facilitate the next workshop. This is how the project survives September without the founder being its only labor

### Across the whole timeline

A public changelog or build-in-public thread on Instagram or X, updated 2–3 times a week. It costs ten minutes per post, builds an audience **before** launch rather than after, and by September there's a documented narrative arc that makes the press pitch write itself.

---

## 12. Sustainability beyond September

Free is correct for launch. The viable paths in the Colombian context:

1. **Paid workshops at private schools**, subsidizing the public ones
2. **Corporate or foundation sponsorship** — MinTIC, Ruta N, corporate CSR
3. **Recruiting contributors from among the standout students** — the best users become the content creators

The third is the most elegant and the one that best solves the labor problem.

---

## 13. Bar for success

The bar for "successful" here is **fifty Colombian teenagers who understand AI better than they did** — not a polished multi-feature platform. Hit that and everything else follows.
