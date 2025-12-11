import { OptionStrategy } from "./OptionStrategy.js";

/**
 * Strategy para opciones de radio opcionales
 * Caso: min=1, max=1, required=false
 * Ejemplo: "RECOMENDADA" - puede elegir 0 o 1 opción
 */
export class RadioOptionalStrategy extends OptionStrategy {
  /**
   * Valida que si hay selección, sea válida
   */
  validate(selectedValue) {
    // Si no hay selección, es válido (es opcional)
    if (!selectedValue) {
      return { valid: true };
    }

    // Si hay selección, debe ser válida
    const isValidChoice = this.choices.some((c) => c.value === selectedValue);
    if (!isValidChoice) {
      return {
        valid: false,
        message: `La opción seleccionada en "${this.name}" no es válida`,
      };
    }

    return { valid: true };
  }

  /**
   * No pre-selecciona nada (es opcional)
   */
  getInitialValue() {
    return null;
  }

  /**
   * Renderiza como radio buttons
   */
  getRenderType() {
    return "radio";
  }

  /**
   * Calcula el precio solo si hay selección
   */
  calculatePrice(selectedValue) {
    if (!selectedValue) return 0;

    const choice = this.findChoice(selectedValue);
    return choice?.price || 0;
  }
}
