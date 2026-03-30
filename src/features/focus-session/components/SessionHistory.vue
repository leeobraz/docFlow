<script setup lang="ts">
import { useFocusStore } from "../stores/useFocusStore";
import { useStudyObjectsStore } from "@/features/study-objects/stores/useStudyObjectsStore";
import AppIcon from "@/components/AppIcon.vue";

const focusStore = useFocusStore();
const objectsStore = useStudyObjectsStore();

function getDisciplineName(studyObjectId: string, disciplineId: string): string {
  return objectsStore.getDiscipline(studyObjectId, disciplineId)?.name ?? "—";
}

function formatMinutes(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
}
</script>

<template>
  <div>
    <h3 class="text-xs font-medium uppercase tracking-wider text-surface-500">
      Sessões Recentes
    </h3>

    <div v-if="focusStore.recentSessions.length === 0" class="mt-4 text-center">
      <AppIcon name="timer" :size="24" class="mx-auto text-surface-700" />
      <p class="mt-2 text-xs text-surface-500">Nenhuma sessão registrada</p>
    </div>

    <ul v-else class="mt-3 flex flex-col gap-2">
      <li
        v-for="session in focusStore.recentSessions"
        :key="session.id"
        class="flex items-center justify-between rounded-lg border border-surface-800 bg-surface-900 px-3 py-2.5"
      >
        <div class="min-w-0">
          <p class="truncate text-sm text-surface-300">
            {{ getDisciplineName(session.studyObjectId, session.disciplineId) }}
          </p>
          <p class="mt-0.5 text-xs text-surface-500">
            {{ formatDate(session.startedAt) }} · {{ formatTime(session.startedAt) }}
          </p>
        </div>
        <span class="shrink-0 rounded-md bg-accent-500/10 px-2 py-0.5 text-xs font-medium text-accent-400">
          {{ formatMinutes(session.durationMinutes) }}
        </span>
      </li>
    </ul>
  </div>
</template>
