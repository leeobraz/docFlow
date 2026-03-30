<script setup lang="ts">
defineProps<{
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md";
}>();
</script>

<template>
  <button
    class="inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500/50 disabled:pointer-events-none disabled:opacity-50"
    :class="[
      (size ?? 'md') === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm',
      {
        'bg-accent-500 text-white hover:bg-accent-600': (variant ?? 'primary') === 'primary',
        'border border-surface-700 bg-surface-800 text-surface-300 hover:bg-surface-700': variant === 'secondary',
        'text-surface-400 hover:bg-surface-800 hover:text-surface-300': variant === 'ghost',
        'bg-red-500/10 text-red-400 hover:bg-red-500/20': variant === 'danger',
      },
    ]"
  >
    <slot />
  </button>
</template>
