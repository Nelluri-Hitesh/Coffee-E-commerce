import Link from "next/link";
import type { Metadata } from "next";

import { ProductCard } from "@/components/product/product-card";
import {
  ShopControls,
  type ShopState,
} from "@/components/shop/shop-controls";
import {
  PRICE_BANDS,
  ROAST_FACETS,
  SORT_OPTIONS,
  type SortKey,
} from "@/lib/filters";
import {
  getCollectionCounts,
  getCollections,
  getProducts,
} from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop all coffee",
  description:
    "Browse every Jaitra roast — study fuel, single estate micro-lots, quick brew kits and gift bundles. Filter by roast, price, caffeine and grind.",
};

type SearchParams = Record<string, string | string[] | undefined>;

function toList(value: string | string[] | undefined) {
  if (!value) return [];
  const raw = Array.isArray(value) ? value : [value];
  return raw
    .flatMap((item) => item.split(","))
    .map((item) => item.trim())
    .filter(Boolean);
}

function toSingle(value: string | string[] | undefined) {
  if (!value) return "";
  return Array.isArray(value) ? (value[0] ?? "") : value;
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const collectionsParam = toList(params.collection);
  const roasts = toList(params.roast);
  const caffeine = toList(params.caffeine);
  const grinds = toList(params.grind);
  const bands = toList(params.price);
  const search = toSingle(params.q);
  const sortParam = toSingle(params.sort);

  const sort: SortKey = SORT_OPTIONS.some((option) => option.value === sortParam)
    ? (sortParam as SortKey)
    : "featured";

  const bandSelections = bands
    .map((value) => PRICE_BANDS.find((band) => band.value === value))
    .filter((band): band is (typeof PRICE_BANDS)[number] => Boolean(band));

  const minPrice = bandSelections.length
    ? Math.min(...bandSelections.map((band) => band.min))
    : undefined;
  const maxPrice = bandSelections.length
    ? Math.max(...bandSelections.map((band) => band.max))
    : undefined;

  const state: ShopState = {
    collections: collectionsParam,
    roasts,
    caffeine,
    grinds,
    bands,
    sort,
    search,
  };

  const [allCollections, counts, products] = await Promise.all([
    getCollections(),
    getCollectionCounts(),
    getProducts({
      collections: collectionsParam,
      roasts,
      caffeine,
      grinds,
      minPrice,
      maxPrice,
      search,
      sort,
    }),
  ]);

  const activeCollection = collectionsParam.length === 1
    ? allCollections.find((collection) => collection.slug === collectionsParam[0])
    : undefined;

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-10 sm:px-6 lg:px-8">
      <nav className="mb-6 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-espresso/40">
        <Link href="/" className="transition hover:text-espresso">
          Home
        </Link>
        <span>/</span>
        <span className="text-espresso/70">
          {activeCollection ? activeCollection.name : "Shop all"}
        </span>
      </nav>

      <header className="max-w-3xl">
        <p className="eyebrow text-caramel-deep">
          {activeCollection ? activeCollection.tagline : "The full shelf"}
        </p>
        <h1 className="balance mt-3 font-display text-[2.5rem] leading-[1.05] text-espresso sm:text-5xl">
          {activeCollection
            ? activeCollection.name
            : "Every bag on the Jaitra shelf"}
        </h1>
        <p className="mt-4 max-w-2xl text-[0.98rem] leading-relaxed text-espresso/65">
          {activeCollection
            ? activeCollection.description
            : "Fourteen products, four collections, one roast queue that never sits still. Filter by how you brew, how broke you are this month, and how much sleep you are willing to lose."}
        </p>
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-[16rem_1fr] lg:gap-14">
        <div className="lg:sticky lg:top-[8rem] lg:h-fit">
          <ShopControls
            state={state}
            facets={{
              collections: allCollections.map((collection) => ({
                slug: collection.slug,
                name: collection.name,
                count: counts.get(collection.slug) ?? 0,
              })),
            }}
            resultCount={products.length}
          />
        </div>

        <div>
          {products.length === 0 ? (
            <div className="rounded-[1.6rem] border border-dashed border-espresso/20 bg-white/40 px-8 py-20 text-center">
              <p className="text-4xl">🫗</p>
              <h2 className="mt-5 font-display text-2xl text-espresso">
                Nothing matches that combination
              </h2>
              <p className="mx-auto mt-3 max-w-sm text-sm text-espresso/60">
                Try loosening a filter — or browse the whole shelf and let the roast
                date decide.
              </p>
              <Link
                href="/shop"
                className="mt-7 inline-flex rounded-full bg-espresso px-6 py-3 text-sm font-semibold text-crema transition hover:bg-caramel-deep"
              >
                Reset filters
              </Link>
            </div>
          ) : (
            <>
              <p className="mb-6 text-sm text-espresso/55 lg:hidden">
                <span className="font-semibold tabular-nums text-espresso">
                  {products.length}
                </span>{" "}
                {products.length === 1 ? "product" : "products"}
              </p>
              <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:gap-x-6 lg:grid-cols-3">
                {products.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    priority={index < 3}
                  />
                ))}
              </div>
            </>
          )}

          <div className="mt-16 rounded-[1.4rem] border border-espresso/10 bg-crema-dark/50 p-7">
            <div className="flex flex-wrap items-center justify-between gap-5">
              <div>
                <h2 className="font-display text-xl text-espresso">
                  Can&apos;t decide? Let the roast level choose.
                </h2>
                <p className="mt-1.5 text-sm text-espresso/60">
                  Light for flavour hunting, dark for fuel. Everything else in
                  between.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {ROAST_FACETS.slice(0, 4).map((roast) => (
                  <Link
                    key={roast}
                    href={`/shop?roast=${encodeURIComponent(roast)}`}
                    className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                      roasts.includes(roast)
                        ? "border-espresso bg-espresso text-crema"
                        : "border-espresso/20 text-espresso/70 hover:border-espresso hover:text-espresso"
                    }`}
                  >
                    {roast}
                  </Link>
                ))}
                <Link
                  href="/shop?caffeine=Decaf"
                  className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                    caffeine.includes("Decaf")
                      ? "border-espresso bg-espresso text-crema"
                      : "border-espresso/20 text-espresso/70 hover:border-espresso hover:text-espresso"
                  }`}
                >
                  Decaf
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
