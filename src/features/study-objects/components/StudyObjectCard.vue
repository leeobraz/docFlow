<script setup lang="ts">
import type { StudyObject } from "@/types";
import AppIcon from "@/components/AppIcon.vue";

defineProps<{
  studyObject: StudyObject;
}>();

defineEmits<{
  click: [];
  delete: [];
}>();

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}
</script>

<template>
  <article
    class="group cursor-pointer rounded-xl border border-surface-800 bg-surface-900 p-5 transition-all hover:border-accent-500/30 hover:bg-surface-800/50"
    @click="$emit('click')"
  >
    <div class="flex items-start justify-between">
      <div class="flex min-w-0 flex-1 items-center gap-3">
        <div class="shrink-0 rounded-lg bg-accent-500/10 p-2">
          <AppIcon name="graduation-cap" :size="20" class="text-accent-400" />
        </div>
        <div class="min-w-0">
          <h3 class="truncate text-sm font-semibold text-surface-300">
            {{ studyObject.title }}
          </h3>
          <p v-if="studyObject.description" class="mt-0.5 truncate text-xs text-surface-500">
            {{ studyObject.description }}
          </p>
        </div>
      </div>

      <button
        class="shrink-0 rounded-md p-1.5 text-surface-600 opacity-0 transition-all hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100"
        @click.stop="$emit('delete')"
      >
        <AppIcon name="trash" :size="14" />
      </button>
    </div>

    <div class="mt-4 flex items-center gap-4 text-xs text-surface-500">
      <span class="flex items-center gap-1.5">
        <AppIcon name="book" :size="12" />
        {{ studyObject.disciplines.length }} disciplina{{ studyObject.disciplines.length !== 1 ? 's' : '' }}
      </span>
      <span>{{ formatDate(studyObject.updatedAt) }}</span>
    </div>
  </article>
</template>
