/**
 * Exports granulares de composables de carrito
 * Cada composable tiene una responsabilidad única
 */
export { useCartItems } from "./useCartItems.js";
export { useAddToCart } from "./useAddToCart.js";
export { useCartDrawer } from "./useCartDrawer.js";
export { useCartTotals } from "./useCartTotals.js";
export { useOrderNotes } from "./useOrderNotes.js";
export { useCartAnimation } from "./useCartAnimation.js";

// Mantener useCart para retrocompatibilidad
export { useCart } from "./useCart.js";
