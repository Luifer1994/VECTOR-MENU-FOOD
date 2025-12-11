<script setup>
import { useCategories } from '@/modules/categories/composables'
import { useRouter } from 'vue-router'
import ThemeToggle from '@/components/ThemeToggle.vue'

const { categoryList } = useCategories()
const router = useRouter()

const navigateToCategory = (id) => {
    router.push({ name: 'category', params: { id } })
}

// Función mejorada para masonry más compacto
const getCardClass = (index) => {
    // Patrón más balanceado
    const patterns = [
        'row-span-2',           // 0: Grande vertical
        '',                     // 1: Normal  
        '',                     // 2: Normal
        'md:col-span-2',        // 3: Ancho horizontal
        '',                     // 4: Normal
        'row-span-2',           // 5: Grande vertical
        '',                     // 6: Normal
        'md:col-span-2 row-span-2',  // 7: Extra grande
        '',                     // 8: Normal
        '',                     // 9: Normal
    ]

    return patterns[index % patterns.length]
}

const getCardHeight = (index) => {
    // Alturas más variadas pero consistentes
    const isLarge = index % 10 === 0 || index % 10 === 5
    const isExtraLarge = index % 10 === 7

    if (isExtraLarge) return '320px'
    if (isLarge) return '260px'
    return '200px'
}
</script>

<template>
    <div class="container mx-auto px-4 py-8 pb-32">
        <header class="mb-12 text-center relative z-10">
            <div class="absolute right-0 top-0 z-50">
                <ThemeToggle />
            </div>
            <h1 class="text-4xl md:text-6xl font-black mb-4 tracking-tight">
                <span class="text-gold">LAS FAVORITAS</span><br>
                <span class="text-foreground">DE LA CASA</span>
            </h1>
            <p class="text-muted-foreground text-lg md:text-xl">
                Hamburguesas, salchipapas, bebidas y más
            </p>
        </header>

        <!-- Categorías Grid - Masonry compacto con auto-flow dense -->
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 auto-rows-[200px] grid-flow-dense">
            <div v-for="(category, index) in categoryList" :key="category.id"
                class="group relative rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02]"
                :class="getCardClass(index)" @click="navigateToCategory(category.id)">
                <!-- Image with better loading -->
                <img :src="category.image" :alt="category.name" loading="lazy"
                    class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    @error="(e) => e.target.src = 'https://placehold.co/600x400/000000/FF8C00?text=' + category.name">

                <!-- Gradient Overlay -->
                <div
                    class="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent group-hover:from-black/90 group-hover:via-black/70 transition-all duration-500">
                </div>

                <!-- Content -->
                <div class="absolute inset-0 z-20 flex flex-col justify-end p-3 md:p-6">
                    <!-- Category Name -->
                    <h2 class="text-sm md:text-xl lg:text-2xl font-black mb-1 md:mb-2 transform transition-all duration-300 group-hover:translate-y-0 translate-y-1 leading-tight"
                        :style="{ color: category.color || '#FF8C00' }">
                        {{ category.name }}
                    </h2>

                    <!-- Description - Hidden on mobile, shown on hover for desktop -->
                    <p
                        class="hidden md:block text-white/90 text-xs opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75 line-clamp-2">
                        {{ category.description }}
                    </p>

                    <!-- CTA Button - Only on hover for desktop -->
                    <div
                        class="hidden md:block mt-2 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-150">
                        <span class="inline-flex items-center font-bold px-3 py-1.5 rounded-full text-xs shadow-lg"
                            :style="{
                                backgroundColor: category.color || '#FF8C00',
                                color: '#000000'
                            }">
                            Ver Menú →
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Empty State -->
        <div v-if="!categoryList || categoryList.length === 0" class="text-center py-20">
            <p class="text-muted-foreground text-lg">
                Cargando categorías...
            </p>
        </div>
    </div>
</template>
