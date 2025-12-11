import { useProductsStore } from "../store/useProductsStore.js";
import { computed } from "vue";

/**
 * Composable para obtener productos
 * Interface única para componentes/vistas
 */
export function useProducts() {
  const store = useProductsStore();

  // Getters reactivos
  const products = computed(() => store.products);
  const loading = computed(() => store.loading);
  const error = computed(() => store.error);
  const categories = computed(() => store.categories);
  const productsByCategory = computed(() => store.productsByCategory);

  // Actions
  async function loadProducts() {
    await store.loadProducts();
  }

  function getProductById(id) {
    return store.getProductById(id);
  }

  function getProductsByCategory(category) {
    return store.getProductsByCategory(category);
  }

  function searchProducts(query) {
    return store.searchProducts(query);
  }

  return {
    // State
    products,
    loading,
    error,
    categories,
    productsByCategory,

    // Actions
    loadProducts,
    getProductById,
    getProductsByCategory,
    searchProducts,
  };
}
