<script setup>
import { useCartItems, useCartDrawer, useCartTotals, useOrderNotes } from '@/modules/cart/composables'
import { useProductById } from '@/modules/products/composables'
import { formatCurrency } from '@/shared/utils/formatters.js'
import { ShoppingBag, X, Plus, Minus, Trash2, Edit } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import ProductModal from '@/modules/products/components/ProductModal.vue'

// Composables granulares
const { items, itemCount, isEmpty, removeItem, updateQuantity } = useCartItems()
const { isOpen, toggleDrawer, closeDrawer } = useCartDrawer()
const { subtotal } = useCartTotals()
const { orderNotes } = useOrderNotes()

const formattedTotal = computed(() => formatCurrency(subtotal.value))

const getItemTotal = (item) => formatCurrency(item.price * item.quantity)

// Modal para editar producto
const isEditModalOpen = ref(false)
const productToEdit = ref(null)
const itemToEdit = ref(null)

// Formatear opciones seleccionadas para mostrar labels reales
const formatSelectedOptions = (item) => {
    if (!item.selectedOptions || !item.product?.optionStrategies) return []

    const formatted = []

    // Recorrer las strategies del producto para obtener los labels
    for (const strategy of item.product.optionStrategies) {
        const value = item.selectedOptions[strategy.name]

        if (value === undefined || value === null) continue

        if (Array.isArray(value)) {
            // Multi-select: buscar labels de cada choice seleccionado
            if (value.length > 0) {
                const labels = value.map(val => {
                    const choice = strategy.choices.find(c => c.value === val)
                    return choice ? choice.label : val
                })
                formatted.push({
                    group: strategy.name,
                    value: labels.join(', ')
                })
            }
        } else {
            // Single select: buscar label del choice seleccionado
            const choice = strategy.choices.find(c => c.value === value)
            if (choice) {
                formatted.push({
                    group: strategy.name,
                    value: choice.label
                })
            }
        }
    }

    return formatted
}

// Abrir modal para editar
const openEditModal = (item) => {
    itemToEdit.value = item

    // Buscar el producto original del store para tener las strategies correctas
    const { getProductById } = useProductById()
    const originalProduct = getProductById(item.productId)

    if (originalProduct) {
        productToEdit.value = originalProduct
        isEditModalOpen.value = true
    } else {
        console.error('Product not found in store:', item.productId)
    }
}

const closeEditModal = () => {
    isEditModalOpen.value = false
    productToEdit.value = null
    itemToEdit.value = null
}

// Al guardar edición, eliminar item viejo y cerrar modal
// (el modal agregará el nuevo item con las opciones actualizadas)
const handleEditClose = () => {
    if (itemToEdit.value) {
        removeItem(itemToEdit.value.id)
    }
    closeEditModal()
}
</script>

