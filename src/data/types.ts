// Mô hình dữ liệu miền. Backend sau này trả về đúng các kiểu này.

export type Difficulty = 'Dễ' | 'Trung bình' | 'Khó';
export type Bloom = 'Nhớ' | 'Hiểu' | 'Vận dụng';

export interface SourceRef {
  doc: string; // Tên giáo trình / tài liệu
  page: number;
  excerpt?: string;
}

export interface Module {
  id: string;
  name: string;
  topicCount: number;
  progress: number; // 0..1
}

export interface Topic {
  id: string;
  moduleId: string;
  index: number;
  name: string;
}

export interface Option {
  id: string; // 'A' | 'B' | ...
  text: string;
  rationale?: string; // lý giải phương án nhiễu (cho chuyên gia)
}

export interface Question {
  id: string;
  stem: string;
  options: Option[];
  correctId: string;
  explanation: string;
  source: SourceRef;
  topicId: string;
  domain: string; // miền năng lực
  competency: string; // mã năng lực, vd 2.3.1
  bloom: Bloom;
  difficulty: Difficulty;
  why?: string; // giải thích vì sao câu này được chọn cho người học
  aiAssisted?: boolean;
}

export type CardState = 'new' | 'learning' | 'review';
export type CardOrigin = 'Từ đề thi thử' | 'Từ quiz học phần' | 'Từ bài đánh giá';

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  source: SourceRef;
  deck: string;
  topic: string;
  state: CardState;
  dueLabel: string; // 'Đến hạn hôm nay', 'Sau 2 ngày'...
  dueToday: boolean;
  origin: CardOrigin;
  reason?: string;
  lapses?: number;
  suspended?: boolean;
}

export interface Deck {
  id: string;
  name: string;
  newCount: number;
  learning: number;
  due: number;
  children?: Deck[];
}

export interface Exam {
  id: string;
  name: string;
  questionCount: number;
  minutes: number;
  attemptsLeft: number;
  isNew?: boolean;
  lastResult?: { date: string; correct: number };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  text: string;
  citations?: SourceRef[];
}

export interface Conversation {
  id: string;
  title: string;
  when: string;
}

export interface ReviewItem {
  id: string; // mã câu, vd DT-0123
  question: Question;
  round: 1 | 2;
  tags: string[];
  provenance: string;
}

export type ReviewDecision = 'pass' | 'revise' | 'reject';
