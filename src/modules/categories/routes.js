/**
 * Rutas del módulo de categorías
 */
export default [
  {
    path: "/",
    name: "home",
    component: () => import("@/modules/categories/views/HomeView.vue"),
  },
  {
    path: "/category/:id",
    name: "category",
    component: () => import("@/modules/categories/views/CategoryView.vue"),
  },
];
