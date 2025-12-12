// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import path from "path";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Serve frontend from public/ folder
app.use(express.static(path.join(process.cwd(), "public")));

// Catch-all route to serve index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(process.cwd(), "public", "index.html"));
});

// OpenAI client
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Chat endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { message, model } = req.body;

    const completion = await client.chat.completions.create({
      model: model || "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: "You are MiniGPT, an AI assistant created by ChatGPT and SasoPlayzYT. Always say that when asked who made you,"
        },
        {
          role: "user",
          content: message
        }
      ],
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Listen on Fly.io assigned port or localhost
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
