import React from 'react';

interface Price {
  amountType?: string;
  createdAt: string;
  id: string;
  isArchived: boolean;
  modifiedAt: string | null;
  priceAmount?: number;
  priceCurrency?: string;
  productId: string;
  recurringInterval?: string | null;
  type?: string;
}

interface Product {
  createdAt: string;
  description: string | null;
  id: string;
  isArchived: boolean;
  isRecurring: boolean;
  medias: any[];
  metadata?: Record<string, any>;
  modifiedAt: string | null;
  name: string;
  organizationId: string;
  prices: Price[];
  recurringInterval?: string | null;
}

interface PriceCardProps {
  product: Product;
}

// Utility function to format price from cents to currency
const formatPrice = (priceAmount: number, currency: string = 'USD'): string => {
  const amount = priceAmount / 100; // Convert from cents
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

// Utility function to get billing text
const getBillingText = (isRecurring: boolean, interval: string | null | undefined): string => {
  if (!isRecurring) return 'one-time';
  if (!interval) return 'recurring';
  return `per ${interval}`;
};

export const PriceCard: React.FC<PriceCardProps> = ({ product }) => {
  // Get the first price from the prices array
  const price = product.prices[0];
  
  if (!price || price.priceAmount === undefined || price.priceCurrency === undefined) {
    return null;
  }

  const formattedPrice = formatPrice(price.priceAmount, price.priceCurrency);
  const billingText = getBillingText(product.isRecurring, product.recurringInterval);

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow duration-200">
      <h3 className="text-xl font-semibold text-card-foreground mb-2">
        {product.name}
      </h3>
      <div className="text-2xl font-bold text-primary mb-1">
        {formattedPrice}
      </div>
      <div className="text-sm text-muted-foreground capitalize">
        {billingText}
      </div>
    </div>
  );
};