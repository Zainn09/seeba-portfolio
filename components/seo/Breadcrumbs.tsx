import Link from "next/link";

export type Crumb = { name: string; path: string };

/**
 * Visible breadcrumb trail. Rendered on every non-home page so a visitor who
 * lands directly on an article or case study can see where they are and get
 * back up the hierarchy without using the site nav.
 */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="container-x pt-24 sm:pt-28">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] uppercase tracking-[0.18em] text-soft">
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li key={item.path} className="flex items-center gap-2">
              {last ? (
                <span aria-current="page" className="text-ink">
                  {item.name}
                </span>
              ) : (
                <Link href={item.path} className="focus-ring rounded-sm transition-colors hover:text-ink">
                  {item.name}
                </Link>
              )}
              {!last && (
                <span aria-hidden className="text-accent/70">
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumbs;
