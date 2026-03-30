import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
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

export default router;
