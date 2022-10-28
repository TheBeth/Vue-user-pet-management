import { createRouter, createWebHistory } from "vue-router";
import UsersManager from "./pages/UsersManager.vue";
import PetManager from "./pages/PetManager.vue";
import AuthenUser from "./pages/AuthenUser.vue";
import NotFound from "./pages/NotFound.vue";
import ResetPassword from "./pages/ResetPassword.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/user" },
    { path: "/signin", component: AuthenUser, meta: { requiresUnauth: true } },
    {
      path: "/resetPassword",
      component: ResetPassword,
      meta: { requiresUnauth: true },
    },
    { path: "/user", component: UsersManager, meta: { requiresAuth: true } },
    { path: "/pet", component: PetManager, meta: { requiresAuth: true } },
    { path: "/:notFound(.*)", component: NotFound },
  ],
});

router.beforeEach((to, _, next) => {
  if (
    to.meta.requiresAuth &&
    !window.localStorage.getItem("token") &&
    !window.localStorage.getItem("refreshToken") &&
    !window.localStorage.getItem("idToken")
  ) {
    next("signin");
  } else if (to.meta.requiresUnauth && window.localStorage.getItem("token")) {
    console.log(localStorage);
    next("/user");
  } else {
    next();
  }
});

export default router;
