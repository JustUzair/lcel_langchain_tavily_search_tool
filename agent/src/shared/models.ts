import { ChatGroq } from "@langchain/groq";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatOpenAI } from "@langchain/openai";
import { ChatDeepSeek } from "@langchain/deepseek";
import type { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { env } from "./env.js";

type ModelOptions = {
  temperature?: number;
  maxTokens?: number;
};
export type Model =
  | ChatGoogleGenerativeAI
  | ChatGroq
  | ChatOpenAI
  | ChatDeepSeek;

export function makeModel(opts: ModelOptions = {}): BaseChatModel {
  const temperature = opts.temperature ?? 0.2;
  switch (env.MODEL_PROVIDER) {
    case "gemini":
      return new ChatGoogleGenerativeAI({
        apiKey: env.GEMINI_API_KEY!,
        model: env.GEMINI_MODEL!,
        temperature,
        maxOutputTokens: opts.maxTokens,
      });
    case "openai":
      return new ChatOpenAI({
        apiKey: env.OPENAI_API_KEY!,
        model: env.OPENAI_MODEL!,
        temperature,
        maxTokens: opts.maxTokens,
      });
    case "deepseek":
      return new ChatDeepSeek({
        apiKey: env.DEEPSEEK_API_KEY!,
        model: env.DEEPSEEK_MODEL!,
        temperature,
        maxTokens: opts.maxTokens,
      });

    case "groq":
    default:
      return new ChatGroq({
        apiKey: env.GROQ_API_KEY!,
        model: env.GROQ_MODEL!,
        temperature,
        maxTokens: opts.maxTokens,
      });
  }
}
