import { ref } from "vue";

/**
 * Composable for managing loading states
 * Mobile-optimized with automatic error handling
 */
export function useLoading(initialState = false) {
  const isLoading = ref(initialState);
  const error = ref(null);

  /**
   * Execute async function with loading state
   */
  async function withLoading(fn) {
    isLoading.value = true;
    error.value = null;

    try {
      const result = await fn();
      return result;
    } catch (err) {
      error.value = err.message || "An error occurred";
      console.error("Loading error:", err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Set loading state manually
   */
  function setLoading(state) {
    isLoading.value = state;
  }

  /**
   * Clear error
   */
  function clearError() {
    error.value = null;
  }

  return {
    isLoading,
    error,
    withLoading,
    setLoading,
    clearError,
  };
}
