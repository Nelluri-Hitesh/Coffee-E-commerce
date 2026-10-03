"use client";

import { useState } from "react";

import { useCart } from "@/components/cart/cart-provider";

export type QuickAddPayload = {
  productId: number;
  slug: string;
  name: string;
  image: string;
  sizeLabel: string;
  grind: string;
  unitPriceCents: number;
  stock: number;
};

export function QuickAddButton({
  payload,
  label = "Quick add",
  variant = "card",
}: {
  payload: QuickAddPayload;
  label?: string;
  variant?: "card" | "wide";
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem({ ...payload, quantity: 1 });
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <button
      type="button"
      onClick={handleAdd}
      className={`group/btn inline-flex items-center justify-center gap-2 rounded-full text-xs font-semibold uppercase tracking-[0.14em] transition-all duration-300 ${
        variant === "card"
          ? "w-full bg-espresso/92 py-3 text-crema backdrop-blur hover:bg-caramel-deep hover:text-crema"
          : "w-full border border-espresso/20 py-3 text-espresso hover:border-espresso hover:bg-espresso hover:text-crema"
      } ${added ? "bg-sage text-crema" : ""}`}
    >
      {added ? (
        <>
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          In the bag
        </>
      ) : (
        <>
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.7">
            <path d="M6 8h12l-1 11a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 8Z" strokeLinecap="round" />
            <path d="M9.2 8V6.4a2.8 2.8 0 0 1 5.6 0V8" strokeLinecap="round" />
          </svg>
          {label}
        </>
      )}
    </button>
  );
}
