// Trạng thái phía client (người dùng hiện tại, lựa chọn, cài đặt).
// Dữ liệu từ server không nên để ở đây lâu dài — khi có backend,
// cân nhắc dùng TanStack Query cho cache dữ liệu server.

import { create } from 'zustand';

export type Role = 'learner' | 'expert' | 'ministry';

interface ReviewSettings {
  newPerDay: number;
  maxReviews: number;
  targetRetention: 0.85 | 0.9 | 0.95;
  compressBeforeExam: boolean;
  sources: { quiz: boolean; assessment: boolean; exam: boolean };
}

interface AppState {
  role: Role | null;
  signedIn: boolean;
  selectedModules: string[];
  assessmentDone: boolean;
  reviewSettings: ReviewSettings;
  lastExam: { examId: string; answers: Record<string, string>; seconds: number } | null;
  signIn: (role?: Role) => void;
  signOut: () => void;
  toggleModule: (id: string) => void;
  completeAssessment: () => void;
  updateReviewSettings: (patch: Partial<ReviewSettings>) => void;
  resetReviewSettings: () => void;
  saveExam: (examId: string, answers: Record<string, string>, seconds: number) => void;
}

const defaultReviewSettings: ReviewSettings = {
  newPerDay: 20,
  maxReviews: 200,
  targetRetention: 0.9,
  compressBeforeExam: true,
  sources: { quiz: true, assessment: true, exam: true },
};

export const useAppStore = create<AppState>((set) => ({
  role: null,
  signedIn: false,
  selectedModules: ['dich-te', 'tiem-chung'],
  assessmentDone: false,
  reviewSettings: defaultReviewSettings,
  lastExam: null,
  signIn: (role = 'learner') => set({ signedIn: true, role }),
  signOut: () => set({ signedIn: false, role: null }),
  toggleModule: (id) =>
    set((s) => ({
      selectedModules: s.selectedModules.includes(id)
        ? s.selectedModules.filter((m) => m !== id)
        : [...s.selectedModules, id],
    })),
  completeAssessment: () => set({ assessmentDone: true }),
  updateReviewSettings: (patch) => set((s) => ({ reviewSettings: { ...s.reviewSettings, ...patch } })),
  resetReviewSettings: () => set({ reviewSettings: defaultReviewSettings }),
  saveExam: (examId, answers, seconds) => set({ lastExam: { examId, answers, seconds } }),
}));
