import { and, asc, desc, eq, gte, ilike, inArray, lte, or, sql } from "drizzle-orm";

import { db } from "@/db";
import { ensureSeeded } from "@/db/seed";
import {
  collections,
  orderItems,
  orders,
  products,
  reviews,
  type Collection,
  type Order,
  type OrderItem,
  type Product,
  type Review,
} from "@/db/schema";
import { seedCollections, seedProducts, seedReviews } from "@/db/seed-data";

export type ProductWithCollection = Product & {
  collection: Pick<Collection, "slug" | "name" | "accent"> | null;
};

import {
  type ProductFilters,
  type SortKey,
} from "@/lib/filters";

export {
  CAFFEINE_FACETS,
  GRIND_FACETS,
  PRICE_BANDS,
  ROAST_FACETS,
  SORT_OPTIONS,
} from "@/lib/filters";
export type { ProductFilters, SortKey } from "@/lib/filters";

// Fallback in-memory dataset
const mockCollections: Collection[] = seedCollections.map((c, idx) => ({
  id: idx + 1,
  slug: c.slug,
  name: c.name,
  tagline: c.tagline,
  description: c.description,
  image: c.image,
  accent: c.accent,
  sortOrder: c.sortOrder,
}));

const mockCollectionMap = new Map(mockCollections.map((c) => [c.slug, c]));

const mockProducts: ProductWithCollection[] = seedProducts.map((p, idx) => {
  const col = mockCollectionMap.get(p.collectionSlug);
  const revs = seedReviews.filter((r) => r.productSlug === p.slug);
  const ratingSum = revs.reduce((acc, r) => acc + r.rating, 0);
  return {
    id: idx + 1,
    slug: p.slug,
    name: p.name,
    tagline: p.tagline,
    description: p.description,
    story: p.story,
    origin: p.origin,
    process: p.process,
    varietal: p.varietal,
    altitude: p.altitude,
    roast: p.roast,
    caffeine: p.caffeine,
    intensity: p.intensity,
    tastingNotes: p.tastingNotes,
    brewMethods: p.brewMethods,
    grinds: p.grinds,
    sizes: p.sizes,
    image: p.image,
    gallery: p.gallery,
    badge: p.badge,
    priceCents: p.sizes[0]?.priceCents ?? 0,
    compareAtCents: p.compareAtCents,
    stock: p.stock,
    ratingSum,
    ratingCount: revs.length,
    isFeatured: p.isFeatured,
    isBestseller: p.isBestseller,
    collectionId: col?.id ?? null,
    createdAt: new Date(),
    collection: col ? { slug: col.slug, name: col.name, accent: col.accent } : null,
  };
});

const mockReviews: Review[] = seedReviews.map((r, idx) => {
  const prod = mockProducts.find((p) => p.slug === r.productSlug);
  return {
    id: idx + 1,
    productId: prod?.id ?? 1,
    author: r.author,
    campus: r.campus,
    major: r.major,
    rating: r.rating,
    title: r.title,
    body: r.body,
    verified: true,
    createdAt: new Date(Date.now() - r.daysAgo * 86_400_000),
  };
});

export async function getCollections(): Promise<Collection[]> {
  if (!db) return mockCollections;
  try {
    await ensureSeeded();
    return await db.select().from(collections).orderBy(asc(collections.sortOrder));
  } catch {
    return mockCollections;
  }
}

export async function getCollectionCounts(): Promise<Map<string, number>> {
  if (!db) {
    const map = new Map<string, number>();
    for (const c of mockCollections) {
      const count = mockProducts.filter((p) => p.collection?.slug === c.slug).length;
      map.set(c.slug, count);
    }
    return map;
  }
  try {
    await ensureSeeded();
    const rows: { slug: string; count: number }[] = await db
      .select({
        slug: collections.slug,
        count: sql<number>`count(${products.id})::int`,
      })
      .from(collections)
      .leftJoin(products, eq(products.collectionId, collections.id))
      .groupBy(collections.slug);

    return new Map(rows.map((row) => [row.slug, Number(row.count)]));
  } catch {
    const map = new Map<string, number>();
    for (const c of mockCollections) {
      const count = mockProducts.filter((p) => p.collection?.slug === c.slug).length;
      map.set(c.slug, count);
    }
    return map;
  }
}

