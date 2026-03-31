import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";
import { nanoid } from "nanoid";
import type { FocusSession } from "@/types";
import { useStudyLogsStore } from "@/features/calendar/stores/useStudyLogsStore";
import { useStudyObjectsStore } from "@/features/study-objects/stores/useStudyObjectsStore";

const STORAGE_KEY = "docflow:focus-sessions";

function loadSessions(): FocusSession[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw, (key, value) => {
      if (["startedAt", "endedAt"].includes(key) && typeof value === "string") {
        return new Date(value);
      }
      return value;
    });
  } catch {
    return [];
  }
}

function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export const useFocusStore = defineStore("focus", () => {
  const sessions = ref<FocusSession[]>(loadSessions());
  const elapsedSeconds = ref(0);
  const isRunning = ref(false);
  const isPaused = ref(false);

  const activeStudyObjectId = ref("");
  const activeDisciplineId = ref("");
  const sessionStartedAt = ref<Date | null>(null);

  let timerInterval: ReturnType<typeof setInterval> | null = null;
  let pauseAccumulatedMs = 0;
  let segmentStart = 0;

  watch(sessions, (val) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(val));
  }, { deep: true });

  const hasActiveSession = computed(() => isRunning.value || isPaused.value);

  const todaySessions = computed(() =>
    sessions.value.filter((s) => {
      const d = s.startedAt;
      const ds = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      return ds === todayStr();
    })
  );

  const todayTotalMinutes = computed(() =>
    todaySessions.value.reduce((sum, s) => sum + s.durationMinutes, 0)
  );

  const weekSessions = computed(() => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    return sessions.value.filter((s) => s.startedAt >= startOfWeek);
  });

  const weekTotalMinutes = computed(() =>
    weekSessions.value.reduce((sum, s) => sum + s.durationMinutes, 0)
  );

  const recentSessions = computed(() =>
    [...sessions.value]
      .sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime())
      .slice(0, 10)
  );

  function startSession(studyObjectId: string, disciplineId: string) {
    if (hasActiveSession.value) return;

    activeStudyObjectId.value = studyObjectId;
    activeDisciplineId.value = disciplineId;
    sessionStartedAt.value = new Date();
    elapsedSeconds.value = 0;
    pauseAccumulatedMs = 0;
    isRunning.value = true;
    isPaused.value = false;

    segmentStart = Date.now();
    timerInterval = setInterval(() => {
      const currentSegmentMs = Date.now() - segmentStart;
      const totalMs = pauseAccumulatedMs + currentSegmentMs;
      elapsedSeconds.value = Math.floor(totalMs / 1000);
    }, 200);
  }

  function pauseSession() {
    if (!isRunning.value) return;

    pauseAccumulatedMs += Date.now() - segmentStart;
    isRunning.value = false;
    isPaused.value = true;

    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  function resumeSession() {
    if (!isPaused.value) return;

    isRunning.value = true;
    isPaused.value = false;
    segmentStart = Date.now();

    timerInterval = setInterval(() => {
      const currentSegmentMs = Date.now() - segmentStart;
      const totalMs = pauseAccumulatedMs + currentSegmentMs;
      elapsedSeconds.value = Math.floor(totalMs / 1000);
    }, 200);
  }

  function stopSession() {
    if (!hasActiveSession.value || !sessionStartedAt.value) return;

    if (isRunning.value) {
      pauseAccumulatedMs += Date.now() - segmentStart;
    }

    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }

    const durationMinutes = Math.max(1, Math.round(pauseAccumulatedMs / 60000));

    const session: FocusSession = {
      id: nanoid(8),
      studyObjectId: activeStudyObjectId.value,
      disciplineId: activeDisciplineId.value,
      startedAt: sessionStartedAt.value,
      endedAt: new Date(),
      durationMinutes,
      isActive: false,
    };
    sessions.value.push(session);

    const logsStore = useStudyLogsStore();
    logsStore.createLog({
      studyObjectId: activeStudyObjectId.value,
      disciplineId: activeDisciplineId.value,
      date: todayStr(),
      minutes: durationMinutes,
      notes: `Sessão de foco: ${formatDuration(elapsedSeconds.value)}`,
    });

    const objectsStore = useStudyObjectsStore();
    objectsStore.addMinutesToDiscipline(
      activeStudyObjectId.value,
      activeDisciplineId.value,
      durationMinutes
    );

    isRunning.value = false;
    isPaused.value = false;
    elapsedSeconds.value = 0;
    activeStudyObjectId.value = "";
    activeDisciplineId.value = "";
    sessionStartedAt.value = null;
    pauseAccumulatedMs = 0;
  }

  function formatDuration(totalSeconds: number): string {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    if (h > 0) {
      return `${h}h ${String(m).padStart(2, "0")}min`;
    }
    return `${m}min ${String(s).padStart(2, "0")}s`;
  }

  return {
    sessions,
    elapsedSeconds,
    isRunning,
    isPaused,
    hasActiveSession,
    activeStudyObjectId,
    activeDisciplineId,
    todaySessions,
    todayTotalMinutes,
    weekSessions,
    weekTotalMinutes,
    recentSessions,
    startSession,
    pauseSession,
    resumeSession,
    stopSession,
  };
});
