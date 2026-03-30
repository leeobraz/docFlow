<script setup lang="ts">
import { ref } from "vue";
import AppModal from "@/components/AppModal.vue";
import AppInput from "@/components/AppInput.vue";
import AppTextarea from "@/components/AppTextarea.vue";
import AppButton from "@/components/AppButton.vue";

const emit = defineEmits<{
  close: [];
  create: [title: string, description: string];
}>();

const title = ref("");
const description = ref("");

function submit() {
  const trimmed = title.value.trim();
  if (!trimmed) return;
  emit("create", trimmed, description.value.trim());
}
</script>

<template>
  <AppModal title="Novo Objeto de Estudo" @close="$emit('close')">
    <form class="flex flex-col gap-4" @submit.prevent="submit">
      <AppInput
        v-model="title"
        label="Título"
        placeholder="Ex: Concurso Câmara Municipal de Goiânia"
      />
      <AppTextarea
        v-model="description"
        label="Descrição (opcional)"
        placeholder="Analista Técnico Legislativo — Edital 2026"
        :rows="2"
      />
    </form>

    <template #footer>
      <AppButton variant="secondary" @click="$emit('close')">Cancelar</AppButton>
      <AppButton :disabled="!title.trim()" @click="submit">Criar</AppButton>
    </template>
  </AppModal>
</template>
