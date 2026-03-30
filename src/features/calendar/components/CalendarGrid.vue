<script setup lang="ts">
import { ref, computed } from "vue";
import { useStudyLogsStore } from "../stores/useStudyLogsStore";
import AppIcon from "@/components/AppIcon.vue";

const emit = defineEmits<{
  selectDate: [date: string];
}>();

const props = defineProps<{
  selectedDate: string | null;
}>();

const logsStore = useStudyLogsStore();

const today = new Date();
const currentYear = ref(today.getFullYear());
const currentMonth = ref(today.getMonth());

const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const monthLabel = computed(() => {
  const date = new Date(currentYear.value, currentMonth.value);
  return date.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
});

interface CalendarDay {
  day: number;
  date: string;
  isCurrentMonth: boolean;
  isToday: boolean;
}

const calendarDays = computed<CalendarDay[]>(() => {
  const year = currentYear.value;
  const month = currentMonth.value;
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const todayStr = formatDateStr(today.getFullYear(), today.getMonth(), today.getDate());
  const days: CalendarDay[] = [];

  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i;
    const m = month === 0 ? 11 : month - 1;
    const y = month === 0 ? year - 1 : year;
    const date = formatDateStr(y, m, d);
    days.push({ day: d, date, isCurrentMonth: false, isToday: date === todayStr });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const date = formatDateStr(year, month, d);
    days.push({ day: d, date, isCurrentMonth: true, isToday: date === todayStr });
  }

  const remaining = 42 - days.length;
  for (let d = 1; d <= remaining; d++) {
    const m = month === 11 ? 0 : month + 1;
    const y = month === 11 ? year + 1 : year;
    const date = formatDateStr(y, m, d);
    days.push({ day: d, date, isCurrentMonth: false, isToday: date === todayStr });
  }

  return days;
});

function formatDateStr(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function prevMonth() {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
}

function nextMonth() {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
}

function goToToday() {
  currentYear.value = today.getFullYear();
  currentMonth.value = today.getMonth();
  const todayStr = formatDateStr(today.getFullYear(), today.getMonth(), today.getDate());
  emit("selectDate", todayStr);
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between">
      <h3 class="text-sm font-semibold capitalize text-surface-300">
        {{ monthLabel }}
      </h3>
      <div class="flex items-center gap-1">
        <button
          class="rounded-md px-2 py-1 text-xs text-surface-500 transition-colors hover:bg-surface-800 hover:text-surface-300"
          @click="goToToday"
        >
          Hoje
        </button>
        <button
          class="rounded-md p-1.5 text-surface-500 transition-colors hover:bg-surface-800 hover:text-surface-300"
          @click="prevMonth"
        >
          <AppIcon name="chevron-left" :size="16" />
        </button>
        <button
          class="rounded-md p-1.5 text-surface-500 transition-colors hover:bg-surface-800 hover:text-surface-300"
          @click="nextMonth"
        >
          <AppIcon name="chevron-right" :size="16" />
        </button>
      </div>
    </div>

    <div class="mt-4 grid grid-cols-7 gap-px rounded-lg border border-surface-800 bg-surface-800 overflow-hidden">
      <div
        v-for="wd in weekDays"
        :key="wd"
        class="bg-surface-900 py-2 text-center text-xs font-medium text-surface-500"
      >
        {{ wd }}
      </div>

      <button
        v-for="(cell, i) in calendarDays"
        :key="i"
        class="relative flex h-14 flex-col items-center justify-start gap-1 bg-surface-950 pt-1.5 transition-colors hover:bg-surface-800/70 lg:h-16"
        :class="{
          'opacity-40': !cell.isCurrentMonth,
          'bg-surface-800/50': props.selectedDate === cell.date,
        }"
        @click="emit('selectDate', cell.date)"
      >
        <span
          class="flex h-6 w-6 items-center justify-center rounded-full text-xs"
          :class="{
            'bg-accent-500 font-semibold text-white': cell.isToday,
            'text-surface-300': cell.isCurrentMonth && !cell.isToday,
            'text-surface-600': !cell.isCurrentMonth,
          }"
        >
          {{ cell.day }}
        </span>

        <div
          v-if="logsStore.hasLogsOnDate(cell.date)"
          class="flex items-center gap-0.5"
        >
          <span
            v-for="n in Math.min(logsStore.getLogCountByDate(cell.date), 3)"
            :key="n"
            class="h-1 w-1 rounded-full bg-accent-400"
          />
          <span
            v-if="logsStore.getLogCountByDate(cell.date) > 3"
            class="h-1 w-1 rounded-full bg-accent-400/50"
          />
        </div>
      </button>
    </div>
  </div>
</template>
