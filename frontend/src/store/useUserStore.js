import { create } from 'zustand';

const useUserStore = create((set) => ({
  user: null,
  users: [],
  getUsers: (users) => set({ users }),
  getUser: (user) => set({ user }),
  createUser: (user) => set((state) => ({ user: { ...state.user, ...user } })),
  updateUser: (user) => set((state) => ({ user: { ...state.user, ...user } })),
  deleteUser: () => set({ user: null }),
}));

export default useUserStore;
