<script setup lang="ts">
import { ref, watch } from "vue";
import AppIcon from "@/components/AppIcon.vue";
import AppButton from "@/components/AppButton.vue";

const props = defineProps<{
  notes: string;
}>();

const emit = defineEmits<{
  save: [notes: string];
}>();

const localNotes = ref(props.notes);
const hasChanges = ref(false);

watch(() => props.notes, (val) => {
  localNotes.value = val;
  hasChanges.value = false;
});

watch(localNotes, (val) => {
  hasChanges.value = val !== props.notes;
});

function save() {
  emit("save", localNotes.value);
  hasChanges.value = false;
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between">
      <h3 class="text-xs font-medium uppercase tracking-wider text-surface-500">
        Resumo / Anotações
      </h3>
      <AppButton
        v-if="hasChanges"
        size="sm"
        @click="save"
      >
        <AppIcon name="save" :size="14" />
        Salvar
      </AppButton>
    </div>

    <textarea
      v-model="localNotes"
      placeholder="Escreva seus resumos e anotações aqui..."
      rows="14"
      class="mt-3 w-full resize-y rounded-lg border border-surface-700 bg-surface-800/50 px-4 py-3 text-sm leading-relaxed text-surface-300 placeholder-surface-600 outline-none transition-colors focus:border-accent-500/50"
    />

    <p v-if="hasChanges" class="mt-2 text-xs text-accent-400">
      Alterações não salvas
    </p>
  </div>
</template>
