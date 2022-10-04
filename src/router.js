import { createRouter, createWebHistory } from "vue-router";
import UsersManager from "./pages/UsersManager.vue";
import PetManager from "./pages/PetManager.vue";
import AuthenUser from "./pages/AuthenUser.vue";
import NotFound from "./pages/NotFound.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/user" },
    { path: "/signin", component: AuthenUser, meta: { requiresUnauth: true } },
    { path: "/user", component: UsersManager, meta: { requiresAuth: true } },
    { path: "/pet", component: PetManager, meta: { requiresAuth: true } },
    { path: "/:notFound(.*)", component: NotFound },
  ],
});

router.beforeEach((to, _, next) => {
  if (to.meta.requiresAuth && !window.localStorage.getItem("token")) {
    next("signin");
  } else if (to.meta.requiresUnauth && window.localStorage.getItem("token")) {
    next("/user");
  } else {
    next();
  }
});

export default router;
