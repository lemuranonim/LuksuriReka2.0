import { create } from 'zustand';

interface AppState {
    isDevMode: boolean;
    isAppLoaded: boolean;
    activeSection: 'hub' | 'ceo-portfolio' | 'case-study' | 'services' | 'mascot' | 'about' | null;
    isMascotSpeaking: boolean;
    setAppLoaded: (loaded: boolean) => void;
    toggleDevMode: () => void;
    setActiveSection: (section: 'hub' | 'ceo-portfolio' | 'case-study' | 'services' | 'mascot' | 'about' | null) => void;
    toggleMascotSpeaking: () => void;
}

export const useAppStore = create<AppState>((set) => ({
    isDevMode: false,
    isAppLoaded: false,
    activeSection: 'hub',
    isMascotSpeaking: false,
    setAppLoaded: (loaded) => set({ isAppLoaded: loaded }),
    toggleDevMode: () => set((state) => ({ isDevMode: !state.isDevMode })),
    setActiveSection: (section) => set({ activeSection: section, isMascotSpeaking: false }),
    toggleMascotSpeaking: () => set((state) => ({ isMascotSpeaking: !state.isMascotSpeaking })),
}));
