<script setup>
import { computed } from 'vue'
import { ShoppingCart, Star } from 'lucide-vue-next'
import { useLazyImage } from '@/shared/composables/useLazyImage'

const props = defineProps({
    product: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['open-modal'])

const formattedPrice = computed(() => {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0
    }).format(props.product.price)
})

// Lazy loading optimizado - sin animación de scroll
const { imageSrc, isLoaded, imageRef } = useLazyImage(props.product.image)
</script>

<template>
    <div @click="$emit('open-modal', { product: props.product, event: $event })"
        class="group bg-card text-card-foreground rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full border border-border/40 hover:border-primary/50 cursor-pointer touch-active hover:scale-[1.02]">
        <div class="relative overflow-hidden aspect-square bg-muted">
            <!-- Lazy loaded image with blur-up effect -->
            <img ref="imageRef" :src="imageSrc" :alt="props.product.name"
                class="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                :class="{ 'blur-sm': !isLoaded, 'blur-0': isLoaded }" loading="lazy">

            <div v-if="props.product.rating"
                class="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white text-[10px] md:text-xs font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                <Star class="w-2.5 h-2.5 md:w-3 md:h-3 fill-yellow-400 text-yellow-400" />
                {{ props.product.rating }}
            </div>
        </div>

        <div class="p-3 md:p-4 flex flex-col flex-grow">
            <h3 class="font-bold text-base md:text-lg leading-tight mb-1 line-clamp-2 uppercase">
                {{ props.product.name }}
            </h3>

            <p class="text-muted-foreground text-xs md:text-sm mb-3 line-clamp-2 hidden md:block">
                {{ props.product.description }}
            </p>

            <div class="mt-auto flex items-center justify-between">
                <span class="text-lg md:text-xl font-black text-primary">{{ formattedPrice }}</span>

                <div
                    class="bg-primary/10 text-primary p-2 rounded-full transform group-hover:bg-primary group-hover:text-black transition-all duration-300 group-hover:scale-110">
                    <ShoppingCart class="w-4 h-4 md:w-5 md:h-5" />
                </div>
            </div>
        </div>
    </div>
</template>
