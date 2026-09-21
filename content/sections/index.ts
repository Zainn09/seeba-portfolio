import { pythonAdditions } from "./a-python";
import { aimlAdditions } from "./b-aiml";
import { projectsAdditions } from "./c-projects";
import { softwareAdditions } from "./d-software";

/**
 * Aggregated additive sections keyed by article slug. The compiler splices
 * these in before the FAQ/outro so every article clears the word target.
 */
export type AdditionsMap = Record<string, string>;

export const additions: AdditionsMap = {
  ...pythonAdditions,
  ...aimlAdditions,
  ...projectsAdditions,
  ...softwareAdditions,
  // further pillars appended as they are authored
};
