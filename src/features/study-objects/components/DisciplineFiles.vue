<script setup lang="ts">
import { ref } from "vue";
import type { StudyFile } from "@/types";
import AppIcon from "@/components/AppIcon.vue";
import AppButton from "@/components/AppButton.vue";
import AppModal from "@/components/AppModal.vue";
import AppInput from "@/components/AppInput.vue";

defineProps<{
  files: StudyFile[];
}>();

const emit = defineEmits<{
  addFile: [file: { name: string; type: "pdf" | "text"; url?: string }];
  removeFile: [fileId: string];
}>();

const showModal = ref(false);
const fileName = ref("");
const fileUrl = ref("");

function submit() {
  const trimmedName = fileName.value.trim();
  if (!trimmedName) return;

  emit("addFile", {
    name: trimmedName,
    type: trimmedName.toLowerCase().endsWith(".pdf") ? "pdf" : "text",
    url: fileUrl.value.trim() || undefined,
  });

  fileName.value = "";
  fileUrl.value = "";
  showModal.value = false;
}

function getFileIcon(type: string): string {
  return type === "pdf" ? "file" : "file-text";
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between">
      <h3 class="text-xs font-medium uppercase tracking-wider text-surface-500">
        Arquivos
      </h3>
      <AppButton size="sm" variant="ghost" @click="showModal = true">
        <AppIcon name="plus" :size="14" />
        Adicionar
      </AppButton>
    </div>

    <div v-if="files.length === 0" class="mt-4 rounded-lg border border-dashed border-surface-700 py-8 text-center">
      <AppIcon name="upload" :size="24" class="mx-auto text-surface-600" />
      <p class="mt-2 text-xs text-surface-500">Nenhum arquivo vinculado</p>
    </div>

    <ul v-else class="mt-3 flex flex-col gap-2">
      <li
        v-for="file in files"
        :key="file.id"
        class="group flex items-center justify-between rounded-lg border border-surface-800 bg-surface-800/50 px-3 py-2.5"
      >
        <div class="flex items-center gap-2.5 overflow-hidden">
          <AppIcon :name="getFileIcon(file.type)" :size="16" class="shrink-0 text-surface-500" />
          <div class="min-w-0">
            <p class="truncate text-sm text-surface-300">{{ file.name }}</p>
            <a
              v-if="file.url"
              :href="file.url"
              target="_blank"
              class="truncate text-xs text-accent-400 hover:underline"
            >
              {{ file.url }}
            </a>
          </div>
        </div>
        <button
          class="shrink-0 rounded-md p-1 text-surface-600 opacity-0 transition-all hover:text-red-400 group-hover:opacity-100"
          @click="$emit('removeFile', file.id)"
        >
          <AppIcon name="trash" :size="14" />
        </button>
      </li>
    </ul>

    <AppModal v-if="showModal" title="Vincular Arquivo" @close="showModal = false">
      <form class="flex flex-col gap-4" @submit.prevent="submit">
        <AppInput
          v-model="fileName"
          label="Nome do arquivo"
          placeholder="Ex: Edital_Completo.pdf"
        />
        <AppInput
          v-model="fileUrl"
          label="URL / Link (opcional)"
          placeholder="https://..."
        />
      </form>

      <template #footer>
        <AppButton variant="secondary" @click="showModal = false">Cancelar</AppButton>
        <AppButton :disabled="!fileName.trim()" @click="submit">Vincular</AppButton>
      </template>
    </AppModal>
  </div>
</template>
