import { OptionStrategy } from "./OptionStrategy.js";

/**
 * Strategy para opciones de checkbox con multi-selección
 * Caso: max > 1
 * Ejemplo: "ACOMPAÑANTE" - puede elegir entre 1 y 3 opciones
 */
export class CheckboxMultiStrategy extends OptionStrategy {
  /**
   * Valida que la cantidad de selecciones esté dentro del rango
   */
  validate(selectedValue) {
    const selected = Array.isArray(selectedValue) ? selectedValue : [];

    // Si es requerido y no hay selecciones
    if (this.required && selected.length === 0) {
      return {
        valid: false,
        message: `Debes seleccionar al menos ${this.min} opción(es) en "${this.name}"`,
      };
    }

    // Validar mínimo
    if (selected.length > 0 && selected.length < this.min) {
      return {
        valid: false,
        message: `Selecciona mínimo ${this.min} opción(es) en "${this.name}"`,
      };
    }

    // Validar máximo
    if (selected.length > this.max) {
      return {
        valid: false,
        message: `Máximo ${this.max} opción(es) permitidas en "${this.name}"`,
      };
    }

    // Todas las selecciones deben ser válidas
    const allValid = selected.every((value) =>
      this.choices.some((c) => c.value === value)
    );

    if (!allValid) {
      return {
        valid: false,
        message: `Algunas opciones seleccionadas en "${this.name}" no son válidas`,
      };
    }

    return { valid: true };
  }

  /**
   * Inicializa con array vacío
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
   * Suma el precio de todas las opciones seleccionadas
   */
  calculatePrice(selectedValue) {
    const selected = Array.isArray(selectedValue) ? selectedValue : [];

    return selected.reduce((total, value) => {
      const choice = this.findChoice(value);
      return total + (choice?.price || 0);
    }, 0);
  }
}
