// Vercel serverless catch-all: every /api/* request is handled by the shared
// Express app. Exporting an Express app as the default handler is supported by
// @vercel/node (an Express app is itself a (req, res) handler).
import { createApiApp } from "../serverApp";

export default createApiApp();
