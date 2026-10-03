import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { ProductCard } from "@/components/product/product-card";
import { ProductGallery } from "@/components/product/product-gallery";
import { PurchasePanel } from "@/components/product/purchase-panel";
import { ReviewForm } from "@/components/product/review-form";
import { Reveal } from "@/components/ui/reveal";
import { StarRating } from "@/components/ui/star-rating";
import { formatPrice, formatRating, relativeDate } from "@/lib/format";
import {
  getProductBySlug,
  getRelatedProducts,
  getReviewsForProduct,
} from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.tagline,
      images: [{ url: product.image }],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [reviews, related] = await Promise.all([
    getReviewsForProduct(product.id),
    getRelatedProducts(product, 4),
  ]);

  const rating = product.ratingCount > 0
    ? product.ratingSum / product.ratingCount
    : 0;

  const distribution = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((review) => review.rating === star).length;
    return {
      star,
      count,
      percent: reviews.length ? Math.round((count / reviews.length) * 100) : 0,
    };
  });

  const specs = [
    { label: "Origin", value: product.origin },
    { label: "Process", value: product.process },
    { label: "Varietal", value: product.varietal },
    { label: "Altitude", value: product.altitude },
    { label: "Roast", value: product.roast },
    { label: "Caffeine", value: product.caffeine },
  ].filter((spec) => spec.value && spec.value !== "—");

  const gallery = product.gallery.length ? product.gallery : [product.image];

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-8 sm:px-6 lg:px-8">
      <nav className="mb-8 flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.18em] text-espresso/40">
        <Link href="/" className="transition hover:text-espresso">
          Home
        </Link>
        <span>/</span>
        <Link href="/shop" className="transition hover:text-espresso">
          Shop
        </Link>
        {product.collection && (
          <>
            <span>/</span>
            <Link
              href={`/shop?collection=${product.collection.slug}`}
              className="transition hover:text-espresso"
            >
              {product.collection.name}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-espresso/70">{product.name}</span>
      </nav>

      <div className="grid gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        <div className="animate-fade-in">
          <ProductGallery
            images={gallery}
            name={product.name}
            badge={product.badge}
          />
        </div>

        <div className="animate-fade-up">
          {product.collection && (
            <Link
              href={`/shop?collection=${product.collection.slug}`}
              className="eyebrow inline-flex items-center gap-2 text-caramel-deep transition hover:text-espresso"
            >
              <span
                className="size-1.5 rounded-full"
                style={{ backgroundColor: product.collection.accent }}
              />
              {product.collection.name}
            </Link>
          )}

          <h1 className="balance mt-3 font-display text-[2.4rem] leading-[1.06] text-espresso sm:text-[2.9rem]">
            {product.name}
          </h1>
          <p className="mt-3 text-[1.02rem] italic text-espresso/60">
            {product.tagline}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-4">
            <span className="inline-flex items-center gap-2">
              <StarRating rating={rating} size={16} className="text-caramel-deep" />
              <span className="text-sm font-semibold text-espresso">
                {rating > 0 ? formatRating(rating) : "New"}
              </span>
              <a
                href="#reviews"
                className="text-sm text-espresso/50 underline-offset-4 transition hover:text-espresso hover:underline"
              >
                {product.ratingCount} reviews
              </a>
            </span>
            {product.compareAtCents && product.compareAtCents > product.priceCents && (
              <span className="rounded-full bg-terracotta/12 px-3 py-1 text-xs font-semibold text-terracotta">
                Save {formatPrice(product.compareAtCents - product.priceCents)}
              </span>
            )}
          </div>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="font-display text-3xl tabular-nums text-espresso">
              {formatPrice(product.priceCents)}
            </span>
            {product.compareAtCents && product.compareAtCents > product.priceCents && (
              <span className="text-base text-espresso/40 line-through tabular-nums">
                {formatPrice(product.compareAtCents)}
              </span>
            )}
            <span className="text-xs uppercase tracking-[0.16em] text-espresso/40">
              incl. taxes
            </span>
          </div>

          <p className="mt-6 text-[0.98rem] leading-relaxed text-espresso/70">
            {product.description}
          </p>

          <div className="mt-8 flex flex-wrap gap-2">
            {product.tastingNotes.map((note) => (
              <span
                key={note}
                className="rounded-full border border-espresso/12 bg-white/60 px-3.5 py-1.5 text-xs font-semibold text-espresso/75"
              >
                {note}
              </span>
            ))}
          </div>

          <div className="mt-9 border-t border-espresso/10 pt-8">
            <PurchasePanel
              productId={product.id}
              slug={product.slug}
              name={product.name}
              image={product.image}
              sizes={product.sizes}
              grinds={product.grinds}
              stock={product.stock}
              brewMethods={product.brewMethods}
            />
          </div>

          <div className="mt-9 divide-y divide-espresso/10 border-y border-espresso/10">
            <details className="group py-4" open>
              <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold text-espresso">
                The story behind this lot
                <span className="text-espresso/40 transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-espresso/65">
                {product.story || product.description}
              </p>
            </details>

            <details className="group py-4">
              <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold text-espresso">
                Brew guide
                <span className="text-espresso/40 transition group-open:rotate-45">+</span>
              </summary>
              <ul className="mt-3 space-y-2 text-sm text-espresso/65">
                <li>
                  <strong className="font-semibold text-espresso">Dose:</strong> 15g
                  coffee to 250ml water (1:16.5)
                </li>
                <li>
                  <strong className="font-semibold text-espresso">Water:</strong> 94°C
                  for light roasts, 90°C for dark
                </li>
                <li>
                  <strong className="font-semibold text-espresso">Best for:</strong>{" "}
                  {product.brewMethods.join(" · ")}
                </li>
                <li>
                  <strong className="font-semibold text-espresso">Rest:</strong> 5
                  days off the roast for espresso, 2 for filter
                </li>
              </ul>
            </details>

            <details className="group py-4">
              <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold text-espresso">
                Shipping & returns
                <span className="text-espresso/40 transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-espresso/65">
                Dispatched within 48 hours of the roast date. Free standard delivery
                above ₹999, express in 1–2 days, or collect free from the Jaitra cart
                on campus. Unopened bags can be swapped within 14 days — even if you
                just did not like the roast.
              </p>
            </details>
          </div>

          <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
            {specs.map((spec) => (
              <div key={spec.label}>
                <dt className="text-[0.65rem] uppercase tracking-[0.18em] text-espresso/40">
                  {spec.label}
                </dt>
                <dd className="mt-1 text-sm text-espresso/80">{spec.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* ---------------- reviews ---------------- */}
      <section id="reviews" className="mt-24 scroll-mt-28">
        <Reveal className="grid gap-10 lg:grid-cols-[20rem_1fr] lg:gap-16">
          <div className="lg:sticky lg:top-[8rem] lg:h-fit">
            <p className="eyebrow text-caramel-deep">Verified reviews</p>
            <h2 className="mt-3 font-display text-3xl leading-tight text-espresso">
              {rating > 0 ? `${formatRating(rating)} out of 5` : "Be the first"}
            </h2>
            <div className="mt-3 flex items-center gap-3">
              <StarRating rating={rating} size={16} className="text-caramel-deep" />
              <span className="text-sm text-espresso/55">
                {reviews.length} review{reviews.length === 1 ? "" : "s"}
              </span>
            </div>

            <div className="mt-6 space-y-2">
              {distribution.map((row) => (
                <div key={row.star} className="flex items-center gap-3 text-xs">
                  <span className="w-8 tabular-nums text-espresso/50">
                    {row.star}★
                  </span>
                  <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-espresso/10">
                    <span
                      className="block h-full rounded-full bg-caramel"
                      style={{ width: `${row.percent}%` }}
                    />
                  </span>
                  <span className="w-6 text-right tabular-nums text-espresso/40">
                    {row.count}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-7">
              <ReviewForm slug={product.slug} />
            </div>
          </div>

          <div>
            {reviews.length === 0 ? (
              <p className="rounded-[1.4rem] border border-dashed border-espresso/20 p-10 text-center text-sm text-espresso/55">
                No reviews yet — brew a bag and tell everyone what you tasted.
              </p>
            ) : (
              <ul className="space-y-5">
                {reviews.map((review) => (
                  <li
                    key={review.id}
                    className="rounded-[1.3rem] border border-espresso/10 bg-white/55 p-6 transition hover:border-espresso/25"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-3">
                          <StarRating
                            rating={review.rating}
                            className="text-caramel-deep"
                          />
                          <h3 className="font-display text-lg leading-tight text-espresso">
                            {review.title}
                          </h3>
                        </div>
                        <p className="mt-2 text-sm text-espresso/65">
                          <span className="font-semibold text-espresso">
                            {review.author}
                          </span>
                          {review.campus ? ` · ${review.campus}` : ""}
                          {review.major && review.major !== "—"
                            ? ` · ${review.major}`
                            : ""}
                        </p>
                      </div>
                      <div className="text-right text-xs text-espresso/40">
                        <p>{relativeDate(review.createdAt)}</p>
                        {review.verified && (
                          <p className="mt-1 inline-flex items-center gap-1 text-sage">
                            ✓ Verified buyer
                          </p>
                        )}
                      </div>
                    </div>
                    <p className="mt-4 text-[0.92rem] leading-relaxed text-espresso/70">
                      {review.body}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Reveal>
      </section>

      {/* ---------------- related ---------------- */}
      <section className="mt-24">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-3xl text-espresso sm:text-4xl">
            Pairs well with
          </h2>
          <Link
            href="/shop"
            className="link-underline text-sm font-semibold text-espresso"
          >
            Shop everything →
          </Link>
        </Reveal>

        <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
          {related.map((item, index) => (
            <Reveal key={item.id} delay={index * 70}>
              <ProductCard product={item} />
            </Reveal>
          ))}
        </div>
      </section>

      <div className="mt-20 grid gap-4 sm:grid-cols-3">
        {[
          {
            title: "Roasted, not warehoused",
            body: "Bags leave the roastery within 48 hours of the drum. Check the stamp.",
            icon: "🔥",
          },
          {
            title: "Ground to your brewer",
            body: "Moka, filter, press or whole bean — pick it on this page and we handle it.",
            icon: "⚙️",
          },
          {
            title: "Student pricing, always",
            body: "Use STUDENT10 at checkout for 10% off, any day of the semester.",
            icon: "🎓",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-[1.3rem] border border-espresso/10 bg-crema-dark/40 p-6"
          >
            <p className="text-2xl">{item.icon}</p>
            <h3 className="mt-3 font-display text-lg text-espresso">{item.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-espresso/60">
              {item.body}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
}
