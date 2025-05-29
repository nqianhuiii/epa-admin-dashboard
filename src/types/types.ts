export interface TextbookData {
  id?: string;
  title: string;
  pdfUrl: string;
  fileName: string;
  fileSize: number;
  uploadedAt: Date;
}

export interface NotesData {
  id?: string;
  title: string;
  pdfUrl: string;
  fileName: string;
  fileSize: number;
  uploadedAt: Date;
}

export interface PastYearData {
  id?: string;
  title: string;
  pdfUrl: string;
  fileName: string;
  fileSize: number;
  uploadedAt: Date;
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


