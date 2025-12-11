import { useCartStore } from "../store/useCartStore.js";
import { computed } from "vue";

/**
 * Composable granular para items del carrito
 */
export function useCartItems() {
  const store = useCartStore();

  const items = computed(() => store.items);
  const itemCount = computed(() => store.itemCount);
  const isEmpty = computed(() => store.isEmpty);

  function removeItem(itemId) {
    store.removeItem(itemId);
  }

  function replaceItem(oldItemId, product, quantity, selectedOptions, notes) {
    store.replaceItem(oldItemId, product, quantity, selectedOptions, notes);
  }

  function updateQuantity(itemId, newQuantity) {
    store.updateQuantity(itemId, newQuantity);
  }

  return {
    items,
    itemCount,
    isEmpty,
    removeItem,
    replaceItem,
    updateQuantity,
  };
}
