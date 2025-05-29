import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc, 
  query, 
  orderBy, 
  serverTimestamp,
  Timestamp 
} from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import { StudySession, CreateStudySessionInput, UpdateStudySessionInput } from "@/types/types";


// Helper function to convert Firebase document to StudySession
function convertFirebaseDocToStudySession(doc: any): StudySession {
  const data = doc.data();
  return {
    id: doc.id,
    title: data.title,
    description: data.description,
    date: data.date,
    meetingLink: data.meetingLink,
    teacherName: data.teacherName,
    createdAt: data.createdAt instanceof Timestamp 
      ? data.createdAt.toDate().toISOString() 
      : data.createdAt,
    updatedAt: data.updatedAt instanceof Timestamp 
      ? data.updatedAt.toDate().toISOString() 
      : data.updatedAt,
  };
}

// Service class for Study Sessions
export class StudySessionsService {
  private collectionRef = collection(db, 'studySessions');


  async getAllStudySessions(): Promise<StudySession[]> {
    try {
      const q = query(this.collectionRef, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => convertFirebaseDocToStudySession(doc));
    } catch (error) {
      console.error("Error fetching study sessions:", error);
      throw new Error("Failed to fetch study sessions");
    }
  }


  async getStudySessionById(id: string): Promise<StudySession | null> {
    try {
      const docRef = doc(db, 'studySessions', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return convertFirebaseDocToStudySession(docSnap);
      }
      
      return null;
    } catch (error) {
      console.error("Error fetching study session:", error);
      throw new Error("Failed to fetch study session");
    }
  }

  async createStudySession(input: CreateStudySessionInput): Promise<StudySession> {
    try {
      const now = serverTimestamp();
      
      const docData = {
        title: input.title.trim(),
        description: input.description.trim(),
        date: input.date,
        meetingLink: input.meetingLink.trim(),
        teacherName: input.teacherName.trim(),
        createdAt: now,
        updatedAt: now,
      };

      const docRef = await addDoc(this.collectionRef, docData);
      
      // Fetch the created document to return with proper timestamps
      const createdDoc = await getDoc(docRef);
      return convertFirebaseDocToStudySession(createdDoc);
    } catch (error) {
      console.error("Error creating study session:", error);
      throw new Error("Failed to create study session");
    }
  }

  async updateStudySession(input: UpdateStudySessionInput): Promise<StudySession> {
    try {
      const docRef = doc(db, 'studySessions', input.id);
      
      // Check if document exists
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        throw new Error("Study session not found");
      }

      const updateData = {
        title: input.title.trim(),
        description: input.description.trim(),
        date: input.date,
        meetingLink: input.meetingLink.trim(),
        teacherName: input.teacherName.trim(),
        updatedAt: serverTimestamp(),
      };

      await updateDoc(docRef, updateData);
      
      // Fetch the updated document
      const updatedDoc = await getDoc(docRef);
      return convertFirebaseDocToStudySession(updatedDoc);
    } catch (error) {
      console.error("Error updating study session:", error);
      if (error instanceof Error && error.message === "Study session not found") {
        throw error;
      }
      throw new Error("Failed to update study session");
    }
  }

  async deleteStudySession(id: string): Promise<void> {
    try {
      const docRef = doc(db, 'studySessions', id);
      
      // Check if document exists
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        throw new Error("Study session not found");
      }

      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting study session:", error);
      if (error instanceof Error && error.message === "Study session not found") {
        throw error;
      }
      throw new Error("Failed to delete study session");
    }
  }

  /**
   * Get upcoming study sessions (sessions with date >= today)
   */
//   async getUpcomingStudySessions(): Promise<StudySession[]> {
//     try {
//       const today = new Date().toISOString().split('T')[0]; // Get YYYY-MM-DD format
//       const allSessions = await this.getAllStudySessions();
      
//       return allSessions.filter(session => session.date >= today);
//     } catch (error) {
//       console.error("Error fetching upcoming study sessions:", error);
//       throw new Error("Failed to fetch upcoming study sessions");
//     }
//   }

  /**
   * Get past study sessions (sessions with date < today)
   */
//   async getPastStudySessions(): Promise<StudySession[]> {
//     try {
//       const today = new Date().toISOString().split('T')[0]; // Get YYYY-MM-DD format
//       const allSessions = await this.getAllStudySessions();
      
//       return allSessions.filter(session => session.date < today);
//     } catch (error) {
//       console.error("Error fetching past study sessions:", error);
//       throw new Error("Failed to fetch past study sessions");
//     }
//   }
}

