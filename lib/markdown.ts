import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";

export type Heading = { id: string; text: string; level: number; children: Heading[] };

/**
 * Serialize markdown (with GFM tables, fenced code + highlighted languages,
 * and raw HTML callouts) into an HTML string. Returns headings so the article
 * page can render a nested table of contents.
 */
export async function markdownToHtml(markdown: string): Promise<{ html: string; headings: Heading[] }> {
  const headings: Heading[] = [];
  const stack: Heading[] = [];

  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(() => (tree) => {
      // extract headings while still in mdast
      for (const node of tree.children) {
        if (node.type === "heading") {
          const text = plainText(node as never);
          const heading: Heading = {
            id: "",
            text,
            level: node.depth,
            children: [],
          };
          while (stack.length && stack[stack.length - 1].level >= node.depth) stack.pop();
          if (stack.length === 0) headings.push(heading);
          else stack[stack.length - 1].children.push(heading);
          if (node.depth >= 2) stack.push(heading);
        }
      }
    })
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeSlug)
    .use(rehypeHighlight, { detect: false, ignoreMissing: true })
    .use(rehypeStringify)
    .process(markdown);

  // match slug ids back onto the extracted headings
  const html = String(file);
  assignIds(headings, html);

  return { html, headings };
}

function assignIds(list: Heading[], html: string) {
  for (const h of list) {
    // github-slugger style: lowercase, strip punctuation, spaces → dashes
    const probe = h.text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/[\s_-]+/g, "-");
    h.id = html.includes(`id="${probe}"`) ? probe : "";
    assignIds(h.children, html);
  }
}

/** Build a plain-text label from a mdast heading's children. */
function plainText(node: { children?: { type: string; value?: string }[] }): string {
  if (!node.children) return "";
  return node.children
    .map((c) => (c.type === "text" || c.type === "inlineCode" ? c.value ?? "" : ""))
    .join("");
}

export function extractPlainText(markdown: string): string {
  // lightweight text extraction for search snippets
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[#>*`_\-[\]]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
