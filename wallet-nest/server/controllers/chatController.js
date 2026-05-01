import process from 'node:process';

const GEMINI_KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

const MENTOR_SYSTEM = `You are WalletNest's AI Finance Mentor: concise, encouraging, and practical.
You speak in short paragraphs. Use Indian Rupees (Rs) when mentioning money.
Never invent specific transaction line items; you may reference aggregates the user provides.
If spending looks high vs budget, give one clear next step. No medical or legal advice.`;

async function geminiGenerate({ messages, financeContext }) {
  const contents = (messages || [])
    .filter((m) => m.role === 'user' || m.role === 'assistant')
    .map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(MODEL)}:generateContent?key=${encodeURIComponent(GEMINI_KEY)}`;

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: `${MENTOR_SYSTEM}\n\nUser finance snapshot:\n${financeContext || ''}` }],
      },
      contents,
      generationConfig: { temperature: 0.65, maxOutputTokens: 1024 },
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data?.error?.message || res.statusText || 'Gemini error';
    throw new Error(msg);
  }
  const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).filter(Boolean).join('\n') || '';
  if (!text.trim()) throw new Error('Empty model response');
  return text.trim();
}

export const processChat = async (req, res, next) => {
  if (!GEMINI_KEY) {
    return res.status(503).json({ error: 'GEMINI_API_KEY is not set in .env' });
  }

  try {
    const text = await geminiGenerate(req.body ?? {});
    res.json({ text });
  } catch (error) {
    res.status(500).json({ error: String(error?.message || error) });
  }
};
