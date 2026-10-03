import type { Metadata } from "next";

import { CheckoutFlow } from "@/components/checkout/checkout-flow";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your Jaitra Coffee order.",
};

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-10 sm:px-6 lg:px-8">
      <header className="mb-10 max-w-2xl">
        <p className="eyebrow text-caramel-deep">Secure checkout</p>
        <h1 className="mt-3 font-display text-[2.4rem] leading-[1.06] text-espresso sm:text-5xl">
          Four quick steps to better coffee
        </h1>
        <p className="mt-4 text-[0.98rem] leading-relaxed text-espresso/65">
          Bags are roasted to order, so nothing sits in a warehouse. Pick delivery
          or campus collection and we will handle the rest.
        </p>
      </header>

      <CheckoutFlow />
    </div>
  );
}
