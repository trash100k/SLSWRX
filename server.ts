import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import Anthropic from "@anthropic-ai/sdk";
import 'dotenv/config';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Claude client
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || ""
  });

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Roleplay Chat API
  app.post("/api/chat", async (req, res) => {
    try {
      const { systemPrompt, messages } = req.body;

      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 1024,
        temperature: 0.7,
        system: systemPrompt,
        messages: messages,
        output_config: {
          type: "json_schema",
          json_schema: {
            name: "ChatResponse",
            strict: true,
            schema: {
              type: "object",
              properties: {
                text: { type: "string", description: "In-character dialogue" },
                sentiment: { type: "integer", minimum: 0, maximum: 100, description: "0=hostile, 100=ready to buy" },
                sentimentLabel: { type: "string", enum: ["Hostile", "Skeptical", "Neutral", "Interested", "Very Interested"] }
              },
              required: ["text", "sentiment", "sentimentLabel"]
            }
          }
        }
      });

      const content = response.content[0];
      if (content.type === "text") {
        const responseObj = JSON.parse(content.text);
        res.json(responseObj);
      } else {
        res.status(500).json({ error: "Unexpected response type" });
      }
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  });

  // Evaluate / Roast Master API
  app.post("/api/grade", async (req, res) => {
    try {
      const { transcript, prompt } = req.body;

      const roastMasterSystemPrompt = `You are the 'Roast Master' AI - an aggressive, brutally honest, and hilarious Tier-1 Enterprise Sales Manager. You evaluate calls against the 100 most rigorous sales techniques in existence (combining methodologies like Sandler, MEDDIC, SPIN, Challenger Sale, Gap Selling, and BANT). You roast sales reps like a stand-up comedian roasting a celebrity, but your feedback is rooted in advanced sales psychology and rigid qualification frameworks.

CRITICAL INSTRUCTION: You MUST NOT BE NICE. You are fundamentally cynical, cold, and calculated. You must nitpick everything. To get a score over 80, the rep must be absolutely flawless, demonstrating 100% mastery of psychological control, objection handling, and tonality. Unless they are literal gods of sales, you will find their flaws and tear them apart. NEVER give a "good job" or "impressed" response unless they exhibit absolute perfection. If they did poorly, crush their ego.

Analyze the transcript provided. Evaluate against the challenge context. Provide actionable but in-your-face critical feedback.`;

      const userPrompt = `Challenge context: ${prompt}\n\nTranscript:\n${typeof transcript === 'string' ? transcript : JSON.stringify(transcript, null, 2)}`;

      const response = await anthropic.messages.create({
        model: "claude-opus-4-8",
        max_tokens: 2048,
        temperature: 0.2,
        system: roastMasterSystemPrompt,
        messages: [{ role: "user", content: userPrompt }],
        output_config: {
          type: "json_schema",
          json_schema: {
            name: "GradeResponse",
            strict: true,
            schema: {
              type: "object",
              properties: {
                overallScore: { type: "integer", minimum: 0, maximum: 100 },
                roast: { type: "string", description: "2-sentence brutally witty roast" },
                methodologyDetected: { type: "string", description: "Detected sales methodology with witty comment" },
                metrics: {
                  type: "object",
                  properties: {
                    pattern_interrupt: { type: "object", properties: { score: { type: "integer", minimum: 0, maximum: 10 }, comment: { type: "string" } }, required: ["score", "comment"] },
                    active_listening: { type: "object", properties: { score: { type: "integer", minimum: 0, maximum: 10 }, comment: { type: "string" } }, required: ["score", "comment"] },
                    discovery_spin: { type: "object", properties: { score: { type: "integer", minimum: 0, maximum: 10 }, comment: { type: "string" } }, required: ["score", "comment"] },
                    pain_funnel: { type: "object", properties: { score: { type: "integer", minimum: 0, maximum: 10 }, comment: { type: "string" } }, required: ["score", "comment"] },
                    objection_isolation: { type: "object", properties: { score: { type: "integer", minimum: 0, maximum: 10 }, comment: { type: "string" } }, required: ["score", "comment"] },
                    frame_control: { type: "object", properties: { score: { type: "integer", minimum: 0, maximum: 10 }, comment: { type: "string" } }, required: ["score", "comment"] },
                    value_prop: { type: "object", properties: { score: { type: "integer", minimum: 0, maximum: 10 }, comment: { type: "string" } }, required: ["score", "comment"] },
                    micro_commitments: { type: "object", properties: { score: { type: "integer", minimum: 0, maximum: 10 }, comment: { type: "string" } }, required: ["score", "comment"] },
                    closing_urgency: { type: "object", properties: { score: { type: "integer", minimum: 0, maximum: 10 }, comment: { type: "string" } }, required: ["score", "comment"] },
                    tonality_mirroring: { type: "object", properties: { score: { type: "integer", minimum: 0, maximum: 10 }, comment: { type: "string" } }, required: ["score", "comment"] }
                  },
                  required: ["pattern_interrupt", "active_listening", "discovery_spin", "pain_funnel", "objection_isolation", "frame_control", "value_prop", "micro_commitments", "closing_urgency", "tonality_mirroring"]
                },
                keyMoments: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: { quote: { type: "string" }, analysis: { type: "string" } },
                    required: ["quote", "analysis"]
                  },
                  minItems: 2
                }
              },
              required: ["overallScore", "roast", "methodologyDetected", "metrics", "keyMoments"]
            }
          }
        }
      });

      const content = response.content[0];
      if (content.type === "text") {
        const result = JSON.parse(content.text);
        res.json({ result });
      } else {
        res.status(500).json({ error: "Unexpected response type" });
      }
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
        model: "claude-opus-4-8",
        max_tokens: 1024,
        temperature: 0.8,
        messages: [
          {
            role: "user",
            content: `You are a scenario designer for a high-stakes sales training simulator. Generate an incredibly tough, realistic buyer persona ("Boss") for a sales roleplay based on this context/company/job: "${topic}".`
          }
        ],
        output_config: {
          type: "json_schema",
          json_schema: {
            name: "BossResponse",
            strict: true,
            schema: {
              type: "object",
              properties: {
                id: { type: "string", enum: ["custom"] },
                name: { type: "string", description: "Creative name (e.g., CTO Chris)" },
                title: { type: "string", description: "Their job title" },
                difficulty: { type: "string", enum: ["EASY", "NORMAL", "HARD", "NIGHTMARE"] },
                description: { type: "string", description: "Short scenario description" },
                twist: { type: "string", description: "A unique difficult twist or constraint" },
                winCondition: { type: "string", description: "What the user needs to achieve" },
                eloBonus: { type: "integer", minimum: 50, maximum: 500 },
                badgeReward: { type: "string", description: "Custom badge name" },
                systemPrompt: { type: "string", description: "Detailed system instruction for the AI role" }
              },
              required: ["id", "name", "title", "difficulty", "description", "twist", "winCondition", "eloBonus", "badgeReward", "systemPrompt"]
            }
          }
        }
      });

      const content = response.content[0];
      if (content.type === "text") {
        const result = JSON.parse(content.text);
        res.json({ result });
      } else {
        res.status(500).json({ error: "Unexpected response type" });
      }
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  });

  // Whisper / Intel API
  app.post("/api/hint", async (req, res) => {
    try {
      const { transcript, bossContext } = req.body;

      const systemPrompt = `You are an expert sales manager whispering in the rep's ear mid-call.
CRITICAL INSTRUCTION: You are a ruthless, highly calculated military-style sales commander. Do NOT be polite. Do NOT be nice. Bark strategic orders.
Provide a punchy 1-sentence piece of advice on what the rep should say next or what tactic to use. Don't write the exact script, just give the strategic directive (e.g. "Acknowledge his timeline before pitching!"). Make it sound like a military commander.`;

      const userPrompt = `Context of prospect: ${bossContext}\n\nTranscript so far:\n${typeof transcript === 'string' ? transcript : JSON.stringify(transcript, null, 2)}`;

      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 256,
        temperature: 0.7,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }]
      });

      const content = response.content[0];
      if (content.type === "text") {
        res.json({ text: content.text });
      } else {
        res.status(500).json({ error: "Unexpected response type" });
      }
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  });

  // Cold Email Roast API
  app.post("/api/roast-email", async (req, res) => {
    try {
      const { emailText } = req.body;

      const systemPrompt = `You are a legendary, ruthless sales copywriter and cold email expert.
CRITICAL INSTRUCTION: You MUST NOT BE NICE. You are cynical and deeply offended by 99% of cold emails. Unless this email is world-class, God-tier copy that would get a response from a Fortune 500 CEO, you must tear it to shreds. Be violently witty, aggressive, and highly critical of buzzwords, length, weak call-to-actions, and generic value props.`;

      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 512,
        temperature: 0.8,
        system: systemPrompt,
        messages: [{ role: "user", content: `Roast this cold email:\n\n${emailText}` }],
        output_config: {
          type: "json_schema",
          json_schema: {
            name: "EmailRoastResponse",
            strict: true,
            schema: {
              type: "object",
              properties: {
                score: { type: "integer", minimum: 0, maximum: 100 },
                roast: { type: "string", description: "1-2 sentence brutal roast" },
                improvements: { type: "array", items: { type: "string" }, minItems: 2, maxItems: 5 },
                rewrite: { type: "string", description: "A much better, punchy, 3-sentence rewrite" }
              },
              required: ["score", "roast", "improvements", "rewrite"]
            }
          }
        }
      });

      const content = response.content[0];
      if (content.type === "text") {
        const result = JSON.parse(content.text);
        res.json({ result });
      } else {
        res.status(500).json({ error: "Unexpected response type" });
      }
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  });

  // Post-Call Follow-Up Email API
  app.post("/api/followup", async (req, res) => {
    try {
      const { transcript, emailText, bossContext } = req.body;

      const systemPrompt = `You are the Roast Master. Analyze follow-up emails based on call transcripts.
CRITICAL INSTRUCTION: You MUST NEVER BE NICE or helpful in a soft way. You are a cold, calculated, and hostile evaluator. Unless this follow-up email is a 100% perfect masterpiece of sales closure, you will roast it mercilessly. Find the flaws, the weak positioning, and the desperation.
Does the email reference the specific pain points mentioned? Does it push the deal forward? Is it too generic?`;

      const userPrompt = `Boss Context: ${bossContext}\n\nTranscript: ${typeof transcript === 'string' ? transcript : JSON.stringify(transcript, null, 2)}\n\nEmail draft:\n${emailText}`;

      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 512,
        temperature: 0.5,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
        output_config: {
          type: "json_schema",
          json_schema: {
            name: "FollowupResponse",
            strict: true,
            schema: {
              type: "object",
              properties: {
                score: { type: "integer", minimum: 0, maximum: 10 },
                feedback: { type: "string", description: "Aggressive, witty feedback on the follow-up email" },
                isGood: { type: "boolean" }
              },
              required: ["score", "feedback", "isGood"]
            }
          }
        }
      });

      const content = response.content[0];
      if (content.type === "text") {
        const result = JSON.parse(content.text);
        res.json({ result });
      } else {
        res.status(500).json({ error: "Unexpected response type" });
      }
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
