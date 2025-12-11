import { useCartStore } from "../store/useCartStore.js";

/**
 * Composable granular para agregar al carrito
 */
export function useAddToCart() {
  const store = useCartStore();

  function addItem(product, quantity, selectedOptions, notes) {
    store.addItem(product, quantity, selectedOptions, notes);
  }

  function clearCart() {
    store.clearCart();
  }

  return {
    addItem,
    clearCart,
  };
}
