// Client-safe shop constants — no database imports so these can be used in
// browser components without pulling the Postgres driver into the bundle.

export type SortKey =
  | "featured"
  | "price-asc"
  | "price-desc"
  | "rating"
  | "newest"
  | "name";

export type ProductFilters = {
  collections?: string[];
  roasts?: string[];
  caffeine?: string[];
  grinds?: string[];
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sort?: SortKey;
};

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating", label: "Top rated" },
  { value: "newest", label: "Newest roast" },
  { value: "name", label: "A – Z" },
];

export const ROAST_FACETS = [
  "Light",
  "Medium-Light",
  "Medium",
  "Medium-Dark",
  "Dark",
];

export const CAFFEINE_FACETS = ["Regular", "Half-caf", "Decaf"];

export const PRICE_BANDS: {
  value: string;
  label: string;
  min: number;
  max: number;
}[] = [
  { value: "under-600", label: "Under ₹600", min: 0, max: 59999 },
  { value: "600-900", label: "₹600 – ₹900", min: 60000, max: 90000 },
  { value: "900-1500", label: "₹900 – ₹1,500", min: 90000, max: 150000 },
  {
    value: "1500-plus",
    label: "₹1,500 & above",
    min: 150000,
    max: 10_000_000,
  },
];

export const GRIND_FACETS = [
  "Whole Bean",
  "Espresso",
  "Filter / Pour Over",
  "French Press",
  "Cold Brew",
];
