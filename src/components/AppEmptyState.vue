<script setup lang="ts">
import AppIcon from "./AppIcon.vue";

defineProps<{
  icon: string;
  title: string;
  description: string;
}>();
</script>

<template>
  <div class="flex flex-col items-center justify-center py-16 text-center">
    <div class="rounded-full bg-surface-800 p-4">
      <AppIcon :name="icon" :size="32" class="text-surface-500" />
    </div>
    <h3 class="mt-4 text-sm font-medium text-surface-400">{{ title }}</h3>
    <p class="mt-1 max-w-xs text-xs text-surface-600">{{ description }}</p>
    <div v-if="$slots.action" class="mt-5">
      <slot name="action" />
    </div>
  </div>
</template>
