<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# SalesWorx — competitive sales roleplay

Gamified sales training: roleplay calls against AI buyer personas, get brutally-honest AI grading, climb a ranked ladder.

**📋 Roadmap:** see [docs/00-MASTER-PLAN.md](docs/00-MASTER-PLAN.md) — the full plan to take this from prototype to a real product (voice harness, judge pipeline, Glicko-2 ladder, One Shot weekly mode, growth engine), with a forensic codebase audit, verified research appendix, and agent-executable build milestones.

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/611ea0ef-971a-4c54-bee1-0cfcd183de61

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
