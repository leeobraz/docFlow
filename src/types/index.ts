export interface StudyObject {
  id: string;
  title: string;
  description: string;
  disciplines: Discipline[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Discipline {
  id: string;
  studyObjectId: string;
  name: string;
  files: StudyFile[];
  notes: string;
  totalMinutes: number;
  createdAt: Date;
}

export interface StudyFile {
  id: string;
  disciplineId: string;
  name: string;
  type: "pdf" | "text";
  url?: string;
  content?: string;
  storagePath?: string;
  uploadedAt: Date;
}

export interface StudyLog {
  id: string;
  disciplineId: string;
  studyObjectId: string;
  date: string; // YYYY-MM-DD
  minutes: number;
  notes: string;
  createdAt: Date;
}

export interface FocusSession {
  id: string;
  disciplineId: string;
  studyObjectId: string;
  startedAt: Date;
  endedAt?: Date;
  durationMinutes: number;
  isActive: boolean;
}
