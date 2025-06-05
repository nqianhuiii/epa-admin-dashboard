export interface TextbookData {
  id?: string;
  title: string;
  pdfUrl: string;
  fileName: string;
  fileSize: number;
  uploadedAt: Date;
  updatedAt?: Date;
}

export interface NotesData {
  id?: string;
  title: string;
  chapter:string;
  pdfUrl: string;
  fileName: string;
  fileSize: number;
  uploadedAt: Date;
  updatedAt?: Date;
}

export type ExerciseType = "pastYear" | "practice";

export interface ExerciseData {
  id?: string;
  type: ExerciseType;
  title: string;
  chapter?:string;
  pdfUrl: string;
  fileName: string;
  fileSize: number;
  uploadedAt: Date;
  updatedAt?: Date;
}

export interface StudySession {
  id: string;
  title: string;
  description: string;
  date: string;
  meetingLink: string;
  teacherName: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStudySessionInput {
  title: string;
  description: string;
  date: string;
  meetingLink: string;
  teacherName: string;
}

export interface UpdateStudySessionInput extends CreateStudySessionInput {
  id: string;
}


