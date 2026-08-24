import express from "express";
import OpenAI from "openai";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const port = Number(process.env.ASSISTANT_PORT || process.env.PORT || 8787);
const maxMessageLength = 700;
const restaurantTerms = ["cheeseful", "bite", "menu", "food", "order", "price", "rs", "rupee", "delivery", "pickup", "location", "address", "wah", "phone", "call", "whatsapp", "hour", "time", "open", "close", "paratha", "shawarma", "wrap", "wing", "strip", "drink", "cola", "onion", "cheese", "crispy", "zinger", "review", "rating", "favourite", "favorite", "account", "sign in", "sign up", "profile", "availability", "available", "owner", "restaurant", "contact"];
const greetingPattern = /^(hi|hello|hey|assalam(?:ualaikum| o alaikum)|salam|thanks|thank you)[!.,\s]*$/i;
const scopeReply = "I’m the Cheeseful Bites assistant. I can help only with our menu, prices, ordering, delivery, location, hours, account help, and customer feedback.";

function isRestaurantQuestion(content) {
  const normalized = content.trim().toLowerCase();
  return greetingPattern.test(normalized) || restaurantTerms.some((term) => normalized.includes(term));
}

function restaurantInput(history, message) {
  const cleanHistory = Array.isArray(history) ? history.slice(-8).filter((entry) => entry && (entry.role === "user" || entry.role === "assistant") && typeof entry.content === "string").map((entry) => `${entry.role === "assistant" ? "Restaurant assistant" : "Customer"}: ${entry.content.slice(0, maxMessageLength)}`).join("\n") : "";
  return `You are the professional Cheeseful Bites restaurant assistant for Wah Model Town, Pakistan. Answer ONLY questions about Cheeseful Bites: menu, current prices and availability supplied in conversation, ordering, WhatsApp ordering, pickup, delivery guidance, location, phone number, hours, account help, favourites, reviews, and owner information. If unrelated, say you only help with Cheeseful Bites restaurant matters. Never provide general knowledge, news, coding, medical, legal, political, financial, or unrelated advice. Never invent menu items, prices, availability, delivery times, policies, credentials, promotions, or reviews. Keep answers concise and helpful. Restaurant facts: Cheeseful Bites is a Hotel/Restaurant at QP8J+V6R, Lane 21, Phase-II Wah Model Town, Wah, 47010, Pakistan. Phone and WhatsApp: +92 328 8681123. Owner: Abdul Ahad. Hours: daily 03:00 PM–03:00 AM. Customers can send cart details to WhatsApp. New accounts are customers by default; trusted operators assign admins in Supabase. Reviews are genuine customer submissions and need owner approval.\n\nConversation context:\n${cleanHistory || "No prior messages."}\n\nCustomer: ${message}\nRestaurant assistant:`;
}

app.use(express.json({ limit: "32kb" }));
app.post("/api/restaurant-assistant", async (req, res) => {
  const message = typeof req.body?.message === "string" ? req.body.message.trim() : "";
  if (!message || message.length > maxMessageLength) return res.status(400).json({ error: "Please send a short restaurant question." });
  if (!isRestaurantQuestion(message)) return res.json({ reply: scopeReply, source: "scope" });
  if (!process.env.GROQ_API_KEY) return res.status(503).json({ error: "Set GROQ_API_KEY on the server before using the restaurant assistant." });

  try {
    const groq = new OpenAI({ apiKey: process.env.GROQ_API_KEY, baseURL: "https://api.groq.com/openai/v1" });
    const response = await groq.responses.create({ model: "openai/gpt-oss-20b", input: restaurantInput(req.body?.history, message) });
    const reply = response.output_text?.trim() || response.output?.flatMap((item) => item.content ?? []).filter((item) => item.type === "output_text" && typeof item.text === "string").map((item) => item.text.trim()).filter(Boolean).join("\n");
    if (!reply) return res.status(502).json({ error: "I couldn’t prepare a restaurant answer right now. Please call or message +92 328 8681123 for immediate help." });
    return res.json({ reply: reply.slice(0, 1600), source: "groq" });
  } catch (error) {
    console.error("[Restaurant Assistant] Groq error", error);
    return res.status(502).json({ error: "I can’t reach the restaurant assistant right now. Please call or message +92 328 8681123 for immediate help." });
  }
});

if (process.env.NODE_ENV === "production") {
  const dist = path.join(root, "dist");
  app.use(express.static(dist));
  app.get("*", (_req, res) => res.sendFile(path.join(dist, "index.html")));
}

app.listen(port, () => console.log(`Cheeseful Bites server listening on http://localhost:${port}`));
