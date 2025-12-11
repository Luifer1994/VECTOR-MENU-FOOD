<script setup>
import { RouterView } from 'vue-router'
import { useProductsList } from '@/modules/products/composables'
import { useTheme } from '@/shared/composables/useTheme.js'
import { onMounted } from 'vue'
import FloatingCart from '@/modules/cart/components/FloatingCart.vue'

const { loadProducts } = useProductsList()
const { applyThemeVariables } = useTheme()

onMounted(() => {
  // Cargar productos
  loadProducts()

  // Aplicar variables del tema CSS
  applyThemeVariables()
})
</script>

<template>
  <main
    class="min-h-screen bg-background text-foreground relative font-sans antialiased selection:bg-primary selection:text-white">
    <RouterView />
    <FloatingCart />
  </main>
</template>
