import Image from "next/image";
import Link from "next/link";

import { QuickAddButton } from "@/components/product/quick-add";
import { StarRating } from "@/components/ui/star-rating";
import { formatPrice, formatRating } from "@/lib/format";
import type { ProductWithCollection } from "@/lib/queries";

export function ProductCard({
  product,
  priority = false,
}: {
  product: ProductWithCollection;
  priority?: boolean;
}) {
  const rating =
    product.ratingCount > 0 ? product.ratingSum / product.ratingCount : 0;
  const hoverImage = product.gallery.find((src) => src !== product.image);
  const onSale =
    product.compareAtCents !== null && product.compareAtCents > product.priceCents;

  return (
    <article className="group relative flex flex-col">
      <div className="relative overflow-hidden rounded-[1.4rem] bg-crema-dark">
        <Link href={`/products/${product.slug}`} className="block">
          <div className="relative aspect-square w-full">
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority={priority}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-[900ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.07]"
            />
            {hoverImage && (
              <Image
                src={hoverImage}
                alt=""
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
              />
            )}
          </div>
        </Link>

        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-3">
          <div className="flex flex-col items-start gap-2">
            {product.badge && (
              <span className="rounded-full bg-crema/95 px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-espresso shadow-sm">
                {product.badge}
              </span>
            )}
            {onSale && (
              <span className="rounded-full bg-terracotta px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-crema shadow-sm">
                On offer
              </span>
            )}
          </div>
          <span className="rounded-full bg-espresso/80 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-crema backdrop-blur">
            {product.roast}
          </span>
        </div>

        <div className="absolute inset-x-3 bottom-3 transition-all duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] lg:translate-y-3 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 lg:focus-within:translate-y-0 lg:focus-within:opacity-100">
          <QuickAddButton
            payload={{
              productId: product.id,
              slug: product.slug,
              name: product.name,
              image: product.image,
              sizeLabel: product.sizes[0]?.label ?? "250g",
              grind: product.grinds[0] ?? "Whole Bean",
              unitPriceCents: product.sizes[0]?.priceCents ?? product.priceCents,
              stock: product.stock,
            }}
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col px-1 pt-4">
        <div className="flex items-start justify-between gap-3">
          <Link
            href={`/products/${product.slug}`}
            className="font-display text-[1.05rem] leading-tight text-espresso transition group-hover:text-caramel-deep"
          >
            {product.name}
          </Link>
          <div className="text-right">
            <p className="font-display text-[1.05rem] tabular-nums text-espresso">
              {formatPrice(product.priceCents)}
            </p>
            {onSale && product.compareAtCents && (
              <p className="text-xs text-espresso/40 line-through tabular-nums">
                {formatPrice(product.compareAtCents)}
              </p>
            )}
          </div>
        </div>

        <p className="mt-1.5 line-clamp-2 text-[0.82rem] leading-relaxed text-espresso/55">
          {product.tagline}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.7rem] text-espresso/45">
          <span className="inline-flex items-center gap-1.5">
            <StarRating rating={rating} size={12} className="text-caramel-deep" />
            {rating > 0 ? formatRating(rating) : "New"}
            {product.ratingCount > 0 && (
              <span className="text-espresso/35">({product.ratingCount})</span>
            )}
          </span>
          {product.caffeine === "Decaf" && (
            <span className="rounded-full bg-sage/15 px-2 py-0.5 font-semibold text-sage">
              Decaf
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
