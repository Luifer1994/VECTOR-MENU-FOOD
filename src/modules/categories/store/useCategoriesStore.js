import { defineStore } from "pinia";
import { ref, computed } from "vue";
import categoriesData from "@/data/categories.json";

export const useCategoriesStore = defineStore("categories", () => {
  // State
  const categories = ref(categoriesData.categories);

  // Getters
  //ordenar por nombre
  const categoryList = computed(() => {
    return Object.entries(categories.value)
      .sort((a, b) => a[1].name.localeCompare(b[1].name))
      .map(([key, data]) => ({
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
