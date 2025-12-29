import { create } from 'zustand';

export interface UserState {
  user: User.Profile | null;
  setUser: (user: User.Profile | null) => void;
  clearUser: () => void;
}

const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));

export default useUserStore;
