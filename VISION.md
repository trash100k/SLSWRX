# SalesWorx — Product Vision

> **One line:** SalesWorx is a competitive, ranked sales arena that reps play because it's
> addictive — and companies pay for because the rank is a *verified, skill-based credential*
> they can scout and hire against.

This document is the north star. Every feature decision should serve the thesis below. It is
grounded in research on leaderboard psychology, live-service game design, habit formation,
sales gamification, and gamified hiring (sources at the bottom).

---

## 1. The thesis: we are building a *rating system*, not a training tool

The defining finding across all sales-gamification research: **gamification fails when it
rewards shallow activity** (calls dialed, emails sent) and **succeeds when it rewards quality
outcomes.** Most "sales gamification" is a leaderboard of call volume — it drives spam, burns
out, and gets abandoned by week three.

SalesWorx already does the hard thing right: **the score is graded skill, not volume.** The
Roast Master's 10-metric grade (`/api/grade`) is a defensible measure of how good a rep
actually is. That makes the resulting ELO something no other tool has — **a credential.**

> The Roast Master grade is the asset. The game is the distribution. The credential is the
> business. Everything else serves these three.

---

## 2. The five mechanics that make it addictive

Each maps to code that already exists or is a near-term extension.

### 2.1 The Roast Master is the variable-reward engine — lean all the way in
The Hook Model (Trigger → Action → Variable Reward → Investment) shows that *unpredictable*
rewards are what spike dopamine and form compulsion. We already have the perfect engine: **you
never know what grade you'll get.** The wait for the Roast Master verdict is the "open the loot
box" moment.

- **Build:** Turn the grade reveal in `PostCall` into a *production* — suspense, animated score
  count-up, screen-shake on a brutal roast, a shareable verdict card. This screen is the
  retention engine; treat it like the most important UI in the app.

### 2.2 Leagues, not a global leaderboard
A single global board *harms* most users: ~31% report negative effects from rank comparison,
~44% spiral on "upward comparison," and winner-take-all boards demotivate ~90%. Duolingo solved
this with **weekly leagues of ~30 similar-skill players with promotion/relegation**, so
competition always feels *winnable*.

- **Have:** `RANKS` (Bronze → Apex) in `src/lib/game.ts`.
- **Build:** Cohort matchmaking — bucket players into small same-skill leagues; weekly
  promotion/relegation. Never show a raw global 1–N list as the primary surface.

### 2.3 Seasons with a soft reset
Ranked ladders retain players for *years* because each season softens rank and hands even
burned-out players a clean reason to return — the climb reopens. Battle-pass cycles (60–90 days)
work via FOMO + sunk cost + loss aversion + a constant challenge→reward→repeat loop.

- **Build:** 90-day seasons. Partial ELO reset, season-exclusive boss roster, end-of-season
  titles ("Season 3 Apex Legend"), season-exclusive cosmetics. A season progression track
  (free + premium tiers) is the natural monetization surface for the consumer side.

### 2.4 The daily boss becomes a streak
Loss aversion is the strongest force in the stack — a long streak is investment that *hurts* to
lose. Streaks lifted Duolingo commitment ~60%.

- **Have:** `getDailyBoss()` in `src/data/bosses.ts`.
- **Build:** Streak counter, streak-freeze item, escalating "you're about to lose it"
  notifications. The daily boss is the Trigger in the Hook loop.

### 2.5 Investment compounds (switching costs)
The more a rep pours in, the harder they are to pull out.

- **Have:** Architect (custom bosses), Film Room (replays), badges.
- **Build:** Surface accumulated investment prominently on the profile — custom bosses created,
  badges earned, season history, best roasts survived.

---

## 3. The scouting wedge — the moat and the monetization

Gamified hiring is already real (game-based assessments raise candidate engagement ~40%; Google
and PwC use them) but every existing tool is a boring puzzle. We have a *real, ranked,
competitive* arena reps play for fun. That's the unfair advantage.

**The flywheel:**
1. A **verified, anti-cheat SalesWorx Rating** becomes a portable credential reps put on
   LinkedIn ("Diamond II · 2,150 · Top 4%").
2. Companies run branded **Scouting Combines** — custom Architect scenarios for *their* product —
   and see verified scores, transcripts, and Film Room replays of candidates under real pressure
   instead of self-reported resume claims.
3. Top-ranked reps opt into a **talent marketplace**; companies pay to discover and assess them.
   This is the intrinsic career payoff ordinary sales contests lack — you play to get *recruited*,
   not for a $50 gift card.
4. Companies bring their candidate pipelines → those candidates discover the game → become
   retained players → supply for the next company. **Two-sided flywheel: free addictive game for
   reps; companies pay to scout.**

