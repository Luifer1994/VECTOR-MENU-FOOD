import { createRouter, createWebHistory } from "vue-router";
import categoriesRoutes from "@/modules/categories/routes.js";
import productsRoutes from "@/modules/products/routes.js";
import cartRoutes from "@/modules/cart/routes.js";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...categoriesRoutes, ...productsRoutes, ...cartRoutes],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

export default router;
