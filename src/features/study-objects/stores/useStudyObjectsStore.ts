import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { nanoid } from "nanoid";
import type { StudyObject, Discipline, StudyFile } from "@/types";
import { supabase, deleteFile } from "@/lib/supabase";
import { useAuthStore } from "@/stores/useAuthStore";

export const useStudyObjectsStore = defineStore("studyObjects", () => {
  const studyObjects = ref<StudyObject[]>([]);
  const loaded = ref(false);

  const sortedStudyObjects = computed(() =>
    [...studyObjects.value].sort(
      (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
    )
  );

  function userId(): string {
    return useAuthStore().user!.id;
  }

  async function fetchAll() {
    const uid = userId();

    const [objRes, discRes, filesRes] = await Promise.all([
      supabase.from("study_objects").select("*").eq("user_id", uid),
      supabase.from("disciplines").select("*").eq("user_id", uid),
      supabase.from("study_files").select("*").eq("user_id", uid),
    ]);

    const filesMap = new Map<string, StudyFile[]>();
    for (const f of filesRes.data ?? []) {
      const file: StudyFile = {
        id: f.id,
        disciplineId: f.discipline_id,
        name: f.name,
        type: f.type,
        url: f.url,
        storagePath: f.storage_path,
        uploadedAt: new Date(f.uploaded_at),
      };
      const arr = filesMap.get(f.discipline_id) ?? [];
      arr.push(file);
      filesMap.set(f.discipline_id, arr);
    }

    const discMap = new Map<string, Discipline[]>();
    for (const d of discRes.data ?? []) {
      const disc: Discipline = {
        id: d.id,
        studyObjectId: d.study_object_id,
        name: d.name,
        notes: d.notes ?? "",
        totalMinutes: d.total_minutes ?? 0,
        files: filesMap.get(d.id) ?? [],
        createdAt: new Date(d.created_at),
      };
      const arr = discMap.get(d.study_object_id) ?? [];
      arr.push(disc);
      discMap.set(d.study_object_id, arr);
    }

    studyObjects.value = (objRes.data ?? []).map((o) => ({
      id: o.id,
      title: o.title,
      description: o.description ?? "",
      disciplines: discMap.get(o.id) ?? [],
      createdAt: new Date(o.created_at),
      updatedAt: new Date(o.updated_at),
    }));

    loaded.value = true;
  }

  function getById(id: string): StudyObject | undefined {
    return studyObjects.value.find((so) => so.id === id);
  }

  function getDiscipline(studyObjectId: string, disciplineId: string): Discipline | undefined {
    return getById(studyObjectId)?.disciplines.find((d) => d.id === disciplineId);
  }

  async function createStudyObject(title: string, description: string): Promise<StudyObject> {
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

    await supabase.from("study_objects").insert({
      id: obj.id,
      user_id: userId(),
      title,
      description,
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
    });

    return obj;
  }

  async function updateStudyObject(id: string, data: Partial<Pick<StudyObject, "title" | "description">>) {
    const obj = getById(id);
    if (!obj) return;

    if (data.title !== undefined) obj.title = data.title;
    if (data.description !== undefined) obj.description = data.description;
    obj.updatedAt = new Date();

    await supabase.from("study_objects").update({
      ...data,
      updated_at: obj.updatedAt.toISOString(),
    }).eq("id", id);
  }

  async function deleteStudyObject(id: string) {
    const idx = studyObjects.value.findIndex((so) => so.id === id);
    if (idx !== -1) studyObjects.value.splice(idx, 1);

    await supabase.from("study_objects").delete().eq("id", id);
  }

  async function addDiscipline(studyObjectId: string, name: string): Promise<Discipline | undefined> {
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

    await Promise.all([
      supabase.from("disciplines").insert({
        id: discipline.id,
        study_object_id: studyObjectId,
        user_id: userId(),
        name,
        created_at: discipline.createdAt.toISOString(),
      }),
      supabase.from("study_objects").update({
        updated_at: obj.updatedAt.toISOString(),
      }).eq("id", studyObjectId),
    ]);

    return discipline;
  }

  async function updateDiscipline(
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

    await supabase.from("disciplines").update(data).eq("id", disciplineId);
  }

  async function addMinutesToDiscipline(studyObjectId: string, disciplineId: string, minutes: number) {
    const discipline = getDiscipline(studyObjectId, disciplineId);
    if (!discipline) return;
    discipline.totalMinutes += minutes;

    const obj = getById(studyObjectId);
    if (obj) obj.updatedAt = new Date();

    await supabase.from("disciplines").update({
      total_minutes: discipline.totalMinutes,
    }).eq("id", disciplineId);
  }

  async function deleteDiscipline(studyObjectId: string, disciplineId: string) {
    const obj = getById(studyObjectId);
    if (!obj) return;

    const idx = obj.disciplines.findIndex((d) => d.id === disciplineId);
    if (idx !== -1) {
      obj.disciplines.splice(idx, 1);
      obj.updatedAt = new Date();
    }

    await supabase.from("disciplines").delete().eq("id", disciplineId);
  }

  async function addFile(
    studyObjectId: string,
    disciplineId: string,
    file: Omit<StudyFile, "id" | "disciplineId" | "uploadedAt">
  ): Promise<StudyFile | undefined> {
    const discipline = getDiscipline(studyObjectId, disciplineId);
    if (!discipline) return;

    const studyFile: StudyFile = {
      id: nanoid(8),
      disciplineId,
      name: file.name,
      type: file.type,
      url: file.url,
      storagePath: file.storagePath,
      uploadedAt: new Date(),
    };
    discipline.files.push(studyFile);

    const obj = getById(studyObjectId);
    if (obj) obj.updatedAt = new Date();

    await supabase.from("study_files").insert({
      id: studyFile.id,
      discipline_id: disciplineId,
      user_id: userId(),
      name: studyFile.name,
      type: studyFile.type,
      url: studyFile.url,
      storage_path: studyFile.storagePath,
      uploaded_at: studyFile.uploadedAt.toISOString(),
    });

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

    await supabase.from("study_files").delete().eq("id", fileId);
  }

  return {
    studyObjects,
    loaded,
    sortedStudyObjects,
    fetchAll,
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
