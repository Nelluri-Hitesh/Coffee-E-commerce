"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { useCart } from "@/components/cart/cart-provider";

const NAV = [
  { href: "/shop", label: "Shop all" },
  { href: "/shop?collection=study-fuel", label: "Study fuel" },
  { href: "/shop?collection=single-estate", label: "Single estate" },
  { href: "/shop?collection=gift-kits", label: "Gift kits" },
];

export function SiteHeader() {
  const { count, openCart, hydrated, pulse } = useCart();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [bump, setBump] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (pulse === 0) return;
    setBump(true);
    const timer = setTimeout(() => setBump(false), 420);
    return () => clearTimeout(timer);
  }, [pulse]);

  return (
    <>
      <div className="relative z-[60] overflow-hidden bg-espresso text-crema">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 px-4 py-2 text-[0.7rem] tracking-[0.14em] uppercase sm:text-xs">
          <span className="hidden sm:inline text-caramel">★</span>
          <p className="text-crema/85">
            Free delivery over ₹999 · Extra 10% off with code{" "}
            <span className="font-semibold text-caramel">STUDENT10</span>
          </p>
        </div>
      </div>

      <header
        className={`sticky top-0 z-[65] transition-all duration-500 ${
          scrolled
            ? "border-b border-espresso/10 bg-crema/85 backdrop-blur-xl"
            : "border-b border-transparent bg-crema"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <Link href="/" className="group flex items-center gap-3">
              <span className="relative grid size-10 place-items-center rounded-full bg-espresso text-crema transition-transform duration-500 group-hover:-rotate-12">
                <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.4">
                  <path d="M4 9h12v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V9Z" strokeLinecap="round" />
                  <path d="M16 10h1.8a2.7 2.7 0 0 1 0 5.4H16" strokeLinecap="round" />
                  <path d="M8 3.5c0 1.2 1.2 1.6 1.2 2.8M12 3.5c0 1.2 1.2 1.6 1.2 2.8" strokeLinecap="round" />
                </svg>
              </span>
              <span className="leading-none">
                <span className="block font-display text-xl tracking-tight text-espresso">
                  Jaitra
                </span>
                <span className="block text-[0.6rem] uppercase tracking-[0.32em] text-espresso/45">
                  Coffee Roasters
                </span>
              </span>
            </Link>

            <nav className="hidden items-center gap-7 lg:flex">
              {NAV.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="link-underline text-sm font-medium text-espresso/75 transition hover:text-espresso"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/shop"
              className="hidden text-sm font-medium text-espresso/70 transition hover:text-espresso sm:block"
            >
              <span className="sr-only">Search the shop</span>
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6">
                <circle cx="11" cy="11" r="6.5" />
                <path d="m16 16 4.5 4.5" strokeLinecap="round" />
              </svg>
            </Link>

            <button
              type="button"
              onClick={openCart}
              className="relative inline-flex items-center gap-2 rounded-full border border-espresso/15 px-4 py-2.5 text-sm font-semibold text-espresso transition hover:border-espresso hover:bg-espresso hover:text-crema"
            >
              <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M6 8h12l-1 11a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 8Z" strokeLinecap="round" />
                <path d="M9.2 8V6.4a2.8 2.8 0 0 1 5.6 0V8" strokeLinecap="round" />
              </svg>
              <span className="hidden sm:inline">Bag</span>
              {hydrated && count > 0 && (
                <span
                  key={pulse}
                  className={`grid min-w-5 place-items-center rounded-full bg-caramel px-1.5 text-[0.68rem] font-bold text-espresso tabular-nums ${
                    bump ? "animate-pop" : ""
                  }`}
                >
                  {count}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              className="grid size-10 place-items-center rounded-full border border-espresso/15 text-espresso transition hover:border-espresso/40 lg:hidden"
            >
              <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.7">
                {menuOpen ? (
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                ) : (
                  <path d="M4 8h16M4 15h16" strokeLinecap="round" />
                )}
              </svg>
            </button>
          </div>
        </div>

        <div
          className={`overflow-hidden border-espresso/10 bg-crema transition-[max-height,opacity] duration-500 lg:hidden ${
            menuOpen ? "max-h-80 border-t opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <nav className="flex flex-col px-4 pb-5 pt-3 sm:px-6">
            {NAV.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="border-b border-espresso/5 py-3 font-display text-lg text-espresso"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/checkout"
              className="py-3 text-sm font-semibold uppercase tracking-[0.18em] text-caramel-deep"
            >
              Checkout
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
}
