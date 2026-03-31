<script setup lang="ts">
import { watch } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/useAuthStore";
import { useStudyObjectsStore } from "@/features/study-objects/stores/useStudyObjectsStore";
import { useStudyLogsStore } from "@/features/calendar/stores/useStudyLogsStore";
import { useFocusStore } from "@/features/focus-session/stores/useFocusStore";
import DefaultLayout from "@/layouts/DefaultLayout.vue";

const auth = useAuthStore();
const router = useRouter();

async function loadAllData() {
  await Promise.all([
    useStudyObjectsStore().fetchAll(),
    useStudyLogsStore().fetchAll(),
    useFocusStore().fetchAll(),
  ]);
}

if (auth.isAuthenticated) {
  loadAllData();
}

watch(() => auth.isAuthenticated, (authenticated) => {
  if (authenticated) {
    loadAllData();
    if (router.currentRoute.value.name === "login") {
      router.push("/");
    }
  }
});
</script>

<template>
  <RouterView v-if="$route.meta.public" />
  <DefaultLayout v-else>
    <RouterView />
  </DefaultLayout>
</template>
