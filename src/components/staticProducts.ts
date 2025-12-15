import type { Product } from "./PriceCard";

export type ProductWithCheckout = Product & {
  checkoutUrl?: string;
  polarProductId?: string;
};

// Product IDs from environment
const productIds = {
  monthly: import.meta.env.VITE_POLAR_PRODUCT_ID_MONTHLY as string | undefined,
  quarterly: import.meta.env.VITE_POLAR_PRODUCT_ID_QUARTERLY as string | undefined,
  semiannual: import.meta.env.VITE_POLAR_PRODUCT_ID_SEMIANNUAL as string | undefined,
  lifetime: import.meta.env.VITE_POLAR_PRODUCT_ID_LIFETIME as string | undefined,
};

// Factory function to create products with minimal boilerplate
const createProduct = (
  id: string,
  name: string,
  description: string,
  cents: number,
  isRecurring: boolean,
  interval: string | null,
  productIdKey: keyof typeof productIds
): ProductWithCheckout => ({
  id,
  name,
  description,
  isRecurring,
  recurringInterval: interval,
  medias: [],
  metadata: {},
  organizationId: "static",
  createdAt: "static",
  modifiedAt: null,
  isArchived: false,
  prices: [{
    id: `${id}-price`,
    productId: id,
    createdAt: "static",
    modifiedAt: null,
    isArchived: false,
    priceAmount: cents,
    priceCurrency: "USD",
    recurringInterval: interval,
  }],
  polarProductId: productIds[productIdKey],
});

export const staticProducts: ProductWithCheckout[] = [
  createProduct("premium-monthly", "Premium Monthly", "Standard monthly subscription with full access.", 2999, true, "month", "monthly"),
  createProduct("premium-quarterly", "Premium Quarterly", "Quarterly billing with a small discount.", 7999, true, "quarter", "quarterly"),
  createProduct("premium-semiannual", "Premium Semiannual", "Pay twice a year and save compared to monthly.", 14999, true, "6 months", "semiannual"),
  createProduct("premium-lifetime", "Lifetime Premium", "One-time purchase; keep access forever.", 5900, false, null, "lifetime"),
];
