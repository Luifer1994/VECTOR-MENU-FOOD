import themeConfig from "@/config/theme.json";

/**
 * Composable para acceder al tema de la aplicación
 */
export function useTheme() {
  /**
   * Obtiene el valor de un color del tema
   * @param {string} path - Ruta al color (ej: 'primary.500', 'success')
   * @returns {string}
   */
  function getColor(path) {
    const parts = path.split(".");
    let value = themeConfig.colors;

    for (const part of parts) {
      value = value?.[part];
    }

    return value || "#000000";
  }

  /**
   * Obtiene información de la marca
   * @returns {Object}
   */
  function getBrand() {
    return themeConfig.brand;
  }

  /**
   * Obtiene configuración de tipografía
   * @returns {Object}
   */
  function getTypography() {
    return themeConfig.typography;
  }

  /**
   * Obtiene configuración de layout
   * @returns {Object}
   */
  function getLayout() {
    return themeConfig.layout;
  }

  /**
   * Aplica las CSS variables del tema al documento
   */
  function applyThemeVariables() {
    const root = document.documentElement;

    // Colores primarios
    Object.entries(themeConfig.colors.primary).forEach(([key, value]) => {
      root.style.setProperty(`--color-primary-${key}`, value);
    });

    // Colores secundarios
    Object.entries(themeConfig.colors.secondary).forEach(([key, value]) => {
      root.style.setProperty(`--color-secondary-${key}`, value);
    });

    // Neutrales
    Object.entries(themeConfig.colors.neutral).forEach(([key, value]) => {
      root.style.setProperty(`--color-neutral-${key}`, value);
    });

    // Estados
    root.style.setProperty("--color-success", themeConfig.colors.success);
    root.style.setProperty("--color-warning", themeConfig.colors.warning);
    root.style.setProperty("--color-error", themeConfig.colors.error);
    root.style.setProperty("--color-info", themeConfig.colors.info);

    // Fuentes
    root.style.setProperty(
      "--font-primary",
      themeConfig.typography.fontFamily.primary
    );
    root.style.setProperty(
      "--font-heading",
      themeConfig.typography.fontFamily.heading
    );
  }

  return {
    config: themeConfig,
    getColor,
    getBrand,
    getTypography,
    getLayout,
    applyThemeVariables,
  };
}
