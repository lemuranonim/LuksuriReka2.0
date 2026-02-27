import { create } from 'zustand';

interface AppState {
    isDevMode: boolean;
    activeSection: 'hub' | 'desk' | 'plant' | 'server';
    toggleDevMode: () => void;
    setActiveSection: (section: 'hub' | 'desk' | 'plant' | 'server') => void;
}

export const useAppStore = create<AppState>((set) => ({
    isDevMode: false,
    activeSection: 'hub',
    toggleDevMode: () => set((state) => ({ isDevMode: !state.isDevMode })),
    setActiveSection: (section) => set({ activeSection: section }),
}));
