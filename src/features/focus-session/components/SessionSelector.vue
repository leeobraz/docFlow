<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useStudyObjectsStore } from "@/features/study-objects/stores/useStudyObjectsStore";
import { useFocusStore } from "../stores/useFocusStore";
import AppSelect from "@/components/AppSelect.vue";
import AppButton from "@/components/AppButton.vue";
import AppIcon from "@/components/AppIcon.vue";

const objectsStore = useStudyObjectsStore();
const focusStore = useFocusStore();

const selectedObjectId = ref("");
const selectedDisciplineId = ref("");

const objectOptions = computed(() =>
  objectsStore.studyObjects.map((so) => ({
    value: so.id,
    label: so.title,
  }))
);

const disciplineOptions = computed(() => {
  if (!selectedObjectId.value) return [];
  const obj = objectsStore.getById(selectedObjectId.value);
  return obj?.disciplines.map((d) => ({
    value: d.id,
    label: d.name,
  })) ?? [];
});

const canStart = computed(() =>
  selectedObjectId.value &&
  selectedDisciplineId.value &&
  !focusStore.hasActiveSession
);

watch(selectedObjectId, () => {
  selectedDisciplineId.value = "";
});

function start() {
  if (!canStart.value) return;
  focusStore.startSession(selectedObjectId.value, selectedDisciplineId.value);
}
</script>

<template>
  <div class="rounded-xl border border-surface-800 bg-surface-900 p-5">
    <h3 class="text-xs font-medium uppercase tracking-wider text-surface-500">
      Sessão de Foco
    </h3>

    <div v-if="!focusStore.hasActiveSession" class="mt-4 flex flex-col gap-3">
      <AppSelect
        v-model="selectedObjectId"
        label="Objeto de Estudo"
        :options="objectOptions"
        placeholder="Selecione..."
      />
      <AppSelect
        v-model="selectedDisciplineId"
        label="Disciplina"
        :options="disciplineOptions"
        :placeholder="selectedObjectId ? 'Selecione...' : 'Selecione o objeto primeiro'"
      />
      <AppButton class="mt-2 w-full" :disabled="!canStart" @click="start">
        <AppIcon name="play" :size="16" />
        Iniciar Foco
      </AppButton>
    </div>

    <div v-else class="mt-4">
      <p class="text-sm text-surface-300">
        {{ objectsStore.getDiscipline(focusStore.activeStudyObjectId, focusStore.activeDisciplineId)?.name }}
      </p>
      <p class="mt-0.5 text-xs text-surface-500">
        {{ objectsStore.getById(focusStore.activeStudyObjectId)?.title }}
      </p>
    </div>
  </div>
</template>
