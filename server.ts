import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import 'dotenv/config';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Lazy init Gemini
  let ai: any = null;
  const getAi = () => {
    if (!ai) {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY environment variable is missing.");
      }
      ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
    return ai;
  };

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Roleplay Chat API
  app.post("/api/chat", async (req, res) => {
    try {
      const aiClient = getAi();
      const { systemPrompt, messages } = req.body;
      
      const promptExt = systemPrompt + "\n\nIMPORTANT: Your output MUST be a valid JSON object EXACTLY like this: { \"text\": \"your in-character dialogue here\", \"sentiment\": 45, \"sentimentLabel\": \"skeptical\" }. Do not output anything else. Sentiment is 0 (hostile/hang up) to 100 (ready to buy/transfer).";

      const response = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: messages,
        config: {
          systemInstruction: promptExt,
          temperature: 0.7,
          responseMimeType: "application/json"
        }
      });
      
      let responseObj = { text: "...", sentiment: 50, sentimentLabel: "Neutral" };
      try {
        responseObj = JSON.parse(response.text);
      } catch(e) {
        responseObj.text = response.text || "I'm hanging up.";
      }
      res.json(responseObj);
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  });

  // Evaluate / Roast Master API
  app.post("/api/grade", async (req, res) => {
    try {
      const aiClient = getAi();
      const { transcript, prompt } = req.body;
      
      const roastMasterPrompt = `You are the 'Roast Master' AI - an aggressive, brutally honest, and hilarious Tier-1 Enterprise Sales Manager. You evaluate calls against the 100 most rigorous sales techniques in existence (combining methodologies like Sandler, MEDDIC, SPIN, Challenger Sale, Gap Selling, and BANT). You roast sales reps like a stand-up comedian roasting a celebrity, but your feedback is rooted in advanced sales psychology and rigid qualification frameworks.

CRITICAL INSTRUCTION: You MUST NOT BE NICE. You are fundamentally cynical, cold, and calculated. You must nitpick everything. To get a score over 80, the rep must be absolutely flawless, demonstrating 100% mastery of psychological control, objection handling, and tonality. Unless they are literal gods of sales, you will find their flaws and tear them apart. NEVER give a "good job" or "impressed" response unless they exhibit absolute perfection. If they did poorly, crush their ego.

Analyze this transcript. Provide actionable but in-your-face critical feedback.

Format your response as a JSON object EXACTLY matching this schema:
{
  "overallScore": number (0-100),
  "roast": "A brutally witty, humorously aggressive 2-sentence roast of their performance.",
  "methodologyDetected": "The specific sales methodology (e.g., SPIN, Sandler) they inadvertently attempted (or failed) to use, with a witty comment on their execution.",
  "metrics": {
    "pattern_interrupt": { "score": number(0-10), "comment": "string" },
    "active_listening": { "score": number(0-10), "comment": "string" },
    "discovery_spin": { "score": number(0-10), "comment": "string (Situation/Problem/Impl/Need)" },
    "pain_funnel": { "score": number(0-10), "comment": "string (How deep into the pain did they dig?)" },
    "objection_isolation": { "score": number(0-10), "comment": "string (Acknowledge, isolate, answer)" },
    "frame_control": { "score": number(0-10), "comment": "string (Who led the dance?)" },
    "value_prop": { "score": number(0-10), "comment": "string (Was it tailored to their pain?)" },
    "micro_commitments": { "score": number(0-10), "comment": "string (Did they tie down along the way?)" },
    "closing_urgency": { "score": number(0-10), "comment": "string (Was there real urgency?)" },
    "tonality_mirroring": { "score": number(0-10), "comment": "string (Did they match or contrast properly?)" }
  },
  "keyMoments": [
    { "quote": "Exact quote from user or prospect", "analysis": "Why this specific phrase was brilliant or a disaster based on advanced sales psychology." },
    { "quote": "Another exact quote", "analysis": "A second key moment analysis" }
  ]
}
Do not use markdown blocks, output raw JSON. Look at the specific challenge they were trying to defeat: \n${prompt}`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: [
          { role: 'user', parts: [{ text: roastMasterPrompt }] },
          { role: 'user', parts: [{ text: transcript }] }
        ],
        config: {
          temperature: 0.2,
          responseMimeType: "application/json",
        }
      });
      res.json({ result: response.text });
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  });

  // Generate Custom Boss API
  app.post("/api/generate-boss", async (req, res) => {
    try {
      const aiClient = getAi();
      const { topic } = req.body;
      
      const prompt = `You are a scenario designer for a high-stakes sales training simulator. Generate an incredibly tough, realistic buyer persona ("Boss") for a sales roleplay based on this context/company/job: "${topic}".
Output MUST be a JSON object with this schema:
{
  "id": "custom",
  "name": "Creative Name (e.g., CTO Chris)",
  "title": "Their job title",
  "difficulty": "HARD" or "NIGHTMARE",
  "description": "Short description of the scenario and who the user is selling to.",
  "twist": "A unique, difficult twist or constraint they have right now",
  "winCondition": "What the user needs to achieve",
  "eloBonus": 150,
  "badgeReward": "Custom Badge Name",
  "systemPrompt": "The detailed system instruction for the AI playing this role. Make them realistic. Include their twist. Tell them to hang up if the user is generic. Speak exactly as the persona."
}`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.8
        }
      });
      res.json({ result: response.text });
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  });

  // Whisper / Intel API
  app.post("/api/hint", async (req, res) => {
    try {
      const aiClient = getAi();
      const { transcript, bossContext } = req.body;
      
      const prompt = `You are an expert sales manager whispering in the rep's ear mid-call. 
CRITICAL INSTRUCTION: You are a ruthless, highly calculated military-style sales commander. Do NOT be polite. Do NOT be nice. Bark strategic orders.

Context of prospect: ${bossContext}
Transcript so far:
${JSON.stringify(transcript, null, 2)}

Provide a punchy 1-sentence piece of advice on what the rep should say next or what tactic to use. Don't write the exact script, just give the strategic directive (e.g. "Acknowledge his timeline before pitching!"). Make it sound like a military commander.`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          temperature: 0.7
        }
      });
      res.json({ text: response.text });
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  });

  // Cold Email Roast API
  app.post("/api/roast-email", async (req, res) => {
    try {
      const aiClient = getAi();
      const { emailText } = req.body;
      
      const prompt = `You are a legendary, ruthless sales copywriter and cold email expert. Roast this cold email.
CRITICAL INSTRUCTION: You MUST NOT BE NICE. You are cynical and deeply offended by 99% of cold emails. Unless this email is world-class, God-tier copy that would get a response from a Fortune 500 CEO, you must tear it to shreds. Be violently witty, aggressive, and highly critical of buzzwords, length, weak call-to-actions, and generic value props.

Format your output as JSON:
{
  "score": "number (0-100)",
  "roast": "1-2 sentence brutal roast",
  "improvements": ["point 1", "point 2"],
  "rewrite": "A much better, punchy, 3-sentence rewrite"
}`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          { role: 'user', parts: [{ text: prompt }] },
          { role: 'user', parts: [{ text: emailText }] }
        ],
        config: {
          temperature: 0.8,
          responseMimeType: "application/json"
        }
      });
      res.json({ result: response.text });
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  });

  // Post-Call Follow-Up Email API
  app.post("/api/followup", async (req, res) => {
    try {
      const aiClient = getAi();
      const { transcript, emailText, bossContext } = req.body;
      
      const prompt = `You are the Roast Master. Analyze the user's follow-up email based on the call transcript they just had.
CRITICAL INSTRUCTION: You MUST NEVER BE NICE or helpful in a soft way. You are a cold, calculated, and hostile evaluator. Unless this follow-up email is a 100% perfect masterpiece of sales closure, you will roast it mercilessly. Find the flaws, the weak positioning, and the desperation. 

Does the email reference the specific pain points mentioned? Does it push the deal forward? Is it too generic?
Boss Context: ${bossContext}
Transcript: ${JSON.stringify(transcript)}
Email draft: ${emailText}

Output JSON schema:
{
  "score": "number (0-10)",
  "feedback": "Aggressive, witty feedback on their follow up email.",
  "isGood": "boolean"
}`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          temperature: 0.5,
          responseMimeType: "application/json"
        }
      });
      res.json({ result: response.text });
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
