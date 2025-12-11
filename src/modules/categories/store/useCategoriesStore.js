import { defineStore } from "pinia";
import { ref, computed } from "vue";
import categoriesData from "@/data/categories.json";

export const useCategoriesStore = defineStore("categories", () => {
  // State
  const categories = ref(categoriesData.categories);

  // Getters
  const categoryList = computed(() => {
    return Object.entries(categories.value).map(([key, data]) => ({
      id: key,
      ...data,
    }));
  });

  const getCategoryById = computed(() => (id) => {
    return categories.value[id] || null;
  });

  return {
    categories,
    categoryList,
    getCategoryById,
  };
});
