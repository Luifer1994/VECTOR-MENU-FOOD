import { OptionStrategy } from "./OptionStrategy.js";

/**
 * Strategy para opciones de "Sin..." (productoSin)
 * Caso especial: siempre opcional, siempre gratis, siempre checkbox
 * Ejemplo: "Sin Verdura", "Sin Cebolla"
 */
export class ProductoSinStrategy extends OptionStrategy {
  constructor(config) {
    super({
      ...config,
      required: false, // Siempre opcional
      min: 0,
      max: config.choices?.length || 999, // Puede seleccionar todas
    });
  }

  /**
   * Siempre válido (es opcional)
   */
  validate(selectedValue) {
    // Cualquier selección es válida
    return { valid: true };
  }

  /**
   * Inicializa sin selecciones
   */
  getInitialValue() {
    return [];
  }

  /**
   * Renderiza como checkboxes
   */
  getRenderType() {
    return "checkbox";
  }

  /**
   * Siempre retorna 0 (quitar ingredientes es gratis)
   */
  calculatePrice(selectedValue) {
    return 0;
  }
}
