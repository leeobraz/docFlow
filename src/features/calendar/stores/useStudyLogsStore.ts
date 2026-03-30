import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";
import type { StudyLog } from "@/types";

const STORAGE_KEY = "docflow:study-logs";

function loadFromStorage(): StudyLog[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw, (key, value) => {
      if (key === "createdAt" && typeof value === "string") {
        return new Date(value);
      }
      return value;
    });
  } catch {
    return [];
  }
}

export const useStudyLogsStore = defineStore("studyLogs", () => {
  const logs = ref<StudyLog[]>(loadFromStorage());

  watch(logs, (val) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(val));
  }, { deep: true });

  const logsByDate = computed(() => {
    const map = new Map<string, StudyLog[]>();
    for (const log of logs.value) {
      const existing = map.get(log.date);
      if (existing) {
        existing.push(log);
      } else {
        map.set(log.date, [log]);
      }
    }
    return map;
  });

  function getLogsByDate(date: string): StudyLog[] {
    return logsByDate.value.get(date) ?? [];
  }

  function getTotalMinutesByDate(date: string): number {
    return getLogsByDate(date).reduce((sum, l) => sum + l.minutes, 0);
  }

  function hasLogsOnDate(date: string): boolean {
    return logsByDate.value.has(date);
  }

  function getLogCountByDate(date: string): number {
    return getLogsByDate(date).length;
  }

  function createLog(data: {
    disciplineId: string;
    studyObjectId: string;
    date: string;
    minutes: number;
    notes: string;
  }): StudyLog {
    const log: StudyLog = {
      id: crypto.randomUUID(),
      ...data,
      createdAt: new Date(),
    };
    logs.value.push(log);
    return log;
  }

  function deleteLog(id: string) {
    const idx = logs.value.findIndex((l) => l.id === id);
    if (idx !== -1) logs.value.splice(idx, 1);
  }

  function updateLog(id: string, data: Partial<Pick<StudyLog, "minutes" | "notes">>) {
    const log = logs.value.find((l) => l.id === id);
    if (!log) return;
    if (data.minutes !== undefined) log.minutes = data.minutes;
    if (data.notes !== undefined) log.notes = data.notes;
  }

  return {
    logs,
    logsByDate,
    getLogsByDate,
    getTotalMinutesByDate,
    hasLogsOnDate,
    getLogCountByDate,
    createLog,
    deleteLog,
    updateLog,
  };
});
