<script setup lang="ts">
import { ref } from "vue";
import { nanoid } from "nanoid";
import type { StudyFile } from "@/types";
import { uploadFile } from "@/lib/supabase";
import AppIcon from "@/components/AppIcon.vue";
import AppButton from "@/components/AppButton.vue";
import AppModal from "@/components/AppModal.vue";
import AppInput from "@/components/AppInput.vue";

const props = defineProps<{
  files: StudyFile[];
  studyObjectId: string;
  disciplineId: string;
}>();

const emit = defineEmits<{
  addFile: [file: { name: string; type: "pdf" | "text"; url: string; storagePath: string }];
  removeFile: [fileId: string];
}>();

const showModal = ref(false);
const fileName = ref("");
const fileUrl = ref("");
const selectedFile = ref<File | null>(null);
const uploading = ref(false);
const uploadError = ref("");
const dragOver = ref(false);

function handleFileSelect(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files?.[0]) {
    selectedFile.value = input.files[0];
    if (!fileName.value.trim()) {
      fileName.value = input.files[0].name;
    }
  }
}

function handleDrop(event: DragEvent) {
  dragOver.value = false;
  const file = event.dataTransfer?.files?.[0];
  if (file) {
    selectedFile.value = file;
    if (!fileName.value.trim()) {
      fileName.value = file.name;
    }
  }
}

function openModal() {
  fileName.value = "";
  fileUrl.value = "";
  selectedFile.value = null;
  uploadError.value = "";
  showModal.value = true;
}

async function submit() {
  const trimmedName = fileName.value.trim();
  if (!trimmedName) return;

  if (selectedFile.value) {
    uploading.value = true;
    uploadError.value = "";
    try {
      const fileId = nanoid(8);
      const storagePath = `${props.studyObjectId}/${props.disciplineId}/${fileId}_${selectedFile.value.name}`;
      const publicUrl = await uploadFile(selectedFile.value, storagePath);

      emit("addFile", {
        name: trimmedName,
        type: trimmedName.toLowerCase().endsWith(".pdf") ? "pdf" : "text",
        url: publicUrl,
        storagePath,
      });
      showModal.value = false;
    } catch (err: any) {
      uploadError.value = err.message || "Erro ao fazer upload";
    } finally {
      uploading.value = false;
    }
  } else if (fileUrl.value.trim()) {
    emit("addFile", {
      name: trimmedName,
      type: trimmedName.toLowerCase().endsWith(".pdf") ? "pdf" : "text",
      url: fileUrl.value.trim(),
      storagePath: "",
    });
    showModal.value = false;
  }
}

function getFileIcon(type: string): string {
  return type === "pdf" ? "file" : "file-text";
}

function formatSize(file: File): string {
  if (file.size < 1024) return `${file.size} B`;
  if (file.size < 1024 * 1024) return `${(file.size / 1024).toFixed(1)} KB`;
  return `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between">
      <h3 class="text-xs font-medium uppercase tracking-wider text-surface-500">
        Arquivos
      </h3>
      <AppButton size="sm" variant="ghost" @click="openModal">
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
        <a
          :href="file.url"
          target="_blank"
          class="flex items-center gap-2.5 overflow-hidden"
          :class="file.url ? 'cursor-pointer' : 'cursor-default'"
        >
          <AppIcon :name="getFileIcon(file.type)" :size="16" class="shrink-0 text-surface-500" />
          <div class="min-w-0">
            <p class="truncate text-sm text-surface-300 group-hover:text-accent-400 transition-colors">
              {{ file.name }}
            </p>
          </div>
        </a>
        <button
          class="shrink-0 rounded-md p-1 text-surface-600 opacity-0 transition-all hover:text-red-400 group-hover:opacity-100"
          @click="$emit('removeFile', file.id)"
        >
          <AppIcon name="trash" :size="14" />
        </button>
      </li>
    </ul>

    <AppModal v-if="showModal" title="Adicionar Arquivo" @close="showModal = false">
      <form class="flex flex-col gap-4" @submit.prevent="submit">
        <div
          class="flex flex-col items-center justify-center rounded-lg border-2 border-dashed px-4 py-6 transition-colors"
          :class="dragOver ? 'border-accent-500 bg-accent-500/5' : 'border-surface-700 hover:border-surface-600'"
          @dragover.prevent="dragOver = true"
          @dragleave="dragOver = false"
          @drop.prevent="handleDrop"
        >
          <template v-if="selectedFile">
            <AppIcon name="file" :size="24" class="text-accent-400" />
            <p class="mt-2 text-sm text-surface-300">{{ selectedFile.name }}</p>
            <p class="text-xs text-surface-500">{{ formatSize(selectedFile) }}</p>
            <button
              type="button"
              class="mt-2 text-xs text-surface-500 hover:text-red-400"
              @click="selectedFile = null"
            >
              Remover
            </button>
          </template>
          <template v-else>
            <AppIcon name="upload" :size="24" class="text-surface-600" />
            <p class="mt-2 text-sm text-surface-400">
              Arraste um arquivo ou
              <label class="cursor-pointer text-accent-400 hover:underline">
                selecione
                <input type="file" class="hidden" @change="handleFileSelect" />
              </label>
            </p>
          </template>
        </div>

        <div class="flex items-center gap-3">
          <div class="h-px flex-1 bg-surface-800" />
          <span class="text-xs text-surface-500">ou cole um link</span>
          <div class="h-px flex-1 bg-surface-800" />
        </div>

        <AppInput
          v-model="fileUrl"
          label="URL / Link externo"
          placeholder="https://..."
          :disabled="!!selectedFile"
        />

        <AppInput
          v-model="fileName"
          label="Nome do arquivo"
          placeholder="Ex: Edital_Completo.pdf"
        />

        <p v-if="uploadError" class="text-xs text-red-400">{{ uploadError }}</p>
      </form>

      <template #footer>
        <AppButton variant="secondary" @click="showModal = false">Cancelar</AppButton>
        <AppButton
          :disabled="!fileName.trim() || (!selectedFile && !fileUrl.trim()) || uploading"
          @click="submit"
        >
          <template v-if="uploading">Enviando...</template>
          <template v-else>Adicionar</template>
        </AppButton>
      </template>
    </AppModal>
  </div>
</template>
