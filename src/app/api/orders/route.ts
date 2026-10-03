import { cartSubtotalCents, computeTotals, type CartItem } from "@/lib/shop";
import { createOrder } from "@/lib/queries";

export const dynamic = "force-dynamic";

type Payload = {
  email?: string;
  fullName?: string;
  phone?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  campus?: string;
  deliveryMethod?: string;
  promoCode?: string;
  notes?: string;
  items?: unknown;
};

function str(value: unknown, max = 160) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

const VALID_DELIVERY = new Set(["standard", "express", "campus"]);

export async function POST(request: Request) {
  let payload: Payload;
  try {
    payload = (await request.json()) as Payload;
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const email = str(payload.email, 160);
  const fullName = str(payload.fullName, 120);
  const deliveryMethod = VALID_DELIVERY.has(str(payload.deliveryMethod, 20))
    ? str(payload.deliveryMethod, 20)
    : "standard";
  const promoCode = str(payload.promoCode, 40).toUpperCase();

  const rawItems = Array.isArray(payload.items) ? payload.items : [];

  const items: CartItem[] = rawItems.flatMap((entry) => {
    if (!entry || typeof entry !== "object") return [];
    const item = entry as Partial<CartItem>;
    if (
      typeof item.slug !== "string" ||
      typeof item.name !== "string" ||
      typeof item.unitPriceCents !== "number" ||
      typeof item.quantity !== "number"
    ) {
      return [];
    }
    return [
      {
        key: str(item.key, 200) || `${item.slug}`,
        productId: typeof item.productId === "number" ? item.productId : 0,
        slug: item.slug,
        name: str(item.name, 160),
        image: str(item.image, 300),
        sizeLabel: str(item.sizeLabel, 40),
        grind: str(item.grind, 40),
        unitPriceCents: Math.max(0, Math.round(item.unitPriceCents)),
        quantity: Math.min(99, Math.max(1, Math.round(item.quantity))),
        stock: typeof item.stock === "number" ? item.stock : 99,
      },
    ];
  });

  if (!fullName) {
    return Response.json({ error: "Name is required." }, { status: 400 });
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return Response.json({ error: "A valid email is required." }, { status: 400 });
  }
  if (items.length === 0) {
    return Response.json({ error: "Your bag is empty." }, { status: 400 });
  }
  if (deliveryMethod !== "campus") {
    if (!str(payload.address1, 200)) {
      return Response.json({ error: "Street address is required." }, { status: 400 });
    }
    if (!str(payload.city, 80) || !str(payload.postalCode, 20)) {
      return Response.json(
        { error: "City and PIN code are required for delivery." },
        { status: 400 },
      );
    }
  }

  // Recompute money server-side so client tampering cannot change the total.
  const subtotalCents = cartSubtotalCents(items);
  const totals = computeTotals(items, deliveryMethod as never, promoCode);

  const order = await createOrder({
    email,
    fullName,
    phone: str(payload.phone, 30),
    address1: str(payload.address1, 200),
    address2: str(payload.address2, 200),
    city: str(payload.city, 80),
    state: str(payload.state, 80),
    postalCode: str(payload.postalCode, 20),
    country: str(payload.country, 80) || "India",
    campus: str(payload.campus, 120),
    deliveryMethod,
    promoCode,
    notes: str(payload.notes, 500),
    subtotalCents,
    shippingCents: totals.shippingCents,
    discountCents: totals.discountCents,
    totalCents: totals.totalCents,
    items: items.map((item) => ({
      productId: item.productId || null,
      slug: item.slug,
      name: item.name,
      image: item.image,
      sizeLabel: item.sizeLabel,
      grind: item.grind,
      unitPriceCents: item.unitPriceCents,
      quantity: item.quantity,
    })),
  });

  return Response.json(
    {
      orderNumber: order.orderNumber,
      totalCents: order.totalCents,
      eta: deliveryMethod === "campus" ? "Ready in 4 hours" : "3 – 5 days",
    },
    { status: 201 },
  );
}
