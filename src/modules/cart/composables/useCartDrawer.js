import { useCartStore } from "../store/useCartStore.js";
import { computed } from "vue";

/**
 * Composable granular para el drawer del carrito
 */
export function useCartDrawer() {
  const store = useCartStore();

  const isOpen = computed(() => store.isOpen);

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
    isOpen,
    toggleDrawer,
    openDrawer,
    closeDrawer,
  };
}
