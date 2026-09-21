import { pythonAdditions } from "./a-python";
import { aimlAdditions } from "./b-aiml";

/**
 * Aggregated additive sections keyed by article slug. The compiler splices
 * these in before the FAQ/outro so every article clears the word target.
 */
export type AdditionsMap = Record<string, string>;

export const additions: AdditionsMap = {
  ...pythonAdditions,
  ...aimlAdditions,
  // further pillars appended as they are authored
};
