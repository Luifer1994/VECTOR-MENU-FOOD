import { useProductsStore } from "../store/useProductsStore.js";

/**
 * Composable granular para obtener un producto por ID
 */
export function useProductById() {
  const store = useProductsStore();

  function getProductById(id) {
    return store.getProductById(id);
  }

  return {
    getProductById,
  };
}
