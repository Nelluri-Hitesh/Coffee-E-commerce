"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";

import {
  CAFFEINE_FACETS,
  GRIND_FACETS,
  PRICE_BANDS,
  ROAST_FACETS,
  SORT_OPTIONS,
  type SortKey,
} from "@/lib/filters";

export type ShopState = {
  collections: string[];
  roasts: string[];
  caffeine: string[];
  grinds: string[];
  bands: string[];
  sort: SortKey;
  search: string;
};

export type ShopFacets = {
  collections: { slug: string; name: string; count: number }[];
};

function buildQuery(state: ShopState) {
  const params = new URLSearchParams();
  const listKeys: (keyof Omit<ShopState, "sort" | "search">)[] = [
    "collections",
    "roasts",
    "caffeine",
    "grinds",
    "bands",
  ];

  listKeys.forEach((key) => {
    const values = state[key];
    if (values.length) params.set(key, values.join(","));
  });

  if (state.search.trim()) params.set("q", state.search.trim());
  if (state.sort !== "featured") params.set("sort", state.sort);

  return params;
}

export function ShopControls({
  state,
  facets,
  resultCount,
}: {
  state: ShopState;
  facets: ShopFacets;
  resultCount: number;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState(state.search);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => setSearch(state.search), [state.search]);

  const activeCount = useMemo(
    () =>
      state.collections.length +
      state.roasts.length +
      state.caffeine.length +
      state.grinds.length +
      state.bands.length +
      (state.search ? 1 : 0),
    [state],
  );

  const push = (next: ShopState) => {
    const query = buildQuery(next);
    startTransition(() => {
      router.push(query.toString() ? `/shop?${query}` : "/shop", {
        scroll: false,
      });
    });
  };

  const toggle = (
    key: keyof Omit<ShopState, "sort" | "search">,
    value: string,
  ) => {
    const current = state[key];
    const next = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];
    push({ ...state, [key]: next });
  };

  const clearAll = () => {
    setSearch("");
    push({
      collections: [],
      roasts: [],
      caffeine: [],
      grinds: [],
      bands: [],
      sort: state.sort,
      search: "",
    });
  };

  const groups: {
    key: keyof Omit<ShopState, "sort" | "search">;
    label: string;
    options: { value: string; label: string; hint?: string }[];
  }[] = [
    {
      key: "collections",
      label: "Collection",
      options: facets.collections.map((collection) => ({
        value: collection.slug,
        label: collection.name,
        hint: String(collection.count),
      })),
    },
    {
      key: "roasts",
      label: "Roast level",
      options: ROAST_FACETS.map((roast) => ({ value: roast, label: roast })),
    },
    {
      key: "bands",
      label: "Price",
      options: PRICE_BANDS.map((band) => ({ value: band.value, label: band.label })),
    },
    {
      key: "caffeine",
      label: "Caffeine",
      options: CAFFEINE_FACETS.map((item) => ({ value: item, label: item })),
    },
    {
      key: "grinds",
      label: "Grind available",
      options: GRIND_FACETS.map((item) => ({ value: item, label: item })),
    },
  ];

  const panel = (
    <div className="space-y-8">
      <div>
        <label
          htmlFor="shop-search"
          className="eyebrow text-espresso/45"
        >
          Search
        </label>
        <form
          className="mt-3 flex items-center gap-2 rounded-full border border-espresso/15 bg-white/60 px-4 py-2.5 focus-within:border-espresso/50"
          onSubmit={(event) => {
            event.preventDefault();
            push({ ...state, search });
          }}
        >
          <svg viewBox="0 0 24 24" className="size-4 shrink-0 text-espresso/40" fill="none" stroke="currentColor" strokeWidth="1.7">
            <circle cx="11" cy="11" r="6.5" />
            <path d="m16 16 4.5 4.5" strokeLinecap="round" />
          </svg>
          <input
            id="shop-search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Origin, notes, name…"
            className="min-w-0 flex-1 bg-transparent text-sm text-espresso placeholder:text-espresso/40 focus:outline-none"
          />
          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                push({ ...state, search: "" });
              }}
              className="text-xs text-espresso/40 hover:text-espresso"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </form>
      </div>

      {groups.map((group) => (
        <fieldset key={group.key}>
          <legend className="eyebrow text-espresso/45">{group.label}</legend>
          <div className="mt-3 space-y-2">
            {group.options.map((option) => {
              const checked = state[group.key].includes(option.value);
              return (
                <label
                  key={option.value}
                  className="group flex cursor-pointer items-center gap-3 text-sm text-espresso/75"
                >
                  <span
                    className={`grid size-[1.1rem] shrink-0 place-items-center rounded-[0.35rem] border transition ${
                      checked
                        ? "border-espresso bg-espresso text-crema"
                        : "border-espresso/25 bg-white/70 group-hover:border-espresso/60"
                    }`}
                  >
                    {checked && (
                      <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={checked}
                    onChange={() => toggle(group.key, option.value)}
                  />
                  <span className="flex-1 transition group-hover:text-espresso">
                    {option.label}
                  </span>
                  {option.hint && (
                    <span className="text-xs tabular-nums text-espresso/35">
                      {option.hint}
                    </span>
                  )}
                </label>
              );
            })}
          </div>
        </fieldset>
      ))}

      {activeCount > 0 && (
        <button
          type="button"
          onClick={clearAll}
          className="w-full rounded-full border border-espresso/20 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-espresso/70 transition hover:border-espresso hover:bg-espresso hover:text-crema"
        >
          Clear {activeCount} filter{activeCount === 1 ? "" : "s"}
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* toolbar */}
      <div className="sticky top-[4.6rem] z-40 -mx-4 mb-8 flex items-center justify-between gap-3 border-b border-espresso/10 bg-crema/90 px-4 py-3 backdrop-blur-lg sm:mx-0 sm:rounded-full sm:border sm:px-5">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-espresso lg:hidden"
        >
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.7">
            <path d="M4 7h16M7 12h10M10 17h4" strokeLinecap="round" />
          </svg>
          Filters
          {activeCount > 0 && (
            <span className="grid size-5 place-items-center rounded-full bg-espresso text-[0.65rem] text-crema">
              {activeCount}
            </span>
          )}
        </button>

        <p className="hidden text-sm text-espresso/55 lg:block">
          <span className="font-semibold tabular-nums text-espresso">
            {resultCount}
          </span>{" "}
          {resultCount === 1 ? "product" : "products"}
          {isPending && <span className="ml-2 text-caramel-deep">updating…</span>}
        </p>

        <div className="flex items-center gap-3">
          <span className="hidden text-xs uppercase tracking-[0.16em] text-espresso/40 sm:block">
            Sort
          </span>
          <select
            value={state.sort}
            onChange={(event) =>
              push({ ...state, sort: event.target.value as SortKey })
            }
            className="rounded-full border border-espresso/15 bg-white/70 px-4 py-2 text-sm font-medium text-espresso focus:border-espresso focus:outline-none"
            aria-label="Sort products"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* desktop sidebar */}
      <aside className="hidden lg:block">{panel}</aside>

      {/* mobile sheet */}
      <div
        aria-hidden={!mobileOpen}
        className={`fixed inset-0 z-[75] lg:hidden ${mobileOpen ? "" : "pointer-events-none"}`}
      >
        <button
          type="button"
          aria-label="Close filters"
          onClick={() => setMobileOpen(false)}
          className={`absolute inset-0 bg-espresso/45 backdrop-blur-[3px] transition-opacity duration-400 ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          className={`absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-[1.75rem] bg-crema p-6 pb-8 transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] ${
            mobileOpen ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-display text-2xl text-espresso">Filters</h2>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="grid size-9 place-items-center rounded-full border border-espresso/15 text-espresso"
              aria-label="Close filters"
            >
              ✕
            </button>
          </div>
          {panel}
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="mt-6 w-full rounded-full bg-espresso py-3.5 text-sm font-semibold text-crema"
          >
            Show {resultCount} {resultCount === 1 ? "product" : "products"}
          </button>
        </div>
      </div>
    </>
  );
}


