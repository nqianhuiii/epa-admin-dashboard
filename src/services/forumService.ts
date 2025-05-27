import { collection, getDocs, query, orderBy, doc, getDoc, getCountFromServer } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { getUsernameById } from "./userSercvice";

export interface PostData {
  title: string;
  description: string;
  imageUrls?: string[];
  userId: string;
  likedBy?: string[];
  createdAt?: string;
}

export interface AppPost extends PostData {
  id: string;
  username?: string;
  commentCount?: number;
}

export interface ForumComment {
  id: string;
  text: string;
  userId: string;
  createdAt: Date;
  username: string;
}

export const getAllPosts = async (): Promise<AppPost[]> => {
  try {
    const postsQuery = query(
      collection(db, "posts"),
      orderBy("createdAt", "desc")
    );

    const postSnapshot = await getDocs(postsQuery);

    const posts = await Promise.all(
      postSnapshot.docs.map(async (doc) => {
        const data = doc.data();
        const createdAt = data.createdAt?.toDate?.().toISOString() ?? null;

        // Get username for this post's userId
        const username = await getUsernameById(data.userId);

        // Get comment count for the post (inside comments subcollection)
        let commentCount = 0;
        try {
          const commentsCollectionRef = collection(db, "posts", doc.id, "comments");
          const commentCountSnap = await getCountFromServer(commentsCollectionRef);
          commentCount = commentCountSnap.data().count;
        } catch (err) {
          console.error(`Error fetching comment count for post ${doc.id}:`, err);
        }

        return {
          id: doc.id,
          title: data.title,
          description: data.description,
          imageUrls: data.imageUrls ?? [],
          userId: data.userId,
          likedBy: data.likedBy ?? [],
          createdAt,
          username,
          commentCount,
        };
      })
    );

    return posts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};

export const getPostById = async (postId: string): Promise<AppPost | null> => {
  try {
    const postRef = doc(db, 'posts', postId);
    const postSnap = await getDoc(postRef);

    const data = postSnap.data() as Omit<PostData, 'id' | 'username' | 'commentCount'>;
    const username = await getUsernameById(data.userId);

    // Get comment count for the post
    let commentCount = 0;
    try {
      const commentsCollectionRef = collection(db, "posts", postId, "comments");
      const commentCountSnap = await getCountFromServer(commentsCollectionRef);
      commentCount = commentCountSnap.data().count;
    } catch (err) {
      console.error(`Error fetching comment count for post ${postId}:`, err);
    }

    // Convert createdAt if it exists
    // const createdAt = data.createdAt?.toDate?.().toISOString() ?? null;

    return {
      id: postSnap.id,
      title: data.title,
      description: data.description,
      imageUrls: data.imageUrls ?? [],
      userId: data.userId,
      likedBy: data.likedBy ?? [],
    //   createdAt,
      username: username || "Unknown User",
      commentCount,
    };
  } catch (error) {
    console.error("Error fetching post by ID:", error);
    return null; 
  }
};

export const getCommentsByPostId = async (postId: string): Promise<ForumComment[]> => {
  try {
    const commentsRef = collection(db, "posts", postId, "comments");
    const q = query(commentsRef, orderBy("createdAt", "asc"));
    const querySnapshot = await getDocs(q);
    
    const comments: ForumComment[] = await Promise.all(
      querySnapshot.docs.map(async (docSnap) => {
        const data = docSnap.data();
        const username = await getUsernameById(data.userId);
  
        return {
          id: docSnap.id,
          text: data.text,
          userId: data.userId,
          createdAt: data.createdAt?.toDate?.() || new Date(),
          username: username || "Unknown User",
        };
      })
    );
    
    return comments;
  } catch (error) {
    console.error("Error getting comments:", error);
    throw new Error("Failed to get comments");
  }
};

