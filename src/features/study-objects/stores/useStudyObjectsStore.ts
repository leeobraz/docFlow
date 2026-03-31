import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";
import { nanoid } from "nanoid";
import type { StudyObject, Discipline, StudyFile } from "@/types";
import { deleteFile } from "@/lib/supabase";

const STORAGE_KEY = "docflow:study-objects";

function loadFromStorage(): StudyObject[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw, (key, value) => {
      if (["createdAt", "updatedAt", "uploadedAt"].includes(key) && typeof value === "string") {
        return new Date(value);
      }
      return value;
    });
  } catch {
    return [];
  }
}

export const useStudyObjectsStore = defineStore("studyObjects", () => {
  const studyObjects = ref<StudyObject[]>(loadFromStorage());

  watch(studyObjects, (val) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(val));
  }, { deep: true });

  const sortedStudyObjects = computed(() =>
    [...studyObjects.value].sort(
      (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
    )
  );

  function getById(id: string): StudyObject | undefined {
    return studyObjects.value.find((so) => so.id === id);
  }

  function getDiscipline(studyObjectId: string, disciplineId: string): Discipline | undefined {
    const so = getById(studyObjectId);
    return so?.disciplines.find((d) => d.id === disciplineId);
  }

  function createStudyObject(title: string, description: string): StudyObject {
    const now = new Date();
    const obj: StudyObject = {
      id: nanoid(8),
      title,
      description,
      disciplines: [],
      createdAt: now,
      updatedAt: now,
    };
    studyObjects.value.push(obj);
    return obj;
  }

  function updateStudyObject(id: string, data: Partial<Pick<StudyObject, "title" | "description">>) {
    const obj = getById(id);
    if (!obj) return;
    if (data.title !== undefined) obj.title = data.title;
    if (data.description !== undefined) obj.description = data.description;
    obj.updatedAt = new Date();
  }

  function deleteStudyObject(id: string) {
    const idx = studyObjects.value.findIndex((so) => so.id === id);
    if (idx !== -1) studyObjects.value.splice(idx, 1);
  }

  function addDiscipline(studyObjectId: string, name: string): Discipline | undefined {
    const obj = getById(studyObjectId);
    if (!obj) return;

    const discipline: Discipline = {
      id: nanoid(8),
      studyObjectId,
      name,
      files: [],
      notes: "",
      totalMinutes: 0,
      createdAt: new Date(),
    };
    obj.disciplines.push(discipline);
    obj.updatedAt = new Date();
    return discipline;
  }

  function updateDiscipline(
    studyObjectId: string,
    disciplineId: string,
    data: Partial<Pick<Discipline, "name" | "notes">>
  ) {
    const discipline = getDiscipline(studyObjectId, disciplineId);
    if (!discipline) return;
    if (data.name !== undefined) discipline.name = data.name;
    if (data.notes !== undefined) discipline.notes = data.notes;

    const obj = getById(studyObjectId);
    if (obj) obj.updatedAt = new Date();
  }

  function addMinutesToDiscipline(studyObjectId: string, disciplineId: string, minutes: number) {
    const discipline = getDiscipline(studyObjectId, disciplineId);
    if (!discipline) return;
    discipline.totalMinutes += minutes;

    const obj = getById(studyObjectId);
    if (obj) obj.updatedAt = new Date();
  }

  function deleteDiscipline(studyObjectId: string, disciplineId: string) {
    const obj = getById(studyObjectId);
    if (!obj) return;
    const idx = obj.disciplines.findIndex((d) => d.id === disciplineId);
    if (idx !== -1) {
      obj.disciplines.splice(idx, 1);
      obj.updatedAt = new Date();
    }
  }

  function addFile(studyObjectId: string, disciplineId: string, file: Omit<StudyFile, "id" | "disciplineId" | "uploadedAt">): StudyFile | undefined {
    const discipline = getDiscipline(studyObjectId, disciplineId);
    if (!discipline) return;

    const studyFile: StudyFile = {
      id: nanoid(8),
      disciplineId,
      name: file.name,
      type: file.type,
      url: file.url,
      content: file.content,
      uploadedAt: new Date(),
    };
    discipline.files.push(studyFile);

    const obj = getById(studyObjectId);
    if (obj) obj.updatedAt = new Date();
    return studyFile;
  }

  async function removeFile(studyObjectId: string, disciplineId: string, fileId: string) {
    const discipline = getDiscipline(studyObjectId, disciplineId);
    if (!discipline) return;
    const idx = discipline.files.findIndex((f) => f.id === fileId);
    if (idx !== -1) {
      const file = discipline.files[idx];
      if (file.storagePath) {
        try { await deleteFile(file.storagePath); } catch { /* noop */ }
      }
      discipline.files.splice(idx, 1);
      const obj = getById(studyObjectId);
      if (obj) obj.updatedAt = new Date();
    }
  }

  return {
    studyObjects,
    sortedStudyObjects,
    getById,
    getDiscipline,
    createStudyObject,
    updateStudyObject,
    deleteStudyObject,
    addDiscipline,
    updateDiscipline,
    deleteDiscipline,
    addFile,
    removeFile,
    addMinutesToDiscipline,
  };
});
