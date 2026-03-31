<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useAuthStore } from "@/stores/useAuthStore";
import { useStudyObjectsStore } from "@/features/study-objects/stores/useStudyObjectsStore";
import { useStudyLogsStore } from "@/features/calendar/stores/useStudyLogsStore";
import { useFocusStore } from "@/features/focus-session/stores/useFocusStore";
import DefaultLayout from "@/layouts/DefaultLayout.vue";

const auth = useAuthStore();
const ready = ref(false);

async function loadAllData() {
  await Promise.all([
    useStudyObjectsStore().fetchAll(),
    useStudyLogsStore().fetchAll(),
    useFocusStore().fetchAll(),
  ]);
}

onMounted(async () => {
  await auth.init();
  if (auth.isAuthenticated) {
    await loadAllData();
  }
  ready.value = true;
});

watch(() => auth.isAuthenticated, async (authenticated) => {
  if (authenticated) {
    await loadAllData();
  }
});
</script>

<template>
  <div v-if="!ready" class="flex h-screen items-center justify-center bg-surface-950">
    <p class="text-surface-500">Carregando...</p>
  </div>

  <template v-else>
    <RouterView v-if="$route.meta.public" />
    <DefaultLayout v-else>
      <RouterView />
    </DefaultLayout>
  </template>
</template>
