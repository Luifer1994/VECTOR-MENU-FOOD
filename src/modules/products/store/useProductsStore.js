import { defineStore } from "pinia";
import { ref, computed } from "vue";
import menuRealData from "@/data/menu-real.json";
import { transformProducts } from "../utils/productTransformers.js";
import { normalizeText } from "@/shared/utils/formatters.js";

export const useProductsStore = defineStore("products", () => {
  // State
  const rawProducts = ref([]);
  const products = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // Getters
  const productCount = computed(() => products.value.length);

  const productsByCategory = computed(() => {
    const grouped = {};

    products.value.forEach((product) => {
      if (!grouped[product.category]) {
        grouped[product.category] = [];
      }
      grouped[product.category].push(product);
    });

    return grouped;
  });

  const categories = computed(() => {
    return Object.keys(productsByCategory.value).sort();
  });

  // Actions
  async function loadProducts() {
    loading.value = true;
    error.value = null;

    try {
      rawProducts.value = menuRealData.productos || [];
      products.value = transformProducts(rawProducts.value);
    } catch (err) {
      error.value = err.message;
      console.error("Error loading products:", err);
    } finally {
      loading.value = false;
    }
  }

  function getProductById(id) {
    return products.value.find((p) => p.id === id);
  }

  function getProductsByCategory(category) {
    return products.value.filter((p) => p.category === category);
  }

  function searchProducts(query) {
    if (!query || query.trim() === "") {
      return products.value;
    }

    const normalizedQuery = normalizeText(query);

    return products.value.filter((product) => {
      const normalizedName = normalizeText(product.name);
      const normalizedCategory = normalizeText(product.category);

      return (
        normalizedName.includes(normalizedQuery) ||
        normalizedCategory.includes(normalizedQuery)
      );
    });
  }

  return {
    // State
    products,
    loading,
    error,

    // Getters
    productCount,
    productsByCategory,
    categories,

    // Actions
    loadProducts,
    getProductById,
    getProductsByCategory,
    searchProducts,
  };
});
