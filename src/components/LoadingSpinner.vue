<script setup>
import { computed } from 'vue'

const props = defineProps({
    size: {
        type: String,
        default: 'md',
        validator: (val) => ['sm', 'md', 'lg'].includes(val)
    },
    color: {
        type: String,
        default: 'primary'
    }
})

const sizeClasses = computed(() => {
    const sizes = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12'
    }
    return sizes[props.size]
})

const colorClass = computed(() => {
    const colors = {
        primary: 'text-primary',
        secondary: 'text-secondary',
        white: 'text-white'
    }
    return colors[props.color] || colors.primary
})
</script>

<template>
    <div class="flex items-center justify-center">
        <!-- Rotating ring spinner optimized for mobile -->
        <svg :class="[sizeClasses, colorClass, 'animate-spin']" xmlns="http://www.w3.org/2000/svg" fill="none"
            viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
            </path>
        </svg>
    </div>
</template>
