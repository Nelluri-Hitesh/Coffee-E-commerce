import Image from "next/image";
import Link from "next/link";

import { ProductCard } from "@/components/product/product-card";
import { Reveal } from "@/components/ui/reveal";
import { StarRating } from "@/components/ui/star-rating";
import { formatPrice, formatRating, relativeDate } from "@/lib/format";
import {
  getCollections,
  getCollectionCounts,
  getFeaturedProducts,
  getStorefrontStats,
  getTopReviews,
} from "@/lib/queries";

export const dynamic = "force-dynamic";

const MARQUEE = [
  "Roasted every Monday",
  "Free delivery over ₹999",
  "Student discount: STUDENT10",
  "Campus pick-up in 4 hours",
  "Roast date printed on every bag",
  "Small batches of 12kg",
];

const STEPS = [
  {
    number: "01",
    title: "Tell us how you brew",
    body: "Moka pot in the hostel room, drip machine in the department lounge, or a hanging filter bag on the go.",
  },
  {
    number: "02",
    title: "We grind to match",
    body: "Every bag is ground to order — or left whole if you have your own grinder and opinions about it.",
  },
  {
    number: "03",
    title: "Roasted, then shipped",
    body: "We roast to a 48-hour queue, never to a warehouse. Your bag leaves Bengaluru within two days of the roast.",
  },
];

