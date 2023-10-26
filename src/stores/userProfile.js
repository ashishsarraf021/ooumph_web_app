import { create } from 'zustand';

const useProfileStore = create((set) => ({
    email: null,

    setEmail: (email) => {
        set({ email });
    },

    clearEmail: () => {
        set({ email: null });
    },
}));

export default useProfileStore;
