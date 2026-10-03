"use client";

import { useState } from "react";

import { useCart } from "@/components/cart/cart-provider";
import { formatPrice } from "@/lib/format";

type Size = { label: string; priceCents: number };

export function PurchasePanel({
  productId,
  slug,
  name,
  image,
  sizes,
  grinds,
  stock,
  brewMethods,
}: {
  productId: number;
  slug: string;
  name: string;
  image: string;
  sizes: Size[];
  grinds: string[];
  stock: number;
  brewMethods: string[];
}) {
  const { addItem } = useCart();
  const [sizeIndex, setSizeIndex] = useState(0);
  const [grind, setGrind] = useState(grinds[0] ?? "Whole Bean");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const size = sizes[sizeIndex] ?? { label: "250g", priceCents: 0 };
  const comparePerCup = Math.round(size.priceCents / 100 / 16);

  const handleAdd = () => {
    addItem({
      productId,
      slug,
      name,
      image,
      sizeLabel: size.label,
      grind,
      unitPriceCents: size.priceCents,
      quantity,
      stock,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const lowStock = stock <= 25;

  return (
    <div className="space-y-7">
      <div>
        <div className="flex items-center justify-between">
          <p className="eyebrow text-espresso/45">Size</p>
          <p className="text-xs text-espresso/45">
            ≈ ₹{comparePerCup} per cup
          </p>
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {sizes.map((option, index) => (
            <button
              key={option.label}
              type="button"
              onClick={() => setSizeIndex(index)}
              className={`rounded-xl border px-4 py-3 text-left transition ${
                index === sizeIndex
                  ? "border-espresso bg-espresso text-crema shadow-[0_12px_24px_-16px_rgba(27,18,14,0.9)]"
                  : "border-espresso/15 bg-white/50 text-espresso hover:border-espresso/50"
              }`}
            >
              <span className="block text-sm font-semibold">{option.label}</span>
              <span
                className={`mt-0.5 block text-xs tabular-nums ${
                  index === sizeIndex ? "text-crema/70" : "text-espresso/50"
                }`}
              >
                {formatPrice(option.priceCents)}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="eyebrow text-espresso/45">Grind for</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {grinds.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setGrind(option)}
              className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                option === grind
                  ? "border-espresso bg-espresso text-crema"
                  : "border-espresso/15 bg-white/50 text-espresso/75 hover:border-espresso/50 hover:text-espresso"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
        {brewMethods.length > 0 && (
          <p className="mt-2.5 text-xs text-espresso/45">
            Great as {brewMethods.slice(0, 3).join(", ").toLowerCase()}.
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="inline-flex items-center rounded-full border border-espresso/15 bg-white/50">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => setQuantity((value) => Math.max(1, value - 1))}
            className="grid size-11 place-items-center rounded-l-full text-espresso/70 transition hover:bg-espresso hover:text-crema"
          >
            −
          </button>
          <span className="w-10 text-center text-sm font-semibold tabular-nums">
            {quantity}
          </span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() =>
              setQuantity((value) => Math.min(Math.max(1, stock), value + 1))
            }
            className="grid size-11 place-items-center rounded-r-full text-espresso/70 transition hover:bg-espresso hover:text-crema"
          >
            +
          </button>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className={`group relative flex-1 overflow-hidden rounded-full px-8 py-4 text-sm font-semibold transition-all duration-300 ${
            added
              ? "bg-sage text-crema"
              : "bg-espresso text-crema hover:bg-caramel-deep"
          }`}
        >
          <span className="relative z-10 inline-flex items-center gap-2">
            {added ? "Added to your bag ✓" : `Add to bag · ${formatPrice(size.priceCents * quantity)}`}
          </span>
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-espresso/55">
        <span className="inline-flex items-center gap-1.5">
          <span className={`size-1.5 rounded-full ${lowStock ? "bg-terracotta" : "bg-sage"}`} />
          {lowStock ? `Only ${stock} left this batch` : `${stock} in stock`}
        </span>
        <span>Free delivery over ₹999</span>
        <span>Roasted to order</span>
      </div>
    </div>
  );
}
