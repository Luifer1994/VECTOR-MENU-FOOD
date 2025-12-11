import { ref, onMounted, onUnmounted } from "vue";

/**
 * Composable para animaciones on-scroll
 * Optimizado para mobile con IntersectionObserver
 */
export function useScrollAnimation(options = {}) {
  const {
    threshold = 0.1,
    rootMargin = "0px",
    animationClass = "animate-slide-up",
    once = true,
  } = options;

  const elementRef = ref(null);
  const isVisible = ref(false);
  let observer = null;

  const setupObserver = () => {
    if (!elementRef.value) return;

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isVisible.value = true;

            // Agregar clase de animación
            if (animationClass) {
              entry.target.classList.add(animationClass);
            }

            // Desconectar si solo queremos animar una vez
            if (once) {
              observer?.disconnect();
            }
          } else if (!once) {
            isVisible.value = false;
            if (animationClass) {
              entry.target.classList.remove(animationClass);
            }
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(elementRef.value);
  };

  onMounted(() => {
    setupObserver();
  });

  onUnmounted(() => {
    observer?.disconnect();
  });

  return {
    elementRef,
    isVisible,
  };
}
