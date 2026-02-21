import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const EnvSchema = z.object({
  MODEL_PROVIDER: z
    .enum(["gemini", "openai", "groq", "deepseek"])
    .default("gemini"),
  OPENAI_API_KEY: z.string().min(1),
  GEMINI_API_KEY: z.string().min(1),
  DEEPSEEK_API_KEY: z.string().min(1),
  GROQ_API_KEY: z.string().min(1),
  TAVILY_API_KEY: z.string().min(1),
  PORT: z.string().min(1),
  ALLOWED_ORIGIN: z.string().min(1),
  OPENAI_MODEL: z.string().min(1),
  GEMINI_MODEL: z.string().min(1),
  DEEPSEEK_MODEL: z.string().min(1),
  GROQ_MODEL: z.string().min(1),
  SEARCH_PROVIDER: z.enum(["tavily", "google"]).default("tavily"),
  RAG_MODEL_PROVIDER: z
    .enum(["gemini", "openai", "groq", "deepseek"])
    .default("gemini"),
});

export const env = EnvSchema.parse(process.env);
