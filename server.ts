import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import 'dotenv/config';
import { createApiApp } from "./serverApp";

// Local dev / self-hosted server. (On Vercel the API is served by
// api/[...path].ts and the frontend by Vercel's static hosting — this file
// is not used there.)
async function startServer() {
  const app = express();
  const PORT = 3000;

  // Mount the 6 /api endpoints.
  app.use(createApiApp());

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
