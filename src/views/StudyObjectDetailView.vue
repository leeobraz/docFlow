<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStudyObjectsStore } from "@/features/study-objects/stores/useStudyObjectsStore";
import DisciplineCard from "@/features/study-objects/components/DisciplineCard.vue";
import CreateDisciplineModal from "@/features/study-objects/components/CreateDisciplineModal.vue";
import AppButton from "@/components/AppButton.vue";
import AppIcon from "@/components/AppIcon.vue";
import AppEmptyState from "@/components/AppEmptyState.vue";

const route = useRoute();
const router = useRouter();
const store = useStudyObjectsStore();
const showCreateModal = ref(false);

const studyObject = computed(() =>
  store.getById(route.params.id as string)
);

function handleCreateDiscipline(name: string) {
  store.addDiscipline(route.params.id as string, name);
  showCreateModal.value = false;
}

function handleDeleteDiscipline(disciplineId: string) {
  store.deleteDiscipline(route.params.id as string, disciplineId);
}

function openDiscipline(disciplineId: string) {
  router.push({
    name: "discipline-detail",
    params: {
      id: route.params.id,
      disciplineId,
    },
  });
}
</script>

<template>
  <div class="mx-auto max-w-5xl">
    <div v-if="!studyObject" class="py-16 text-center">
      <p class="text-surface-500">Objeto de estudo não encontrado.</p>
      <AppButton variant="secondary" class="mt-4" @click="router.push({ name: 'study-objects' })">
        Voltar
      </AppButton>
    </div>

    <template v-else>
      <div class="flex items-start gap-4">
        <button
          class="mt-1 rounded-md p-1.5 text-surface-500 transition-colors hover:bg-surface-800 hover:text-surface-300"
          @click="router.push({ name: 'study-objects' })"
        >
          <AppIcon name="arrow-left" :size="18" />
        </button>

        <div class="flex-1">
          <div class="flex items-start justify-between">
            <div>
              <h1 class="text-2xl font-semibold text-surface-300">
                {{ studyObject.title }}
              </h1>
              <p v-if="studyObject.description" class="mt-1 text-sm text-surface-500">
                {{ studyObject.description }}
              </p>
            </div>
            <AppButton @click="showCreateModal = true">
              <AppIcon name="plus" :size="16" />
              Nova Disciplina
            </AppButton>
          </div>

          <div v-if="studyObject.disciplines.length > 0" class="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <DisciplineCard
              v-for="d in studyObject.disciplines"
              :key="d.id"
              :discipline="d"
              @click="openDiscipline(d.id)"
              @delete="handleDeleteDiscipline(d.id)"
            />
          </div>

          <AppEmptyState
            v-else
            icon="book"
            title="Nenhuma disciplina"
            description="Adicione disciplinas para organizar seus materiais de estudo."
            class="mt-8"
          >
            <template #action>
              <AppButton @click="showCreateModal = true">
                <AppIcon name="plus" :size="16" />
                Criar Disciplina
              </AppButton>
            </template>
          </AppEmptyState>
        </div>
      </div>
    </template>

    <CreateDisciplineModal
      v-if="showCreateModal"
      @close="showCreateModal = false"
      @create="handleCreateDiscipline"
    />
  </div>
</template>
