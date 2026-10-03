"use client";

import Image from "next/image";
import Link from "next/link";

import { useCart } from "@/components/cart/cart-provider";
import { formatPrice } from "@/lib/format";
import { DELIVERY_OPTIONS, FREE_SHIPPING_THRESHOLD_CENTS, type DeliveryMethod } from "@/lib/shop";

export function CartDrawer() {
  const cart = useCart();
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    subtotalCents,
    shippingCents,
    discountCents,
    totalCents,
    freeShippingRemainingCents,
    delivery,
    setDelivery,
    hydrated,
  } = cart;

  const progress = Math.min(
    100,
    Math.round(((FREE_SHIPPING_THRESHOLD_CENTS - freeShippingRemainingCents) /
      FREE_SHIPPING_THRESHOLD_CENTS) * 100),
  );

  return (
    <div
      aria-hidden={!isOpen}
      className={`fixed inset-0 z-[70] ${isOpen ? "" : "pointer-events-none"}`}
    >
      <button
        type="button"
        aria-label="Close cart"
        onClick={closeCart}
        className={`absolute inset-0 bg-espresso/45 backdrop-blur-[3px] transition-opacity duration-500 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Your cart"
        className={`absolute right-0 top-0 flex h-full w-full max-w-[27rem] flex-col border-l border-espresso/10 bg-crema shadow-[-24px_0_60px_-30px_rgba(27,18,14,0.5)] transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between border-b border-espresso/10 px-6 py-5">
          <div>
            <p className="eyebrow text-caramel-deep">Your bag</p>
            <h2 className="font-display text-2xl text-espresso">
              {items.length === 0
                ? "Nothing brewing yet"
                : `${items.length} ${items.length === 1 ? "item" : "items"}`}
            </h2>
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="grid size-10 place-items-center rounded-full border border-espresso/15 text-espresso transition hover:rotate-90 hover:border-espresso/40 hover:bg-espresso hover:text-crema"
            aria-label="Close cart"
          >
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </header>

        {items.length > 0 && (
          <div className="border-b border-espresso/10 bg-crema-dark/60 px-6 py-4">
            <p className="text-xs text-espresso/70">
              {freeShippingRemainingCents === 0
                ? "Standard delivery is on us ☕"
                : `${formatPrice(freeShippingRemainingCents)} away from free standard delivery`}
            </p>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-espresso/10">
              <div
                className="h-full rounded-full bg-caramel transition-[width] duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="thin-scroll flex-1 overflow-y-auto px-6 py-5">
          {!hydrated ? (
            <div className="space-y-4">
              {[0, 1].map((index) => (
                <div key={index} className="h-24 animate-pulse rounded-2xl bg-espresso/5" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="relative grid size-24 place-items-center rounded-full bg-crema-dark">
                <span className="text-4xl">🫙</span>
              </div>
              <h3 className="mt-6 font-display text-xl text-espresso">
                Your bag is empty
              </h3>
              <p className="mt-2 max-w-[16rem] text-sm text-espresso/60">
                Pick a roast that matches your deadline. Students get 10% off with
                code <span className="font-semibold">STUDENT10</span>.
              </p>
              <Link
                href="/shop"
                onClick={closeCart}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-espresso px-6 py-3 text-sm font-semibold text-crema transition hover:bg-espresso-soft"
              >
                Browse the shelf
              </Link>
            </div>
          ) : (
            <ul className="space-y-5">
              {items.map((item) => (
                <li key={item.key} className="flex gap-4">
                  <Link
                    href={`/products/${item.slug}`}
                    onClick={closeCart}
                    className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-crema-dark"
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <Link
                        href={`/products/${item.slug}`}
                        onClick={closeCart}
                        className="font-display text-[0.98rem] leading-snug text-espresso hover:text-caramel-deep"
                      >
                        {item.name}
                      </Link>
                      <button
                        type="button"
                        onClick={() => removeItem(item.key)}
                        className="text-[0.7rem] uppercase tracking-widest text-espresso/40 transition hover:text-terracotta"
                      >
                        Remove
                      </button>
                    </div>
                    <p className="mt-1 text-xs text-espresso/55">
                      {item.sizeLabel}
                      {item.grind ? ` · ${item.grind}` : ""}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="inline-flex items-center rounded-full border border-espresso/15">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          onClick={() => updateQuantity(item.key, item.quantity - 1)}
                          className="grid size-8 place-items-center rounded-l-full text-espresso/70 transition hover:bg-espresso hover:text-crema"
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-sm font-semibold tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          onClick={() => updateQuantity(item.key, item.quantity + 1)}
                          className="grid size-8 place-items-center rounded-r-full text-espresso/70 transition hover:bg-espresso hover:text-crema"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-sm font-semibold tabular-nums text-espresso">
                        {formatPrice(item.unitPriceCents * item.quantity)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <footer className="border-t border-espresso/10 bg-crema px-6 pb-6 pt-5">
            <fieldset className="mb-4">
              <legend className="eyebrow mb-2 text-espresso/50">Delivery</legend>
              <div className="grid gap-2">
                {DELIVERY_OPTIONS.map((option) => {
                  const active = delivery === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setDelivery(option.value as DeliveryMethod)}
                      className={`flex items-center justify-between rounded-xl border px-3 py-2 text-left text-xs transition ${
                        active
                          ? "border-espresso bg-espresso text-crema"
                          : "border-espresso/15 text-espresso/70 hover:border-espresso/40"
                      }`}
                    >
                      <span>
                        <span className="font-semibold">{option.label}</span>
                        <span className="block text-[0.68rem] opacity-70">
                          {option.eta}
                        </span>
                      </span>
                      <span className="tabular-nums">
                        {option.priceCents === 0 ? "Free" : formatPrice(option.priceCents)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <dl className="space-y-1.5 text-sm">
              <div className="flex justify-between text-espresso/70">
                <dt>Subtotal</dt>
                <dd className="tabular-nums">{formatPrice(subtotalCents)}</dd>
              </div>
              {discountCents > 0 && (
                <div className="flex justify-between text-sage">
                  <dt>Discount</dt>
                  <dd className="tabular-nums">−{formatPrice(discountCents)}</dd>
                </div>
              )}
              <div className="flex justify-between text-espresso/70">
                <dt>Delivery</dt>
                <dd className="tabular-nums">
                  {shippingCents === 0 ? "Free" : formatPrice(shippingCents)}
                </dd>
              </div>
              <div className="flex justify-between border-t border-espresso/10 pt-2 font-display text-lg text-espresso">
                <dt>Total</dt>
                <dd className="tabular-nums">{formatPrice(totalCents)}</dd>
              </div>
            </dl>

            <Link
              href="/checkout"
              onClick={closeCart}
              className="group mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-espresso px-6 py-3.5 text-sm font-semibold text-crema transition hover:bg-caramel-deep"
            >
              Checkout
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
            <button
              type="button"
              onClick={closeCart}
              className="mt-2 w-full text-center text-xs uppercase tracking-[0.18em] text-espresso/45 transition hover:text-espresso"
            >
              Keep shopping
            </button>
          </footer>
        )}
      </aside>
    </div>
  );
}
