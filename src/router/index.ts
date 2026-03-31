import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
import { useAuthStore } from "@/stores/useAuthStore";

const routes: RouteRecordRaw[] = [
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/LoginView.vue"),
    meta: { public: true },
  },
  {
    path: "/",
    redirect: "/study-objects",
  },
  {
    path: "/study-objects",
    name: "study-objects",
    component: () => import("@/views/StudyObjectsView.vue"),
  },
  {
    path: "/study-objects/:id",
    name: "study-object-detail",
    component: () => import("@/views/StudyObjectDetailView.vue"),
  },
  {
    path: "/study-objects/:id/disciplines/:disciplineId",
    name: "discipline-detail",
    component: () => import("@/views/DisciplineDetailView.vue"),
  },
  {
    path: "/calendar",
    name: "calendar",
    component: () => import("@/views/CalendarView.vue"),
  },
  {
    path: "/focus",
    name: "focus",
    component: () => import("@/views/FocusView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  const auth = useAuthStore();

  if (!to.meta.public && !auth.isAuthenticated) {
    return { name: "login" };
  }

  if (to.name === "login" && auth.isAuthenticated) {
    return { path: "/" };
  }
});

export default router;
