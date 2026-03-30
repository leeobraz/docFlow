<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useStudyObjectsStore } from "@/features/study-objects/stores/useStudyObjectsStore";
import AppModal from "@/components/AppModal.vue";
import AppSelect from "@/components/AppSelect.vue";
import AppInput from "@/components/AppInput.vue";
import AppTextarea from "@/components/AppTextarea.vue";
import AppButton from "@/components/AppButton.vue";

const props = defineProps<{
  date: string;
}>();

const emit = defineEmits<{
  close: [];
  create: [data: {
    studyObjectId: string;
    disciplineId: string;
    minutes: number;
    notes: string;
  }];
}>();

const objectsStore = useStudyObjectsStore();

const selectedObjectId = ref("");
const selectedDisciplineId = ref("");
const hours = ref("");
const minutes = ref("");
const notes = ref("");

const objectOptions = computed(() =>
  objectsStore.studyObjects.map((so) => ({
    value: so.id,
    label: so.title,
  }))
);

const disciplineOptions = computed(() => {
  if (!selectedObjectId.value) return [];
  const obj = objectsStore.getById(selectedObjectId.value);
  if (!obj) return [];
  return obj.disciplines.map((d) => ({
    value: d.id,
    label: d.name,
  }));
});

watch(selectedObjectId, () => {
  selectedDisciplineId.value = "";
});

const formattedDate = computed(() => {
  const [y, m, d] = props.date.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
});

const totalMinutes = computed(() => {
  const h = parseInt(hours.value) || 0;
  const m = parseInt(minutes.value) || 0;
  return h * 60 + m;
});

const isValid = computed(() =>
  selectedObjectId.value &&
  selectedDisciplineId.value &&
  totalMinutes.value > 0
);

function submit() {
  if (!isValid.value) return;
  emit("create", {
    studyObjectId: selectedObjectId.value,
    disciplineId: selectedDisciplineId.value,
    minutes: totalMinutes.value,
    notes: notes.value.trim(),
  });
}
</script>

<template>
  <AppModal title="Registrar Estudo" @close="$emit('close')">
    <form class="flex flex-col gap-4" @submit.prevent="submit">
      <p class="text-xs text-surface-500">
        {{ formattedDate }}
      </p>

      <AppSelect
        v-model="selectedObjectId"
        label="Objeto de Estudo"
        :options="objectOptions"
        placeholder="Selecione o objeto..."
      />

      <AppSelect
        v-model="selectedDisciplineId"
        label="Disciplina"
        :options="disciplineOptions"
        :placeholder="selectedObjectId ? 'Selecione a disciplina...' : 'Selecione o objeto primeiro'"
      />

      <div class="grid grid-cols-2 gap-3">
        <AppInput
          v-model="hours"
          label="Horas"
          placeholder="0"
        />
        <AppInput
          v-model="minutes"
          label="Minutos"
          placeholder="30"
        />
      </div>

      <AppTextarea
        v-model="notes"
        label="Anotações (opcional)"
        placeholder="O que foi estudado, conceitos absorvidos..."
        :rows="3"
      />
    </form>

    <template #footer>
      <AppButton variant="secondary" @click="$emit('close')">Cancelar</AppButton>
      <AppButton :disabled="!isValid" @click="submit">Registrar</AppButton>
    </template>
  </AppModal>
</template>
