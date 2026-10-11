// Lớp truy cập dữ liệu. Hiện trả về dữ liệu mẫu.
// Khi có backend: giữ nguyên chữ ký hàm, thay thân hàm bằng gọi HTTP,
// ví dụ: return http.get<Question[]>('/sessions/today/questions').
// Màn hình chỉ gọi qua file này, không import mock trực tiếp cho dữ liệu động.

import * as mock from '../data/mock';
import type { ChatMessage, Flashcard, Question, ReviewDecision } from '../data/types';

const delay = <T,>(value: T, ms = 150) => new Promise<T>((r) => setTimeout(() => r(value), ms));

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? '';

export const authApi = {
  async activate(code: string) {
    // TODO backend: POST /auth/activate { code }
    const ok = code.trim().length >= 4;
    return delay({ ok, learner: mock.learner, error: ok ? undefined : 'Mã kích hoạt không hợp lệ' });
  },
};

export const learningApi = {
  modules: () => delay(mock.modules),
  topics: (moduleId: string) => delay(mock.topics.filter((t) => t.moduleId === moduleId)),
  // Câu luyện điểm yếu do động cơ thích ứng chọn
  weakPracticeQuestions: (): Promise<Question[]> =>
    delay([mock.questions[0], mock.questions[1], mock.questions[6], mock.questions[7], mock.questions[3], mock.questions[5]]),
  assessmentQuestions: (): Promise<Question[]> => delay(mock.assessmentQuestions),
  quickCheck: (): Promise<Question> => delay(mock.questions[3]),
};

export const cardsApi = {
  dueCards: (): Promise<Flashcard[]> => delay(mock.flashcards.filter((c) => c.dueToday)),
  allCards: (): Promise<Flashcard[]> => delay(mock.flashcards),
  // TODO backend: POST /cards/:id/review { rating } -> lịch ôn mới (FSRS)
  grade: (cardId: string, rating: 1 | 2 | 3 | 4) => delay({ cardId, rating }),
};

export const examApi = {
  list: () => delay(mock.exams),
  // Đề 40 câu. Ở bản mẫu lặp lại pool câu hỏi.
  questions: (examId: string): Promise<Question[]> =>
    delay(
      Array.from({ length: 40 }, (_, i) => {
        const q = mock.questions[i % mock.questions.length];
        return { ...q, id: `${q.id}@${examId}-${i + 1}` }; // giữ mã câu gốc trước '@'
      }),
    ),
};

export const chatApi = {
  conversations: () => delay(mock.conversations),
  // TODO backend: POST /chat { conversationId, message } -> stream câu trả lời có trích dẫn
  async send(_conversationId: string, _text: string): Promise<ChatMessage | null> {
    return delay(null);
  },
};

export const reviewApi = {
  queue: () => delay(mock.reviewQueue),
  // TODO backend: POST /review/:id/decision
  decide: (id: string, decision: ReviewDecision, comment: string) => delay({ id, decision, comment }),
};
