<script setup>
const props = defineProps({
    type: {
        type: String,
        default: 'card',
        validator: (val) => ['card', 'category', 'text'].includes(val)
    },
    count: {
        type: Number,
        default: 1
    }
})
</script>

<template>
    <!-- Product Card Skeleton -->
    <div v-if="type === 'card'" class="space-y-3">
        <div v-for="i in count" :key="i" class="bg-muted rounded-2xl overflow-hidden animate-skeleton">
            <!-- Image skeleton -->
            <div class="w-full aspect-[4/3] bg-muted-foreground/10"></div>

            <!-- Content skeleton -->
            <div class="p-4 space-y-3">
                <!-- Title -->
                <div class="h-5 bg-muted-foreground/10 rounded-lg w-3/4"></div>

                <!-- Price -->
                <div class="h-6 bg-muted-foreground/10 rounded-lg w-1/3"></div>

                <!-- Button -->
                <div class="h-10 bg-muted-foreground/10 rounded-lg w-full"></div>
            </div>
        </div>
    </div>

    <!-- Category Card Skeleton -->
    <div v-else-if="type === 'category'" class="space-y-3">
        <div v-for="i in count" :key="i" class="relative rounded-2xl md:rounded-3xl overflow-hidden animate-skeleton"
            style="min-height: 180px">
            <!-- Background -->
            <div class="absolute inset-0 bg-muted-foreground/10"></div>

            <!-- Content -->
            <div class="absolute bottom-0 left-0 right-0 p-6 space-y-2">
                <div class="h-6 bg-muted-foreground/20 rounded-lg w-2/3"></div>
                <div class="h-4 bg-muted-foreground/20 rounded-lg w-1/2"></div>
            </div>
        </div>
    </div>

    <!-- Text Skeleton -->
    <div v-else-if="type === 'text'" class="space-y-2">
        <div v-for="i in count" :key="i" class="h-4 bg-muted-foreground/10 rounded animate-skeleton"
            :class="i === count ? 'w-2/3' : 'w-full'"></div>
    </div>
</template>

<style scoped>
@keyframes skeleton {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.5;
    }
}

.animate-skeleton {
    animation: skeleton 1.5s ease-in-out infinite;
}
</style>
