/**
 * Base Strategy para opciones de productos
 * Todas las strategies heredan de esta clase base
 */
export class OptionStrategy {
  constructor(config) {
    this.name = config.name;
    this.choices = config.choices || [];
    this.min = parseInt(config.min) || 0;
    this.max = parseInt(config.max) || 1;
    this.required = Boolean(config.required);
  }

  /**
   * Valida si la selección cumple las reglas de la strategy
   * @param {any} selectedValue - Valor(es) seleccionado(s)
   * @returns {{valid: boolean, message?: string}}
   */
  validate(selectedValue) {
    throw new Error("validate() debe ser implementado en la subclase");
  }

  /**
   * Obtiene el valor inicial para esta opción
   * @returns {any}
   */
  getInitialValue() {
    throw new Error("getInitialValue() debe ser implementado en la subclase");
  }

  /**
   * Retorna el tipo de renderizado para el componente
   * @returns {'radio' | 'checkbox'}
   */
  getRenderType() {
    throw new Error("getRenderType() debe ser implementado en la subclase");
  }

  /**
   * Calcula el precio adicional según la selección
   * @param {any} selectedValue - Valor(es) seleccionado(s)
   * @returns {number}
   */
  calculatePrice(selectedValue) {
    throw new Error("calculatePrice() debe ser implementado en la subclase");
  }

  /**
   * Helper para encontrar una opción por su valor
   * @param {string} value
   * @returns {Object|undefined}
   */
  findChoice(value) {
    return this.choices.find((c) => c.value === value);
  }
}