function buildWhere(filters: ProductFilters) {
  const clauses = [];

  if (filters.collections?.length) {
    clauses.push(inArray(collections.slug, filters.collections));
  }
  if (filters.roasts?.length) {
    clauses.push(inArray(products.roast, filters.roasts));
  }
  if (filters.caffeine?.length) {
    clauses.push(inArray(products.caffeine, filters.caffeine));
  }
  if (filters.minPrice !== undefined) {
    clauses.push(gte(products.priceCents, filters.minPrice));
  }
  if (filters.maxPrice !== undefined) {
    clauses.push(lte(products.priceCents, filters.maxPrice));
  }
  if (filters.search) {
    const term = `%${filters.search.trim()}%`;
    clauses.push(
      or(
        ilike(products.name, term),
        ilike(products.tagline, term),
        ilike(products.origin, term),
        ilike(products.description, term),
      ),
    );
  }
  if (filters.grinds?.length) {
    clauses.push(
      or(
        ...filters.grinds.map(
          (grind) => sql`${products.grinds} @> ${JSON.stringify([grind])}::jsonb`,
        ),
      ),
    );
  }

  return clauses.length ? and(...clauses) : undefined;
}

function orderClause(sort: SortKey = "featured") {
  switch (sort) {
    case "price-asc":
      return [asc(products.priceCents), asc(products.name)];
    case "price-desc":
      return [desc(products.priceCents), asc(products.name)];
    case "rating":
      return [
        desc(
          sql`case when ${products.ratingCount} > 0
            then ${products.ratingSum}::numeric / ${products.ratingCount}
            else 0 end`,
        ),
        desc(products.ratingCount),
      ];
    case "newest":
      return [desc(products.createdAt), asc(products.name)];
    case "name":
      return [asc(products.name)];
    default:
      return [
        desc(products.isFeatured),
        desc(products.isBestseller),
        desc(products.ratingCount),
        asc(products.name),
      ];
  }
}

const productSelection = {
  id: products.id,
  slug: products.slug,
  name: products.name,
  tagline: products.tagline,
  description: products.description,
  story: products.story,
  origin: products.origin,
  process: products.process,
  varietal: products.varietal,
  altitude: products.altitude,
  roast: products.roast,
  caffeine: products.caffeine,
  intensity: products.intensity,
  tastingNotes: products.tastingNotes,
  brewMethods: products.brewMethods,
  grinds: products.grinds,
  sizes: products.sizes,
  image: products.image,
  gallery: products.gallery,
  badge: products.badge,
  priceCents: products.priceCents,
  compareAtCents: products.compareAtCents,
  stock: products.stock,
  ratingSum: products.ratingSum,
  ratingCount: products.ratingCount,
  isFeatured: products.isFeatured,
  isBestseller: products.isBestseller,
  collectionId: products.collectionId,
  createdAt: products.createdAt,
  collectionSlug: collections.slug,
  collectionName: collections.name,
  collectionAccent: collections.accent,
};

type RawProductRow = {
  [K in keyof typeof productSelection]: unknown;
};

function hydrate(row: RawProductRow): ProductWithCollection {
  const { collectionSlug, collectionName, collectionAccent, ...rest } = row as Omit<
    RawProductRow,
    "collectionSlug" | "collectionName" | "collectionAccent"
  > & {
    collectionSlug: string | null;
    collectionName: string | null;
    collectionAccent: string | null;
  };

  return {
    ...(rest as Product),
    collection:
      collectionSlug && collectionName
        ? {
            slug: collectionSlug,
            name: collectionName,
            accent: collectionAccent ?? "#c2854f",
          }
        : null,
  };
}

export async function getProducts(
  filters: ProductFilters = {},
): Promise<ProductWithCollection[]> {
  if (!db) return mockProducts;
  try {
    await ensureSeeded();

    const rows = await db
      .select(productSelection)
      .from(products)
      .leftJoin(collections, eq(products.collectionId, collections.id))
      .where(buildWhere(filters))
      .orderBy(...orderClause(filters.sort));

    return rows.map(hydrate);
  } catch {
    return mockProducts;
  }
}

export async function getProductBySlug(
  slug: string,
): Promise<ProductWithCollection | null> {
  if (!db) return mockProducts.find((p) => p.slug === slug) ?? null;
  try {
    await ensureSeeded();

    const [row] = await db
      .select(productSelection)
      .from(products)
      .leftJoin(collections, eq(products.collectionId, collections.id))
      .where(eq(products.slug, slug))
      .limit(1);

    return row ? hydrate(row) : null;
  } catch {
    return mockProducts.find((p) => p.slug === slug) ?? null;
  }
}

export async function getFeaturedProducts(
  limit = 4,
): Promise<ProductWithCollection[]> {
  if (!db) return mockProducts.filter((p) => p.isFeatured).slice(0, limit);
  try {
    await ensureSeeded();

    const rows = await db
      .select(productSelection)
      .from(products)
      .leftJoin(collections, eq(products.collectionId, collections.id))
      .where(eq(products.isFeatured, true))
      .orderBy(desc(products.isBestseller), desc(products.ratingCount))
      .limit(limit);

    return rows.map(hydrate);
  } catch {
    return mockProducts.filter((p) => p.isFeatured).slice(0, limit);
  }
}

