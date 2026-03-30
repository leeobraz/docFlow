<script setup lang="ts">
import { useRoute } from "vue-router";
import { computed } from "vue";
import AppIcon from "@/components/AppIcon.vue";

defineProps<{
  sidebarOpen: boolean;
}>();

defineEmits<{
  toggleSidebar: [];
}>();

const route = useRoute();

const pageTitle = computed(() => {
  const titles: Record<string, string> = {
    "study-objects": "Objetos de Estudo",
    "study-object-detail": "Objetos de Estudo",
    "discipline-detail": "Objetos de Estudo",
    calendar: "Calendário",
    focus: "Foco",
  };
  return titles[route.name as string] ?? "";
});
</script>

<template>
  <header class="flex h-14 shrink-0 items-center gap-4 border-b border-surface-800 bg-surface-900/50 px-6 backdrop-blur-sm">
    <button
      v-if="!sidebarOpen"
      class="rounded-md p-1.5 text-surface-500 transition-colors hover:bg-surface-800 hover:text-surface-300 lg:hidden"
      @click="$emit('toggleSidebar')"
    >
      <AppIcon name="menu" :size="18" />
    </button>

    <h2 class="text-sm font-medium text-surface-400">
      {{ pageTitle }}
    </h2>
  </header>
</template>
