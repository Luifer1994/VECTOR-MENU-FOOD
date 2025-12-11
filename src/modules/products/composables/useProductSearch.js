import { useProductsStore } from "../store/useProductsStore.js";

/**
 * Composable granular para búsqueda de productos
 */
export function useProductSearch() {
  const store = useProductsStore();

  function searchProducts(query) {
    return store.searchProducts(query);
  }

  return {
    searchProducts,
  };
}
