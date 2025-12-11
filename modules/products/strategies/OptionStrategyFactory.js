import { RadioRequiredStrategy } from "./RadioRequiredStrategy.js";
import { RadioOptionalStrategy } from "./RadioOptionalStrategy.js";
import { CheckboxMultiStrategy } from "./CheckboxMultiStrategy.js";
import { ProductoSinStrategy } from "./ProductoSinStrategy.js";

/**
 * Factory para crear la strategy correcta según la configuración
 */
export class OptionStrategyFactory {
  /**
   * Crea una strategy basándose en la configuración
   * @param {Object} config - Configuración de la opción
   * @param {string} config.name - Nombre del grupo
   * @param {number} config.min - Mínimo a seleccionar
   * @param {number} config.max - Máximo a seleccionar
   * @param {boolean} config.required - Si es obligatorio
   * @param {Array} config.choices - Opciones disponibles
   * @param {string} [config.type] - Tipo especial (ej: 'productoSin')
   * @returns {OptionStrategy}
   */
  static create(config) {
    const { min, max, required, type } = config;

    // Caso especial: ProductoSin
    if (type === "productoSin") {
      return new ProductoSinStrategy(config);
    }

    // Radio Required: min=1, max=1, required=true
    if (min === 1 && max === 1 && required) {
      return new RadioRequiredStrategy(config);
    }

    // Radio Optional: min=1, max=1, required=false
    if (min === 1 && max === 1 && !required) {
      return new RadioOptionalStrategy(config);
    }

    // Checkbox Multi: max > 1
    if (max > 1) {
      return new CheckboxMultiStrategy(config);
    }

    // Default: Radio Optional (más seguro)
    console.warn(`No se encontró strategy específica para config:`, config);
    return new RadioOptionalStrategy(config);
  }

  /**
   * Crea múltiples strategies desde un array de configuraciones
   * @param {Array<Object>} configs
   * @returns {Array<OptionStrategy>}
   */
  static createMultiple(configs) {
    return configs.map((config) => this.create(config));
  }
}
