import { OptionStrategyFactory } from "../strategies/OptionStrategyFactory.js";

/**
 * URLs de imágenes por categoría
 */
const CATEGORY_IMAGES = {
  ADICIONALES:
    "https://images.unsplash.com/photo-1618346136472-090de76b4cc0?w=600",
  "AL BARRIL":
    "https://images.unsplash.com/photo-1544025162-d76694265947?w=600",
  "ASADOS CARBON":
    "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600",
  BEBIDAS: "https://images.unsplash.com/photo-1437418747212-8d9709afab22?w=600",
  "CLASICA BAR":
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600",
  COCTELES:
    "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600",
  DESGRANADO: "https://images.unsplash.com/photo-1551462147-37950a0f9a4e?w=600",
  "ENT PARA PICAR":
    "https://images.unsplash.com/photo-1621457734625-8abafef1d10b?w=600",
  INFANTIL:
    "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=600",
  LIMONADAS:
    "https://images.unsplash.com/photo-1523677011781-c91d1bbe4a61?w=600",
  MEKATOS: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=600",
  "PAL GRUPO":
    "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600",
  PERROS: "https://images.unsplash.com/photo-1612392062422-ef19b42f74df?w=600",
  "PICADA DE CARNE":
    "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600",
  "PLATOS ESPECIALES":
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600",
  SALCHIPAPAS:
    "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=600",
  SHOTS: "https://images.unsplash.com/photo-1514361892635-6b07e31e75f9?w=600",
  "SODAS MICHELADAS":
    "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600",
  "Z LICORES":
    "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=600",
  "ZZ EVENTOS":
    "https://images.unsplash.com/photo-1530103043960-ef38714abb15?w=600",
};

/**
 * Obtiene imagen placeholder según categoría
 */
function getPlaceholderImage(category) {
  return (
    CATEGORY_IMAGES[category] ||
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600"
  );
}

/**
 * Transforma un grupo de combo del JSON a strategy
 * @param {Object} grupo - Grupo de combo del JSON
 * @returns {OptionStrategy}
 */
function transformComboGroupToStrategy(grupo) {
  const firstInsumo = grupo.insumos[0] || {};

  const config = {
    name: grupo.nombre.trim(),
    min: parseInt(firstInsumo.min) || 0,
    max: parseInt(firstInsumo.max) || 1,
    required: firstInsumo.obligatorio === "1",
    choices: grupo.insumos.map((insumo) => ({
      label: insumo.Nombre,
      value: insumo.Codigo,
      price: parseFloat(insumo.Precio) || 0,
      raw: insumo, // Mantener datos originales
    })),
  };

  return OptionStrategyFactory.create(config);
}

/**
 * Transforma todos los combos a strategies
 * @param {Array} combo - Array de grupos de combo
 * @returns {Array<OptionStrategy>}
 */
export function transformComboToStrategies(combo) {
  if (!combo || !Array.isArray(combo) || combo.length === 0) {
    return [];
  }

  return combo.map(transformComboGroupToStrategy);
}

/**
 * Transforma productoSin a strategy
 * @param {Array} productoSin - Array de productos "sin"
 * @returns {ProductoSinStrategy|null}
 */
export function transformProductoSinToStrategy(productoSin) {
  if (!productoSin || !Array.isArray(productoSin) || productoSin.length === 0) {
    return null;
  }

  const config = {
    name: "Personaliza tu pedido",
    type: "productoSin",
    min: 0,
    max: productoSin.length,
    required: false,
    choices: productoSin.map((item) => ({
      label: `Sin ${item.Insumo}`,
      value: item.Codigo,
      price: 0,
      raw: item,
    })),
  };

  return OptionStrategyFactory.create(config);
}

/**
 * Transforma un producto completo del JSON
 * @param {Object} rawProduct - Producto del JSON original
 * @returns {Object} Producto transformado con strategies
 */
export function transformProduct(rawProduct) {
  // Transformar combos a strategies
  const strategies = transformComboToStrategies(rawProduct.combo || []);

  // Agregar strategy de productoSin si existe
  const sinStrategy = transformProductoSinToStrategy(rawProduct.productoSin);
  if (sinStrategy) {
    strategies.push(sinStrategy);
  }

  // Usar imagen placeholder si img es null o vacío
  const productImage =
    rawProduct.img || getPlaceholderImage(rawProduct.Categoria);

  return {
    id: rawProduct.Codigo,
    name: rawProduct.Nombre,
    description: rawProduct.Categoria, // Mejorar después
    category: rawProduct.Categoria,
    area: rawProduct.Area,
    price: parseFloat(rawProduct.PrecioBase) || 0,
    image: productImage,
    optionStrategies: strategies,

    // Metadata útil
    blocked: rawProduct.Bloqueado === "1",
    hasOptions: strategies.length > 0,

    // Mantener raw data por si acaso
    raw: rawProduct,
  };
}

/**
 * Transforma múltiples productos
 * @param {Array} rawProducts
 * @returns {Array<Object>}
 */
export function transformProducts(rawProducts) {
  if (!Array.isArray(rawProducts)) {
    return [];
  }

  return rawProducts
    .filter((p) => p.Bloqueado !== "1") // Filtrar bloqueados
    .map(transformProduct);
}
