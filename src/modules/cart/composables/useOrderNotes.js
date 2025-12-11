import { useCartStore } from "../store/useCartStore.js";
import { computed } from "vue";

/**
 * Composable granular para notas del pedido
 */
export function useOrderNotes() {
  const store = useCartStore();

  const orderNotes = computed({
    get: () => store.orderNotes,
    set: (value) => {
      store.orderNotes = value;
    },
  });

  return {
    orderNotes,
  };
}
