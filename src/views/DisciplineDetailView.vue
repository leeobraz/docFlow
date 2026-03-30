<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStudyObjectsStore } from "@/features/study-objects/stores/useStudyObjectsStore";
import DisciplineFiles from "@/features/study-objects/components/DisciplineFiles.vue";
import DisciplineNotes from "@/features/study-objects/components/DisciplineNotes.vue";
import AppIcon from "@/components/AppIcon.vue";
import AppButton from "@/components/AppButton.vue";

type Tab = "files" | "notes";

const route = useRoute();
const router = useRouter();
const store = useStudyObjectsStore();
const activeTab = ref<Tab>("files");

const studyObjectId = computed(() => route.params.id as string);
const disciplineId = computed(() => route.params.disciplineId as string);

const studyObject = computed(() => store.getById(studyObjectId.value));
const discipline = computed(() =>
  store.getDiscipline(studyObjectId.value, disciplineId.value)
);

const tabs: { key: Tab; label: string; icon: string }[] = [
  { key: "files", label: "Arquivos", icon: "file" },
  { key: "notes", label: "Resumo", icon: "file-text" },
];

function goBack() {
  router.push({
    name: "study-object-detail",
    params: { id: studyObjectId.value },
  });
}

function handleAddFile(file: { name: string; type: "pdf" | "text"; url?: string }) {
  store.addFile(studyObjectId.value, disciplineId.value, file);
}

function handleRemoveFile(fileId: string) {
  store.removeFile(studyObjectId.value, disciplineId.value, fileId);
}

function handleSaveNotes(notes: string) {
  store.updateDiscipline(studyObjectId.value, disciplineId.value, { notes });
}
</script>

<template>
  <div class="mx-auto max-w-4xl">
    <div v-if="!discipline" class="py-16 text-center">
      <p class="text-surface-500">Disciplina não encontrada.</p>
      <AppButton variant="secondary" class="mt-4" @click="router.push({ name: 'study-objects' })">
        Voltar
      </AppButton>
    </div>

    <template v-else>
      <div class="flex items-start gap-4">
        <button
          class="mt-1 rounded-md p-1.5 text-surface-500 transition-colors hover:bg-surface-800 hover:text-surface-300"
          @click="goBack"
        >
          <AppIcon name="arrow-left" :size="18" />
        </button>

        <div class="flex-1">
          <p class="text-xs text-surface-500">
            {{ studyObject?.title }}
          </p>
          <h1 class="mt-0.5 text-xl font-semibold text-surface-300">
            {{ discipline.name }}
          </h1>
        </div>
      </div>

      <div class="mt-6 flex gap-1 border-b border-surface-800">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          class="flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors"
          :class="
            activeTab === tab.key
              ? 'border-accent-500 text-accent-400'
              : 'border-transparent text-surface-500 hover:text-surface-300'
          "
          @click="activeTab = tab.key"
        >
          <AppIcon :name="tab.icon" :size="16" />
          {{ tab.label }}
        </button>
      </div>

      <div class="mt-6">
        <DisciplineFiles
          v-if="activeTab === 'files'"
          :files="discipline.files"
          @add-file="handleAddFile"
          @remove-file="handleRemoveFile"
        />
        <DisciplineNotes
          v-else
          :notes="discipline.notes"
          @save="handleSaveNotes"
        />
      </div>
    </template>
  </div>
</template>
