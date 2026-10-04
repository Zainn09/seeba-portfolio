/**
 * Structured data builders (schema.org via JSON-LD).
 *
 * Rules followed here:
 *  - Only facts that are visible on the page are described.
 *  - `sameAs` is populated only from real configured profiles (see lib/site).
 *  - No ratings, reviews, awards, employer or experience claims are invented.
 *  - One `@id` per entity so Person / WebSite / Article nodes can reference
 *    each other instead of being duplicated across pages.
 */
import { SITE, SAME_AS, SEO } from "./site";
import { absoluteUrl, articlePath, paths } from "./urls";
import type { ArticleMeta } from "@/content/types";
import type { Hub } from "@/content/types";
import type { ProjectCaseStudy } from "@/content/projects";

export const PERSON_ID = `${SITE.baseUrl}/#person`;
export const WEBSITE_ID = `${SITE.baseUrl}/#website`;

type Node = Record<string, unknown>;

/** Abdul Haseeb — the entity the whole site is about. */
export function personNode(): Node {
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: SITE.name,
    alternateName: "Abdul Haseeb (ABH)",
    url: absoluteUrl(paths.home),
    jobTitle: "BSCS Student · Python Developer",
    description:
      "BSCS student and Python developer building real software projects — console applications, responsive websites and an Android e-commerce app — while learning toward Artificial Intelligence and Machine Learning.",
    knowsAbout: [
      "Python",
      "Java",
      "HTML5",
      "CSS3",
      "XML",
      "Android development",
      "Firebase Authentication",
      "SQLite",
      "Git",
      "GitHub",
      "Artificial Intelligence",
      "Machine Learning",
    ],
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: SITE.university,
    },
    ...(SITE.city
      ? {
          homeLocation: {
            "@type": "Place",
            name: SITE.city,
          },
        }
      : {}),
    ...(SITE.portrait.src
      ? {
          image: {
            "@type": "ImageObject",
            url: absoluteUrl(SITE.portrait.src),
            width: SITE.portrait.width,
            height: SITE.portrait.height,
          },
        }
      : {}),
    ...(SAME_AS.length ? { sameAs: SAME_AS } : {}),
    ...(SITE.email ? { email: SITE.email } : {}),
  };
}

/** The website itself, published by the person. */
export function websiteNode(): Node {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: `${SITE.name} — Developer Portfolio & Notebook`,
    url: absoluteUrl(paths.home),
    description: SEO.description,
    inLanguage: "en",
    publisher: { "@id": PERSON_ID },
  };
}

/** Homepage: the person's profile page. */
export function profilePageNode(): Node {
  return {
    "@type": "ProfilePage",
    "@id": `${SITE.baseUrl}/#profile`,
    url: absoluteUrl(paths.home),
    name: SEO.title,
    description: SEO.description,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": PERSON_ID },
    dateModified: SITE.contentUpdated,
    inLanguage: "en",
  };
}

export function breadcrumbNode(items: { name: string; path: string }[]): Node {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function collectionPageNode({
  name,
  description,
  path,
  items,
}: {
  name: string;
  description: string;
  path: string;
  items: { name: string; path: string }[];
}): Node {
  return {
    "@type": "CollectionPage",
    "@id": `${absoluteUrl(path)}#collection`,
    url: absoluteUrl(path),
    name,
    description,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": PERSON_ID },
    inLanguage: "en",
    dateModified: SITE.contentUpdated,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: items.length,
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        url: absoluteUrl(item.path),
      })),
    },
  };
}

export function blogPostingNode(article: ArticleMeta, hub?: Hub): Node {
  const url = absoluteUrl(articlePath(article));
  return {
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: article.title,
    description: article.excerpt,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    datePublished: article.publishDate,
    dateModified: article.updatedDate ?? article.publishDate,
    author: { "@id": PERSON_ID },
    publisher: { "@id": PERSON_ID },
    image: {
      "@type": "ImageObject",
      url: absoluteUrl(article.socialPath ?? `/images/blog/${article.slug}.png`),
      width: 1200,
      height: 630,
    },
    articleSection: hub?.name ?? article.category,
    keywords: [article.primaryKeyword, ...article.secondaryKeywords].join(", "),
    wordCount: article.wordCount,
    inLanguage: "en",
    isPartOf: { "@id": WEBSITE_ID },
  };
}

export function faqNode(faqs: { question: string; answer: string }[]): Node {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

const LANGUAGE_LABELS: Record<string, string> = {
  Python: "Python",
  Java: "Java",
  HTML5: "HTML",
  CSS3: "CSS",
  XML: "XML",
};

/** A project the person built — described as source code, not as a product. */
export function softwareSourceCodeNode(project: ProjectCaseStudy): Node {
  const url = absoluteUrl(paths.project(project.slug));
  const languages = project.tech
    .map((tech) => LANGUAGE_LABELS[tech])
    .filter((value): value is string => Boolean(value));

  return {
    "@type": "SoftwareSourceCode",
    "@id": `${url}#project`,
    name: project.name,
    description: project.summary,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: { "@id": PERSON_ID },
    creator: { "@id": PERSON_ID },
    ...(languages.length
      ? { programmingLanguage: languages.length === 1 ? languages[0] : languages }
      : {}),
    ...(project.repoUrl ? { codeRepository: project.repoUrl } : {}),
    keywords: project.keywords.join(", "),
    inLanguage: "en",
    isPartOf: { "@id": WEBSITE_ID },
  };
}

/** Wrap nodes into a single JSON-LD graph. */
export function graph(nodes: Node[]): Node {
  return { "@context": "https://schema.org", "@graph": nodes };
}
