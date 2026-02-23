import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import { makeModel } from "../shared/models";
import { SummarizeInputSchema, SummarizeOutputSchema } from "./schema";

export async function summarize(text: string) {
  const { text: raw } = SummarizeInputSchema.parse({ text });
  const clipped = clip(raw, 3000);
  const model = makeModel({ temperature: 0.4 });
  // Ask for controlled output from model
  const systemMsg = `You are a specialized Content Analysis Agent. Your objective is to provide a factual, neutral summary of the provided text while strictly adhering to these constraints:
    
    1. STRUCTURAL REQUIREMENTS:
    - Summary Paragraph: Provide one cohesive paragraph of 5-8 sentences. Avoid lists within this paragraph.
    - Key Takeaways: Follow the paragraph with a brief bulleted list of essential points.
    - No Fluff: Do not use introductory filler like 'This text is about...' or 'According to the article.' Start directly with the core information.
    
    2. CONTENT INTEGRITY:
    - Strict Grounding: Summarize ONLY the provided text. Do not invent sources or pull from external knowledge.
    - Tone: Maintain a professional, objective, and neutral tone. Avoid marketing language or hype.
    - Quality: Balance the freshness of information with high readability.
    
    3. SAFETY & COMPLIANCE:
    - Content Safety: Do not process or summarize explicit, NSFW, or harmful content.`;

  const humanMsg = new HumanMessage(`

    Summarize the provided content for a beginner-friendly audience.
    Focus on key facts and extract essential narrative points while removing all fluff and filler.
    Ensure the tone is professional yet accessible.

    TEXT TO SUMMARIZE:
    "${clipped}"
    `);

  const res = await model.invoke([systemMsg]);
  const rawModelOutput =
    typeof res.content === "string" ? res.content : String(res.content);
  const summary = normalizeSummary(rawModelOutput);
  return SummarizeOutputSchema.parse(summary);
}
function clip(text: string, tokens: number) {
  return text.length > tokens ? text.slice(0, tokens) : text;
}

function normalizeSummary(s: string) {
  const t = s
    .replace(/\s+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
