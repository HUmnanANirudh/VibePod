import { create } from 'zustand';
import { Project, Track, Clip } from '@/lib/schema';

interface SavedProject {
  id: string;
  name: string;
  prompt: string | null;
  data: Project;
  createdAt: string;
  updatedAt: string;
}

// Debounce timer for auto-save
let autoSaveTimer: NodeJS.Timeout | null = null;

interface AudioState {
  project: Project | null;
  currentProjectId: string | null; // Track which saved project we're editing
  isPlaying: boolean;
  seekRequest: { bar: number, timestamp: number } | null;
  currentBar: number; // For visualization
  draggedPlayheadBar: number | null; // For playhead dragging
  isSaving: boolean; // Auto-save indicator
  
  // Saved projects from database
  savedProjects: SavedProject[];
  loadingSavedProjects: boolean;

  // Actions
  setProject: (project: Project, projectId?: string | null) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setCurrentBar: (bar: number) => void;
  seekTo: (bar: number) => void;
  setDraggedPlayheadBar: (bar: number | null) => void;
  updateTrack: (trackId: string, updates: Partial<Track>) => void;
  updateClip: (trackId: string, clipIndex: number, updates: Partial<Clip>) => void;
  resetProject: () => void;
  
  // Saved projects actions
  setSavedProjects: (projects: SavedProject[]) => void;
  addSavedProject: (project: SavedProject) => void;
  updateSavedProject: (project: SavedProject) => void;
  setLoadingSavedProjects: (loading: boolean) => void;
  fetchSavedProjects: () => Promise<void>;
  setCurrentProjectId: (id: string | null) => void;
}

// Auto-save function (debounced)
const triggerAutoSave = (projectId: string, project: Project, set: any, get: any) => {
  if (autoSaveTimer) {
    clearTimeout(autoSaveTimer);
  }
  
  autoSaveTimer = setTimeout(async () => {
    set({ isSaving: true });
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: project }),
      });
      
      if (res.ok) {
        const updated = await res.json();
        // Update the saved project in the list
        const savedProjects = get().savedProjects;
        const updatedProjects = savedProjects.map((p: SavedProject) => 
          p.id === projectId ? { ...p, data: project, updatedAt: updated.updatedAt } : p
        );
        set({ savedProjects: updatedProjects });
        console.log('Auto-saved project');
      }
    } catch (err) {
      console.error('Auto-save failed:', err);
    } finally {
      set({ isSaving: false });
    }
  }, 1500); // 1.5 second debounce
};

export const useAudioStore = create<AudioState>((set, get) => ({
  project: {
    bpm: 120,
    tracks: []
  },
  currentProjectId: null,
  isPlaying: false,
  currentBar: 0,
  seekRequest: null,
  draggedPlayheadBar: null,
  savedProjects: [],
  loadingSavedProjects: false,
  isSaving: false,

  setProject: (project, projectId) => {
    set({ project, currentProjectId: projectId ?? get().currentProjectId });
  },
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setCurrentBar: (currentBar) => set({ currentBar }),
  seekTo: (bar) => set({ seekRequest: { bar, timestamp: Date.now() } }),
  setDraggedPlayheadBar: (bar) => set({ draggedPlayheadBar: bar }),

  updateTrack: (trackId, updates) => {
    const state = get();
    if (!state.project) return;
    
    const newTracks = state.project.tracks.map(t =>
      t.id === trackId ? { ...t, ...updates } : t
    );
    const newProject = { ...state.project, tracks: newTracks };
    set({ project: newProject });
    
    // Trigger auto-save if we have a project ID
    if (state.currentProjectId) {
      triggerAutoSave(state.currentProjectId, newProject, set, get);
    }
  },

  updateClip: (trackId, clipIndex, updates) => {
    const state = get();
    if (!state.project) return;
    
    const newTracks = state.project.tracks.map(track => {
      if (track.id !== trackId) return track;
      return {
        ...track,
        clips: track.clips.map((clip, idx) =>
          idx === clipIndex ? { ...clip, ...updates } : clip
        )
      };
    });
    const newProject = { ...state.project, tracks: newTracks };
    set({ project: newProject });
    
    // Trigger auto-save if we have a project ID
    if (state.currentProjectId) {
      triggerAutoSave(state.currentProjectId, newProject, set, get);
    }
  },

  resetProject: () => set({
    project: { bpm: 120, tracks: [] },
    currentProjectId: null,
    isPlaying: false,
    currentBar: 0
  }),

  setSavedProjects: (projects) => set({ savedProjects: projects }),
  addSavedProject: (project) => set((state) => ({ 
    savedProjects: [project, ...state.savedProjects],
    currentProjectId: project.id // Set as current project when added
  })),
  updateSavedProject: (project) => set((state) => ({
    savedProjects: state.savedProjects.map(p => p.id === project.id ? project : p)
  })),
  setLoadingSavedProjects: (loading) => set({ loadingSavedProjects: loading }),
  setCurrentProjectId: (id) => set({ currentProjectId: id }),
  
  fetchSavedProjects: async () => {
    set({ loadingSavedProjects: true });
    try {
      const res = await fetch("/api/projects");
      if (res.ok) {
        const data = await res.json();
        set({ savedProjects: data });
      }
    } catch (err) {
      console.error("Failed to fetch projects", err);
    } finally {
      set({ loadingSavedProjects: false });
    }
  },
}));
