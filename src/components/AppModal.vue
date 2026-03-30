<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import AppIcon from "./AppIcon.vue";

defineProps<{
  title: string;
}>();

const emit = defineEmits<{
  close: [];
}>();

function onKeydown(e: KeyboardEvent) {
  if (e.key === "Escape") emit("close");
}

onMounted(() => window.addEventListener("keydown", onKeydown));
onUnmounted(() => window.removeEventListener("keydown", onKeydown));
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        class="absolute inset-0 bg-black/60 backdrop-blur-sm"
        @click="$emit('close')"
      />

      <div class="relative w-full max-w-lg rounded-xl border border-surface-700 bg-surface-900 shadow-2xl">
        <div class="flex items-center justify-between border-b border-surface-800 px-6 py-4">
          <h3 class="text-base font-semibold text-surface-300">{{ title }}</h3>
          <button
            class="rounded-md p-1 text-surface-500 transition-colors hover:bg-surface-800 hover:text-surface-300"
            @click="$emit('close')"
          >
            <AppIcon name="x" :size="16" />
          </button>
        </div>

        <div class="px-6 py-5">
          <slot />
        </div>

        <div
          v-if="$slots.footer"
          class="flex items-center justify-end gap-3 border-t border-surface-800 px-6 py-4"
        >
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Teleport>
</template>