export async function getRelatedProducts(
  product: ProductWithCollection,
  limit = 4,
): Promise<ProductWithCollection[]> {
  if (!db) {
    return mockProducts
      .filter((p) => p.id !== product.id && p.collection?.slug === product.collection?.slug)
      .slice(0, limit);
  }
  try {
    const rows = await db
      .select(productSelection)
      .from(products)
      .leftJoin(collections, eq(products.collectionId, collections.id))
      .where(
        and(
          product.collection
            ? eq(collections.slug, product.collection.slug)
            : sql`true`,
          sql`${products.id} <> ${product.id}`,
        ),
      )
      .orderBy(desc(products.isBestseller))
      .limit(limit);

    if (rows.length >= limit) return rows.map(hydrate);

    const fallback = await db
      .select(productSelection)
      .from(products)
      .leftJoin(collections, eq(products.collectionId, collections.id))
      .where(sql`${products.id} <> ${product.id}`)
      .orderBy(desc(products.ratingCount))
      .limit(limit);

    const merged = [...rows, ...fallback].filter(
      (row, index, all) => all.findIndex((item) => item.id === row.id) === index,
    );

    return merged.slice(0, limit).map(hydrate);
  } catch {
    return mockProducts
      .filter((p) => p.id !== product.id)
      .slice(0, limit);
  }
}

export async function getReviewsForProduct(productId: number): Promise<Review[]> {
  if (!db) return mockReviews.filter((r) => r.productId === productId);
  try {
    await ensureSeeded();
    return await db
      .select()
      .from(reviews)
      .where(eq(reviews.productId, productId))
      .orderBy(desc(reviews.createdAt));
  } catch {
    return mockReviews.filter((r) => r.productId === productId);
  }
}

export async function getTopReviews(limit = 8) {
  if (!db) {
    return mockReviews.slice(0, limit).map((r) => {
      const p = mockProducts.find((prod) => prod.id === r.productId);
      return {
        ...r,
        productName: p?.name ?? "Coffee",
        productSlug: p?.slug ?? "coffee",
      };
    });
  }
  try {
    await ensureSeeded();
    return await db
      .select({
        id: reviews.id,
        author: reviews.author,
        campus: reviews.campus,
        major: reviews.major,
        rating: reviews.rating,
        title: reviews.title,
        body: reviews.body,
        createdAt: reviews.createdAt,
        verified: reviews.verified,
        productName: products.name,
        productSlug: products.slug,
      })
      .from(reviews)
      .innerJoin(products, eq(reviews.productId, products.id))
      .where(eq(reviews.rating, 5))
      .orderBy(desc(reviews.createdAt))
      .limit(limit);
  } catch {
    return mockReviews.slice(0, limit).map((r) => {
      const p = mockProducts.find((prod) => prod.id === r.productId);
      return {
        ...r,
        productName: p?.name ?? "Coffee",
        productSlug: p?.slug ?? "coffee",
      };
    });
  }
}

export async function getStorefrontStats() {
  if (!db) {
    const ratingSum = mockProducts.reduce((acc, p) => acc + p.ratingSum, 0);
    const ratingCount = mockProducts.reduce((acc, p) => acc + p.ratingCount, 0);
    return {
      productCount: mockProducts.length,
      reviewCount: mockReviews.length,
      averageRating: ratingCount > 0 ? ratingSum / ratingCount : 4.9,
    };
  }
  try {
    await ensureSeeded();
    const [productStats] = await db
      .select({
        productCount: sql<number>`count(*)::int`,
        ratingSum: sql<number>`coalesce(sum(${products.ratingSum}), 0)::int`,
        ratingCount: sql<number>`coalesce(sum(${products.ratingCount}), 0)::int`,
      })
      .from(products);

    const [reviewStats] = await db
      .select({ reviewCount: sql<number>`count(*)::int` })
      .from(reviews);

    const average =
      productStats && productStats.ratingCount > 0
        ? productStats.ratingSum / productStats.ratingCount
        : 0;

    return {
      productCount: productStats?.productCount ?? 0,
      reviewCount: reviewStats?.reviewCount ?? 0,
      averageRating: average,
    };
  } catch {
    return {
      productCount: mockProducts.length,
      reviewCount: mockReviews.length,
      averageRating: 4.9,
    };
  }
}

