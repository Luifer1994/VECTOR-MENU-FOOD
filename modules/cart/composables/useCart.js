import { useCartStore } from "../store/useCartStore.js";
import { computed } from "vue";

/**
 * Composable para gestionar el carrito
 */
export function useCart() {
  const store = useCartStore();

  // State
  const items = computed(() => store.items);
  const orderNotes = computed({
    get: () => store.orderNotes,
    set: (value) => {
      store.orderNotes = value;
    },
  });
  const isOpen = computed(() => store.isOpen);
  const itemCount = computed(() => store.itemCount);
  const subtotal = computed(() => store.subtotal);
  const isEmpty = computed(() => store.isEmpty);

  // Actions
  function addItem(product, quantity, selectedOptions, notes) {
    store.addItem(product, quantity, selectedOptions, notes);
  }

  function removeItem(itemId) {
    store.removeItem(itemId);
  }

  function updateQuantity(itemId, newQuantity) {
    store.updateQuantity(itemId, newQuantity);
  }

  function clearCart() {
    store.clearCart();
  }

  function toggleDrawer() {
    store.toggleDrawer();
  }

  function openDrawer() {
    store.openDrawer();
  }

  function closeDrawer() {
    store.closeDrawer();
  }

  return {
    // State
    items,
    orderNotes,
    isOpen,
    itemCount,
    subtotal,
    isEmpty,

    // Actions
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleDrawer,
    openDrawer,
    closeDrawer,
  };
}
