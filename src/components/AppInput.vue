<script setup lang="ts">
const model = defineModel<string>();

defineProps<{
  label?: string;
  placeholder?: string;
}>();
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label v-if="label" class="text-xs font-medium text-surface-400">
      {{ label }}
    </label>
    <input
      v-model="model"
      :placeholder="placeholder"
      class="rounded-lg border border-surface-700 bg-surface-800 px-3 py-2 text-sm text-surface-300 placeholder-surface-600 outline-none transition-colors focus:border-accent-500/50 focus:ring-1 focus:ring-accent-500/25"
    />
  </div>
</template>
