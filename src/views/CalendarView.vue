<script setup lang="ts">
import { ref } from "vue";
import { useStudyLogsStore } from "@/features/calendar/stores/useStudyLogsStore";
import CalendarGrid from "@/features/calendar/components/CalendarGrid.vue";
import DayDetailPanel from "@/features/calendar/components/DayDetailPanel.vue";
import CreateLogModal from "@/features/calendar/components/CreateLogModal.vue";
import AppIcon from "@/components/AppIcon.vue";

const logsStore = useStudyLogsStore();

const today = new Date();
const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

const selectedDate = ref<string | null>(todayStr);
const showCreateModal = ref(false);

function handleSelectDate(date: string) {
  selectedDate.value = date;
}

function handleCreate(data: {
  studyObjectId: string;
  disciplineId: string;
  minutes: number;
  notes: string;
}) {
  if (!selectedDate.value) return;
  logsStore.createLog({
    ...data,
    date: selectedDate.value,
  });
  showCreateModal.value = false;
}
</script>

<template>
  <div class="mx-auto max-w-6xl">
    <div class="mb-8">
      <h1 class="text-2xl font-semibold text-surface-300">Calendário</h1>
      <p class="mt-1 text-sm text-surface-500">
        Acompanhe seu progresso diário de estudos.
      </p>
    </div>

    <div class="flex flex-col gap-6 lg:flex-row">
      <div class="lg:flex-1">
        <CalendarGrid
          :selected-date="selectedDate"
          @select-date="handleSelectDate"
        />
      </div>

      <div class="lg:w-80">
        <div class="rounded-xl border border-surface-800 bg-surface-900 p-5">
          <template v-if="selectedDate">
            <DayDetailPanel
              :date="selectedDate"
              @add-log="showCreateModal = true"
            />
          </template>
          <div v-else class="flex flex-col items-center justify-center py-10 text-center">
            <AppIcon name="calendar" :size="28" class="text-surface-700" />
            <p class="mt-3 text-xs text-surface-500">
              Selecione um dia no calendário
            </p>
          </div>
        </div>
      </div>
    </div>

    <CreateLogModal
      v-if="showCreateModal && selectedDate"
      :date="selectedDate"
      @close="showCreateModal = false"
      @create="handleCreate"
    />
  </div>
</template>
