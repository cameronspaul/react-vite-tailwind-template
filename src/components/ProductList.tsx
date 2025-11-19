import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export const ProductList = () => {
  const products = useQuery(api.polar.listAllProductsWithLogging);
  
  if (products === undefined) {
    return <div>Loading products...</div>;
  }
  
  return (
    <div>
      <h2>Products</h2>
      <pre>{JSON.stringify(products, null, 2)}</pre>
    </div>
  );
};