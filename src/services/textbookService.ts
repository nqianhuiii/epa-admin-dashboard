// services/textbookService.ts
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
import { TextbookData } from "@/types/types";

export class TextbookService {

  static async getAll(): Promise<TextbookData[]> {
    try {
      const textbooksRef = collection(db, 'textbooks');
      const q = query(textbooksRef, orderBy('uploadedAt', 'desc'));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        uploadedAt: doc.data().uploadedAt.toDate(),
        updatedAt: doc.data().updatedAt?.toDate() || "", 
      })) as TextbookData[];
    } catch (error) {
      console.error('Failed to fetch textbooks:', error);
      throw new Error('Failed to fetch textbooks');
    }
  }

  static async create(textbookData: Omit<TextbookData, 'id'>): Promise<string> {
    try {
      const textbooksRef = collection(db, 'textbooks');
      const docData = {
        ...textbookData,
        uploadedAt: Timestamp.fromDate(textbookData.uploadedAt),
      };
      
      const docRef = await addDoc(textbooksRef, docData);
      return docRef.id;
    } catch (error) {
      console.error('Failed to create textbook:', error);
      throw new Error('Failed to create textbook');
    }
  }

  static async delete(textbookId: string): Promise<void> {
    try {
      const docRef = doc(db, 'textbooks', textbookId);
      
      // Check if document exists
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        throw new Error('Textbook not found');
      }
      
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Failed to delete textbook:', error);
      throw new Error('Failed to delete textbook');
    }
  }

  static async getById(textbookId: string): Promise<TextbookData | null> {
    try {
      const docRef = doc(db, 'textbooks', textbookId);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        return null;
      }
      
      return {
        id: docSnap.id,
        ...docSnap.data(),
        uploadedAt: docSnap.data().uploadedAt.toDate(),
      } as TextbookData;
    } catch (error) {
      console.error('Failed to fetch textbook:', error);
      throw new Error('Failed to fetch textbook');
    }
  }

static async update(id: string, updateData: Partial<Omit<TextbookData, 'id'>>): Promise<void> {
  try {
    const textbookRef = doc(db, 'textbooks', id);
    
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
    
    await updateDoc(textbookRef, docData);
  } catch (error) {
    console.error('Failed to update textbook:', error);
    throw new Error('Failed to update textbook');
  }
}

}