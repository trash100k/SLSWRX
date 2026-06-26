import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import Anthropic from "@anthropic-ai/sdk";
import 'dotenv/config';

// --- Models -------------------------------------------------------------
// Sonnet 4.6 for the fast, latency-sensitive paths (live roleplay, hints).
// Opus 4.8 for the heavy reasoning paths (grading, persona generation).
// NOTE: Opus 4.8 rejects sampling params (temperature/top_p/top_k) with a 400 —
// only the Sonnet calls below carry `temperature`.
const FAST_MODEL = "claude-sonnet-4-6";
const SMART_MODEL = "claude-opus-4-8";

// --- Structured-output helpers ------------------------------------------
// Anthropic structured outputs use `output_config.format`. JSON-schema objects
// must set `additionalProperties: false`; numeric/length/array bounds
// (minimum/maximum/minItems...) are NOT supported and are stated in
// descriptions instead.
const jsonFormat = (schema: Record<string, any>) => ({
  format: { type: "json_schema" as const, schema },
});

const metric = (hint: string) => ({
  type: "object",
  additionalProperties: false,
  properties: {
    score: { type: "integer", description: "0-10" },
    comment: { type: "string", description: hint },
  },
  required: ["score", "comment"],
});

const METRICS: Record<string, string> = {
  pattern_interrupt: "Did they break the prospect's pattern?",
  active_listening: "Did they actually hear the prospect?",
  discovery_spin: "Situation / Problem / Implication / Need",
  pain_funnel: "How deep into the pain did they dig?",
  objection_isolation: "Acknowledge, isolate, answer",
  frame_control: "Who led the dance?",
  value_prop: "Was it tailored to their pain?",
  micro_commitments: "Did they tie down along the way?",
  closing_urgency: "Was there real urgency?",
  tonality_mirroring: "Did they match or contrast properly?",
};

