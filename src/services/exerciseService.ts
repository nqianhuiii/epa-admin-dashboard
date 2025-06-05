import { db } from "@/config/firebaseConfig";
import { 
  collection, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  doc, 
  getDoc,
  orderBy, 
  query,
  Timestamp, 
  updateDoc
} from 'firebase/firestore';
import { ExerciseData } from "@/types/types";

export class ExerciseService {

  static async getAll(): Promise<ExerciseData[]> {
    try {
      const exerciseRef = collection(db, 'exercises'); 
      const q = query(exerciseRef, orderBy('uploadedAt', 'desc'));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        uploadedAt: doc.data().uploadedAt.toDate(),
        updatedAt: doc.data().updatedAt?.toDate() || "", 
      })) as ExerciseData[];
    } catch (error) {
      console.error('Failed to fetch exercise:', error);
      throw new Error('Failed to fetch exercise');
    }
  }

  static async create(ExerciseData: Omit<ExerciseData, 'id'>): Promise<string> {
    try {
      const exerciseRef = collection(db, 'exercises');
      const docData = {
        ...ExerciseData,
        uploadedAt: Timestamp.fromDate(ExerciseData.uploadedAt),
      };
      
      const docRef = await addDoc(exerciseRef, docData);
      return docRef.id;
    } catch (error) {
      console.error('Failed to create exercise:', error);
      throw new Error('Failed to create exercise');
    }
  }

  static async delete(exerciseId: string): Promise<void> {
    try {
      const docRef = doc(db, 'exercises', exerciseId);
      
      // Check if document exists
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        throw new Error('Exercise not found');
      }
      
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Failed to delete exercise:', error);
      throw new Error('Failed to delete exercise');
    }
  }

  static async getById(exerciseId: string): Promise<ExerciseData | null> {
    try {
      const docRef = doc(db, 'exercises', exerciseId);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        return null;
      }
      
      return {
        id: docSnap.id,
        ...docSnap.data(),
        uploadedAt: docSnap.data().uploadedAt.toDate(),
      } as ExerciseData;
    } catch (error) {
      console.error('Failed to fetch exercise:', error);
      throw new Error('Failed to fetch exercise');
    }
  }

    static async update(
      id: string, 
      updateData: Partial<Omit<ExerciseData, 'id'>>
    ): Promise<void> {
      try {
        const notesRef = doc(db, 'exercises', id);
  
        // Prepare the document data with proper Firestore types
        const docData: Record<string, any> = {};
        
        // Copy all fields except uploadedAt
        Object.keys(updateData).forEach(key => {
          if (key !== 'uploadedAt') {
            docData[key] = updateData[key as keyof typeof updateData];
          }
        });
        
        // Handle uploadedAt conversion separately
        if (updateData.uploadedAt) {
          docData.uploadedAt = Timestamp.fromDate(updateData.uploadedAt);
        }
            console.log('Final docData being sent to Firestore:', docData);
  
        await updateDoc(notesRef, docData);
      } catch (error) {
        console.error('Failed to update exercise:', error);
        throw new Error('Failed to update exercise');
      }
    }
}