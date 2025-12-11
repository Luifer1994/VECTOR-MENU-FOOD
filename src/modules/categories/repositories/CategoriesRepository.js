import categoriesData from "@/data/categories.json";

/**
 * Repository para acceso a datos de categorías
 */
export class CategoriesRepository {
  /**
   * Obtiene todas las categorías
   */
  async getAll() {
    try {
      return Promise.resolve(categoriesData.categories || {});
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw new Error("Failed to load categories");
    }
  }

  /**
   * Obtiene una categoría por ID
   */
  async getById(id) {
    try {
      const categories = await this.getAll();
      return categories[id] || null;
    } catch (error) {
      console.error("Error fetching category:", error);
      throw new Error("Failed to load category");
    }
  }
}

// Export singleton instance
export const categoriesRepository = new CategoriesRepository();
