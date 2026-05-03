import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

/**
 * Sends a base64 image to Gemini 1.5 Flash to extract handwritten poem text.
 * Returns cleaned text with line breaks preserved.
 */
export async function extractHandwriting(imageBase64: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const result = await model.generateContent([
    {
      inlineData: {
        mimeType: "image/jpeg",
        data: imageBase64,
      },
    },
    `You are a handwriting transcription assistant for a poetry app.
Extract all handwritten text from this image exactly as written.
Preserve line breaks as they appear in the poem.
Fix obvious cursive letter ambiguities but do not change words.
Return only the poem text — no commentary, no labels, no quotes.`,
  ]);

  return result.response.text().trim();
}
