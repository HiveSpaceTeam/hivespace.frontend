import { createRouter, createWebHistory } from "vue-router";
import routerPage from "./routerPage";
import routerUser from "./routerUser";
import userManager from "@/auth/user-manager";
import { oAuthSignin } from "@/auth/oauth-helper";
import authHelper from "../helpers/authHelper";
import appConfig from "@/config/appConfig";

const routes = [
  {
    path: "",
    component: () => import("@/layouts/MainLayout.vue"),
    meta: {},
    children: [
      {
        path: "", // Đường dẫn cho trang chủ
        name: "", // Tên của route
        component: () => import("@/pages/Home.vue"),
        meta: {
          anonymous: true,
        }
      },
      {
        path: "/product-detail/:id", // Đường dẫn cho chi tiết
        name: "productDetail", // Tên của route
        component: () => import("@/pages/ProductDetail.vue"),
        meta: {
          anonymous: true,
        }
      },
      {
        path: "/search/:key", // Đường dẫn cho chi tiết
        name: "search", // Tên của route
        component: () => import("@/pages/Search.vue"),
        meta: {
          anonymous: true,
        }
      },
      ...routerUser
    ],
  },
  {
    path: "/cart",
    name: "cart",
    component: () => import("@/views/cart/Cart.vue"),
  },
  {
    path: "/check-out",
    name: "checkout",
    component: () => import("@/views/checkOut/CheckOut.vue"),
  },
  ...routerPage,
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  if (to.meta.anonymous) {
    next();
    return;
  }

  const enableOauth = appConfig.enableOauth;
  if (enableOauth) {
    const user = await userManager.getUser();
    if (!user) {
      await oAuthSignin();
      return;
    }
  } else {
    if (!authHelper.isAuthenticated()) {
      next({ path: "/login" });
      return;
    }
  }

  next();
});

export default router;
