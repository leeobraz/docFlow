<script setup lang="ts">
import { watch } from "vue";
import { useAuthStore } from "@/stores/useAuthStore";
import { useStudyObjectsStore } from "@/features/study-objects/stores/useStudyObjectsStore";
import { useStudyLogsStore } from "@/features/calendar/stores/useStudyLogsStore";
import { useFocusStore } from "@/features/focus-session/stores/useFocusStore";
import DefaultLayout from "@/layouts/DefaultLayout.vue";

const auth = useAuthStore();

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
  }
});
</script>

<template>
  <RouterView v-if="$route.meta.public" />
  <DefaultLayout v-else>
    <RouterView />
  </DefaultLayout>
</template>
