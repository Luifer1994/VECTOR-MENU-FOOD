import { useCategoriesStore } from "../store/useCategoriesStore.js";
import { computed } from "vue";

/**
 * Composable para obtener categorías
 */
export function useCategories() {
  const store = useCategoriesStore();

  // Getters
  const categories = computed(() => store.categories);
  const categoryList = computed(() => store.categoryList);

  // Actions
  function getCategoryById(id) {
    return store.getCategoryById(id);
  }

  return {
    categories,
    categoryList,
    getCategoryById,
  };
}
