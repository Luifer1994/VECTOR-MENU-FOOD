import { useProductsStore } from "../store/useProductsStore.js";
import { computed } from "vue";

/**
 * Composable granular para obtener la lista de productos
 */
export function useProductsList() {
  const store = useProductsStore();

  const products = computed(() => store.products);
  const loading = computed(() => store.loading);
  const error = computed(() => store.error);

  async function loadProducts() {
    await store.loadProducts();
  }

  return {
    products,
    loading,
    error,
    loadProducts,
  };
}
