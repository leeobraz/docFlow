<script setup lang="ts">
import type { StudyLog } from "@/types";
import AppIcon from "@/components/AppIcon.vue";

defineProps<{
  log: StudyLog;
  disciplineName: string;
  objectTitle: string;
}>();

defineEmits<{
  delete: [];
}>();

function formatMinutes(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
}
</script>

<template>
  <li class="group rounded-lg border border-surface-800 bg-surface-900 p-3">
    <div class="flex items-start justify-between gap-2">
      <div class="min-w-0">
        <p class="text-sm font-medium text-surface-300">{{ disciplineName }}</p>
        <p class="mt-0.5 truncate text-xs text-surface-500">{{ objectTitle }}</p>
      </div>
      <div class="flex shrink-0 items-center gap-2">
        <span class="rounded-md bg-accent-500/10 px-2 py-0.5 text-xs font-medium text-accent-400">
          {{ formatMinutes(log.minutes) }}
        </span>
        <button
          class="rounded-md p-1 text-surface-600 opacity-0 transition-all hover:text-red-400 group-hover:opacity-100"
          @click="$emit('delete')"
        >
          <AppIcon name="trash" :size="12" />
        </button>
      </div>
    </div>
    <p v-if="log.notes" class="mt-2 text-xs leading-relaxed text-surface-400">
      {{ log.notes }}
    </p>
  </li>
</template>
