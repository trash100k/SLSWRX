# SalesWorx — Master Plan: From Prototype to Viral Competitive Sales Sport

_2026-07-07. Synthesized from a forensic 18-screen codebase audit, six live-web research tracks (voice APIs, LLM-judge scoring, rating systems, viral mechanics, competitors, infrastructure — three adversarially verified against primary sources), and three design specifications. This document is the index and the executive path; the numbered docs carry the depth._

| Doc | Contents |
|---|---|
| [01-CURRENT-STATE-AUDIT.md](01-CURRENT-STATE-AUDIT.md) | What's real vs. fake in every file, with line-level evidence |
| [02-ARCHITECTURE.md](02-ARCHITECTURE.md) | Model/voice/judge harnesses, Supabase schema, generative content pipeline, M0–M5 agent task tables |
| [03-GAME-SYSTEMS.md](03-GAME-SYSTEMS.md) | Glicko-2 rating design, **ONE SHOT** mode full spec, anti-cheat, mode triage, economy |
| [04-GROWTH-PLAYBOOK.md](04-GROWTH-PLAYBOOK.md) | Positioning, **20 elevations**, **10 new features**, 5 viral loops, 90-day launch calendar, pricing |
| [05-RESEARCH-APPENDIX.md](05-RESEARCH-APPENDIX.md) | All research findings with sources and verification corrections |

---

## 1. The Thesis

**SalesWorx becomes the first competitive sales sport — the chess.com of sales calls.** You call an AI buyer who can get annoyed, cut you off, and *hang up on you*. A judge you can't sweet-talk scores you on published formulas plus an anchored rubric. A real Glicko-2 ladder makes your rank a status object worth posting on LinkedIn. And once a week, every rep on Earth faces the same buyer, blind, with **exactly one attempt** — One Shot.

The market gap is verified (05, competitors track — CONFIRMED): every funded competitor (Hyperbound $18.3M, Second Nature $38M, Nooks $70M, Gong) sells to enablement budgets, which structurally forbids public cross-company ladders, brutal roast content, and one-attempt stakes. Zero products in the category have any of the three. Bottom-up demand is proven: 40K+ reps played Hyperbound's free demo bots; #coldcalling roleplay is a live TikTok format. The wedge is Duolingo-vs-Rosetta-Stone: individuals play free, their managers buy the team tier later.

**The core loop everything serves: Call → Roast → Rank → Share.** Anything that doesn't serve it gets cut.

## 2. Where We Are (audit verdict)

A real AI core wrapped in cinematic fakery. See 01 for the full forensics.

**Real today:** six Gemini endpoints in `server.ts` (roleplay chat with sentiment, Roast Master 10-metric grader, boss generator, whisper-coach hints, two email graders); the Arena → PostCall loop; Gauntlet's chat + willpower mechanics.

**Fake today:** everything competitive and social. "Ranked" matchmaking is a 3-second `setTimeout` into a casual match (Arena ignores `?ranked=true`). "ELO" is `floor((score−70)×2)` in localStorage — no opponent rating, editable in DevTools. Leaderboard opponents are the user's own ELO +120/+80 so you always rank 3rd. The entire arcade wing (Guillotine, RapidFire, Negotiation, Tournaments) never touches the backend — scores are `Math.random()*20+80`. Architect's "AI ASSIST" is a `setTimeout` while the real `/api/generate-boss` endpoint sits unused. Nothing persists: transcripts die in router state. Boss system prompts (the answer key) ship to the browser. Three bosses feed a game with a ladder, a gauntlet, and a "daily." TrainingGrounds crashes on mount (missing import). Every unauthenticated Express endpoint is an open proxy on the owner's Gemini key.

**The rule going forward: never ship fake mechanics again.** Fake-until-real is the codebase's core disease; every milestone below either makes a surface real or gates it behind an honest "coming soon."

## 3. The Five Systems To Build

