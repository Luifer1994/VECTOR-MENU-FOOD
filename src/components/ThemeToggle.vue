<script setup>
import { useDark, useToggle } from '@vueuse/core'
import { Sun, Moon } from 'lucide-vue-next'

const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>

<template>
    <button @click="toggleDark()"
        class="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
        aria-label="Toggle Theme">
        <Sun v-if="isDark" class="w-5 h-5 text-yellow-400" />
        <Moon v-else class="w-5 h-5 text-slate-700" />
    </button>
</template>
