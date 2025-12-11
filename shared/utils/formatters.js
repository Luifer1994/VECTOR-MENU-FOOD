/**
 * Formateadores comunes
 */

/**
 * Formatea precio en pesos colombianos
 * @param {number} price
 * @returns {string}
 */
export function formatCurrency(price) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Normaliza texto para búsqueda (sin acentos, minúsculas)
 * @param {string} text
 * @returns {string}
 */
export function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}
