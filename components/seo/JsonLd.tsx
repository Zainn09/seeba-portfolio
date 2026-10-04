/**
 * Renders a JSON-LD graph. `<` is escaped so a stray character in content can
 * never break out of the script tag. Server component — no client JS.
 */
export function JsonLd({ data }: { data: unknown }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
