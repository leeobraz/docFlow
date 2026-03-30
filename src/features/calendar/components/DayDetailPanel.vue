<script setup lang="ts">
import { computed } from "vue";
import { useStudyLogsStore } from "../stores/useStudyLogsStore";
import { useStudyObjectsStore } from "@/features/study-objects/stores/useStudyObjectsStore";
import StudyLogItem from "./StudyLogItem.vue";
import AppButton from "@/components/AppButton.vue";
import AppIcon from "@/components/AppIcon.vue";

const props = defineProps<{
  date: string;
}>();

defineEmits<{
  addLog: [];
}>();

const logsStore = useStudyLogsStore();
const objectsStore = useStudyObjectsStore();

const logs = computed(() => logsStore.getLogsByDate(props.date));
const totalMinutes = computed(() => logsStore.getTotalMinutesByDate(props.date));

const formattedDate = computed(() => {
  const [y, m, d] = props.date.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
});

function formatMinutes(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
}

function getDisciplineName(studyObjectId: string, disciplineId: string): string {
  const d = objectsStore.getDiscipline(studyObjectId, disciplineId);
  return d?.name ?? "Disciplina removida";
}

function getObjectTitle(studyObjectId: string): string {
  const o = objectsStore.getById(studyObjectId);
  return o?.title ?? "Objeto removido";
}

function handleDelete(logId: string) {
  logsStore.deleteLog(logId);
}
</script>

<template>
  <div class="flex h-full flex-col">
    <div class="flex items-start justify-between border-b border-surface-800 pb-4">
      <div>
        <h3 class="text-sm font-semibold capitalize text-surface-300">
          {{ formattedDate }}
        </h3>
        <p v-if="totalMinutes > 0" class="mt-0.5 text-xs text-accent-400">
          {{ formatMinutes(totalMinutes) }} de estudo
        </p>
      </div>
      <AppButton size="sm" @click="$emit('addLog')">
        <AppIcon name="plus" :size="14" />
        Log
      </AppButton>
    </div>

    <div v-if="logs.length === 0" class="flex flex-1 flex-col items-center justify-center py-10">
      <AppIcon name="calendar" :size="28" class="text-surface-700" />
      <p class="mt-3 text-xs text-surface-500">Nenhum registro neste dia</p>
      <AppButton size="sm" class="mt-3" variant="secondary" @click="$emit('addLog')">
        Registrar estudo
      </AppButton>
    </div>

    <ul v-else class="mt-4 flex flex-col gap-3 overflow-y-auto">
      <StudyLogItem
        v-for="log in logs"
        :key="log.id"
        :log="log"
        :discipline-name="getDisciplineName(log.studyObjectId, log.disciplineId)"
        :object-title="getObjectTitle(log.studyObjectId)"
        @delete="handleDelete(log.id)"
      />
    </ul>
  </div>
</template>