---

## 4. Anti-patterns (what kills this — do not do)

- **Don't reward shallow activity.** The score stays quality-graded, never volume. (Already true —
  protect it.)
- **Don't ship a single global winner-take-all leaderboard.** Use leagues + relegation cohorts.
- **Don't run it as a one-off "contest."** It must be a daily habit — seasons + streaks, not a
  flashy month-end push that's forgotten by week three.
- **Don't harm the bottom 90%.** Always show "you vs. last week" and personal bests alongside rank.
- **Ethics:** This sits in the defensible quadrant of Nir Eyal's Manipulation Matrix — the user
  genuinely improves (better at their job, real career upside). Keep it there. No dark-pattern
  monetization of streak anxiety aimed at vulnerable users.

---

## 5. The hard prerequisite

**None of this works on `localStorage`.** A credential you can edit in devtools is worthless; a
leaderboard you can fake is worthless to an employer; a streak that dies on cache-clear is
worthless. Server-authoritative, anti-cheat, account-backed scoring isn't a nice-to-have — it's
the literal product.

`/api/grade` already runs server-side (good). What's missing: **accounts + a database + persisting
the score the server computes**, so the rank becomes trustworthy.

### Current gaps
- ELO, badges, custom bosses, match history all live in `localStorage` (client-editable).
- No accounts, no real cross-device identity.
- "Leaderboards" / "Standings" are not backed by real data.
- No anti-cheat: the client could submit arbitrary transcripts or scores.

---

## 6. Build order

1. **Backend foundation** *(the unlock for everything)* — accounts + Postgres + realtime. The
   grade → ELO → leaderboard chain moves fully server-side and gets persisted. Server validates
   the transcript and computes the grade; the client never sets its own rank.
   *Stack: Supabase (auth + Postgres + realtime in one).*
2. **Retention layer** — seasons, leagues (cohort matchmaking), the daily-boss streak, and the
   Roast Master reveal-as-a-moment.
3. **Scouting wedge** — public verified profile pages first (shareable rank), then employer
   Combine scenarios and the talent marketplace.

---

## 7. Current architecture (as of this writing)

- **Frontend:** React 19 + Vite + Tailwind, 18 routes (`src/App.tsx`). GAELWORX visual system in
  `src/index.css`.
- **Backend:** Express, 6 Claude endpoints in `serverApp.ts` — `chat` / `grade` / `generate-boss`
  / `hint` / `roast-email` / `followup`. Sonnet 4.6 for fast paths, Opus 4.8 for grading &
  generation, structured outputs throughout.
- **Deploy:** Vercel-ready (`vercel.json`, `api/[...path].ts`).
- **Persistence:** `localStorage` only — **this is the gap section 5/6 closes.**

---

## Sources

- Leaderboard psychology — [Common Ninja](https://www.commoninja.com/blog/the-psychology-behind-leaderboards),
  [Yu-kai Chou on leaderboards](https://yukaichou.com/advanced-gamification/how-to-design-effective-leaderboards-boosting-motivation-and-engagement/)
- Live-service / battle pass design — [G2G News](https://g2g.news/gaming/hooked-on-rewards-the-psychology-behind-battle-passes-in-free-to-play-games/),
  [Design the Game](https://www.designthegame.com/learning/tutorial/daily-rewards-streaks-battle-passes-player-retention)
- Ranked-ladder retention — [SEGA Nerds](https://www.seganerds.com/2026/06/11/why-competitive-rank-systems-keep-players-coming-back-to-online-games/)
- Duolingo — [StriveCloud](https://www.strivecloud.io/blog/blog-gamification-examples-boost-user-retention-duolingo),
  [Trophy case study](https://trophy.so/blog/duolingo-gamification-case-study),
  [Streak breakdown](https://medium.com/@salamprem49/duolingo-streak-system-detailed-breakdown-design-flow-886f591c953f)
- Sales gamification — [Geckoboard](https://www.geckoboard.com/blog/gamification-support-sales-teams/),
  [Fugo](https://www.fugo.ai/blog/sales-gamification-works-if-you-follow-the-science-and-avoid-these-mistakes-2/)
- Habit design — [Hook Model / Growth Method](https://growthmethod.com/hooked-model/),
  [Amplitude](https://amplitude.com/blog/the-hook-model)
- Octalysis — [Yu-kai Chou](https://yukaichou.com/gamification-examples/octalysis-gamification-framework/)
- Gamified hiring — [AssessCandidates](https://www.assesscandidates.com/pre-employment-game-based-assessments-for-recruitment/),
  [Jobful](https://jobful.io/resources/post/gamification-skills-assessments-recruitment)
