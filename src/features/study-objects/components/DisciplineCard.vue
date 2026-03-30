<script setup lang="ts">
import type { Discipline } from "@/types";
import AppIcon from "@/components/AppIcon.vue";

defineProps<{
  discipline: Discipline;
}>();

defineEmits<{
  click: [];
  delete: [];
}>();

function formatMinutes(mins: number): string {
  if (mins === 0) return "0h";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
}
</script>

<template>
  <article
    class="group cursor-pointer rounded-lg border border-surface-800 bg-surface-900 p-4 transition-all hover:border-accent-500/30 hover:bg-surface-800/50"
    @click="$emit('click')"
  >
    <div class="flex items-start justify-between">
      <div class="flex items-center gap-3">
        <div class="rounded-md bg-surface-800 p-1.5">
          <AppIcon name="book" :size="16" class="text-surface-400" />
        </div>
        <h4 class="text-sm font-medium text-surface-300">
          {{ discipline.name }}
        </h4>
      </div>

      <button
        class="shrink-0 rounded-md p-1 text-surface-600 opacity-0 transition-all hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100"
        @click.stop="$emit('delete')"
      >
        <AppIcon name="trash" :size="14" />
      </button>
    </div>

    <div class="mt-3 flex items-center gap-4 text-xs text-surface-500">
      <span class="flex items-center gap-1">
        <AppIcon name="file" :size="12" />
        {{ discipline.files.length }} arquivo{{ discipline.files.length !== 1 ? 's' : '' }}
      </span>
      <span class="flex items-center gap-1">
        <AppIcon name="timer" :size="12" />
        {{ formatMinutes(discipline.totalMinutes) }}
      </span>
    </div>
  </article>
</template>