<template>
    <div>
        <!-- Floating Button - Usar colores del tema -->
        <button data-cart-button @click="toggleDrawer"
            class="fixed bottom-6 right-6 z-50 bg-primary hover:bg-primary/90 text-black p-4 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95"
            :class="{ 'opacity-0 pointer-events-none scale-0': isEmpty && !isOpen }">
            <div class="relative">
                <ShoppingBag class="w-8 h-8" />
                <span v-if="itemCount > 0"
                    class="absolute -top-2 -right-2 bg-[#00FF00] text-black text-xs font-black w-6 h-6 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(0,255,0,0.6)] border-2 border-black cart-badge-wave">
                    {{ itemCount }}
                </span>
            </div>
        </button>

        <!-- Overlay with fade -->
        <Transition name="fade">
            <div v-if="isOpen" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" @click="closeDrawer"></div>
        </Transition>

        <!-- Cart Drawer with slide animation -->
        <Transition name="drawer">
            <div v-if="isOpen"
                class="fixed right-0 top-0 h-full w-full sm:w-[450px] bg-card shadow-2xl z-50 flex flex-col">
                <!-- Header - Usar colores del tema -->
                <div class="p-6 border-b border-border flex items-center justify-between bg-primary text-black">
                    <div class="flex items-center gap-3">
                        <ShoppingBag class="w-6 h-6" />
                        <div>
                            <h2 class="text-xl font-black">Tu Pedido</h2>
                            <p class="text-sm opacity-90">
                                {{ itemCount }} {{ itemCount === 1 ? 'producto' : 'productos' }}
                            </p>
                        </div>
                    </div>
                    <button @click="closeDrawer" class="p-2 hover:bg-black/10 rounded-full transition-colors">
                        <X class="w-6 h-6" />
                    </button>
                </div>

                <!-- Cart Items -->
                <div class="flex-1 overflow-y-auto p-4 space-y-3">
                    <div v-if="isEmpty" class="h-full flex flex-col items-center justify-center text-muted-foreground">
                        <ShoppingBag class="w-16 h-16 mb-4 opacity-50" />
                        <p class="text-lg font-semibold">Tu carrito está vacío</p>
                        <p class="text-sm">Agrega productos para continuar</p>
                    </div>

                    <div v-for="item in items" :key="item.id" class="bg-muted rounded-xl p-3 border border-border">
                        <!-- Item Header -->
                        <div class="flex gap-3 mb-2">
                            <img v-if="item.productImage" :src="item.productImage" :alt="item.productName"
                                class="w-16 h-16 rounded-lg object-cover">
                            <div class="flex-1">
                                <h3 class="font-bold text-sm text-foreground">{{ item.productName }}</h3>
                                <p class="text-xs text-muted-foreground">{{ formatCurrency(item.price) }} c/u</p>
                            </div>
                            <div class="flex gap-1">
                                <button @click="openEditModal(item)" class="text-primary hover:text-primary/80 p-1"
                                    title="Editar">
                                    <Edit class="w-4 h-4" />
                                </button>
                                <button @click="removeItem(item.id)" class="text-red-500 hover:text-red-700 p-1"
                                    title="Eliminar">
                                    <Trash2 class="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <!-- Selected Options - Mejorado con labels reales -->
                        <div v-if="item.selectedOptions && Object.keys(item.selectedOptions).length > 0"
                            class="mb-2 space-y-1">
                            <div v-for="option in formatSelectedOptions(item)" :key="option.group"
                                class="text-xs bg-background rounded-md px-2 py-1 border border-border">
                                <span class="font-semibold text-gold">{{ option.group }}:</span>
                                <span class="text-foreground ml-1">{{ option.value }}</span>
                            </div>
                        </div>

                        <!-- Notes -->
                        <p v-if="item.notes"
                            class="text-xs text-muted-foreground italic mb-2 bg-background rounded px-2 py-1">
                            "{{ item.notes }}"
                        </p>

                        <!-- Quantity Controls -->
                        <div class="flex items-center justify-between">
                            <div class="flex items-center bg-background rounded-lg border border-border">
                                <button @click="updateQuantity(item.id, item.quantity - 1)"
                                    class="p-2 hover:bg-muted rounded-l-lg transition-colors">
                                    <Minus class="w-4 h-4" />
                                </button>
                                <span class="px-4 font-bold text-sm min-w-[3rem] text-center">{{ item.quantity }}</span>
                                <button @click="updateQuantity(item.id, item.quantity + 1)"
                                    class="p-2 hover:bg-muted rounded-r-lg transition-colors">
                                    <Plus class="w-4 h-4" />
                                </button>
                            </div>
                            <span class="font-bold text-primary">{{ getItemTotal(item) }}</span>
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div v-if="!isEmpty" class="p-6 border-t border-border bg-muted">
                    <!-- Order Notes -->
                    <div class="mb-4">
                        <label class="block text-xs font-bold uppercase text-foreground mb-2">
                            Notas del Pedido
                        </label>
                        <textarea v-model="orderNotes" rows="2"
                            class="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Dirección, instrucciones especiales..."></textarea>
                    </div>

                    <!-- Total -->
                    <div class="flex justify-between items-center mb-4 text-xl font-black">
                        <span class="text-foreground">Total</span>
                        <span class="text-gold">{{ formattedTotal }}</span>
                    </div>

                    <!-- Checkout Button -->
                    <button
                        class="w-full bg-primary hover:bg-primary/90 text-black py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-[0.98]">
                        Finalizar Pedido
                    </button>
                </div>
            </div>
        </Transition>

        <!-- Edit Modal -->
        <ProductModal :is-open="isEditModalOpen" :product="productToEdit" @close="handleEditClose" />
    </div>
</template>

<style scoped>
@keyframes wave {

    0%,
    100% {
        transform: scale(1);
        box-shadow: 0 0 15px rgba(0, 255, 0, 0.6);
    }

    50% {
        transform: scale(1.1);
        box-shadow: 0 0 25px rgba(0, 255, 0, 0.8), 0 0 40px rgba(0, 255, 0, 0.4);
    }
}

.cart-badge-wave {
    animation: wave 2s ease-in-out infinite;
}

/* Drawer animations - mobile optimized */
.drawer-enter-active,
.drawer-leave-active {
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.drawer-enter-from {
    transform: translateX(100%);
}

.drawer-leave-to {
    transform: translateX(100%);
}

/* Fade for overlay */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