### 3.1 Voice harness (the model harness layer)
A provider-agnostic `VoiceSession` interface (`src/engine/voice/`) — `connect / startMic / interrupt / endSession` + normalized events (`user_transcript`, `agent_transcript`, `tool_call`, `session_end`). First adapter: **Gemini Live API** (`gemini-2.5-flash-native-audio-preview-12-2025`), browser → Google direct over WebSocket using **server-minted ephemeral tokens** with `liveConnectConstraints` pinning model, persona, and tools — so a token can't be replayed with a tampered prompt. Verified rationale (05, voice track — CONFIRMED): affective dialog + `NON_BLOCKING` async tool calls, and ~**$0.06–0.09 per 5-min call** vs $0.90–2.30 on gpt-realtime-2 and ~$0.50–0.60 on ElevenLabs — the only economics that survive freemium. OpenAI Realtime and ElevenLabs adapters slot in later through the same interface.

Every session declares two tools: **`hang_up_call(reason, final_line)`** — the boss hanging up is the emotional spike and the most shareable failure artifact — and **`book_meeting(...)`** — the win condition as a server-validated state transition, not a judge opinion. Sentiment/hints run in a **sidecar** (flash-lite on each finalized turn), never inside the buyer's context.

### 3.2 Judge harness (scoring that players can stake rank on)
Five stages (02 §1.1.3; 05 scoring track — CONFIRMED):
- **Stage 0 (live):** win/lose tracked by validated tool events during the call.
- **Stage 1 (deterministic, $0):** published formulas — talk-listen ratio (43–57% optimum, Gong's 326K-call study), question count (peak 11–16), longest monologue ≤2:30, WPM ~150, filler rate, sentiment trajectory. The "provably fair" 40% of the score, ungameable by rhetoric because the optima are interior — stuffing overshoots.
- **Stage 2 (ensemble):** 3 independent judge samples, 10 metrics × 0–4 anchored bands, mandatory verbatim evidence quotes, median; disagreement escalates to a pro-model tiebreak.
- **Stage 3 (verification, code):** every evidence quote fuzzy-matched ≥0.9 against the real transcript (LLM self-verification is ~38% accurate — so it's string matching). Anomaly detection on score deltas.
- **Stage 4/5:** fusion (40% deterministic + 45% rubric + 15% outcome) and a golden-set CI gate so no judge-prompt change ships if it drifts from human labels.

**The ladder never consumes the raw judge score.** Outcomes are discretized W/D/L dominated by the tool-validated win event — a prompt-injected 100 pays exactly what an honest 78 pays. This one decision makes judge manipulation nearly worthless and answers the category's #1 trust complaint (Second Nature's "scores the same call differently every time").

### 3.3 Generative content engine
Three bosses can't feed a sport. The pipeline (02 §2): **draft → validate → auto-playtest → seed rating → live**. Gemini-2.5-pro generates full personas (structured win preconditions, opener pools, voice + ambience selection); an injection lint screens authored fields; then a bench of three calibrated AI rep agents (Rookie ≈1100 / Solid ≈1400 / Killer ≈1800) auto-playtests every boss through the full grading pipeline to seed its Glicko rating before a human ever meets it (~$0.05/boss). Same pipeline powers the daily scenario generator, the objection banks behind RapidFire, and community bosses from the Architect (playable unrated until curated into the ranked pool).

### 3.4 Rating engine (the real Elo)
**Glicko-2, applied symmetrically to players and bosses** — the Lichess puzzle model: every call is a rated match between two rated entities whose ratings co-evolve (03 §1). Players start 1500/RD 350; bosses seed by difficulty (Dave 1400, Greg 1700, Patty 2000) at RD 300 and converge within ~30 attempts. Five placement matches with predicted rank; provisional `?` until RD < 110; 8-week seasons with soft reset `(r+1500)/2`; decay only at Master+; **Apex Legend = top-100 seats** requiring weekly activity. All rating writes happen in one idempotent transactional Postgres function keyed on attempt ID — the client can't write a score, period. The localStorage formula is deleted, imported only as a cosmetic "legacy EXP" trophy.

### 3.5 Growth engine
Five loops (04 §4): the **Roast Grid** share card (Wordle grammar: 10 spoiler-free emoji squares + `☠️ HUNG UP ON at 0:47` + roast line + link), the **Carnage Clip** (15–30s vertical audiogram of your worst moment — losing ships in one tap, winning takes two, because negativity travels 5×), **challenge links/embeds** that cold-start an anonymous playable session in <60s, **referral = banked One Shot attempt** (the only currency scarce enough to refer for), and **company leaderboards** by verified email domain as ambient recruiting pressure on coworkers. Target K ≥ 0.3 at 1–2 day cycle time.

## 4. ONE SHOT — the Flagship (full spec: 03 §2)

Every **Monday 00:00 UTC**, one handcrafted buyer drops — identical for every player on Earth. 48-hour window. **One attempt, consumed server-side before the scenario is revealed.** No hints, no battlecards, no warm-up. Disconnect? 5-minute resume grace, then it's graded as-is — *"your line drops, your attempt stands."* Runs on the relay path (LiveKit bridge + server-side recording) so the server's transcript is the only truth. Entry requires verified email, completed placements, RD < 150, account age ≥ 72h — an alt-account farm must invest ~10 real matches per alt to scout one boss that won't behave the same way twice anyway.

Results: percentile leaderboards (global / friends / company / country), published only after the window closes; feeds ranked at 1.5× weight; top-10 runs become public annotated FilmRoom replays (the honor *is* the audit); a weekly "carnage report" ("83% of reps died at the pricing objection — median survival 2:41"). Referral earns a banked future attempt, never a same-week retry. Injection attempts void the attempt — it is spent, not refunded.

Why it works (03 §2.3): shared challenge → comparability → shareability (Wordle's law); scarcity → stakes (every competitor markets *unlimited retries* — zero one-attempt modes exist in the market); failure as spectacle (HQ Trivia's elimination drama; "the AI destroyed me" is a self-deprecating flex in sales culture); Monday appointment + streak with earnable freezes (Duolingo's retention math).

## 5. The Build Path — When, What, Where, How, Why

Six milestones. Ordering principle: **truth before features, substrate before spectacle** — stop shipping fake mechanics, then auth/DB, then voice, then ranked, then One Shot, then content/social. Full agent-executable task tables with Definitions of Done and verify commands are in 02 §3; this is the command view.

| Milestone | When (wk) | What ships | Where (main surfaces) | Why first |
|---|---|---|---|---|
| **M0 — Stop the bleeding** | 1 | Fix the 5 trust bugs (TrainingGrounds crash, custom-boss misgrading, `/10` display, dead `?ranked=true`, swallowed errors); extract shared `useChat`/`useSpeech` hooks; delete dead/fake code; honest "coming soon" gates; real OG/meta tags | `src/components/*`, `src/hooks/*`, `index.html` | Session-one silent product-killers; every later milestone builds on these files |
| **M1 — Substrate** | 1–2 | Supabase auth (email/Google/LinkedIn-OIDC/anonymous) + full schema + RLS; all six endpoints ported to edge functions behind JWT + rate limits; **Glicko-2 in Postgres**; bosses to DB (prompts leave the client forever); every screen reads real data or an honest empty state | `supabase/migrations/`, `supabase/functions/`, `src/lib/supabase.ts` | Nothing competitive is possible while scores are client-authored and the API is an open proxy |
| **M2 — Live voice** | 2–4 | `VoiceSession` interface + Gemini Live adapter; ephemeral `voice-token` fn; `hang_up_call` + `book_meeting` tools; sidecar sentiment/hints; ambience mixer; deterministic metrics; cost telemetry | `src/engine/voice/`, `supabase/functions/voice-token`, `live-sentiment` | Voice is the 2026 category baseline; also the emotional spike (hang-ups) every viral loop feeds on |
| **M3 — Judge + ranked** | 4–6 | Anchored rubric v1, 3-judge ensemble, quote verification, golden-set CI gate; boss auto-playtest calibration; real ranked queue (blind boss ±200, 60s turn timer, forfeits); placements; Season 1; arcade modes made honest | `_shared/judge/`, `RankedHub.tsx`, `eval/golden/`, `.github/workflows/` | Rank must be unfakeable before it's public; the judge must be consistent before the roast is stake-worthy |
| **M4 — One Shot + share engine** | 6–8 | One Shot weekly (server-locked attempts, LiveKit recording path); roast grid share cards (@vercel/og); carnage clip pipeline (Fly.io ffmpeg/Remotion worker); real leaderboards + FilmRoom replays; referral + streaks | `OneShot.tsx`, `workers/`, `clip-request` fn, `Leaderboard.tsx`, `FilmRoom.tsx` | The growth flywheel — ships only once integrity (M3) makes results worth sharing |
| **M5 — Content + social** | 8–10 | Architect publishes real bosses through the calibration pipeline; server-side daily boss; WarRoom async duels; TeamHub company ladder or cut; Armory made consequential; second voice provider behind a flag | `Architect.tsx`, `WarRoom.tsx`, `TeamHub.tsx`, `src/engine/voice/openaiRealtime.ts` | UGC solves content starvation permanently; social surfaces need the graph M4 creates |

### How to run the coding agents against this

- **Task granularity:** every task in 02 §3 is file-scoped with a Definition of Done and a mechanical verify step (`npm run build`, a grep that must return 0 hits, a pgTAP test, an E2E script). An agent takes exactly one task; the verify step is the exit criterion, not the agent's self-report.
- **Parallelization:** within a milestone, tasks marked on disjoint files run as parallel agents in worktrees (e.g., all of M0 is 9 agents at once; M1.3's six endpoint ports are six agents). Across milestones, never overlap — each milestone's exit criteria gate the next.
- **Verification agents:** after each milestone, run an adversarial review pass (separate agents attempting to refute the DoDs: DevTools score-write attempt after M1, token-replay attempt after M2, judge-consistency regrade σ check and injection suite after M3, double-attempt race on One Shot after M4).
- **Golden fixtures first:** before M3 judge work starts, record ~20 real test calls (M2 output) and hand-label them — they become the golden set that gates every judge change in CI forever.
- **Model pinning:** all judge prompts, persona compilers, and model IDs are versioned files in git; any model bump triggers boss RD resets + auto-playtest regression (02 §2.1) — treat model upgrades like schema migrations.
- **Cost tripwires:** per-attempt cost telemetry from M2 day one; alert at >$0.15/casual call, >$0.35/ranked call; concurrency gauge with Vertex AI migration trigger at sustained peak >35 concurrent voice sessions (Developer API Tier 1 caps at 50 — verified).

## 6. Twenty Elevations & Ten New Features (detail: 04 §2–3)

**Elevations (improve what exists):** 1. Live voice arena via Gemini Live · 2. Bosses can hang up on you · 3. Real server-side Glicko-2 · 4. Scoring-trust overhaul (ensemble + quote verification + CI gate) · 5. Fix the five trust bugs · 6. Persist every call · 7. Generated boss openers, boss speaks first · 8. Sidecar sentiment + whisper coach · 9. Deterministic "provably fair" metrics panel · 10. PostCall as a dopamine reveal, not a form · 11. FilmRoom real replay theater · 12. First call in <60s, no signup · 13. Arcade mini-games made honest with one quick-judge endpoint · 14. Streaks + revenge matches · 15. Placement flow + difficulty curve · 16. Sound design + call ambience · 17. Roast intensity dial (Professional / Spicy / Scorched Earth) · 18. Mobile-first core loop · 19. Armory loadouts that actually affect coaching · 20. Profile as shareable trophy room.

**New features:** 1. **One Shot Weekly** · 2. Roast Clip auto-generator · 3. Embeddable "Beat Our AI Buyer" widget + challenge links · 4. Duel-a-Friend (async same-scenario versus) · 5. Influencer Boss Drops (the Mittens playbook, pre-validated in this market by Hyperbound's Adam Robinson bot) · 6. Company Wars (domain-based team ladders) · 7. Spectator Theater + failure reels · 8. Boss Workshop (UGC with co-evolving Glicko ratings) · 9. Coach Mode (mentor replay review — the paid on-ramp) · 10. Live bracket events ("One Shot World Championship," PogChamps format).

## 7. Go-To-Market (detail: 04 §5)

**Weeks 1–4 build in quiet** (M0–M2 + One Shot v1; private alpha of 30–50 reps via founder DMs). **Weeks 5–8 seed the niche:** founder-story posts in Bravado War Room (400K members, anonymous culture = ideal for roast screenshots) and r/sales; official TikTok/Shorts account riding the "cold call with me" format with daily AI-destroys-a-rep clips; first Influencer Boss Drop. **Weeks 9–13 manufacture the moment:** One Shot World Championship qualifiers → livestreamed finals with influencer judges, Product Hunt stacked on finals week, "SalesWorx Wrapped" season cards, Season 2 begins. Gates between phases: D1 ≥ 50%, share attach ≥ 15%, K ≥ 0.15 at week 8; 10K registered, D1 ≥ 60%, K ≥ 0.3 at day 90.

**Pricing (04 §6):** everything that generates a share or a rank is free forever (2 voice + 10 text calls/day, full ladder, One Shot, roast, clips). Pro $24/mo sells depth and volume — unlimited voice minutes, full judge evidence, replay vault — never rank. Team $49/seat self-serve, pulled bottom-up by the public company ladders. Never sold: rating boosts, extra One Shot attempts, judge leniency, roast removal.

**Unit economics (verified pricing, 02 §4):** ~$0.05–0.09 per 5-min voice call, ~$0.04 per full ensemble grade, <$0.30 fully-loaded ranked call. ~$45–130/mo total at 100 users; ~$1.6–3.1K/mo at 10K registered (~$0.15–0.30 per MAU, 85% of it LLM spend) — covered by ~1–2% Pro conversion.

## 8. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Judge inconsistency destroys trust (the category's #1 complaint) | Ensemble median + anchored bands + quote verification + golden-set CI gate + equating across versions; ladder consumes only W/D/L tool-event outcomes (03 §3.4) |
| Prompt injection (roleplay-framed attacks hit ~90% ASR; judge attacks 88–98% — verified) | Server-side prompts only, delimiter-framed player turns, least-privilege tools with server validation, injection classifier → attempt voided, judge blind to all player-authored config |
| Gemini Live is a Preview API | Pin model IDs; `VoiceProvider` seam makes a forced migration a config change + boss recalibration run; OpenAI adapter spike in M5 |
| Concurrency wall (50 sessions on Developer API Tier 1) | Instrument from M2; migrate `voice-token` to Vertex AI (1,000 concurrent, same models) at sustained peak >35 |
| Free-tier abuse burns the key | JWT + quotas + Turnstile + anonymous text-only caps; the open Express proxy dies in M1 |
| Brutal tone backfires publicly | Roast intensity dial, org pinning to Professional; scores never change with tone |
| One Shot retry-farming | Attempt consumed pre-reveal, relay-path server recording, entry gates (placements + RD + age), device clustering, top-20 auto re-grade before publish |

## 9. Definition of "Real"

The prototype is real when, in one unbroken session: a new user lands anonymously, talks to a boss out loud within 60 seconds, gets hung up on, gets roasted with evidence quotes that verifiably exist in their transcript, signs up to save the grade, plays five placements, sees an honest provisional rank no DevTools console can edit, waits for Monday, burns their one One Shot attempt, watches their percentile land on a leaderboard of real humans, and pastes a spoiler-free grid into LinkedIn that cold-starts the next player. Every system in this plan exists to make that sentence true.
