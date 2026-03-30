<script setup lang="ts">
import FocusTimer from "@/features/focus-session/components/FocusTimer.vue";
import SessionSelector from "@/features/focus-session/components/SessionSelector.vue";
import FocusMetrics from "@/features/focus-session/components/FocusMetrics.vue";
import SessionHistory from "@/features/focus-session/components/SessionHistory.vue";
</script>

<template>
  <div class="mx-auto max-w-5xl">
    <div class="mb-8">
      <h1 class="text-2xl font-semibold text-surface-300">Foco</h1>
      <p class="mt-1 text-sm text-surface-500">
        Inicie sessões cronometradas e acompanhe suas métricas.
      </p>
    </div>

    <div class="flex flex-col gap-8 lg:flex-row">
      <div class="flex flex-col items-center gap-8 lg:flex-1">
        <div class="flex w-full max-w-sm flex-col items-center rounded-xl border border-surface-800 bg-surface-900 px-6 py-10">
          <FocusTimer />
        </div>
        <div class="w-full">
          <FocusMetrics />
        </div>
      </div>

      <div class="flex flex-col gap-6 lg:w-80">
        <SessionSelector />
        <div class="rounded-xl border border-surface-800 bg-surface-900 p-5">
          <SessionHistory />
        </div>
      </div>
    </div>
  </div>
</template>
