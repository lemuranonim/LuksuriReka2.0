import { create } from 'zustand';

interface AppState {
    isDevMode: boolean;
    isAppLoaded: boolean;
    activeSection: 'hub' | 'ceo-portfolio' | 'case-study' | 'services';
    setAppLoaded: (loaded: boolean) => void;
    toggleDevMode: () => void;
    setActiveSection: (section: 'hub' | 'ceo-portfolio' | 'case-study' | 'services') => void;
}

export const useAppStore = create<AppState>((set) => ({
    isDevMode: false,
    isAppLoaded: false,
    activeSection: 'hub',
    setAppLoaded: (loaded) => set({ isAppLoaded: loaded }),
    toggleDevMode: () => set((state) => ({ isDevMode: !state.isDevMode })),
    setActiveSection: (section) => set({ activeSection: section }),
}));
