/**
 * Exports granulares de composables de productos
 * Cada composable tiene una responsabilidad específica
 */
export { useProductsList } from "./useProductsList.js";
export { useProductSearch } from "./useProductSearch.js";
export { useProductCategories } from "./useProductCategories.js";
export { useProductById } from "./useProductById.js";
export { useProductOptions } from "./useProductOptions.js";

// Mantener useProducts para retrocompatibilidad (usa internamente los granulares)
export { useProducts } from "./useProducts.js";
