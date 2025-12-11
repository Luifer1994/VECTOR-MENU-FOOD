import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useLocalStorage } from "@/shared/composables/useLocalStorage.js";

const CART_STORAGE_KEY = "midnight_shuttle_cart";

export const useCartStore = defineStore("cart", () => {
  const { get, set } = useLocalStorage();

  // State
  const items = ref([]);
  const orderNotes = ref("");
  const isOpen = ref(false);

  // Getters
  const itemCount = computed(() => {
    // Contar productos únicos, no cantidades totales
    return items.value.length;
  });

  const subtotal = computed(() => {
    return items.value.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);
  });

  const isEmpty = computed(() => items.value.length === 0);

  // Actions
  function addItem(product, quantity, selectedOptions, notes) {
    // Calcular precio del item con opciones
    let itemPrice = product.price;

    if (product.optionStrategies) {
      for (const strategy of product.optionStrategies) {
        const value = selectedOptions[strategy.name];
        itemPrice += strategy.calculatePrice(value);
      }
    }

    // Crear signature para identificar items iguales
    const signature = JSON.stringify({
      productId: product.id,
      options: selectedOptions,
      notes,
    });

    // Buscar si ya existe
    const existingIndex = items.value.findIndex(
      (item) => item.signature === signature
    );

    if (existingIndex >= 0) {
      // Incrementar cantidad
      items.value[existingIndex].quantity += quantity;
    } else {
      // Agregar nuevo
      items.value.push({
        id: Date.now().toString(),
        signature,
        productId: product.id,
        productName: product.name,
        productImage: product.image,
        price: itemPrice,
        quantity,
        selectedOptions,
        notes,
        product, // Referencia completa
      });
    }

    saveToStorage();
  }

  function removeItem(itemId) {
    items.value = items.value.filter((item) => item.id !== itemId);
    saveToStorage();
  }

  function updateQuantity(itemId, newQuantity) {
    if (newQuantity <= 0) {
      removeItem(itemId);
      return;
    }

    const item = items.value.find((i) => i.id === itemId);
    if (item) {
      item.quantity = newQuantity;
      saveToStorage();
    }
  }

  function clearCart() {
    items.value = [];
    orderNotes.value = "";
    saveToStorage();
  }

  function toggleDrawer() {
    isOpen.value = !isOpen.value;
  }

  function openDrawer() {
    isOpen.value = true;
  }

  function closeDrawer() {
    isOpen.value = false;
  }

  function saveToStorage() {
    set(CART_STORAGE_KEY, {
      items: items.value,
      orderNotes: orderNotes.value,
      updatedAt: new Date().toISOString(),
    });
  }

  function loadFromStorage() {
    const saved = get(CART_STORAGE_KEY);
    if (saved) {
      items.value = saved.items || [];
      orderNotes.value = saved.orderNotes || "";
    }
  }

  // Inicializar desde storage
  loadFromStorage();

  return {
    // State
    items,
    orderNotes,
    isOpen,

    // Getters
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
    saveToStorage,
    loadFromStorage,
  };
});
