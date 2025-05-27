// app/actions/userActions.ts
"use server";

import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteUserAction(userId: string) {
  try {
    // Delete from Firestore
    const userDoc = doc(db, "users", userId);
    await deleteDoc(userDoc);
    
    // Revalidate the users page to refetch data
    revalidatePath("/users");
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { success: false, error: "Failed to delete user" };
  }
}

// Optional: Server action for optimistic updates
// export async function deleteUserOptimistic(prevState: any, formData: FormData) {
//   const userId = formData.get("userId") as string;
  
//   try {
//     const userDoc = doc(db, "users", userId);
//     await deleteDoc(userDoc);
    
//     revalidatePath("/users");
//     return { success: true, message: "User deleted successfully" };
//   } catch (error) {
//     return { success: false, message: "Failed to delete user" };
//   }
// }