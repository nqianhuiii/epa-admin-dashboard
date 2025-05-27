import { AppUser } from '@/services/userSercvice';
import {create} from 'zustand';


interface UserStoreState {
    users: AppUser[];
    setUsers: (users: AppUser[]) => void;
}

export const useUserStore = create<UserStoreState>((set) => ({
    users: [],
    setUsers: (users) => set({ users })
}));

export const setUsers= (users: AppUser[]) => {
    useUserStore.getState().setUsers(users);
}