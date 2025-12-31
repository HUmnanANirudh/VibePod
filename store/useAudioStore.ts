import { create } from 'zustand';
import { Project, Track, Clip } from '@/lib/schema';

interface AudioState {
  project: Project | null;
  isPlaying: boolean;
  seekRequest: { bar: number, timestamp: number } | null;
  currentBar: number; // For visualization

  // Actions
  setProject: (project: Project) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setCurrentBar: (bar: number) => void;
  seekTo: (bar: number) => void;
  updateTrack: (trackId: string, updates: Partial<Track>) => void;
  // Initialize with some default empty project
  resetProject: () => void;
}

export const useAudioStore = create<AudioState>((set) => ({
  project: {
    bpm: 120,
    tracks: []
  },
  isPlaying: false,
  currentBar: 0,
  seekRequest: null,

  setProject: (project) => set({ project }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setCurrentBar: (currentBar) => set({ currentBar }),
  seekTo: (bar) => set({ seekRequest: { bar, timestamp: Date.now() } }),

  updateTrack: (trackId, updates) => set((state) => {
    if (!state.project) return state;
    const newTracks = state.project.tracks.map(t =>
      t.id === trackId ? { ...t, ...updates } : t
    );
    return { project: { ...state.project, tracks: newTracks } };
  }),

  resetProject: () => set({
    project: { bpm: 120, tracks: [] },
    isPlaying: false,
    currentBar: 0
  }),
}));
