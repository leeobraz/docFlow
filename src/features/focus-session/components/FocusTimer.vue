<script setup lang="ts">
import { computed } from "vue";
import { useFocusStore } from "../stores/useFocusStore";
import AppIcon from "@/components/AppIcon.vue";

const store = useFocusStore();

const display = computed(() => {
  const total = store.elapsedSeconds;
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n: number) => String(n).padStart(2, "0");

  if (h > 0) return `${pad(h)}:${pad(m)}:${pad(s)}`;
  return `${pad(m)}:${pad(s)}`;
});

const statusLabel = computed(() => {
  if (store.isRunning) return "Em andamento";
  if (store.isPaused) return "Pausado";
  return "Pronto";
});
</script>

<template>
  <div class="flex flex-col items-center">
    <div class="relative">
      <div
        class="flex h-52 w-52 items-center justify-center rounded-full border-2 transition-colors duration-500"
        :class="{
          'border-accent-500/40 shadow-[0_0_40px_rgba(139,92,246,0.1)]': store.isRunning,
          'border-amber-500/30': store.isPaused,
          'border-surface-700': !store.hasActiveSession,
        }"
      >
        <span
          class="font-mono text-4xl font-light tracking-wider"
          :class="{
            'text-surface-200': store.isRunning,
            'text-amber-400': store.isPaused,
            'text-surface-500': !store.hasActiveSession,
          }"
        >
          {{ display }}
        </span>
      </div>

      <div
        v-if="store.isRunning"
        class="absolute inset-0 animate-ping rounded-full border border-accent-500/10"
        style="animation-duration: 3s"
      />
    </div>

    <p
      class="mt-4 text-xs font-medium uppercase tracking-widest"
      :class="{
        'text-accent-400': store.isRunning,
        'text-amber-400': store.isPaused,
        'text-surface-600': !store.hasActiveSession,
      }"
    >
      {{ statusLabel }}
    </p>

    <div v-if="store.hasActiveSession" class="mt-6 flex items-center gap-3">
      <button
        v-if="store.isRunning"
        class="flex h-12 w-12 items-center justify-center rounded-full bg-surface-800 text-amber-400 transition-colors hover:bg-surface-700"
        @click="store.pauseSession()"
      >
        <AppIcon name="pause" :size="20" />
      </button>

      <button
        v-if="store.isPaused"
        class="flex h-12 w-12 items-center justify-center rounded-full bg-accent-500 text-white transition-colors hover:bg-accent-600"
        @click="store.resumeSession()"
      >
        <AppIcon name="play" :size="20" />
      </button>

      <button
        class="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-400 transition-colors hover:bg-red-500/20"
        @click="store.stopSession()"
      >
        <AppIcon name="stop" :size="20" />
      </button>
    </div>
  </div>
</template>
