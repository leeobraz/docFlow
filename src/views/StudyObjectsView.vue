<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useStudyObjectsStore } from "@/features/study-objects/stores/useStudyObjectsStore";
import StudyObjectCard from "@/features/study-objects/components/StudyObjectCard.vue";
import CreateStudyObjectModal from "@/features/study-objects/components/CreateStudyObjectModal.vue";
import AppButton from "@/components/AppButton.vue";
import AppIcon from "@/components/AppIcon.vue";
import AppEmptyState from "@/components/AppEmptyState.vue";

const store = useStudyObjectsStore();
const router = useRouter();
const showCreateModal = ref(false);

async function handleCreate(title: string, description: string) {
  const obj = await store.createStudyObject(title, description);
  showCreateModal.value = false;
  router.push({ name: "study-object-detail", params: { id: obj.id } });
}

function handleDelete(id: string) {
  store.deleteStudyObject(id);
}

function openDetail(id: string) {
  router.push({ name: "study-object-detail", params: { id } });
}
</script>

<template>
  <div class="mx-auto max-w-5xl">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-surface-300">Objetos de Estudo</h1>
        <p class="mt-1 text-sm text-surface-500">
          Gerencie seus concursos, vestibulares e projetos de estudo.
        </p>
      </div>
      <AppButton @click="showCreateModal = true">
        <AppIcon name="plus" :size="16" />
        Novo Objeto
      </AppButton>
    </div>

    <div v-if="store.sortedStudyObjects.length > 0" class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <StudyObjectCard
        v-for="so in store.sortedStudyObjects"
        :key="so.id"
        :study-object="so"
        @click="openDetail(so.id)"
        @delete="handleDelete(so.id)"
      />
    </div>

    <AppEmptyState
      v-else
      icon="graduation-cap"
      title="Nenhum objeto de estudo"
      description="Crie seu primeiro objeto de estudo para começar a organizar suas disciplinas e materiais."
      class="mt-8"
    >
      <template #action>
        <AppButton @click="showCreateModal = true">
          <AppIcon name="plus" :size="16" />
          Criar Primeiro Objeto
        </AppButton>
      </template>
    </AppEmptyState>

    <CreateStudyObjectModal
      v-if="showCreateModal"
      @close="showCreateModal = false"
      @create="handleCreate"
    />
  </div>
</template>
