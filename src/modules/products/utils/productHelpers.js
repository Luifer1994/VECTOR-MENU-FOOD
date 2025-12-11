/**
 * Helpers para productos
 */

/**
 * Valida todas las opciones de un producto
 * @param {Object} product - Producto con optionStrategies
 * @param {Object} selectedOptions - Opciones seleccionadas {[strategyName]: value}
 * @returns {{valid: boolean, errors: Array<string>}}
 */
export function validateProductOptions(product, selectedOptions) {
  if (!product?.optionStrategies || product.optionStrategies.length === 0) {
    return { valid: true, errors: [] };
  }

  const errors = [];

  for (const strategy of product.optionStrategies) {
    const value = selectedOptions[strategy.name];
    const result = strategy.validate(value);

    if (!result.valid) {
      errors.push(result.message);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Calcula el precio total de un producto con sus opciones
 * @param {Object} product
 * @param {Object} selectedOptions
 * @returns {number}
 */
export function calculateProductPrice(product, selectedOptions) {
  let total = product.price || 0;

  if (!product?.optionStrategies) {
    return total;
  }

  for (const strategy of product.optionStrategies) {
    const value = selectedOptions[strategy.name];
    total += strategy.calculatePrice(value);
  }

  return total;
}

/**
 * Obtiene valores iniciales para todas las opciones
 * @param {Object} product
 * @returns {Object} {[strategyName]: initialValue}
 */
export function getInitialProductOptions(product) {
  if (!product?.optionStrategies) {
    return {};
  }

  const initial = {};

  for (const strategy of product.optionStrategies) {
    initial[strategy.name] = strategy.getInitialValue();
  }

  return initial;
}

/**
 * Formatea el precio en pesos colombianos
 * @param {number} price
 * @returns {string}
 */
export function formatPrice(price) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(price);
}