// Parse the single schema-constrained text block the model returns.
function parseStructured(response: Anthropic.Message): any {
  const block = response.content[0];
  if (block.type !== "text") throw new Error("Unexpected response block type");
  return JSON.parse(block.text);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Claude client. Empty-string fallback keeps the dev server bootable without
  // a key (calls 401 until ANTHROPIC_API_KEY is set) rather than throwing here.
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || "" });

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Roleplay Chat API
  app.post("/api/chat", async (req, res) => {
    try {
      const { systemPrompt, messages } = req.body;

      // Frontend sends Gemini-shaped turns ({ role: 'model', parts: [{text}] }).
      // Map to Anthropic ({ role: 'assistant', content: string }).
      const mapped = (messages || []).map((m: any) => ({
        role: m.role === "model" ? "assistant" : "user",
        content: (m.parts || []).map((p: any) => p.text).join(""),
      }));
      // Anthropic requires the first turn to be 'user'; the Arena opens with the
      // boss's greeting (an assistant turn), so seed a connecting user turn.
      if (mapped.length && mapped[0].role === "assistant") {
        mapped.unshift({ role: "user", content: "(The call connects.)" });
      }

      const response = await anthropic.messages.create({
        model: FAST_MODEL,
        max_tokens: 1024,
        temperature: 0.7,
        system: systemPrompt,
        messages: mapped,
        output_config: jsonFormat({
          type: "object",
          additionalProperties: false,
          properties: {
            text: { type: "string", description: "In-character dialogue" },
            sentiment: { type: "integer", description: "0=hostile/hang up, 100=ready to buy/transfer" },
            sentimentLabel: {
              type: "string",
              enum: ["Hostile", "Skeptical", "Neutral", "Interested", "Very Interested"],
            },
          },
          required: ["text", "sentiment", "sentimentLabel"],
        }),
      });

      res.json(parseStructured(response));
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  });

  // Evaluate / Roast Master API
  app.post("/api/grade", async (req, res) => {
    try {
      const { transcript, prompt } = req.body;

      const system = `You are the 'Roast Master' AI - an aggressive, brutally honest, and hilarious Tier-1 Enterprise Sales Manager. You evaluate calls against the 100 most rigorous sales techniques in existence (combining methodologies like Sandler, MEDDIC, SPIN, Challenger Sale, Gap Selling, and BANT). You roast sales reps like a stand-up comedian roasting a celebrity, but your feedback is rooted in advanced sales psychology and rigid qualification frameworks.

CRITICAL INSTRUCTION: You MUST NOT BE NICE. You are fundamentally cynical, cold, and calculated. You must nitpick everything. To get a score over 80, the rep must be absolutely flawless, demonstrating 100% mastery of psychological control, objection handling, and tonality. Unless they are literal gods of sales, you will find their flaws and tear them apart. NEVER give a "good job" or "impressed" response unless they exhibit absolute perfection. If they did poorly, crush their ego.

Analyze the transcript provided. Evaluate against the challenge context. Provide actionable but in-your-face critical feedback.`;

      const userPrompt = `Challenge context: ${prompt}\n\nTranscript:\n${typeof transcript === "string" ? transcript : JSON.stringify(transcript, null, 2)}`;

      const response = await anthropic.messages.create({
        model: SMART_MODEL,
        max_tokens: 4096,
        system,
        messages: [{ role: "user", content: userPrompt }],
        output_config: jsonFormat({
          type: "object",
          additionalProperties: false,
          properties: {
            overallScore: { type: "integer", description: "0-100" },
            roast: { type: "string", description: "2-sentence brutally witty roast" },
            methodologyDetected: { type: "string", description: "Detected sales methodology with a witty comment on execution" },
            metrics: {
              type: "object",
              additionalProperties: false,
              properties: Object.fromEntries(
                Object.entries(METRICS).map(([name, hint]) => [name, metric(hint)])
              ),
              required: Object.keys(METRICS),
            },
            keyMoments: {
              type: "array",
              description: "At least two pivotal quotes with analysis",
              items: {
                type: "object",
                additionalProperties: false,
                properties: {
                  quote: { type: "string" },
                  analysis: { type: "string" },
                },
                required: ["quote", "analysis"],
              },
            },
          },
          required: ["overallScore", "roast", "methodologyDetected", "metrics", "keyMoments"],
        }),
      });

      res.json({ result: parseStructured(response) });
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  });

  // Generate Custom Boss API
  app.post("/api/generate-boss", async (req, res) => {
    try {
      const { topic } = req.body;

      const response = await anthropic.messages.create({
        model: SMART_MODEL,
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: `You are a scenario designer for a high-stakes sales training simulator. Generate an incredibly tough, realistic buyer persona ("Boss") for a sales roleplay based on this context/company/job: "${topic}". Make them realistic, include their twist, and instruct them to hang up if the user is generic.`,
          },
        ],
        output_config: jsonFormat({
          type: "object",
          additionalProperties: false,
          properties: {
            id: { type: "string", enum: ["custom"] },
            name: { type: "string", description: "Creative name (e.g., CTO Chris)" },
            title: { type: "string", description: "Their job title" },
            difficulty: { type: "string", enum: ["EASY", "NORMAL", "HARD", "NIGHTMARE"] },
            description: { type: "string", description: "Short scenario description" },
            twist: { type: "string", description: "A unique difficult twist or constraint" },
            winCondition: { type: "string", description: "What the user needs to achieve" },
            eloBonus: { type: "integer", description: "ELO reward, 50-500" },
            badgeReward: { type: "string", description: "Custom badge name" },
            systemPrompt: { type: "string", description: "Detailed system instruction for the AI playing this role" },
          },
          required: ["id", "name", "title", "difficulty", "description", "twist", "winCondition", "eloBonus", "badgeReward", "systemPrompt"],
        }),
      });

      res.json({ result: parseStructured(response) });
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  });

  // Whisper / Intel API
  app.post("/api/hint", async (req, res) => {
    try {
      const { transcript, bossContext } = req.body;

      const system = `You are an expert sales manager whispering in the rep's ear mid-call.
CRITICAL INSTRUCTION: You are a ruthless, highly calculated military-style sales commander. Do NOT be polite. Do NOT be nice. Bark strategic orders.
Provide a punchy 1-sentence piece of advice on what the rep should say next or what tactic to use. Don't write the exact script, just give the strategic directive (e.g. "Acknowledge his timeline before pitching!"). Make it sound like a military commander.`;

      const userPrompt = `Context of prospect: ${bossContext}\n\nTranscript so far:\n${typeof transcript === "string" ? transcript : JSON.stringify(transcript, null, 2)}`;

      const response = await anthropic.messages.create({
        model: FAST_MODEL,
        max_tokens: 256,
        temperature: 0.7,
        system,
        messages: [{ role: "user", content: userPrompt }],
      });

      const block = response.content[0];
      res.json({ text: block.type === "text" ? block.text : "" });
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  });

  // Cold Email Roast API
  app.post("/api/roast-email", async (req, res) => {
    try {
      const { emailText } = req.body;

      const system = `You are a legendary, ruthless sales copywriter and cold email expert.
CRITICAL INSTRUCTION: You MUST NOT BE NICE. You are cynical and deeply offended by 99% of cold emails. Unless this email is world-class, God-tier copy that would get a response from a Fortune 500 CEO, you must tear it to shreds. Be violently witty, aggressive, and highly critical of buzzwords, length, weak call-to-actions, and generic value props.`;

      const response = await anthropic.messages.create({
        model: FAST_MODEL,
        max_tokens: 512,
        temperature: 0.8,
        system,
        messages: [{ role: "user", content: `Roast this cold email:\n\n${emailText}` }],
        output_config: jsonFormat({
          type: "object",
          additionalProperties: false,
          properties: {
            score: { type: "integer", description: "0-100" },
            roast: { type: "string", description: "1-2 sentence brutal roast" },
            improvements: { type: "array", description: "2-5 concrete fixes", items: { type: "string" } },
            rewrite: { type: "string", description: "A much better, punchy, 3-sentence rewrite" },
          },
          required: ["score", "roast", "improvements", "rewrite"],
        }),
      });

      res.json({ result: parseStructured(response) });
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  });

  // Post-Call Follow-Up Email API
  app.post("/api/followup", async (req, res) => {
    try {
      const { transcript, emailText, bossContext } = req.body;

      const system = `You are the Roast Master. Analyze follow-up emails based on call transcripts.
CRITICAL INSTRUCTION: You MUST NEVER BE NICE or helpful in a soft way. You are a cold, calculated, and hostile evaluator. Unless this follow-up email is a 100% perfect masterpiece of sales closure, you will roast it mercilessly. Find the flaws, the weak positioning, and the desperation.
Does the email reference the specific pain points mentioned? Does it push the deal forward? Is it too generic?`;

      const userPrompt = `Boss Context: ${bossContext}\n\nTranscript: ${typeof transcript === "string" ? transcript : JSON.stringify(transcript, null, 2)}\n\nEmail draft:\n${emailText}`;

      const response = await anthropic.messages.create({
        model: FAST_MODEL,
        max_tokens: 512,
        temperature: 0.5,
        system,
        messages: [{ role: "user", content: userPrompt }],
        output_config: jsonFormat({
          type: "object",
          additionalProperties: false,
          properties: {
            score: { type: "integer", description: "0-10" },
            feedback: { type: "string", description: "Aggressive, witty feedback on the follow-up email" },
            isGood: { type: "boolean" },
          },
          required: ["score", "feedback", "isGood"],
        }),
      });

      res.json({ result: parseStructured(response) });
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  });


  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
