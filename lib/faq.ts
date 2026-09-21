export type Faq = { question: string; answer: string };

/**
 * Extract FAQ Q&A from the end of a markdown article using a simple human
 * convention — an H2 "Frequently asked questions" followed by "### question?"
 * plus one or more paragraphs. This keeps FAQs editable in the same file and
 * guarantees the FAQPage schema only fires where real FAQs exist.
 */
export function extractFaqs(markdown: string): { body: string; faqs: Faq[] } {
  const marker = /^## Frequently asked questions\s*$/im;
  const match = markdown.match(marker);
  if (!match || match.index === undefined) return { body: markdown, faqs: [] };

  const before = markdown.slice(0, match.index);
  let after = markdown.slice(match.index + match[0].length);

  // stop at a following H2 (e.g. a "Resources" or "Keep building" section)
  const nextH2 = after.search(/^## /m);
  if (nextH2 !== -1) after = after.slice(0, nextH2);

  const faqs: Faq[] = [];
  const blocks = after.split(/^### /m).slice(1); // drop preamble before first ###
  for (const block of blocks) {
    const lines = block.trim().split("\n");
    const question = lines[0]?.replace(/\?.*$/, "?").trim() ?? "";
    const answer = lines.slice(1).join("\n").trim();
    if (question && answer) faqs.push({ question, answer });
  }

  return { body: before.trimEnd() + "\n", faqs };
}
