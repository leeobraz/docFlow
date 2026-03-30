<script setup lang="ts">
import { ref } from "vue";
import AppModal from "@/components/AppModal.vue";
import AppInput from "@/components/AppInput.vue";
import AppButton from "@/components/AppButton.vue";

const emit = defineEmits<{
  close: [];
  create: [name: string];
}>();

const name = ref("");

function submit() {
  const trimmed = name.value.trim();
  if (!trimmed) return;
  emit("create", trimmed);
}
</script>

<template>
  <AppModal title="Nova Disciplina" @close="$emit('close')">
    <form @submit.prevent="submit">
      <AppInput
        v-model="name"
        label="Nome da disciplina"
        placeholder="Ex: Direito Administrativo"
      />
    </form>

    <template #footer>
      <AppButton variant="secondary" @click="$emit('close')">Cancelar</AppButton>
      <AppButton :disabled="!name.trim()" @click="submit">Criar</AppButton>
    </template>
  </AppModal>
</template>
