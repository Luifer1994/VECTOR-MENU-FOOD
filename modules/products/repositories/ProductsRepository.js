import menuRealData from "@/data/menu-real.json";

/**
 * Repository para acceso a datos de productos
 * Capa de abstracción entre store y fuente de datos
 */
export class ProductsRepository {
  /**
   * Obtiene todos los productos raw del JSON
   */
  async getAll() {
    try {
      // Simular async (futuro API)
      return Promise.resolve(menuRealData.productos || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      throw new Error("Failed to load products");
    }
  }

  /**
   * Obtiene un producto por ID
   */
  async getById(id) {
    try {
      const products = await this.getAll();
      return products.find((p) => p.Codigo === id) || null;
    } catch (error) {
      console.error("Error fetching product:", error);
      throw new Error("Failed to load product");
    }
  }

  /**
   * Busca productos por query
   */
  async search(query) {
    try {
      const products = await this.getAll();
      const lowerQuery = query.toLowerCase();

      return products.filter(
        (p) =>
          p.Nombre.toLowerCase().includes(lowerQuery) ||
          p.Categoria.toLowerCase().includes(lowerQuery)
      );
    } catch (error) {
      console.error("Error searching products:", error);
      throw new Error("Failed to search products");
    }
  }
}

// Export singleton instance
export const productsRepository = new ProductsRepository();
