<script setup>
import { useProductCategories } from '@/modules/products/composables'
import { useCategories } from '@/modules/categories/composables'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Search, ChevronLeft } from 'lucide-vue-next'
import ProductCard from '@/modules/products/components/ProductCard.vue'
import ProductModal from '@/modules/products/components/ProductModal.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'

const route = useRoute()
const { getProductsByCategory } = useProductCategories()
const { getCategoryById } = useCategories()

const searchQuery = ref('')

// Modal State
const isModalOpen = ref(false)
const selectedProduct = ref(null)

// Get category metadata
const categoryMetadata = computed(() => {
    const id = route.params.id
    return getCategoryById(id)
})

// Get products for this category
const allProducts = computed(() => {
    const id = route.params.id
    return getProductsByCategory(id) || []
})

// Filter products by search
const products = computed(() => {
    if (!searchQuery.value) return allProducts.value

    const query = searchQuery.value.toLowerCase()
    return allProducts.value.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
    )
})

// Reset search when category changes
watch(() => route.params.id, () => {
    searchQuery.value = ''
})

const openModal = ({ product }) => {
    selectedProduct.value = product
    isModalOpen.value = true
}

const closeModal = () => {
    isModalOpen.value = false
    setTimeout(() => {
        selectedProduct.value = null
    }, 300)
}
</script>

<template>
    <div v-if="categoryMetadata" class="min-h-screen pb-24">
        <!-- Sticky Header / Banner -->
        <div class="sticky top-0 z-40 bg-background shadow-lg">
            <!-- Banner Image -->
            <div class="relative h-32 md:h-40 overflow-hidden">
                <div class="absolute inset-0 bg-gradient-to-b from-black/70 to-black/50 z-10"></div>
                <img :src="categoryMetadata.image" :alt="categoryMetadata.name" class="w-full h-full object-cover">
                <div class="absolute inset-0 z-20 container mx-auto px-4 flex flex-col justify-center h-full">
                    <div class="flex items-center justify-between w-full mb-2">
                        <router-link to="/"
                            class="inline-flex items-center text-white/90 hover:text-white transition-colors bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-md hover:bg-black/60 text-sm">
                            <ChevronLeft class="w-4 h-4 mr-1" /> Volver
                        </router-link>
                        <ThemeToggle />
                    </div>
                    <h1 class="text-2xl md:text-3xl font-black drop-shadow-lg"
                        :style="{ color: categoryMetadata.color || '#FF8C00' }">
                        {{ categoryMetadata.name }}
                    </h1>
                    <p class="text-white/90 text-sm md:text-base">{{ categoryMetadata.description }}</p>
                </div>
            </div>

            <!-- Sticky Search Bar -->
            <div class="bg-background/95 backdrop-blur-md border-b border-border px-4 py-3">
                <div class="container mx-auto max-w-md">
                    <div class="relative">
                        <Search
                            class="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                        <input v-model="searchQuery" type="text" placeholder="Buscar productos..."
                            class="w-full pl-12 pr-4 py-2.5 rounded-xl border-2 border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all shadow-sm">
                    </div>
                </div>
            </div>
        </div>

        <!-- Main Content - Products Grid -->
        <div class="container mx-auto px-4 py-6">
            <div v-if="products.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                <ProductCard v-for="product in products" :key="product.id" :product="product" @open-modal="openModal" />
            </div>

            <!-- Empty State -->
            <div v-else class="text-center py-20">
                <div class="text-6xl mb-4">🍽️</div>
                <p class="text-xl text-muted-foreground mb-2">No se encontraron productos</p>
                <p class="text-sm text-muted-foreground mb-4">
                    {{ searchQuery ? 'Intenta con otra búsqueda' : 'Esta categoría no tiene productos disponibles' }}
                </p>
                <button v-if="searchQuery" @click="searchQuery = ''"
                    class="px-6 py-2 bg-primary text-black rounded-full hover:bg-primary/90 transition-colors font-bold">
                    Limpiar búsqueda
                </button>
            </div>
        </div>

        <!-- Product Modal -->
        <ProductModal :is-open="isModalOpen" :product="selectedProduct" @close="closeModal" />
    </div>

    <!-- Loading State -->
    <div v-else class="flex items-center justify-center min-h-screen">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
</template>
