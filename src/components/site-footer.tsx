import Link from "next/link";

const COLUMNS = [
  {
    title: "Shop",
    links: [
      { label: "All coffee", href: "/shop" },
      { label: "Study fuel", href: "/shop?collection=study-fuel" },
      { label: "Single estate", href: "/shop?collection=single-estate" },
      { label: "Quick brew", href: "/shop?collection=quick-brew" },
      { label: "Gift kits & decaf", href: "/shop?collection=gift-kits" },
    ],
  },
  {
    title: "Roast notes",
    links: [
      { label: "Light roasts", href: "/shop?roast=Light" },
      { label: "Medium roasts", href: "/shop?roast=Medium" },
      { label: "Dark roasts", href: "/shop?roast=Dark" },
      { label: "Decaf", href: "/shop?caffeine=Decaf" },
      { label: "Bestsellers", href: "/shop?sort=rating" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Shipping & delivery", href: "/shop" },
      { label: "Brew guides", href: "/shop?grind=Filter+%2F+Pour+Over" },
      { label: "Student discount", href: "/checkout" },
      { label: "Your bag", href: "/checkout" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="relative mt-24 overflow-hidden bg-espresso text-crema">
      <div className="pointer-events-none absolute -left-24 -top-24 size-[22rem] rounded-full bg-caramel/20 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-full border border-crema/25">
                <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.4">
                  <path d="M4 9h12v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V9Z" strokeLinecap="round" />
                  <path d="M16 10h1.8a2.7 2.7 0 0 1 0 5.4H16" strokeLinecap="round" />
                </svg>
              </span>
              <span className="font-display text-2xl">Jaitra Coffee</span>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-crema/65">
              Roasted in small batches in Bengaluru for the people who study past
              midnight. Traceable farms, honest prices, and a bag stamped with the
              day it was actually roasted.
            </p>
            <form className="mt-7 flex max-w-sm items-center gap-2 rounded-full border border-crema/20 p-1.5 focus-within:border-caramel">
              <input
                type="email"
                required
                placeholder="you@college.edu"
                aria-label="Email address"
                className="min-w-0 flex-1 bg-transparent px-4 py-2 text-sm text-crema placeholder:text-crema/40 focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-full bg-caramel px-5 py-2 text-sm font-semibold text-espresso transition hover:bg-crema"
              >
                Join
              </button>
            </form>
            <p className="mt-2 text-xs text-crema/40">
              Brew notes and student-only drops. One email a fortnight.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {COLUMNS.map((column) => (
              <div key={column.title}>
                <h3 className="eyebrow text-caramel">{column.title}</h3>
                <ul className="mt-4 space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="link-underline text-sm text-crema/70 transition hover:text-crema"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-crema/12 pt-6 text-xs text-crema/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Jaitra Coffee Roasters. Demo storefront.</p>
          <p className="flex items-center gap-4">
            <span>Roasted in Bengaluru</span>
            <span aria-hidden>·</span>
            <span>Shipped across India</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
