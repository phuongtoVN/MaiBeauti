import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AnalysisResult } from '@/lib/mockAnalysisData';
import { PersonalizedKit } from '@/lib/mockRecommendations';

interface AnalysisStore {
  currentAnalysis: AnalysisResult | null;
  personalizedKit: PersonalizedKit | null;
  analysisHistory: AnalysisResult[];
  
  // Actions
  setCurrentAnalysis: (analysis: AnalysisResult) => void;
  setPersonalizedKit: (kit: PersonalizedKit) => void;
  addToHistory: (analysis: AnalysisResult) => void;
  clearCurrentAnalysis: () => void;
  getAnalysisById: (id: string) => AnalysisResult | undefined;
}

export const useAnalysisStore = create<AnalysisStore>()(
  persist(
    (set, get) => ({
      currentAnalysis: null,
      personalizedKit: null,
      analysisHistory: [],

      setCurrentAnalysis: (analysis) => {
        set({ currentAnalysis: analysis });
        // Also add to history if not already there
        if (!get().analysisHistory.find((a) => a.analysisId === analysis.analysisId)) {
          get().addToHistory(analysis);
        }
      },

      setPersonalizedKit: (kit) => {
        set({ personalizedKit: kit });
      },

      addToHistory: (analysis) => {
        set((state) => ({
          analysisHistory: [analysis, ...state.analysisHistory].slice(0, 10), // Keep last 10
        }));
      },

      clearCurrentAnalysis: () => {
        set({ currentAnalysis: null, personalizedKit: null });
      },

      getAnalysisById: (id) => {
        return get().analysisHistory.find((a) => a.analysisId === id);
      },
    }),
    {
      name: 'maibeauti-analysis',
    }
  )
);