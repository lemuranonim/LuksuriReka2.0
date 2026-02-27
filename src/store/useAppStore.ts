import { create } from 'zustand';

interface AppState {
    isDevMode: boolean;
    activeSection: 'hub' | 'ceo-portfolio' | 'case-study' | 'services';
    toggleDevMode: () => void;
    setActiveSection: (section: 'hub' | 'ceo-portfolio' | 'case-study' | 'services') => void;
}

export const useAppStore = create<AppState>((set) => ({
    isDevMode: false,
    activeSection: 'hub',
    toggleDevMode: () => set((state) => ({ isDevMode: !state.isDevMode })),
    setActiveSection: (section) => set({ activeSection: section }),
}));
