import { db } from "@/config/firebaseConfig";
import { collection, addDoc, Timestamp, updateDoc, doc, query, orderBy, getDocs, getDoc, deleteDoc } from 'firebase/firestore';
import { FlashcardSet } from "@/types/types";


export class FlashcardService {
    static async createFlashcardSet(set: FlashcardSet): Promise<string> {
    try {
        const docRef = await addDoc(collection(db, 'flashcards'), {
        title: set.title,
        description: set.description,
        createdAt: Timestamp.now(),
        cards: set.cards.map(card => ({
            term: card.term,
            definition: card.definition,
        }))
        });

        return docRef.id;
    } catch (error) {
        console.error('Error creating flashcard set in Firestore:', error);
        throw error;
    }
    }


  static async updateFlashcardSet(set: FlashcardSet): Promise<void> {
    try {
      if (!set.id) {
        throw new Error('Flashcard set ID is required for updates');
      }

      const docRef = doc(db, 'flashcards', String(set.id));
   
      await updateDoc(docRef, {
        title: set.title,
        description: set.description,
        updatedAt: Timestamp.now(),
        cards: set.cards.map(card => ({
          term: card.term,
          definition: card.definition,
        }))
      });
    } catch (error) {
      console.error('Error updating flashcard set in Firestore:', error);
      throw error;
    }
  }


  static async getAllFlashcardSets(): Promise<FlashcardSet[]> {
    try {

      const docRef =  collection(db, 'flashcards');
      const q = query(docRef,  orderBy('createdAt', 'desc')); 
      const querySnapshot = await getDocs(q);

      const flashcards: FlashcardSet[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        
        flashcards.push({
          id: doc.id,
          title: data.title,
          description: data.description,
          cards: data.cards?.map((card: any) => ({
            id: card.id,
            term: card.term,
            definition: card.definition,
          })) || [],
          uploadedAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || data.createdAt?.toDate() || new Date(),
        });
      });

      return flashcards;
    } catch (error) {
      console.error('Error getting flashcard sets from Firestore:', error);
      throw error;
    }
  }


  static async getFlashcardSetById(id: string): Promise<FlashcardSet | null> {
    try {
      const docRef = doc(db, 'flashcards', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        
        return {
          id: docSnap.id,
          title: data.title,
          description: data.description,
          cards: data.cards?.map((card: any) => ({
            id: card.id,
            term: card.term,
            definition: card.definition,
          })) || [],
          uploadedAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || data.createdAt?.toDate() || new Date(),
        };
      } else {
        console.log('No such flashcard set found!');
        return null;
      }
    } catch (error) {
      console.error('Error getting flashcard set by ID from Firestore:', error);
      throw error;
    }
  }

  static async deleteFlashcard(id: string): Promise<void> {
  try {
    const docRef = doc(db, 'flashcards', id);
    
    // Check if document exists
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      throw new Error("Flashcard not found");
    }

    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting flashcard:", error);
    if (error instanceof Error && error.message === "Flashcard not found") {
      throw error;
    }
    throw new Error("Failed to delete flashcard");
  }
}
}





