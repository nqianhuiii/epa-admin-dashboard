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
  time: string;
  meetingLink: string;
  tutorImage: string | File | null;
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
  tutorImage: string | File | null; 
  time: string;
}

export interface UpdateStudySessionInput extends CreateStudySessionInput {
  id: string;
}

export interface Flashcard {
  id: number;
  term: string;
  definition: string;
}

export interface FlashcardSet {
  id: string;
  title: string;
  description: string;
  cards: Flashcard[];
  uploadedAt: Date;
  updatedAt?: Date;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // Index of the correct option
  explanation?: string; 
}

export interface QuizSet {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  timeLimit?: number; 
  passingScore?: number;
  shuffleQuestions?: boolean; 
  uploadedAt: Date;
  updatedAt?: Date;
}

// Alternative interface if you want to support different question types
// export interface QuizQuestionAlternative {
//   id: number;
//   question: string;
//   type: 'multiple-choice' | 'true-false' | 'fill-in-blank';
//   options?: string[]; // For multiple choice
//   correctAnswer: string | number; // Can be index for MC, boolean for T/F, string for fill-in
//   explanation?: string;
// }







