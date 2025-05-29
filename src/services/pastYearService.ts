// services/past yearervice.ts
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
  Timestamp 
} from 'firebase/firestore';
import { PastYearData } from "@/types/types";

export class PastYearService {

  static async getAll(): Promise<PastYearData[]> {
    try {
      const pastYearRef = collection(db, 'pastYears');
      const q = query(pastYearRef, orderBy('uploadedAt', 'desc'));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        uploadedAt: doc.data().uploadedAt.toDate(),
      })) as PastYearData[];
    } catch (error) {
      console.error('Failed to fetch past year:', error);
      throw new Error('Failed to fetch past year');
    }
  }

  static async create(PastYearData: Omit<PastYearData, 'id'>): Promise<string> {
    try {
      const pastYearRef = collection(db, 'pastYears');
      const docData = {
        ...PastYearData,
        uploadedAt: Timestamp.fromDate(PastYearData.uploadedAt),
      };
      
      const docRef = await addDoc(pastYearRef, docData);
      return docRef.id;
    } catch (error) {
      console.error('Failed to create past year:', error);
      throw new Error('Failed to create past year');
    }
  }

  static async delete(pastYearId: string): Promise<void> {
    try {
      const docRef = doc(db, 'pastYears', pastYearId);
      
      // Check if document exists
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        throw new Error('Past year not found');
      }
      
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Failed to delete past year:', error);
      throw new Error('Failed to delete past year');
    }
  }

  static async getById(pastYearId: string): Promise<PastYearData | null> {
    try {
      const docRef = doc(db, 'pastYears', pastYearId);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        return null;
      }
      
      return {
        id: docSnap.id,
        ...docSnap.data(),
        uploadedAt: docSnap.data().uploadedAt.toDate(),
      } as PastYearData;
    } catch (error) {
      console.error('Failed to fetch past year:', error);
      throw new Error('Failed to fetch past year');
    }
  }
}