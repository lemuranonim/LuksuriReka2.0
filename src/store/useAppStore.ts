import { create } from 'zustand';

interface AppState {
    isDevMode: boolean;
    isAppLoaded: boolean;
    isMultiverseView: boolean;
    warpNavTarget: string | null;  // URL to navigate to after planet warp
    activeSection: 'hub' | 'ceo-portfolio' | 'case-study' | 'services' | 'mascot' | 'about' | null;
    isMascotSpeaking: boolean;
    setAppLoaded: (loaded: boolean) => void;
    toggleDevMode: () => void;
    setMultiverseView: (v: boolean) => void;
    setWarpNavTarget: (url: string | null) => void;
    setActiveSection: (section: 'hub' | 'ceo-portfolio' | 'case-study' | 'services' | 'mascot' | 'about' | null) => void;
    toggleMascotSpeaking: () => void;
}

export const useAppStore = create<AppState>((set) => ({
    isDevMode: false,
    isAppLoaded: false,
    isMultiverseView: false,
    warpNavTarget: null,
    activeSection: 'hub',
    isMascotSpeaking: false,
    setAppLoaded: (loaded) => set({ isAppLoaded: loaded }),
    toggleDevMode: () => set((state) => ({ isDevMode: !state.isDevMode })),
    setMultiverseView: (v) => set({ isMultiverseView: v, activeSection: 'hub', isMascotSpeaking: false }),
    setWarpNavTarget: (url) => set({ warpNavTarget: url }),
    setActiveSection: (section) => set({ activeSection: section, isMascotSpeaking: false }),
    toggleMascotSpeaking: () => set((state) => ({ isMascotSpeaking: !state.isMascotSpeaking })),
}));