export async function createReview(input: {
  slug: string;
  author: string;
  campus: string;
  major: string;
  rating: number;
  title: string;
  body: string;
}) {
  if (!db) {
    const prod = mockProducts.find((p) => p.slug === input.slug);
    if (!prod) return null;
    const newReview: Review = {
      id: mockReviews.length + 1,
      productId: prod.id,
      author: input.author,
      campus: input.campus,
      major: input.major,
      rating: input.rating,
      title: input.title,
      body: input.body,
      verified: false,
      createdAt: new Date(),
    };
    mockReviews.push(newReview);
    return newReview;
  }
  try {
    await ensureSeeded();
    const [product] = await db
      .select({ id: products.id })
      .from(products)
      .where(eq(products.slug, input.slug))
      .limit(1);

    if (!product) return null;

    const [inserted] = await db
      .insert(reviews)
      .values({
        productId: product.id,
        author: input.author,
        campus: input.campus,
        major: input.major,
        rating: input.rating,
        title: input.title,
        body: input.body,
        verified: false,
      })
      .returning();

    await db
      .update(products)
      .set({
        ratingSum: sql`${products.ratingSum} + ${input.rating}`,
        ratingCount: sql`${products.ratingCount} + 1`,
      })
      .where(eq(products.id, product.id));

    return inserted;
  } catch {
    const prod = mockProducts.find((p) => p.slug === input.slug);
    if (!prod) return null;
    const newReview: Review = {
      id: mockReviews.length + 1,
      productId: prod.id,
      author: input.author,
      campus: input.campus,
      major: input.major,
      rating: input.rating,
      title: input.title,
      body: input.body,
      verified: false,
      createdAt: new Date(),
    };
    mockReviews.push(newReview);
    return newReview;
  }
}

export type NewOrderInput = {
  email: string;
  fullName: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  campus: string;
  deliveryMethod: string;
  promoCode: string;
  notes: string;
  subtotalCents: number;
  shippingCents: number;
  discountCents: number;
  totalCents: number;
  items: {
    productId: number | null;
    slug: string;
    name: string;
    image: string;
    sizeLabel: string;
    grind: string;
    unitPriceCents: number;
    quantity: number;
  }[];
};

function generateOrderNumber() {
  const random = Math.floor(Math.random() * 46656)
    .toString(36)
    .toUpperCase()
    .padStart(3, "0");
  const stamp = Date.now().toString(36).slice(-4).toUpperCase();
  return `JAI-${stamp}${random}`;
}

const mockOrders: any[] = [];

export async function createOrder(input: NewOrderInput) {
  const orderNumber = generateOrderNumber();
  const mockOrder = {
    id: mockOrders.length + 1,
    orderNumber,
    ...input,
    status: "confirmed",
    createdAt: new Date(),
  };

  if (!db) {
    mockOrders.push(mockOrder);
    return mockOrder;
  }
  try {
    await ensureSeeded();

    const [order] = await db
      .insert(orders)
      .values({
        orderNumber,
        email: input.email,
        fullName: input.fullName,
        phone: input.phone,
        address1: input.address1,
        address2: input.address2,
        city: input.city,
        state: input.state,
        postalCode: input.postalCode,
        country: input.country,
        campus: input.campus,
        deliveryMethod: input.deliveryMethod,
        promoCode: input.promoCode,
        notes: input.notes,
        subtotalCents: input.subtotalCents,
        shippingCents: input.shippingCents,
        discountCents: input.discountCents,
        totalCents: input.totalCents,
        status: "confirmed",
      })
      .returning();

    if (input.items.length) {
      await db.insert(orderItems).values(
        input.items.map((item) => ({
          orderId: order.id,
          productId: item.productId,
          slug: item.slug,
          name: item.name,
          image: item.image,
          sizeLabel: item.sizeLabel,
          grind: item.grind,
          unitPriceCents: item.unitPriceCents,
          quantity: item.quantity,
        })),
      );
    }

    return order;
  } catch {
    mockOrders.push(mockOrder);
    return mockOrder;
  }
}

export async function getOrderByNumber(
  orderNumber: string,
): Promise<{ order: Order; items: OrderItem[] } | null> {
  if (!db) {
    const found = mockOrders.find((o) => o.orderNumber === orderNumber);
    return found ? { order: found, items: found.items ?? [] } : null;
  }
  try {
    await ensureSeeded();
    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.orderNumber, orderNumber))
      .limit(1);

    if (!order) return null;

    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, order.id))
      .orderBy(asc(orderItems.id));

    return { order, items };
  } catch {
    const found = mockOrders.find((o) => o.orderNumber === orderNumber);
    return found ? { order: found, items: found.items ?? [] } : null;
  }
}
