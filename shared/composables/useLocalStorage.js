/**
 * Composable para LocalStorage
 */
export function useLocalStorage() {
  /**
   * Guarda un valor en localStorage
   * @param {string} key
   * @param {any} value
   */
  function set(key, value) {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
    } catch (error) {
      console.error(`Error guardando en localStorage (${key}):`, error);
    }
  }

  /**
   * Obtiene un valor de localStorage
   * @param {string} key
   * @param {any} defaultValue
   * @returns {any}
   */
  function get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error leyendo de localStorage (${key}):`, error);
      return defaultValue;
    }
  }

  /**
   * Elimina un valor de localStorage
   * @param {string} key
   */
  function remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error eliminando de localStorage (${key}):`, error);
    }
  }

  /**
   * Limpia todo el localStorage
   */
  function clear() {
    try {
      localStorage.clear();
    } catch (error) {
      console.error("Error limpiando localStorage:", error);
    }
  }

  return {
    set,
    get,
    remove,
    clear,
  };
}
