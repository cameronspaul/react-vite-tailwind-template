import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/card';

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

export interface Product {
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
  action?: React.ReactNode;
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

export const PriceCard: React.FC<PriceCardProps> = ({ product, action }) => {
  // Get the first price from the prices array
  const price = product.prices[0];

  if (!price || price.priceAmount === undefined || price.priceCurrency === undefined) {
    return null;
  }

  const formattedPrice = formatPrice(price.priceAmount, price.priceCurrency);
  const billingText = getBillingText(product.isRecurring, product.recurringInterval);

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">{product.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        <div className="text-2xl font-bold text-primary">
          {formattedPrice}
        </div>
        <div className="text-sm text-muted-foreground capitalize">
          {billingText}
        </div>
      </CardContent>
      {action && (
        <CardFooter>
          {action}
        </CardFooter>
      )}
    </Card>
  );
};
