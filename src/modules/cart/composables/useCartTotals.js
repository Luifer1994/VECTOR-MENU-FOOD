import { useCartStore } from "../store/useCartStore.js";
import { computed } from "vue";

/**
 * Composable granular para totales del carrito
 */
export function useCartTotals() {
  const store = useCartStore();

  const subtotal = computed(() => store.subtotal);

  return {
    subtotal,
  };
}
