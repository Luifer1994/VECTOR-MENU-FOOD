import { ref, computed, watch } from "vue";
import {
  validateProductOptions,
  calculateProductPrice,
  getInitialProductOptions,
} from "../utils/productHelpers.js";

/**
 * Composable para manejar las opciones de un producto con strategies
 */
export function useProductOptions(productRef) {
  const selectedOptions = ref({});
  const notes = ref("");

  // Inicializar valores cuando cambia el producto
  watch(
    productRef,
    (product) => {
      if (!product) return;

      selectedOptions.value = getInitialProductOptions(product);
      notes.value = "";
    },
    { immediate: true }
  );

  // Validación
  const validation = computed(() => {
    const product = productRef.value;
    if (!product) {
      return { valid: false, errors: ["No hay producto seleccionado"] };
    }

    return validateProductOptions(product, selectedOptions.value);
  });

  const isValid = computed(() => validation.value.valid);

  // Precio con opciones
  const optionsPrice = computed(() => {
    const product = productRef.value;
    if (!product) return 0;

    return (
      calculateProductPrice(product, selectedOptions.value) - product.price
    );
  });

  const totalPrice = computed(() => {
    const product = productRef.value;
    if (!product) return 0;

    return calculateProductPrice(product, selectedOptions.value);
  });

  // Helpers
  function reset() {
    const product = productRef.value;
    if (product) {
      selectedOptions.value = getInitialProductOptions(product);
      notes.value = "";
    }
  }

  function getSelectedOptionsData() {
    return {
      options: { ...selectedOptions.value },
      notes: notes.value,
    };
  }

  return {
    selectedOptions,
    notes,
    validation,
    isValid,
    optionsPrice,
    totalPrice,
    reset,
    getSelectedOptionsData,
  };
}
