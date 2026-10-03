import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const collections = pgTable("collections", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  tagline: text("tagline").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  accent: text("accent").notNull().default("#c2854f"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const products = pgTable(
  "products",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    tagline: text("tagline").notNull(),
    description: text("description").notNull(),
    story: text("story").notNull().default(""),
    origin: text("origin").notNull(),
    process: text("process").notNull().default("Washed"),
    varietal: text("varietal").notNull().default(""),
    altitude: text("altitude").notNull().default(""),
    roast: text("roast").notNull().default("Medium"),
    caffeine: text("caffeine").notNull().default("Regular"),
    intensity: integer("intensity").notNull().default(3),
    tastingNotes: jsonb("tasting_notes").$type<string[]>().notNull().default([]),
    brewMethods: jsonb("brew_methods").$type<string[]>().notNull().default([]),
    grinds: jsonb("grinds").$type<string[]>().notNull().default([]),
    sizes: jsonb("sizes").$type<{ label: string; priceCents: number }[]>()
      .notNull()
      .default([]),
    image: text("image").notNull(),
    gallery: jsonb("gallery").$type<string[]>().notNull().default([]),
    badge: text("badge"),
    priceCents: integer("price_cents").notNull(),
    compareAtCents: integer("compare_at_cents"),
    stock: integer("stock").notNull().default(60),
    ratingSum: integer("rating_sum").notNull().default(0),
    ratingCount: integer("rating_count").notNull().default(0),
    isFeatured: boolean("is_featured").notNull().default(false),
    isBestseller: boolean("is_bestseller").notNull().default(false),
    collectionId: integer("collection_id").references(() => collections.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("products_collection_idx").on(table.collectionId)],
);

export const reviews = pgTable(
  "reviews",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    author: text("author").notNull(),
    campus: text("campus").notNull().default(""),
    major: text("major").notNull().default(""),
    rating: integer("rating").notNull(),
    title: text("title").notNull(),
    body: text("body").notNull(),
    verified: boolean("verified").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("reviews_product_idx").on(table.productId)],
);

export const orders = pgTable(
  "orders",
  {
    id: serial("id").primaryKey(),
    orderNumber: text("order_number").notNull(),
    email: text("email").notNull(),
    fullName: text("full_name").notNull(),
    phone: text("phone").notNull().default(""),
    address1: text("address1").notNull().default(""),
    address2: text("address2").notNull().default(""),
    city: text("city").notNull().default(""),
    state: text("state").notNull().default(""),
    postalCode: text("postal_code").notNull().default(""),
    country: text("country").notNull().default("India"),
    campus: text("campus").notNull().default(""),
    deliveryMethod: text("delivery_method").notNull().default("standard"),
    promoCode: text("promo_code").notNull().default(""),
    subtotalCents: integer("subtotal_cents").notNull(),
    shippingCents: integer("shipping_cents").notNull().default(0),
    discountCents: integer("discount_cents").notNull().default(0),
    totalCents: integer("total_cents").notNull(),
    status: text("status").notNull().default("confirmed"),
    notes: text("notes").notNull().default(""),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [uniqueIndex("orders_number_idx").on(table.orderNumber)],
);

export const orderItems = pgTable(
  "order_items",
  {
    id: serial("id").primaryKey(),
    orderId: integer("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    productId: integer("product_id").references(() => products.id, {
      onDelete: "set null",
    }),
    slug: text("slug").notNull().default(""),
    name: text("name").notNull(),
    image: text("image").notNull().default(""),
    sizeLabel: text("size_label").notNull().default(""),
    grind: text("grind").notNull().default(""),
    unitPriceCents: integer("unit_price_cents").notNull(),
    quantity: integer("quantity").notNull().default(1),
  },
  (table) => [index("order_items_order_idx").on(table.orderId)],
);

export type Collection = typeof collections.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
