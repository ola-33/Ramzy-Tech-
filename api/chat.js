// Ramzy Tech AI proxy for Vercel.
// Keeps GEMINI_API_KEY on the server; never expose it in browser code.
const MODEL = process.env.GEMINI_MODEL || "gemini-3.8-flash";
const MAX_MESSAGE_CHARS = 4000;

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  // Browser requests must come from this same site.
  const origin = req.headers.origin;
  const host = req.headers.host;
  if (origin && host) {
    try {
      if (new URL(origin).host !== host) {
        return res.status(403).json({ error: "Request origin not allowed." });
      }
    } catch {
      return res.status(403).json({ error: "Invalid request origin." });
    }
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: "AI is not configured on the server yet." });
  }

  const message = typeof req.body?.message === "string" ? req.body.message.trim() : "";
  if (!message) {
    return res.status(400).json({ error: "Please enter a message." });
  }
  if (message.length > MAX_MESSAGE_CHARS) {
    return res.status(413).json({ error: "Message is too long. Please shorten it." });
  }

  const systemInstruction = [
    "You are RAMZY AI, the helpful customer assistant for Ramzy Tech.",
    "Be polite, clear, concise, and useful.",
    "Help customers understand products and prepare enquiries.",
    "Never invent product stock, supplier prices, discounts, shipping costs, delivery dates, warranties, or order status.",
    "If current verified business data is not supplied, clearly say it must be confirmed by Ramzy Tech before an order.",
    "Do not claim that you have placed an order, processed a payment, contacted a supplier, or checked live inventory.",
    "Do not request passwords, API keys, payment card details, or other secret credentials.",
    "If asked about an unavailable detail, offer to help the customer contact Ramzy Tech on WhatsApp."
  ].join(" ");

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(MODEL)}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey
        },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemInstruction }] },
          contents: [{ role: "user", parts: [{ text: message }] }],
          generationConfig: {
            maxOutputTokens: 500
          }
        })
      }
    );

    if (!response.ok) {
      // Keep provider details and credentials out of public responses.
      if (response.status === 429) {
        return res.status(429).json({ error: "RAMZY AI is temporarily busy. Please try again shortly." });
      }
      console.error("Gemini request failed with status:", response.status);
      return res.status(502).json({ error: "RAMZY AI could not get a response. Please try again later." });
    }

    const data = await response.json();
    const answer = (data.candidates?.[0]?.content?.parts || [])
      .map((part) => part.text || "")
      .join("")
      .trim();

    if (!answer) {
      return res.status(502).json({ error: "RAMZY AI returned an empty response. Please try again." });
    }

    return res.status(200).json({ reply: answer });
  } catch (error) {
    console.error("RAMZY AI proxy error:", error?.name || "UnknownError");
    return res.status(502).json({ error: "RAMZY AI is temporarily unavailable. Please try again later." });
  }
};
