import { useProductsStore } from "../store/useProductsStore.js";
import { computed } from "vue";

/**
 * Composable granular para categorías de productos
 */
export function useProductCategories() {
  const store = useProductsStore();

  const categories = computed(() => store.categories);
  const productsByCategory = computed(() => store.productsByCategory);

  function getProductsByCategory(category) {
    return store.getProductsByCategory(category);
  }

  return {
    categories,
    productsByCategory,
    getProductsByCategory,
  };
}
