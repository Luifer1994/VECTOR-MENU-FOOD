import categoriesData from "@/data/categories.json";

/**
 * Repository para acceso a datos de categorías
 */
export class CategoriesRepository {
  /**
   * Obtiene todas las categorías ordenadas por nombre
   */
  async getAll() {
    try {
      const categories = Promise.resolve(categoriesData.categories || {});
      //ordenar
      const sortedCategories = Object.entries(categories).sort((a, b) =>
        a[1].name.localeCompare(b[1].name)
      );
      return Object.fromEntries(sortedCategories);
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
