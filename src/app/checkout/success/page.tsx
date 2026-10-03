import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

import { formatPrice } from "@/lib/format";
import { getOrderByNumber } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Order confirmed",
  description: "Your Jaitra Coffee order is confirmed.",
};

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order: orderNumber } = await searchParams;
  const result = orderNumber ? await getOrderByNumber(orderNumber) : null;

  if (!result) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <p className="text-4xl">🫗</p>
        <h1 className="mt-5 font-display text-3xl text-espresso">
          We couldn&apos;t find that order
        </h1>
        <p className="mt-3 text-sm text-espresso/60">
          The confirmation link is tied to a single order number. If your bag is
          still full, you can check out again.
        </p>
        <Link
          href="/shop"
          className="mt-8 inline-flex rounded-full bg-espresso px-7 py-3.5 text-sm font-semibold text-crema transition hover:bg-caramel-deep"
        >
          Back to the shelf
        </Link>
      </div>
    );
  }

  const { order, items } = result;
  const eta =
    order.deliveryMethod === "campus"
      ? "Ready for pick-up in about 4 hours"
      : order.deliveryMethod === "express"
        ? "Arriving in 1 – 2 days"
        : "Arriving in 3 – 5 days";

  return (
    <div className="mx-auto max-w-3xl px-4 pb-24 pt-14 sm:px-6">
      <div className="animate-fade-up text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-sage/15 text-3xl">
          ✓
        </span>
        <p className="eyebrow mt-6 text-caramel-deep">Order confirmed</p>
        <h1 className="balance mt-3 font-display text-[2.4rem] leading-[1.06] text-espresso sm:text-5xl">
          The kettle is already on, {order.fullName.split(" ")[0]}
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-[0.98rem] leading-relaxed text-espresso/65">
          We have emailed a receipt to{" "}
          <span className="font-semibold text-espresso">{order.email}</span>. Your
          beans go into tomorrow morning&apos;s roast queue.
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Order number", value: order.orderNumber },
          { label: "Total paid", value: formatPrice(order.totalCents) },
          { label: "Delivery", value: eta },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-espresso/10 bg-white/55 p-5 text-center"
          >
            <p className="text-[0.62rem] uppercase tracking-[0.18em] text-espresso/45">
              {item.label}
            </p>
            <p className="mt-1.5 font-display text-lg text-espresso">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-[1.5rem] border border-espresso/10 bg-crema-dark/40 p-6 sm:p-8">
        <h2 className="font-display text-xl text-espresso">What&apos;s in the bag</h2>
        <ul className="mt-5 divide-y divide-espresso/10">
          {items.map((item) => (
            <li key={item.id} className="flex items-center gap-4 py-4">
              <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-crema">
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-espresso">
                  {item.name}
                </p>
                <p className="mt-0.5 text-xs text-espresso/55">
                  {item.sizeLabel}
                  {item.grind ? ` · ${item.grind}` : ""} · Qty {item.quantity}
                </p>
              </div>
              <p className="text-sm font-semibold tabular-nums text-espresso">
                {formatPrice(item.unitPriceCents * item.quantity)}
              </p>
            </li>
          ))}
        </ul>

        <dl className="mt-5 space-y-2 border-t border-espresso/10 pt-5 text-sm">
          <div className="flex justify-between text-espresso/65">
            <dt>Subtotal</dt>
            <dd className="tabular-nums">{formatPrice(order.subtotalCents)}</dd>
          </div>
          {order.discountCents > 0 && (
            <div className="flex justify-between font-semibold text-sage">
              <dt>Discount {order.promoCode && `(${order.promoCode})`}</dt>
              <dd className="tabular-nums">−{formatPrice(order.discountCents)}</dd>
            </div>
          )}
          <div className="flex justify-between text-espresso/65">
            <dt>Delivery</dt>
            <dd className="tabular-nums">
              {order.shippingCents === 0 ? "Free" : formatPrice(order.shippingCents)}
            </dd>
          </div>
          <div className="flex items-baseline justify-between border-t border-espresso/10 pt-3">
            <dt className="font-display text-lg text-espresso">Total</dt>
            <dd className="font-display text-xl tabular-nums text-espresso">
              {formatPrice(order.totalCents)}
            </dd>
          </div>
        </dl>

        <div className="mt-6 rounded-2xl bg-crema p-5 text-sm text-espresso/70">
          <p className="font-semibold text-espresso">
            {order.deliveryMethod === "campus"
              ? "Collect from the Jaitra cart, Main Quad"
              : "Delivering to"}
          </p>
          <p className="mt-1.5 leading-relaxed">
            {order.deliveryMethod === "campus"
              ? `${order.campus || "Campus"} · open 8am – 7pm · we will message ${order.phone || order.email} when it is packed.`
              : [
                  order.address1,
                  order.address2,
                  order.city,
                  order.state,
                  order.postalCode,
                  order.country,
                ]
                  .filter(Boolean)
                  .join(", ")}
          </p>
          {order.notes && (
            <p className="mt-3 border-t border-espresso/10 pt-3 text-xs italic text-espresso/55">
              “{order.notes}”
            </p>
          )}
        </div>
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/shop"
          className="rounded-full bg-espresso px-7 py-3.5 text-sm font-semibold text-crema transition hover:bg-caramel-deep"
        >
          Keep shopping
        </Link>
        <Link
          href="/"
          className="rounded-full border border-espresso/20 px-7 py-3.5 text-sm font-semibold text-espresso transition hover:border-espresso"
        >
          Back home
        </Link>
      </div>
    </div>
  );
}
