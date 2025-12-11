import { OptionStrategy } from "./OptionStrategy.js";

/**
 * Strategy para opciones de radio obligatorias
 * Caso: min=1, max=1, required=true
 * Ejemplo: "TIPO DE PÁN" - debe elegir exactamente una opción
 */
export class RadioRequiredStrategy extends OptionStrategy {
  /**
   * Valida que se haya seleccionado exactamente una opción
   */
  validate(selectedValue) {
    // Debe tener valor
    if (!selectedValue) {
      return {
        valid: false,
        message: `Debes seleccionar una opción en "${this.name}"`,
      };
    }

    // Debe ser una opción válida
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
   * Pre-selecciona la primera opción por defecto
   */
  getInitialValue() {
    return this.choices[0]?.value || null;
  }

  /**
   * Renderiza como radio buttons
   */
  getRenderType() {
    return "radio";
  }

  /**
   * Calcula el precio de la opción seleccionada
   */
  calculatePrice(selectedValue) {
    if (!selectedValue) return 0;

    const choice = this.findChoice(selectedValue);
    return choice?.price || 0;
  }
}
