import { collection, getDocs, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";

export interface UserData {
  fullName: string;
  userName: string;
  email: string;
  profilePhotoUrl?: string;
  createdAt?: string; 
  updatedAt?: string; 
}

export interface AppUser extends UserData {
  id: string; // document id
}

export const getAllUsers = async (): Promise<AppUser[]> => {
  try {
    const usersCollection = collection(db, "users");
    const userSnapshot = await getDocs(usersCollection);

    return userSnapshot.docs.map(doc => {
      const data = doc.data();

      // Safely convert Firestore Timestamps to ISO strings
      const createdAt = data.createdAt?.toDate?.().toISOString() ?? null;
      const updatedAt = data.updatedAt?.toDate?.().toISOString() ?? null;

      return {
        id: doc.id,
        ...data,
        createdAt,
        updatedAt
      };

    }) as AppUser[];
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const getUsernameById = async (userId: string): Promise<string> => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      return userDoc.data()?.userName || "";
    } else {
      return "Unknown User";
    }
  } catch (error) {
    console.error("Error fetching username:", error);
    return "Unknown User";
  }
};