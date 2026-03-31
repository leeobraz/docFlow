import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { nanoid } from "nanoid";
import type { StudyLog } from "@/types";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/useAuthStore";

export const useStudyLogsStore = defineStore("studyLogs", () => {
  const logs = ref<StudyLog[]>([]);

  function userId(): string {
    return useAuthStore().user!.id;
  }

  async function fetchAll() {
    const { data } = await supabase
      .from("study_logs")
      .select("*")
      .eq("user_id", userId());

    logs.value = (data ?? []).map((l) => ({
      id: l.id,
      disciplineId: l.discipline_id,
      studyObjectId: l.study_object_id,
      date: l.date,
      minutes: l.minutes,
      notes: l.notes ?? "",
      createdAt: new Date(l.created_at),
    }));
  }

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

  async function createLog(data: {
    disciplineId: string;
    studyObjectId: string;
    date: string;
    minutes: number;
    notes: string;
  }): Promise<StudyLog> {
    const log: StudyLog = {
      id: nanoid(8),
      ...data,
      createdAt: new Date(),
    };
    logs.value.push(log);

    await supabase.from("study_logs").insert({
      id: log.id,
      discipline_id: data.disciplineId,
      study_object_id: data.studyObjectId,
      user_id: userId(),
      date: data.date,
      minutes: data.minutes,
      notes: data.notes,
      created_at: log.createdAt.toISOString(),
    });

    return log;
  }

  async function deleteLog(id: string) {
    const idx = logs.value.findIndex((l) => l.id === id);
    if (idx !== -1) logs.value.splice(idx, 1);

    await supabase.from("study_logs").delete().eq("id", id);
  }

  async function updateLog(id: string, data: Partial<Pick<StudyLog, "minutes" | "notes">>) {
    const log = logs.value.find((l) => l.id === id);
    if (!log) return;
    if (data.minutes !== undefined) log.minutes = data.minutes;
    if (data.notes !== undefined) log.notes = data.notes;

    await supabase.from("study_logs").update(data).eq("id", id);
  }

  return {
    logs,
    logsByDate,
    fetchAll,
    getLogsByDate,
    getTotalMinutesByDate,
    hasLogsOnDate,
    getLogCountByDate,
    createLog,
    deleteLog,
    updateLog,
  };
});
