import { sql } from "drizzle-orm";

import { db } from "@/db";
import {
  collections,
  orderItems,
  orders,
  products,
  reviews,
  type Collection,
} from "@/db/schema";
import { seedCollections, seedProducts, seedReviews } from "@/db/seed-data";

export async function seedDatabase() {
  await db.delete(orderItems);
  await db.delete(orders);
  await db.delete(reviews);
  await db.delete(products);
  await db.delete(collections);

  const insertedCollections: Collection[] = await db
    .insert(collections)
    .values(
      seedCollections.map((collection) => ({
        slug: collection.slug,
        name: collection.name,
        tagline: collection.tagline,
        description: collection.description,
        image: collection.image,
        accent: collection.accent,
        sortOrder: collection.sortOrder,
      })),
    )
    .returning();

  const collectionIdBySlug = new Map<string, number>(
    insertedCollections.map((collection) => [collection.slug, collection.id]),
  );

  const ratingBySlug = new Map<string, { sum: number; count: number }>();
  for (const review of seedReviews) {
    const current = ratingBySlug.get(review.productSlug) ?? { sum: 0, count: 0 };
    current.sum += review.rating;
    current.count += 1;
    ratingBySlug.set(review.productSlug, current);
  }

  const insertedProducts: { id: number; slug: string }[] = await db
    .insert(products)
    .values(
      seedProducts.map((product) => {
        const rating = ratingBySlug.get(product.slug) ?? { sum: 0, count: 0 };
        return {
          slug: product.slug,
          name: product.name,
          tagline: product.tagline,
          description: product.description,
          story: product.story,
          origin: product.origin,
          process: product.process,
          varietal: product.varietal,
          altitude: product.altitude,
          roast: product.roast,
          caffeine: product.caffeine,
          intensity: product.intensity,
          tastingNotes: product.tastingNotes,
          brewMethods: product.brewMethods,
          grinds: product.grinds,
          sizes: product.sizes,
          image: product.image,
          gallery: product.gallery,
          badge: product.badge,
          priceCents: product.sizes[0]?.priceCents ?? 0,
          compareAtCents: product.compareAtCents,
          stock: product.stock,
          ratingSum: rating.sum,
          ratingCount: rating.count,
          isFeatured: product.isFeatured,
          isBestseller: product.isBestseller,
          collectionId: collectionIdBySlug.get(product.collectionSlug) ?? null,
        };
      }),
    )
    .returning({ id: products.id, slug: products.slug });

  const productIdBySlug = new Map<string, number>(
    insertedProducts.map((product) => [product.slug, product.id]),
  );

  await db.insert(reviews).values(
    seedReviews.map((review) => ({
      productId: productIdBySlug.get(review.productSlug) ?? 0,
      author: review.author,
      campus: review.campus,
      major: review.major,
      rating: review.rating,
      title: review.title,
      body: review.body,
      verified: true,
      createdAt: new Date(Date.now() - review.daysAgo * 86_400_000),
    })),
  );
}

async function createTablesIfNotExist() {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS collections (
      id SERIAL PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      tagline TEXT NOT NULL,
      description TEXT NOT NULL,
      image TEXT NOT NULL,
      accent TEXT NOT NULL DEFAULT '#c2854f',
      sort_order INTEGER NOT NULL DEFAULT 0
    );
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      tagline TEXT NOT NULL,
      description TEXT NOT NULL,
      story TEXT NOT NULL DEFAULT '',
      origin TEXT NOT NULL,
      process TEXT NOT NULL DEFAULT 'Washed',
      varietal TEXT NOT NULL DEFAULT '',
      altitude TEXT NOT NULL DEFAULT '',
      roast TEXT NOT NULL DEFAULT 'Medium',
      caffeine TEXT NOT NULL DEFAULT 'Regular',
      intensity INTEGER NOT NULL DEFAULT 3,
      tasting_notes JSONB NOT NULL DEFAULT '[]'::jsonb,
      brew_methods JSONB NOT NULL DEFAULT '[]'::jsonb,
      grinds JSONB NOT NULL DEFAULT '[]'::jsonb,
      sizes JSONB NOT NULL DEFAULT '[]'::jsonb,
      image TEXT NOT NULL,
      gallery JSONB NOT NULL DEFAULT '[]'::jsonb,
      badge TEXT,
      price_cents INTEGER NOT NULL,
      compare_at_cents INTEGER,
      stock INTEGER NOT NULL DEFAULT 60,
      rating_sum INTEGER NOT NULL DEFAULT 0,
      rating_count INTEGER NOT NULL DEFAULT 0,
      is_featured BOOLEAN NOT NULL DEFAULT false,
      is_bestseller BOOLEAN NOT NULL DEFAULT false,
      collection_id INTEGER REFERENCES collections(id) ON DELETE SET NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS reviews (
      id SERIAL PRIMARY KEY,
      product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      author TEXT NOT NULL,
      campus TEXT NOT NULL DEFAULT '',
      major TEXT NOT NULL DEFAULT '',
      rating INTEGER NOT NULL,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      verified BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      order_number TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL,
      full_name TEXT NOT NULL,
      phone TEXT NOT NULL DEFAULT '',
      address1 TEXT NOT NULL DEFAULT '',
      address2 TEXT NOT NULL DEFAULT '',
      city TEXT NOT NULL DEFAULT '',
      state TEXT NOT NULL DEFAULT '',
      postal_code TEXT NOT NULL DEFAULT '',
      country TEXT NOT NULL DEFAULT 'India',
      campus TEXT NOT NULL DEFAULT '',
      delivery_method TEXT NOT NULL DEFAULT 'standard',
      promo_code TEXT NOT NULL DEFAULT '',
      subtotal_cents INTEGER NOT NULL,
      shipping_cents INTEGER NOT NULL DEFAULT 0,
      discount_cents INTEGER NOT NULL DEFAULT 0,
      total_cents INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'confirmed',
      notes TEXT NOT NULL DEFAULT '',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS order_items (
      id SERIAL PRIMARY KEY,
      order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
      slug TEXT NOT NULL DEFAULT '',
      name TEXT NOT NULL,
      image TEXT NOT NULL DEFAULT '',
      size_label TEXT NOT NULL DEFAULT '',
      grind TEXT NOT NULL DEFAULT '',
      unit_price_cents INTEGER NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1
    );
  `);
}

async function runSeedOnce() {
  await createTablesIfNotExist();
  const [row] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(collections);

  if ((row?.count ?? 0) > 0) return;
  await seedDatabase();
}

let seedPromise: Promise<void> | null = null;

/**
 * Seeds the storefront with demo catalogue data the first time it is queried.
 * Safe to call from any request path — the work happens at most once per
 * process, and failures are swallowed so the app still renders.
 */
export async function ensureSeeded() {
  if (!seedPromise) {
    seedPromise = runSeedOnce().catch((error) => {
      seedPromise = null;
      console.error("[seed] failed", error);
    });
  }
  await seedPromise;
}
