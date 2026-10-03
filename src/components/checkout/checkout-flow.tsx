"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { useCart } from "@/components/cart/cart-provider";
import { formatPrice } from "@/lib/format";
import {
  DELIVERY_OPTIONS,
  PROMO_CODES,
  type DeliveryMethod,
} from "@/lib/shop";

type Form = {
  email: string;
  fullName: string;
  phone: string;
  campus: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  notes: string;
  card: string;
  expiry: string;
  cvc: string;
};

const EMPTY_FORM: Form = {
  email: "",
  fullName: "",
  phone: "",
  campus: "",
  address1: "",
  address2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India",
  notes: "",
  card: "",
  expiry: "",
  cvc: "",
};

const STEPS = ["Contact", "Delivery", "Payment", "Review"] as const;

export function CheckoutFlow() {
  const router = useRouter();
  const cart = useCart();
  const {
    items,
    hydrated,
    delivery,
    setDelivery,
    promoCode,
    setPromoCode,
    subtotalCents,
    shippingCents,
    discountCents,
    totalCents,
    promoLabel,
    promoError,
    clear,
    updateQuantity,
    removeItem,
  } = cart;

  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Form>(EMPTY_FORM);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const set = (key: keyof Form, value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  const option = useMemo(
    () => DELIVERY_OPTIONS.find((item) => item.value === delivery) ?? DELIVERY_OPTIONS[0],
    [delivery],
  );

  function validateContact() {
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
      setError("Enter a valid email so we can send the tracking link.");
      return false;
    }
    if (form.fullName.trim().length < 3) {
      setError("Please enter your full name.");
      return false;
    }
    setError("");
    return true;
  }

  function validateDelivery() {
    if (delivery === "campus") {
      setError("");
      return true;
    }
    if (form.address1.trim().length < 5) {
      setError("We need a street address (hostel + block is fine).");
      return false;
    }
    if (!form.city.trim() || !form.postalCode.trim()) {
      setError("City and PIN code are required for courier delivery.");
      return false;
    }
    setError("");
    return true;
  }

  function validatePayment() {
    const digits = form.card.replace(/\s/g, "");
    if (digits.length < 15 || !/^\d+$/.test(digits)) {
      setError("Enter a 16-digit card number (demo mode — any digits work).");
      return false;
    }
    if (!/^\d{2}\/\d{2}$/.test(form.expiry)) {
      setError("Expiry must look like 09/28.");
      return false;
    }
    if (!/^\d{3,4}$/.test(form.cvc)) {
      setError("CVC should be 3 digits.");
      return false;
    }
    setError("");
    return true;
  }

  function next() {
    if (step === 0 && !validateContact()) return;
    if (step === 1 && !validateDelivery()) return;
    if (step === 2 && !validatePayment()) return;
    setStep((value) => Math.min(STEPS.length - 1, value + 1));
  }

  async function placeOrder() {
    setSubmitting(true);
    setError("");
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          deliveryMethod: delivery,
          promoCode,
          items: items.map((item) => ({
            productId: item.productId,
            slug: item.slug,
            name: item.name,
            image: item.image,
            sizeLabel: item.sizeLabel,
            grind: item.grind,
            unitPriceCents: item.unitPriceCents,
            quantity: item.quantity,
            stock: item.stock,
            key: item.key,
          })),
        }),
      });

      const payload = (await response.json()) as {
        orderNumber?: string;
        error?: string;
      };

      if (!response.ok || !payload.orderNumber) {
        setError(payload.error ?? "Could not place the order. Please retry.");
        setSubmitting(false);
        return;
      }

      clear();
      router.push(`/checkout/success?order=${payload.orderNumber}`);
    } catch {
      setError("Network error — please try again.");
      setSubmitting(false);
    }
  }

  if (hydrated && items.length === 0) {
    return (
      <div className="mx-auto max-w-xl rounded-[1.6rem] border border-dashed border-espresso/20 bg-white/50 px-8 py-20 text-center">
        <p className="text-4xl">☕</p>
        <h1 className="mt-5 font-display text-3xl text-espresso">
          Your bag is empty
        </h1>
        <p className="mt-3 text-sm text-espresso/60">
          Add a bag (or three) and we will get this moving. Students save 10% with
          code STUDENT10.
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

  return (
    <div className="grid gap-10 lg:grid-cols-[1.35fr_1fr] lg:gap-14">
      <div>
        {/* stepper */}
        <ol className="mb-9 flex items-center gap-2">
          {STEPS.map((label, index) => {
            const state =
              index === step ? "active" : index < step ? "done" : "todo";
            return (
              <li key={label} className="flex flex-1 items-center gap-2">
                <button
                  type="button"
                  onClick={() => index < step && setStep(index)}
                  className="flex items-center gap-2 text-left"
                >
                  <span
                    className={`grid size-7 shrink-0 place-items-center rounded-full text-[0.7rem] font-bold transition ${
                      state === "active"
                        ? "bg-espresso text-crema"
                        : state === "done"
                          ? "bg-sage text-crema"
                          : "border border-espresso/20 text-espresso/40"
                    }`}
                  >
                    {state === "done" ? "✓" : index + 1}
                  </span>
                  <span
                    className={`hidden text-xs font-semibold uppercase tracking-[0.14em] sm:block ${
                      state === "todo" ? "text-espresso/35" : "text-espresso"
                    }`}
                  >
                    {label}
                  </span>
                </button>
                {index < STEPS.length - 1 && (
                  <span className="h-px flex-1 bg-espresso/12" />
                )}
              </li>
            );
          })}
        </ol>

        <div className="rounded-[1.5rem] border border-espresso/10 bg-white/55 p-6 sm:p-8">
          {error && (
            <p className="mb-6 rounded-xl border border-terracotta/30 bg-terracotta/10 px-4 py-3 text-sm text-terracotta">
              {error}
            </p>
          )}

          {step === 0 && (
            <div className="animate-fade-up space-y-5">
              <header>
                <h2 className="font-display text-2xl text-espresso">
                  Who are we sending this to?
                </h2>
                <p className="mt-1.5 text-sm text-espresso/55">
                  We only email order updates. No spam, no nightly brew spam.
                </p>
              </header>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="College email"
                  value={form.email}
                  onChange={(value) => set("email", value)}
                  placeholder="you@college.edu"
                  type="email"
                  autoComplete="email"
                />
                <Field
                  label="Full name"
                  value={form.fullName}
                  onChange={(value) => set("fullName", value)}
                  placeholder="Ananya Rao"
                  autoComplete="name"
                />
                <Field
                  label="Phone"
                  value={form.phone}
                  onChange={(value) => set("phone", value)}
                  placeholder="+91 98765 43210"
                  autoComplete="tel"
                />
                <Field
                  label="College / campus (optional)"
                  value={form.campus}
                  onChange={(value) => set("campus", value)}
                  placeholder="IIT Madras"
                />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="animate-fade-up space-y-6">
              <header>
                <h2 className="font-display text-2xl text-espresso">
                  How should it reach you?
                </h2>
              </header>

              <div className="space-y-3">
                {DELIVERY_OPTIONS.map((item) => {
                  const active = delivery === item.value;
                  return (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setDelivery(item.value as DeliveryMethod)}
                      className={`flex w-full items-start gap-4 rounded-2xl border px-5 py-4 text-left transition ${
                        active
                          ? "border-espresso bg-espresso/[0.04] shadow-[0_16px_32px_-28px_rgba(27,18,14,0.9)]"
                          : "border-espresso/12 hover:border-espresso/40"
                      }`}
                    >
                      <span
                        className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border-2 transition ${
                          active ? "border-espresso" : "border-espresso/25"
                        }`}
                      >
                        {active && (
                          <span className="size-2.5 rounded-full bg-espresso" />
                        )}
                      </span>
                      <span className="flex-1">
                        <span className="flex items-center justify-between gap-3">
                          <span className="font-semibold text-espresso">
                            {item.label}
                          </span>
                          <span className="text-sm tabular-nums text-espresso/70">
                            {item.priceCents === 0
                              ? "Free"
                              : formatPrice(item.priceCents)}
                          </span>
                        </span>
                        <span className="mt-1 block text-xs text-espresso/55">
                          {item.detail} · {item.eta}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>

              {delivery !== "campus" ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Field
                      label="Hostel / street address"
                      value={form.address1}
                      onChange={(value) => set("address1", value)}
                      placeholder="Jamunia Bhavan, Room 214"
                      autoComplete="address-line1"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Field
                      label="Landmark / area (optional)"
                      value={form.address2}
                      onChange={(value) => set("address2", value)}
                      placeholder="Near the main gate"
                      autoComplete="address-line2"
                    />
                  </div>
                  <Field
                    label="City"
                    value={form.city}
                    onChange={(value) => set("city", value)}
                    placeholder="Chennai"
                    autoComplete="address-level2"
                  />
                  <Field
                    label="State"
                    value={form.state}
                    onChange={(value) => set("state", value)}
                    placeholder="Tamil Nadu"
                    autoComplete="address-level1"
                  />
                  <Field
                    label="PIN code"
                    value={form.postalCode}
                    onChange={(value) => set("postalCode", value)}
                    placeholder="600036"
                    autoComplete="postal-code"
                  />
                  <Field
                    label="Country"
                    value={form.country}
                    onChange={(value) => set("country", value)}
                    placeholder="India"
                    autoComplete="country-name"
                  />
                </div>
              ) : (
                <div className="rounded-2xl border border-sage/30 bg-sage/10 p-5">
                  <p className="text-sm text-espresso/75">
                    Collect from the <strong>Jaitra cart, Main Quad</strong> between
                    8am and 7pm. We will text {form.phone || "you"} when it is
                    packed.
                  </p>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-up space-y-6">
              <header>
                <h2 className="font-display text-2xl text-espresso">Payment</h2>
                <p className="mt-1.5 text-sm text-espresso/55">
                  Demo storefront — no card is charged. Any numbers will do.
                </p>
              </header>

              <div className="rounded-2xl bg-espresso p-5 text-crema">
                <div className="flex items-center justify-between">
                  <span className="text-[0.6rem] uppercase tracking-[0.24em] text-crema/60">
                    Jaitra Pay
                  </span>
                  <span className="text-lg">💳</span>
                </div>
                <p className="mt-6 font-display text-xl tracking-[0.2em]">
                  {form.card || "•••• •••• •••• ••••"}
                </p>
                <div className="mt-4 flex items-center justify-between text-[0.7rem] uppercase tracking-[0.18em] text-crema/70">
                  <span>{form.fullName || "Cardholder name"}</span>
                  <span>{form.expiry || "MM/YY"}</span>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Field
                    label="Card number"
                    value={form.card}
                    onChange={(value) =>
                      set(
                        "card",
                        value
                          .replace(/\D/g, "")
                          .slice(0, 16)
                          .replace(/(.{4})/g, "$1 ")
                          .trim(),
                      )
                    }
                    placeholder="4242 4242 4242 4242"
                    inputMode="numeric"
                  />
                </div>
                <Field
                  label="Expiry (MM/YY)"
                  value={form.expiry}
                  onChange={(value) => {
                    const digits = value.replace(/\D/g, "").slice(0, 4);
                    set(
                      "expiry",
                      digits.length > 2
                        ? `${digits.slice(0, 2)}/${digits.slice(2)}`
                        : digits,
                    );
                  }}
                  placeholder="09/28"
                  inputMode="numeric"
                />
                <Field
                  label="CVC"
                  value={form.cvc}
                  onChange={(value) =>
                    set("cvc", value.replace(/\D/g, "").slice(0, 4))
                  }
                  placeholder="123"
                  inputMode="numeric"
                />
                <div className="sm:col-span-2">
                  <Field
                    label="Delivery notes (optional)"
                    value={form.notes}
                    onChange={(value) => set("notes", value)}
                    placeholder="Leave with the security desk, please."
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-up space-y-6">
              <header>
                <h2 className="font-display text-2xl text-espresso">
                  Check it over
                </h2>
              </header>

              <dl className="grid gap-4 sm:grid-cols-2">
                <SummaryBlock
                  title="Contact"
                  lines={[form.fullName, form.email, form.phone, form.campus]}
                  onEdit={() => setStep(0)}
                />
                <SummaryBlock
                  title="Delivery"
                  lines={[
                    option.label,
                    delivery === "campus"
                      ? "Jaitra cart, Main Quad"
                      : [form.address1, form.address2].filter(Boolean).join(", "),
                    delivery === "campus"
                      ? null
                      : [form.city, form.state, form.postalCode]
                          .filter(Boolean)
                          .join(" · "),
                    option.eta,
                  ]}
                  onEdit={() => setStep(1)}
                />
                <SummaryBlock
                  title="Payment"
                  lines={[
                    form.card ? `Card ending ${form.card.slice(-4)}` : "—",
                    `Expires ${form.expiry}`,
                  ]}
                  onEdit={() => setStep(2)}
                />
                <SummaryBlock
                  title="Extras"
                  lines={[
                    promoLabel ? `Promo: ${promoLabel}` : "No promo code",
                    form.notes ? `Note: ${form.notes}` : null,
                  ]}
                  onEdit={() => setStep(2)}
                />
              </dl>

              <ul className="divide-y divide-espresso/10 border-y border-espresso/10">
                {items.map((item) => (
                  <li key={item.key} className="flex items-center gap-4 py-4">
                    <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-crema-dark">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-espresso">
                        {item.name}
                      </p>
                      <p className="text-xs text-espresso/55">
                        {item.sizeLabel} · {item.grind} · Qty {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-semibold tabular-nums text-espresso">
                      {formatPrice(item.unitPriceCents * item.quantity)}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep((value) => value - 1)}
                className="rounded-full border border-espresso/20 px-6 py-3 text-sm font-semibold text-espresso transition hover:border-espresso"
              >
                ← Back
              </button>
            )}
            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={next}
                className="group flex-1 rounded-full bg-espresso px-8 py-3.5 text-sm font-semibold text-crema transition hover:bg-caramel-deep sm:flex-none"
              >
                Continue to {STEPS[step + 1]}
                <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">
                  →
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={placeOrder}
                disabled={submitting}
                className="flex-1 rounded-full bg-espresso px-8 py-3.5 text-sm font-semibold text-crema transition hover:bg-caramel-deep disabled:opacity-60 sm:flex-none"
              >
                {submitting
                  ? "Placing order…"
                  : `Place order · ${formatPrice(totalCents)}`}
              </button>
            )}
          </div>

          <p className="mt-5 text-xs text-espresso/45">
            By placing this order you agree to our demo terms. This storefront does
            not process real payments.
          </p>
        </div>
      </div>

      {/* summary */}
      <aside className="lg:sticky lg:top-[8rem] lg:h-fit">
        <div className="rounded-[1.5rem] border border-espresso/10 bg-crema-dark/50 p-6">
          <h2 className="font-display text-xl text-espresso">Order summary</h2>

          <ul className="mt-5 space-y-4">
            {items.map((item) => (
              <li key={item.key} className="flex gap-4">
                <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-crema">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-espresso">
                    {item.name}
                  </p>
                  <p className="mt-0.5 text-xs text-espresso/55">
                    {item.sizeLabel} · {item.grind}
                  </p>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="inline-flex items-center rounded-full border border-espresso/15 bg-crema">
                      <button
                        type="button"
                        aria-label="Decrease"
                        onClick={() => updateQuantity(item.key, item.quantity - 1)}
                        className="grid size-7 place-items-center rounded-l-full text-espresso/60 hover:bg-espresso hover:text-crema"
                      >
                        −
                      </button>
                      <span className="w-7 text-center text-xs font-semibold tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        aria-label="Increase"
                        onClick={() => updateQuantity(item.key, item.quantity + 1)}
                        className="grid size-7 place-items-center rounded-r-full text-espresso/60 hover:bg-espresso hover:text-crema"
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.key)}
                      className="text-[0.65rem] uppercase tracking-[0.14em] text-espresso/40 transition hover:text-terracotta"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <p className="text-sm font-semibold tabular-nums text-espresso">
                  {formatPrice(item.unitPriceCents * item.quantity)}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-6 border-t border-espresso/10 pt-5">
            <form
              onSubmit={(event) => {
                event.preventDefault();
                const data = new FormData(event.currentTarget);
                setPromoCode(String(data.get("promo") ?? ""));
              }}
              className="flex gap-2"
            >
              <input
                name="promo"
                defaultValue={promoCode}
                placeholder="Promo code"
                className="min-w-0 flex-1 rounded-full border border-espresso/15 bg-crema px-4 py-2.5 text-sm uppercase tracking-[0.08em] text-espresso placeholder:normal-case placeholder:tracking-normal placeholder:text-espresso/35 focus:border-espresso focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-full border border-espresso/20 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-espresso transition hover:bg-espresso hover:text-crema"
              >
                Apply
              </button>
            </form>
            {promoError && <p className="mt-2 text-xs text-terracotta">{promoError}</p>}
            {promoLabel && (
              <p className="mt-2 text-xs font-semibold text-sage">✓ {promoLabel}</p>
            )}
            <div className="mt-3 flex flex-wrap gap-2">
              {PROMO_CODES.map((promo) => (
                <button
                  key={promo.code}
                  type="button"
                  onClick={() => setPromoCode(promo.code)}
                  className="rounded-full border border-dashed border-espresso/25 px-3 py-1 text-[0.65rem] font-semibold text-espresso/60 transition hover:border-espresso hover:text-espresso"
                >
                  {promo.code}
                </button>
              ))}
            </div>
          </div>

          <dl className="mt-6 space-y-2 border-t border-espresso/10 pt-5 text-sm">
            <Row label="Subtotal" value={formatPrice(subtotalCents)} />
            {discountCents > 0 && (
              <Row
                label="Discount"
                value={`−${formatPrice(discountCents)}`}
                accent
              />
            )}
            <Row
              label="Delivery"
              value={shippingCents === 0 ? "Free" : formatPrice(shippingCents)}
            />
            <div className="flex items-baseline justify-between border-t border-espresso/10 pt-3">
              <dt className="font-display text-lg text-espresso">Total</dt>
              <dd className="font-display text-xl tabular-nums text-espresso">
                {formatPrice(totalCents)}
              </dd>
            </div>
          </dl>

          <ul className="mt-6 space-y-2 text-xs text-espresso/55">
            <li>✓ Roasted within 48 hours of dispatch</li>
            <li>✓ Free delivery over ₹999</li>
            <li>✓ Swap any unopened bag within 14 days</li>
          </ul>
        </div>
      </aside>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  inputMode,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  inputMode?: "numeric" | "text";
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="text-[0.68rem] uppercase tracking-[0.16em] text-espresso/45">
        {label}
      </span>
      <input
        type={type}
        value={value}
        inputMode={inputMode}
        autoComplete={autoComplete}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-espresso/15 bg-crema px-4 py-3 text-sm text-espresso placeholder:text-espresso/35 focus:border-espresso focus:outline-none"
      />
    </label>
  );
}

function SummaryBlock({
  title,
  lines,
  onEdit,
}: {
  title: string;
  lines: (string | null | undefined)[];
  onEdit: () => void;
}) {
  return (
    <div className="rounded-2xl border border-espresso/10 bg-crema/60 p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-[0.68rem] uppercase tracking-[0.18em] text-espresso/45">
          {title}
        </h3>
        <button
          type="button"
          onClick={onEdit}
          className="text-xs font-semibold text-caramel-deep underline-offset-4 hover:underline"
        >
          Edit
        </button>
      </div>
      <div className="mt-2 space-y-0.5 text-sm text-espresso/75">
        {lines.filter(Boolean).map((line, index) => (
          <p key={`${line}-${index}`}>{line}</p>
        ))}
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`flex justify-between ${
        accent ? "font-semibold text-sage" : "text-espresso/65"
      }`}
    >
      <dt>{label}</dt>
      <dd className="tabular-nums">{value}</dd>
    </div>
  );
}
