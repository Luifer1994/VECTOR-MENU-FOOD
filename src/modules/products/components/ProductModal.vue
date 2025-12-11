<script setup>
import { ref, computed, toRef, watch, nextTick } from 'vue'
import { X, Minus, Plus, MessageSquare, Clock } from 'lucide-vue-next'
import { useAddToCart, useCartAnimation } from '@/modules/cart/composables'
import { useProductOptions } from '@/modules/products/composables'
import { formatCurrency } from '@/shared/utils/formatters.js'

const props = defineProps({
    isOpen: Boolean,
    product: Object,
    // Props para edición
    initialQuantity: {
        type: Number,
        default: 1
    },
    initialOptions: {
        type: Object,
        default: () => ({})
    },
    initialNotes: {
        type: String,
        default: ''
    },
    editMode: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['close', 'item-updated'])

const { addItem } = useAddToCart()
const { animateAddToCart } = useCartAnimation()
const quantity = ref(1)

// Usar composable para manejar opciones con strategies
const productRef = toRef(props, 'product')
const {
    selectedOptions,
    notes,
    validation,
    isValid,
    totalPrice
} = useProductOptions(productRef)

const formattedPrice = computed(() => {
    return formatCurrency(totalPrice.value * quantity.value)
})

// Cargar datos iniciales cuando se abre en modo edición
watch(() => props.isOpen, async (isOpen) => {
    if (isOpen && props.editMode) {
        // Esperar al siguiente tick para asegurar que el composable está listo
        await nextTick()
        quantity.value = props.initialQuantity

        // Cargar opciones iniciales
        if (props.initialOptions && Object.keys(props.initialOptions).length > 0) {
            Object.assign(selectedOptions.value, props.initialOptions)
        }

        // Cargar notas iniciales
        notes.value = props.initialNotes
    } else if (isOpen && !props.editMode) {
        // Resetear a valores por defecto si no es edición
        quantity.value = 1
    }
})


const increaseQuantity = () => quantity.value++
const decreaseQuantity = () => {
    if (quantity.value > 1) quantity.value--
}

const handleAdd = () => {
    // Validar antes de agregar
    if (!isValid.value) {
        alert(validation.value.errors.join('\n'))
        return
    }

    // Si estamos en modo edición, emitir datos para que el padre haga replace
    if (props.editMode) {
        emit('item-updated', {
            product: props.product,
            quantity: quantity.value,
            selectedOptions: selectedOptions.value,
            notes: notes.value
        })

        // Cerrar modal después de un pequeño delay
        setTimeout(() => {
            emit('close')
            quantity.value = 1
        }, 200)
        return
    }

    // Modo normal: agregar al carrito
    addItem(
        props.product,
        quantity.value,
        selectedOptions.value,
        notes.value
    )

    // Animar producto volando al carrito
    animateAddToCart(props.product.image)

    // Cerrar modal después de un pequeño delay
    setTimeout(() => {
        emit('close')
        quantity.value = 1
    }, 200)
}


const close = () => {
    emit('close')
    quantity.value = 1
}
</script>

<template>
    <!-- Modal with smooth animations -->
    <Transition name="modal">
        <div v-if="isOpen && product" class="fixed inset-0 z-[60] flex items-end md:items-center justify-center">
            <!-- Backdrop with fade -->
            <Transition name="fade">
                <div v-if="isOpen" @click="close" class="absolute inset-0 bg-black/60 backdrop-blur-sm z-10"></div>
            </Transition>

            <!-- Modal Content -->
            <div
                class="relative bg-card w-full md:w-[600px] md:rounded-2xl rounded-t-2xl shadow-2xl p-0 overflow-hidden transform transition-all animate-in slide-in-from-bottom duration-300 max-h-[90vh] flex flex-col z-50">
                <!-- Image Header -->
                <div class="relative h-40 md:h-52 flex-shrink-0">
                    <img :src="product.image || '/placeholder.jpg'" :alt="product.name"
                        class="w-full h-full object-cover">

                    <button @click="close"
                        class="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur-md transition-colors z-20">
                        <X class="w-5 h-5" />
                    </button>

                    <div class="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90">
                    </div>

                    <div class="absolute bottom-0 left-0 right-0 p-4 z-10 text-white transform translate-y-1">
                        <h2 class="text-2xl md:text-3xl font-black leading-tight">{{ product.name }}</h2>
                    </div>
                </div>

                <!-- Scrollable Content -->
                <div class="flex-1 overflow-y-auto px-4 py-3 bg-background space-y-3">
                    <!-- Price & Category -->
                    <div class="flex items-center justify-between">
                        <span class="text-lg font-bold text-primary">
                            {{ formatCurrency(product.price) }}
                        </span>
                        <div
                            class="inline-flex items-center gap-1 bg-muted px-2 py-0.5 rounded-full text-[10px] font-bold uppercase text-muted-foreground">
                            <Clock class="w-3 h-3" /> {{ product.area || 'COCINA' }}
                        </div>
                    </div>

                    <!-- Description -->
                    <p class="text-sm text-muted-foreground leading-snug">
                        {{ product.description || product.category }}
                    </p>

                    <!-- OPTIONS using Strategies -->
                    <div v-if="product.optionStrategies && product.optionStrategies.length > 0" class="space-y-3">
                        <div v-for="strategy in product.optionStrategies" :key="strategy.name" class="space-y-2">
                            <!-- Option Group Header -->
                            <h4
                                class="text-xs font-bold uppercase tracking-wide flex items-center justify-between text-foreground">
                                {{ strategy.name }}
                                <span v-if="strategy.required"
                                    class="text-[9px] bg-accent/20 text-accent px-1.5 py-0.5 rounded font-bold">
                                    REQUERIDO
                                </span>
                                <span v-else-if="strategy.max > 1"
                                    class="text-[9px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded">
                                    {{ strategy.min }}-{{ strategy.max }}
                                </span>
                            </h4>

                            <!-- Radio Options -->
                            <div v-if="strategy.getRenderType() === 'radio'" class="space-y-1.5">
                                <label v-for="choice in strategy.choices" :key="choice.value"
                                    class="flex items-center px-3 py-2 rounded-lg border-2 border-border bg-muted hover:bg-muted/80 cursor-pointer transition-colors">
                                    <input type="radio" :name="strategy.name" :value="choice.value"
                                        v-model="selectedOptions[strategy.name]" class="peer sr-only">
                                    <div
                                        class="w-4 h-4 rounded-full border-2 border-border peer-checked:border-primary peer-checked:bg-primary flex items-center justify-center mr-2.5 shrink-0">
                                        <div
                                            class="w-1.5 h-1.5 bg-black rounded-full opacity-0 peer-checked:opacity-100">
                                        </div>
                                    </div>
                                    <span class="text-sm font-medium text-foreground flex-1">{{ choice.label }}</span>
                                    <span v-if="choice.price > 0" class="text-xs text-primary font-bold">
                                        +{{ formatCurrency(choice.price) }}
                                    </span>
                                </label>
                            </div>

                            <!-- Checkbox Options -->
                            <div v-else-if="strategy.getRenderType() === 'checkbox'" class="space-y-1.5">
                                <label v-for="choice in strategy.choices" :key="choice.value"
                                    class="flex items-center px-3 py-2 rounded-lg border-2 border-border bg-muted hover:bg-muted/80 cursor-pointer transition-colors">
                                    <input type="checkbox" :value="choice.value"
                                        v-model="selectedOptions[strategy.name]" class="peer sr-only">
                                    <div
                                        class="w-4 h-4 rounded border-2 border-border peer-checked:border-secondary peer-checked:bg-secondary flex items-center justify-center mr-2.5 shrink-0">
                                        <svg class="w-3 h-3 text-black opacity-0 peer-checked:opacity-100" fill="none"
                                            stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3"
                                                d="M5 13l4 4L19 7"></path>
                                        </svg>
                                    </div>
                                    <span class="text-sm font-medium text-foreground flex-1">{{ choice.label }}</span>
                                    <span v-if="choice.price > 0" class="text-xs text-primary font-bold">
                                        +{{ formatCurrency(choice.price) }}
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <!-- Notes/Details - Simplificado -->
                    <div class="space-y-2">
                        <label
                            class="text-xs font-bold uppercase tracking-wide flex items-center gap-1.5 text-foreground">
                            <MessageSquare class="w-4 h-4" /> Observaciones
                        </label>
                        <textarea v-model="notes" rows="2"
                            class="w-full rounded-lg border-2 border-border bg-background text-foreground px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none placeholder:text-muted-foreground"
                            placeholder="Ej: Sin cebolla, salsa extra..."></textarea>
                    </div>
                </div>

                <!-- Footer -->
                <div class="p-3 border-t-2 border-border bg-background flex items-center gap-3">
                    <div class="flex items-center bg-muted rounded-lg px-1.5 py-1">
                        <button @click="decreaseQuantity"
                            class="w-8 h-8 flex items-center justify-center rounded hover:bg-background text-foreground"
                            :disabled="quantity <= 1">
                            <Minus class="w-4 h-4" />
                        </button>
                        <span class="w-10 text-center font-bold text-foreground">{{ quantity }}</span>
                        <button @click="increaseQuantity"
                            class="w-8 h-8 flex items-center justify-center rounded bg-primary text-black hover:bg-primary/90">
                            <Plus class="w-4 h-4" />
                        </button>
                    </div>
                    <button @click="handleAdd"
                        class="flex-1 bg-primary hover:bg-primary/90 text-black h-11 rounded-lg font-bold flex items-center justify-between px-4 transition-all">
                        <span>{{ editMode ? 'Actualizar' : 'Agregar' }}</span>
                        <span class="bg-black/20 px-2 py-0.5 rounded text-xs">{{ formattedPrice }}</span>
                    </button>
                </div>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
/* Modal animations - mobile optimized */
.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.25s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-enter-from .relative {
    transform: scale(0.95) translateY(20px);
    opacity: 0;
}

.modal-leave-to .relative {
    transform: scale(0.95) translateY(20px);
    opacity: 0;
}

/* Fade animation for backdrop */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
