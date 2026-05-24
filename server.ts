import express from "express";
import path from "path";
import { generateAiSuggestion, getAiSuggestionError } from "./server/aiSuggest";

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// REST secure API endpoint for student study suggestions
app.post("/api/ai/suggest", async (req, res) => {
  try {
    const text = await generateAiSuggestion(req.body);
    res.json({ text });
  } catch (error) {
    const { message, statusCode } = getAiSuggestionError(error);
    console.error("Gemini AI integration error:", message);
    res.status(statusCode).json({
      error: message,
      isMisconfigured: !process.env.GEMINI_API_KEY,
    });
  }
});

// App initialization logic wraps Vite middleware
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`MoTrack Full-Stack engine active on port http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error("Error launching MoTrack engine:", err);
});
