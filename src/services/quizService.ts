import { db } from "@/config/firebaseConfig";
import { collection, addDoc, Timestamp, updateDoc, doc, query, orderBy, getDocs, getDoc, deleteDoc } from 'firebase/firestore';
import { QuizSet } from "@/types/types";

export class QuizService {
  static async createQuizSet(quizSet: QuizSet): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'quizzes'), {
        title: quizSet.title,
        description: quizSet.description,
        timeLimit: quizSet.timeLimit,
        passingScore: quizSet.passingScore,
        shuffleQuestions: quizSet.shuffleQuestions,
        createdAt: Timestamp.now(),
        questions: quizSet.questions.map(question => ({
          id: question.id,
          question: question.question,
          options: question.options,
          correctAnswer: question.correctAnswer,
          explanation: question.explanation,
        }))
      });

      return docRef.id;
    } catch (error) {
      console.error('Error creating quiz set in Firestore:', error);
      throw error;
    }
  }

  static async updateQuizSet(quizSet: QuizSet): Promise<void> {
    try {
      if (!quizSet.id) {
        throw new Error('Quiz set ID is required for updates');
      }

      const docRef = doc(db, 'quizzes', String(quizSet.id));
      
      await updateDoc(docRef, {
        title: quizSet.title,
        description: quizSet.description,
        timeLimit: quizSet.timeLimit,
        passingScore: quizSet.passingScore,
        shuffleQuestions: quizSet.shuffleQuestions,
        updatedAt: Timestamp.now(),
        questions: quizSet.questions.map(question => ({
          id: question.id,
          question: question.question,
          options: question.options,
          correctAnswer: question.correctAnswer,
          explanation: question.explanation,
        }))
      });
    } catch (error) {
      console.error('Error updating quiz set in Firestore:', error);
      throw error;
    }
  }

  static async getAllQuizSets(): Promise<QuizSet[]> {
    try {
      const docRef = collection(db, 'quizzes');
      const q = query(docRef, orderBy('createdAt', 'desc'));

      const querySnapshot = await getDocs(q);

      const quizSets: QuizSet[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        
        quizSets.push({
          id: doc.id,
          title: data.title,
          description: data.description,
          timeLimit: data.timeLimit,
          passingScore: data.passingScore,
          shuffleQuestions: data.shuffleQuestions,
          questions: data.questions?.map((question: any) => ({
            id: question.id,
            question: question.question,
            options: question.options,
            correctAnswer: question.correctAnswer,
            explanation: question.explanation,
          })) || [],
          uploadedAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || data.createdAt?.toDate() || new Date(),
        });
      });

      return quizSets;
    } catch (error) {
      console.error('Error getting quiz sets from Firestore:', error);
      throw error;
    }
  }

  static async getQuizSetById(id: string): Promise<QuizSet | null> {
    try {
      const docRef = doc(db, 'quizzes', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        
        return {
          id: docSnap.id,
          title: data.title,
          description: data.description,
          timeLimit: data.timeLimit,
          passingScore: data.passingScore,
          shuffleQuestions: data.shuffleQuestions,
          questions: data.questions?.map((question: any) => ({
            id: question.id,
            question: question.question,
            options: question.options,
            correctAnswer: question.correctAnswer,
            explanation: question.explanation,
          })) || [],
          uploadedAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || data.createdAt?.toDate() || new Date(),
        };
      } else {
        console.log('No such quiz set found!');
        return null;
      }
    } catch (error) {
      console.error('Error getting quiz set by ID from Firestore:', error);
      throw error;
    }
  }

  static async deleteQuizSet(id: string): Promise<void> {
    try {
      const docRef = doc(db, 'quizzes', id);
      
      // Check if document exists
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        throw new Error("Quiz set not found");
      }

      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting quiz set:", error);
      if (error instanceof Error && error.message === "Quiz set not found") {
        throw error;
      }
      throw new Error("Failed to delete quiz set");
    }
  }
}