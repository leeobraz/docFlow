<script setup lang="ts">
import { computed } from "vue";
import { useFocusStore } from "../stores/useFocusStore";
import AppIcon from "@/components/AppIcon.vue";

const store = useFocusStore();

interface MetricCard {
  label: string;
  value: string;
  icon: string;
}

const metrics = computed<MetricCard[]>(() => {
  return [
    {
      label: "Hoje",
      value: formatMinutes(store.todayTotalMinutes),
      icon: "timer",
    },
    {
      label: "Sessões hoje",
      value: String(store.todaySessions.length),
      icon: "play",
    },
    {
      label: "Esta semana",
      value: formatMinutes(store.weekTotalMinutes),
      icon: "trending-up",
    },
    {
      label: "Sessões semana",
      value: String(store.weekSessions.length),
      icon: "bar-chart",
    },
  ];
});

function formatMinutes(mins: number): string {
  if (mins === 0) return "0min";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}
</script>

<template>
  <div class="grid grid-cols-2 gap-3">
    <div
      v-for="card in metrics"
      :key="card.label"
      class="rounded-lg border border-surface-800 bg-surface-900 p-4"
    >
      <div class="flex items-center gap-2">
        <AppIcon :name="card.icon" :size="14" class="text-surface-500" />
        <span class="text-xs text-surface-500">{{ card.label }}</span>
      </div>
      <p class="mt-2 text-xl font-semibold text-surface-300">{{ card.value }}</p>
    </div>
  </div>
</template>
