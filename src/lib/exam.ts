// Tiện ích dùng chung cho các màn thi thử.
import { exams } from '../data/mock';
import type { Exam, Question } from '../data/types';

export function getExam(id: string): Exam {
  return exams.find((e) => e.id === id) ?? { id, name: 'Đề thi thử số 2', questionCount: 40, minutes: 50, attemptsLeft: 2 };
}

/** Bài làm mẫu khi chưa có dữ liệu thật: 33 đúng, 6 sai, 1 bỏ trống */
export function sampleAnswers(qs: Question[]): Record<string, string> {
  const wrong = new Set([2, 4, 9, 15, 22, 30]);
  const blank = new Set([35]);
  const out: Record<string, string> = {};
  qs.forEach((q, i) => {
    if (blank.has(i)) return;
    out[q.id] = wrong.has(i) ? q.options.find((o) => o.id !== q.correctId)!.id : q.correctId;
  });
  return out;
}

export function score(qs: Question[], answers: Record<string, string>) {
  let correct = 0;
  let wrong = 0;
  let blank = 0;
  for (const q of qs) {
    const a = answers[q.id];
    if (!a) blank++;
    else if (a === q.correctId) correct++;
    else wrong++;
  }
  return { correct, wrong, blank };
}

export const fmtTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
