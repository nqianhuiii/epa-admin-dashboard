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
import { NotesData } from "@/types/types";

export class NotesService {

  static async getAll(): Promise<NotesData[]> {
    try {
      const notesRef = collection(db, 'notes');
      const q = query(notesRef, orderBy('uploadedAt', 'desc'));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        uploadedAt: doc.data().uploadedAt.toDate(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(), 

      })) as NotesData[];
    } catch (error) {
      console.error('Failed to fetch notes:', error);
      throw new Error('Failed to fetch notes');
    }
  }

  static async create(notesData: Omit<NotesData, 'id'>): Promise<string> {
    try {
      const notesRef = collection(db, 'notes');
      const docData = {
        ...notesData,
        uploadedAt: Timestamp.fromDate(notesData.uploadedAt),
      };
      
      const docRef = await addDoc(notesRef, docData);
      return docRef.id;
    } catch (error) {
      console.error('Failed to create notes:', error);
      throw new Error('Failed to create notes');
    }
  }

  static async delete(notesId: string): Promise<void> {
    try {
      const docRef = doc(db, 'notes', notesId);
      
      // Check if document exists
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        throw new Error('Notes not found');
      }
      
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Failed to delete notes:', error);
      throw new Error('Failed to delete notes');
    }
  }

  static async getById(notesId: string): Promise<NotesData | null> {
    try {
      const docRef = doc(db, 'notes', notesId);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        return null;
      }
      
      return {
        id: docSnap.id,
        ...docSnap.data(),
        uploadedAt: docSnap.data().uploadedAt.toDate(),
      } as NotesData;
    } catch (error) {
      console.error('Failed to fetch noets:', error);
      throw new Error('Failed to fetch notes');
    }
  }

  static async update(
    id: string, 
    updateData: Partial<Omit<NotesData, 'id' | 'uploadedAt'>>
  ): Promise<void> {
    try {
      const notesRef = doc(db, 'notes', id);
      
      // Convert Date objects to Timestamps for Firestore
      const docData: any = { ...updateData };
      
      if (docData.updatedAt && docData.updatedAt instanceof Date) {
        docData.updatedAt = Timestamp.fromDate(docData.updatedAt);
      }
      
      await updateDoc(notesRef, docData);
    } catch (error) {
      console.error('Failed to update notes:', error);
      throw new Error('Failed to update notes');
    }
  }
}