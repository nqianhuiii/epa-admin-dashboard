"use server";

import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import { revalidatePath } from "next/cache";

export async function deletePostAction(postId: string) {
  try {
    const postRef = doc(db, "posts", postId);
    await deleteDoc(postRef);

    revalidatePath("/posts");

    return { success: true };
  } catch (error) {
    console.error("Error deleting post:", error);
    return { success: false, error: "Failed to delete post" };
  }
}