export default async function HomePage() {
  const [collections, counts, featured, reviews, stats] = await Promise.all([
    getCollections(),
    getCollectionCounts(),
    getFeaturedProducts(8),
    getTopReviews(8),
    getStorefrontStats(),
  ]);

  const hero = featured[0];

  return (
    <>
      {/* ---------------- hero ---------------- */}
      <section className="relative overflow-hidden bg-crema">
        <div className="pointer-events-none absolute -right-40 top-[-12rem] size-[38rem] rounded-full bg-caramel/18 blur-3xl" />
        <div className="pointer-events-none absolute -left-52 bottom-[-14rem] size-[32rem] rounded-full bg-sage/15 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:pb-24 lg:pt-20 xl:px-8">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-espresso/12 bg-white/60 px-4 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-caramel-deep">
              <span className="size-1.5 animate-pulse rounded-full bg-sage" />
              Roasted this week in Bengaluru
            </span>

            <h1 className="balance mt-6 font-display text-[2.75rem] leading-[1.03] tracking-[-0.02em] text-espresso sm:text-6xl lg:text-[4.1rem]">
              Coffee that keeps
              <span className="relative mx-2 inline-block">
                <span className="relative z-10 italic text-caramel-deep">pace</span>
                <svg
                  viewBox="0 0 200 12"
                  className="absolute -bottom-1 left-0 h-2.5 w-full text-caramel/50"
                  preserveAspectRatio="none"
                  aria-hidden
                >
                  <path
                    d="M2 8c40-6 80-6 120-3s50 4 76 1"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              with your deadlines.
            </h1>

            <p className="mt-6 max-w-xl text-[1.02rem] leading-relaxed text-espresso/65">
              Small-batch, single-estate and unapologetically strong. Jaitra is built
              for 2am problem sets, 8am lectures and everything in between — priced
              so a student can actually afford the good stuff.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href="/shop"
                className="group inline-flex items-center gap-2 rounded-full bg-espresso px-7 py-4 text-sm font-semibold text-crema shadow-[0_18px_40px_-22px_rgba(27,18,14,0.9)] transition hover:bg-caramel-deep"
              >
                Shop the shelf
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
              <Link
                href="/shop?collection=study-fuel"
                className="inline-flex items-center gap-2 rounded-full border border-espresso/20 px-7 py-4 text-sm font-semibold text-espresso transition hover:border-espresso hover:bg-espresso hover:text-crema"
              >
                Most caffeinated
              </Link>
            </div>

            <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-espresso/10 pt-7">
              <div>
                <dt className="text-[0.68rem] uppercase tracking-[0.18em] text-espresso/45">
                  Roast rating
                </dt>
                <dd className="mt-1.5 flex items-center gap-2 font-display text-2xl text-espresso">
                  {formatRating(stats.averageRating)}
                  <StarRating rating={stats.averageRating} size={13} className="text-caramel-deep" />
                </dd>
              </div>
              <div>
                <dt className="text-[0.68rem] uppercase tracking-[0.18em] text-espresso/45">
                  Student reviews
                </dt>
                <dd className="mt-1.5 font-display text-2xl text-espresso">
                  {stats.reviewCount}
                </dd>
              </div>
              <div>
                <dt className="text-[0.68rem] uppercase tracking-[0.18em] text-espresso/45">
                  From
                </dt>
                <dd className="mt-1.5 font-display text-2xl text-espresso">
                  {formatPrice(47900)}
                </dd>
              </div>
            </dl>
          </div>

          <div className="relative animate-fade-up [animation-delay:150ms]">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] grain shadow-[0_50px_90px_-50px_rgba(27,18,14,0.65)] sm:aspect-[5/5]">
              <Image
                src="/images/hero.jpg"
                alt="Pour-over coffee brewing on a study desk beside textbooks"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 46vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-espresso/55 via-transparent to-transparent" />

              <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4">
                {hero && (
                  <Link
                    href={`/products/${hero.slug}`}
                    className="group flex-1 rounded-2xl border border-white/20 bg-white/12 p-4 backdrop-blur-md transition hover:bg-white/20"
                  >
                    <p className="text-[0.62rem] uppercase tracking-[0.2em] text-crema/70">
                      Bestseller
                    </p>
                    <p className="mt-1 font-display text-lg leading-tight text-crema">
                      {hero.name}
                    </p>
                    <p className="mt-2 flex items-center justify-between text-xs text-crema/80">
                      <span>{formatPrice(hero.priceCents)}</span>
                      <span className="inline-flex items-center gap-1 transition-transform group-hover:translate-x-1">
                        View →
                      </span>
                    </p>
                  </Link>
                )}
                <div className="hidden shrink-0 rounded-2xl border border-white/20 bg-white/12 px-4 py-3 text-crema backdrop-blur-md sm:block">
                  <p className="text-[0.62rem] uppercase tracking-[0.2em] text-crema/70">
                    Freshness
                  </p>
                  <p className="mt-1 font-display text-lg leading-none">48h</p>
                  <p className="mt-1 text-[0.62rem] text-crema/70">roast to dispatch</p>
                </div>
              </div>
            </div>

            <div className="pointer-events-none absolute -left-6 top-10 hidden animate-fade-up rounded-2xl border border-espresso/10 bg-crema/95 px-4 py-3 shadow-xl [animation-delay:600ms] lg:block">
              <p className="text-[0.6rem] uppercase tracking-[0.2em] text-espresso/45">
                Tasting now
              </p>
              <p className="mt-1 font-display text-sm text-espresso">
                Jasmine · Cocoa · Panela
              </p>
            </div>
          </div>
        </div>

        {/* marquee */}
        <div className="relative border-y border-espresso/10 bg-crema-dark/70 py-3">
          <div className="flex w-max animate-marquee gap-10 whitespace-nowrap">
            {[...MARQUEE, ...MARQUEE, ...MARQUEE, ...MARQUEE].map((item, index) => (
              <span
                key={`${item}-${index}`}
                className="flex items-center gap-10 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-espresso/50"
              >
                {item}
                <span className="text-caramel">✦</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- collections ---------------- */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <p className="eyebrow text-caramel-deep">Featured collections</p>
            <h2 className="balance mt-3 font-display text-4xl leading-[1.08] text-espresso sm:text-5xl">
              Four shelves, one very long reading list
            </h2>
          </div>
          <Link
            href="/shop"
            className="link-underline text-sm font-semibold text-espresso"
          >
            Browse all {stats.productCount} products →
          </Link>
        </Reveal>

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          {collections.map((collection, index) => (
            <Reveal
              key={collection.id}
              delay={index * 80}
              className={index % 3 === 0 ? "lg:col-span-1" : ""}
            >
              <Link
                href={`/shop?collection=${collection.slug}`}
                className="group relative block h-full overflow-hidden rounded-[1.6rem] bg-espresso"
              >
                <div className="relative aspect-[16/11] w-full sm:aspect-[16/10]">
                  <Image
                    src={collection.image}
                    alt={collection.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover opacity-90 transition-transform duration-[1100ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/45 to-transparent opacity-90" />
                </div>

                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
                  <div className="flex items-center gap-3">
                    <span
                      className="h-px w-8"
                      style={{ backgroundColor: collection.accent }}
                    />
                    <span className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-crema/70">
                      {counts.get(collection.slug) ?? 0} products
                    </span>
                  </div>
                  <h3 className="mt-3 font-display text-2xl text-crema sm:text-3xl">
                    {collection.name}
                  </h3>
                  <p className="mt-1.5 text-sm italic text-caramel">
                    {collection.tagline}
                  </p>
                  <p className="mt-3 max-w-md text-[0.85rem] leading-relaxed text-crema/70">
                    {collection.description}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-crema">
                    Shop collection
                    <span className="transition-transform duration-300 group-hover:translate-x-1.5">
                      →
                    </span>
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- featured products ---------------- */}
      <section className="relative overflow-hidden bg-espresso py-20 lg:py-24">
        <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-[40rem] -translate-x-1/2 rounded-full bg-caramel/15 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="flex flex-wrap items-end justify-between gap-6 text-crema">
            <div>
              <p className="eyebrow text-caramel">Student favourites</p>
              <h2 className="balance mt-3 max-w-2xl font-display text-4xl leading-[1.08] sm:text-5xl">
                The bags that keep disappearing from the shelf
              </h2>
            </div>
            <Link
              href="/shop?sort=rating"
              className="rounded-full border border-crema/25 px-6 py-3 text-sm font-semibold text-crema transition hover:bg-crema hover:text-espresso"
            >
              See top rated
            </Link>
          </Reveal>

          <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
            {featured.map((product, index) => (
              <Reveal key={product.id} delay={index * 70}>
                <div className="[&_p]:text-crema/60 [&_a]:text-crema [&_a:hover]:text-caramel">
                  <ProductCard product={product} priority={index < 2} />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- how it works ---------------- */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <Reveal>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.6rem]">
              <Image
                src="/images/roastery.jpg"
                alt="Inside the Jaitra roastery"
                fill
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-espresso/40 to-transparent" />
              <div className="absolute bottom-5 left-5 rounded-2xl bg-crema/95 px-5 py-4 backdrop-blur">
                <p className="text-[0.62rem] uppercase tracking-[0.2em] text-espresso/45">
                  Batch size
                </p>
                <p className="mt-1 font-display text-2xl text-espresso">12 kg</p>
                <p className="text-xs text-espresso/55">never more, never stale</p>
              </div>
            </div>
          </Reveal>

          <div>
            <Reveal>
              <p className="eyebrow text-caramel-deep">How Jaitra works</p>
              <h2 className="balance mt-3 font-display text-4xl leading-[1.08] text-espresso sm:text-[2.75rem]">
                Fresher than the campus café, cheaper than three coffees out
              </h2>
            </Reveal>

            <ol className="mt-10 space-y-7">
              {STEPS.map((step, index) => (
                <Reveal key={step.number} delay={index * 90}>
                  <li className="flex gap-5">
                    <span className="font-display text-2xl text-caramel/70">
                      {step.number}
                    </span>
                    <div className="border-l border-espresso/10 pl-5">
                      <h3 className="font-display text-xl text-espresso">
                        {step.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-espresso/60">
                        {step.body}
                      </p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ---------------- reviews ---------------- */}
      <section className="relative overflow-hidden border-y border-espresso/10 bg-crema-dark/50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="eyebrow text-caramel-deep">From the study group</p>
            <h2 className="balance mt-3 font-display text-4xl leading-[1.08] text-espresso sm:text-5xl">
              {stats.reviewCount} reviews, mostly written past midnight
            </h2>
          </Reveal>
        </div>

        <div className="relative mt-12">
          <div className="flex w-max animate-marquee gap-5 px-4 hover:[animation-play-state:paused]">
            {[...reviews, ...reviews].map((review, index) => (
              <figure
                key={`${review.id}-${index}`}
                className="flex w-[21rem] shrink-0 flex-col justify-between rounded-[1.4rem] border border-espresso/10 bg-crema p-6 shadow-[0_20px_45px_-35px_rgba(27,18,14,0.6)]"
              >
                <div>
                  <StarRating
                    rating={review.rating}
                    className="text-caramel-deep"
                  />
                  <blockquote className="mt-4 font-display text-lg leading-snug text-espresso">
                    “{review.title}”
                  </blockquote>
                  <p className="mt-3 line-clamp-5 text-sm leading-relaxed text-espresso/60">
                    {review.body}
                  </p>
                </div>
                <figcaption className="mt-5 border-t border-espresso/10 pt-4">
                  <p className="text-sm font-semibold text-espresso">
                    {review.author}
                  </p>
                  <p className="text-xs text-espresso/50">
                    {review.campus} · {relativeDate(review.createdAt)}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- closing cta ---------------- */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] bg-espresso px-6 py-14 text-center text-crema sm:px-14">
            <div className="pointer-events-none absolute -right-20 -top-24 size-80 rounded-full bg-caramel/25 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-16 size-72 rounded-full bg-terracotta/20 blur-3xl" />
            <div className="relative mx-auto max-w-2xl">
              <p className="eyebrow text-caramel">Exam season, sorted</p>
              <h2 className="balance mt-4 font-display text-4xl leading-[1.08] sm:text-5xl">
                Send a Survival Kit to someone mid-finals
              </h2>
              <p className="mt-5 text-[0.98rem] leading-relaxed text-crema/70">
                Three bags, a handwritten brew card and jute twine. Add code{" "}
                <span className="rounded-full bg-caramel/20 px-2 py-0.5 font-semibold text-caramel">
                  STUDENT10
                </span>{" "}
                at checkout for 10% off and free campus pick-up.
              </p>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/products/exam-week-survival-kit"
                  className="group inline-flex items-center gap-2 rounded-full bg-crema px-7 py-4 text-sm font-semibold text-espresso transition hover:bg-caramel"
                >
                  View the kit
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
                <Link
                  href="/shop?collection=gift-kits"
                  className="inline-flex items-center rounded-full border border-crema/25 px-7 py-4 text-sm font-semibold text-crema transition hover:bg-crema/10"
                >
                  All gift kits
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
