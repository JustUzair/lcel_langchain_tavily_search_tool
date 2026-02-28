import { RunnableBranch, RunnableSequence } from "@langchain/core/runnables";
import { AgentMode } from "./types";
import { directPath as directPipeline } from "./pipelines/direct";
import { webPipeline } from "./pipelines/web";
import { routeStep } from "./routeStrategy";
import { finalValidateAndPolish } from "./validate";
import { SearchInput } from "../utils/schema";

const branch = RunnableBranch.from<
  {
    query: string;
    mode: AgentMode;
  },
  any
>([[input => input.mode === "web", webPipeline], directPipeline]);

export const searchChain = RunnableSequence.from([
  routeStep,
  branch,
  finalValidateAndPolish,
]);

export async function runSearch(input: SearchInput) {
  return await searchChain.invoke(input);
}
