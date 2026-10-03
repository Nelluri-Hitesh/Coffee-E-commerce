import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-28 text-center">
      <p className="text-5xl">☕️</p>
      <h1 className="mt-6 font-display text-4xl text-espresso">
        This shelf is empty
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-espresso/60">
        The page you were looking for has been moved, sold out, or never existed.
        The good news: there are fourteen very good bags waiting nearby.
      </p>
      <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/shop"
          className="rounded-full bg-espresso px-7 py-3.5 text-sm font-semibold text-crema transition hover:bg-caramel-deep"
        >
          Browse the shop
        </Link>
        <Link
          href="/"
          className="rounded-full border border-espresso/20 px-7 py-3.5 text-sm font-semibold text-espresso transition hover:border-espresso"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
