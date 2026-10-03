export type CartItem = {
  key: string;
  productId: number;
  slug: string;
  name: string;
  image: string;
  sizeLabel: string;
  grind: string;
  unitPriceCents: number;
  quantity: number;
  stock: number;
};

export type DeliveryMethod = "standard" | "express" | "campus";

export const DELIVERY_OPTIONS: {
  value: DeliveryMethod;
  label: string;
  detail: string;
  eta: string;
  priceCents: number;
}[] = [
  {
    value: "standard",
    label: "Standard delivery",
    detail: "Free above ₹999 · tracked courier",
    eta: "3 – 5 days",
    priceCents: 7900,
  },
  {
    value: "express",
    label: "Express delivery",
    detail: "Priority dispatch, roasted same morning",
    eta: "1 – 2 days",
    priceCents: 14900,
  },
  {
    value: "campus",
    label: "Campus pick-up",
    detail: "Collect at the Jaitra cart, Main Quad",
    eta: "Ready in 4 hours",
    priceCents: 0,
  },
];

export type PromoCode = {
  code: string;
  label: string;
  kind: "percent" | "shipping";
  value: number;
  minSubtotalCents: number;
};

export const PROMO_CODES: PromoCode[] = [
  {
    code: "STUDENT10",
    label: "10% student discount",
    kind: "percent",
    value: 10,
    minSubtotalCents: 0,
  },
  {
    code: "ALLNIGHTER15",
    label: "15% off orders above ₹1,500",
    kind: "percent",
    value: 15,
    minSubtotalCents: 150000,
  },
  {
    code: "FREECAMPUS",
    label: "Free delivery, any order",
    kind: "shipping",
    value: 100,
    minSubtotalCents: 0,
  },
];

export const FREE_SHIPPING_THRESHOLD_CENTS = 99900;

export function getPromo(code: string): PromoCode | null {
  const normalised = code.trim().toUpperCase();
  if (!normalised) return null;
  return PROMO_CODES.find((promo) => promo.code === normalised) ?? null;
}

export function cartSubtotalCents(items: CartItem[]) {
  return items.reduce((total, item) => total + item.unitPriceCents * item.quantity, 0);
}

export function cartCount(items: CartItem[]) {
  return items.reduce((total, item) => total + item.quantity, 0);
}

export type Totals = {
  subtotalCents: number;
  shippingCents: number;
  discountCents: number;
  totalCents: number;
  promoLabel: string | null;
  promoError: string | null;
  freeShippingRemainingCents: number;
};

export function computeTotals(
  items: CartItem[],
  delivery: DeliveryMethod = "standard",
  promoCode = "",
): Totals {
  const subtotalCents = cartSubtotalCents(items);
  const option =
    DELIVERY_OPTIONS.find((item) => item.value === delivery) ?? DELIVERY_OPTIONS[0];

  let shippingCents =
    option.value === "standard" && subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS
      ? 0
      : option.priceCents;

  if (subtotalCents === 0) shippingCents = 0;

  const promo = getPromo(promoCode);
  let discountCents = 0;
  let promoLabel: string | null = null;
  let promoError: string | null = null;

  if (promo) {
    if (subtotalCents < promo.minSubtotalCents) {
      promoError = `Add ₹${Math.ceil(
        (promo.minSubtotalCents - subtotalCents) / 100,
      )} more to use ${promo.code}.`;
    } else if (promo.kind === "percent") {
      discountCents = Math.round((subtotalCents * promo.value) / 100);
      promoLabel = promo.label;
    } else {
      discountCents = shippingCents;
      shippingCents = 0;
      promoLabel = promo.label;
    }
  } else if (promoCode.trim()) {
    promoError = "That code is not valid. Try STUDENT10.";
  }

  const totalCents = Math.max(0, subtotalCents - discountCents) + shippingCents;

  return {
    subtotalCents,
    shippingCents,
    discountCents,
    totalCents,
    promoLabel,
    promoError,
    freeShippingRemainingCents: Math.max(
      0,
      FREE_SHIPPING_THRESHOLD_CENTS - subtotalCents,
    ),
  };
}

export function makeCartKey(slug: string, sizeLabel: string, grind: string) {
  return `${slug}::${sizeLabel}::${grind}`;
}
