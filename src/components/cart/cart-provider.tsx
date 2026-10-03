"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import {
  cartCount,
  cartSubtotalCents,
  computeTotals,
  makeCartKey,
  type CartItem,
  type DeliveryMethod,
} from "@/lib/shop";

const STORAGE_KEY = "jaitra-cart-v1";

type CartContextValue = {
  items: CartItem[];
  hydrated: boolean;
  count: number;
  isOpen: boolean;
  delivery: DeliveryMethod;
  promoCode: string;
  setDelivery: (delivery: DeliveryMethod) => void;
  setPromoCode: (code: string) => void;
  addItem: (item: Omit<CartItem, "key">) => void;
  removeItem: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  clear: () => void;
  openCart: () => void;
  closeCart: () => void;
  pulse: number;
  subtotalCents: number;
  shippingCents: number;
  discountCents: number;
  totalCents: number;
  promoLabel: string | null;
  promoError: string | null;
  freeShippingRemainingCents: number;
};

const CartContext = createContext<CartContextValue | null>(null);

function isCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<CartItem>;
  return (
    typeof item.key === "string" &&
    typeof item.slug === "string" &&
    typeof item.name === "string" &&
    typeof item.unitPriceCents === "number" &&
    typeof item.quantity === "number"
  );
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [delivery, setDelivery] = useState<DeliveryMethod>("standard");
  const [promoCode, setPromoCode] = useState("");
  const [pulse, setPulse] = useState(0);
  const hasLoaded = useRef(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setItems(parsed.filter(isCartItem));
        }
      }
    } catch {
      // ignore malformed storage
    }
    hasLoaded.current = true;
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hasLoaded.current) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // storage might be unavailable (private mode)
    }
  }, [items]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  const addItem = useCallback((incoming: Omit<CartItem, "key">) => {
    const key = makeCartKey(incoming.slug, incoming.sizeLabel, incoming.grind);
    setItems((current) => {
      const existing = current.find((item) => item.key === key);
      if (existing) {
        return current.map((item) =>
          item.key === key
            ? {
                ...item,
                quantity: Math.min(
                  item.stock || 99,
                  item.quantity + incoming.quantity,
                ),
              }
            : item,
        );
      }
      return [...current, { ...incoming, key }];
    });
    setPulse((value) => value + 1);
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((key: string) => {
    setItems((current) => current.filter((item) => item.key !== key));
  }, []);

  const updateQuantity = useCallback((key: string, quantity: number) => {
    setItems((current) =>
      quantity <= 0
        ? current.filter((item) => item.key !== key)
        : current.map((item) =>
            item.key === key
              ? { ...item, quantity: Math.min(item.stock || 99, quantity) }
              : item,
          ),
    );
  }, []);

  const clear = useCallback(() => {
    setItems([]);
    setPromoCode("");
  }, []);

  const value = useMemo<CartContextValue>(() => {
    const totals = computeTotals(items, delivery, promoCode);
    return {
      items,
      hydrated,
      count: cartCount(items),
      isOpen,
      delivery,
      promoCode,
      setDelivery,
      setPromoCode,
      addItem,
      removeItem,
      updateQuantity,
      clear,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      pulse,
      ...totals,
    };
  }, [
    items,
    hydrated,
    isOpen,
    delivery,
    promoCode,
    addItem,
    removeItem,
    updateQuantity,
    clear,
    pulse,
  ]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside <CartProvider>");
  return context;
}
