import { AppPost } from '@/services/forumService';
import { create } from 'zustand';

interface PostStoreState {
  posts: AppPost[];
  setPosts: (posts: AppPost[]) => void;
}

export const usePostStore = create<PostStoreState>((set) => ({
  posts: [],
  setPosts: (posts) => set({ posts })
}));

export const setPosts = (posts: AppPost[]) => {
  usePostStore.getState().setPosts(posts);
};
