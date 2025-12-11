import { ref, onMounted, onUnmounted } from "vue";

/**
 * Composable para lazy loading optimizado de imágenes
 * Con blur-up effect y loading progresivo
 */
export function useLazyImage(src, options = {}) {
  const {
    placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23f0f0f0" width="400" height="300"/%3E%3C/svg%3E',
    threshold = 0.1,
    rootMargin = "50px",
  } = options;

  const imageSrc = ref(placeholder);
  const isLoaded = ref(false);
  const isLoading = ref(false);
  const error = ref(null);
  const imageRef = ref(null);

  let observer = null;

  const loadImage = () => {
    if (isLoading.value || isLoaded.value) return;

    isLoading.value = true;
    const img = new Image();

    img.onload = () => {
      imageSrc.value = src;
      isLoaded.value = true;
      isLoading.value = false;
    };

    img.onerror = () => {
      error.value = "Failed to load image";
      isLoading.value = false;
      // Fallback a placeholder
      imageSrc.value = placeholder;
    };

    img.src = src;
  };

  const setupIntersectionObserver = () => {
    if (!imageRef.value) return;

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            loadImage();
            observer?.disconnect();
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(imageRef.value);
  };

  onMounted(() => {
    if (imageRef.value) {
      setupIntersectionObserver();
    }
  });

  onUnmounted(() => {
    observer?.disconnect();
  });

  return {
    imageSrc,
    isLoaded,
    isLoading,
    error,
    imageRef,
  };
}
