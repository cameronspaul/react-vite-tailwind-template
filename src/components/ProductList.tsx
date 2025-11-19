import React, { useEffect } from "react";
import { useQuery, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";

export const ProductList = () => {
  const products = useQuery(api.polar.listAllProductsWithLogging);
  const syncProducts = useAction(api.polar.syncProductsAction);
  const [isSyncing, setIsSyncing] = React.useState(false);
  const [hasSynced, setHasSynced] = React.useState(false);
  
  // Always sync products when component mounts
  useEffect(() => {
    if (!hasSynced && !isSyncing) {
      setIsSyncing(true);
      setHasSynced(true);
      syncProducts()
        .then(() => {
          console.log("Products synced automatically");
        })
        .catch((error) => {
          console.error("Error syncing products:", error);
        })
        .finally(() => {
          setIsSyncing(false);
        });
    }
  }, [hasSynced, isSyncing, syncProducts]);
  
  if (products === undefined) {
    return <div>Loading products...</div>;
  }
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Products</h2>
      
      {isSyncing ? (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
          <p className="text-blue-800">Syncing products from Polar...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
          <p className="text-yellow-800">
            No products found after syncing. Check your Polar configuration.
          </p>
        </div>
      ) : null}
      
      {products.length > 0 && (
        <pre className="bg-gray-100 p-4 rounded-md overflow-auto">
          {JSON.stringify(products, null, 2)}
        </pre>
      )}
    </div>
  );
};