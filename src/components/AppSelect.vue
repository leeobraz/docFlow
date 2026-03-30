<script setup lang="ts">
const model = defineModel<string>();

defineProps<{
  label?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}>();
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label v-if="label" class="text-xs font-medium text-surface-400">
      {{ label }}
    </label>
    <select
      v-model="model"
      class="appearance-none rounded-lg border border-surface-700 bg-surface-800 px-3 py-2 text-sm text-surface-300 outline-none transition-colors focus:border-accent-500/50 focus:ring-1 focus:ring-accent-500/25"
    >
      <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
      <option
        v-for="opt in options"
        :key="opt.value"
        :value="opt.value"
      >
        {{ opt.label }}
      </option>
    </select>
  </div>
</template>
