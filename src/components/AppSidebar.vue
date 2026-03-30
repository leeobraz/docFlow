<script setup lang="ts">
import { useRoute } from "vue-router";
import AppIcon from "@/components/AppIcon.vue";

defineProps<{
  open: boolean;
}>();

defineEmits<{
  toggle: [];
}>();

const route = useRoute();

const navItems = [
  { to: "/study-objects", label: "Objetos de Estudo", icon: "book" as const },
  { to: "/calendar", label: "Calendário", icon: "calendar" as const },
  { to: "/focus", label: "Foco", icon: "timer" as const },
];

function isActive(path: string): boolean {
  return route.path.startsWith(path);
}
</script>

<template>
  <aside
    class="flex flex-col border-r border-surface-800 bg-surface-900 transition-all duration-300"
    :class="open ? 'w-60' : 'w-0 lg:w-16'"
  >
    <div
      class="flex h-14 items-center overflow-hidden border-b border-surface-800 px-4"
      :class="open ? 'justify-between' : 'justify-center'"
    >
      <span
        v-if="open"
        class="text-sm font-bold tracking-wide text-accent-400 uppercase"
      >
        docFlow
      </span>
      <button
        class="rounded-md p-1.5 text-surface-500 transition-colors hover:bg-surface-800 hover:text-surface-300"
        @click="$emit('toggle')"
      >
        <AppIcon :name="open ? 'x' : 'menu'" :size="18" />
      </button>
    </div>

    <nav class="mt-4 flex flex-1 flex-col gap-1 overflow-hidden px-2">
      <router-link
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
        :class="
          isActive(item.to)
            ? 'bg-accent-500/10 text-accent-400'
            : 'text-surface-500 hover:bg-surface-800 hover:text-surface-300'
        "
      >
        <AppIcon
          :name="item.icon"
          :size="20"
          class="shrink-0"
        />
        <span v-if="open" class="truncate">{{ item.label }}</span>
      </router-link>
    </nav>

    <div
      v-if="open"
      class="border-t border-surface-800 p-4"
    >
      <p class="text-xs text-surface-600">docFlow v0.1</p>
    </div>
  </aside>
</template>
