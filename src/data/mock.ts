// DỮ LIỆU MẪU — chỉ dùng cho giai đoạn dựng giao diện.
// Khi có backend, xoá file này và để src/services/api.ts gọi API thật.

import type {
  Conversation,
  Deck,
  Exam,
  Flashcard,
  Module,
  Question,
  ReviewItem,
  Topic,
} from './types';

const GT_DT = 'Giáo trình Dịch tễ học';

export const learner = {
  name: 'Thu Hà',
  initials: 'TH',
  institution: 'CSĐT A',
  examDate: '01/03/2027',
  daysToExam: 142,
};

export const modules: Module[] = [
  { id: 'dich-te', name: 'Dịch tễ học cơ bản', topicCount: 8, progress: 0.38 },
  { id: 'tiem-chung', name: 'Tiêm chủng mở rộng', topicCount: 6, progress: 0.17 },
  { id: 'moi-truong', name: 'Sức khỏe môi trường', topicCount: 7, progress: 0 },
  { id: 'dinh-duong', name: 'Dinh dưỡng cộng đồng', topicCount: 6, progress: 0 },
  { id: 'truyen-nhiem', name: 'Bệnh truyền nhiễm', topicCount: 9, progress: 0 },
  { id: 'thong-ke', name: 'Thống kê y sinh', topicCount: 5, progress: 0.4 },
  { id: 'nghe-nghiep', name: 'Sức khỏe nghề nghiệp', topicCount: 6, progress: 0 },
  { id: 'quan-ly', name: 'Quản lý y tế', topicCount: 5, progress: 0 },
];

export const topics: Topic[] = [
  { id: 'dt-1', moduleId: 'dich-te', index: 1, name: 'Khái niệm' },
  { id: 'dt-2', moduleId: 'dich-te', index: 2, name: 'Thiết kế nghiên cứu' },
  { id: 'dt-3', moduleId: 'dich-te', index: 3, name: 'Đo lường bệnh trạng' },
  { id: 'dt-4', moduleId: 'dich-te', index: 4, name: 'Sai số và nhiễu' },
  { id: 'dt-5', moduleId: 'dich-te', index: 5, name: 'Điều tra vụ dịch' },
  { id: 'dt-6', moduleId: 'dich-te', index: 6, name: 'Giám sát dịch tễ' },
  { id: 'dt-7', moduleId: 'dich-te', index: 7, name: 'Sàng lọc' },
  { id: 'dt-8', moduleId: 'dich-te', index: 8, name: 'Quan hệ nhân quả' },
  { id: 'tc-1', moduleId: 'tiem-chung', index: 1, name: 'Lịch tiêm chủng thường xuyên' },
  { id: 'tc-2', moduleId: 'tiem-chung', index: 2, name: 'Bảo quản vắc xin' },
  { id: 'tk-1', moduleId: 'thong-ke', index: 1, name: 'Cỡ mẫu' },
  { id: 'tk-2', moduleId: 'thong-ke', index: 2, name: 'Kiểm định giả thuyết' },
];

export const questions: Question[] = [
  {
    id: 'q-incidence-tb',
    stem:
      'Một huyện có 50.000 dân. Đầu năm có 300 người đang điều trị lao; trong năm ghi nhận thêm 200 ca lao mới. Tỷ lệ mới mắc lao trong năm là bao nhiêu?',
    options: [
      { id: 'A', text: '4,0 trên 1.000 dân' },
      { id: 'B', text: '10,0 trên 1.000 dân' },
      { id: 'C', text: '6,0 trên 1.000 dân' },
      { id: 'D', text: '4,0 trên 100 dân' },
    ],
    correctId: 'A',
    explanation:
      'Người đang mắc lao không còn nguy cơ mắc mới, nên mẫu số là 50.000 − 300 = 49.700. Tỷ lệ mới mắc = 200 / 49.700 ≈ 4,0 trên 1.000 dân.',
    source: { doc: GT_DT, page: 59 },
    topicId: 'dt-3',
    domain: 'Dịch tễ học',
    competency: '2.3.1',
    bloom: 'Vận dụng',
    difficulty: 'Trung bình',
    why: 'Cùng năng lực 2.3.1 với câu 2 bạn vừa sai · mức Vận dụng · bạn chưa gặp câu này trong 14 ngày.',
  },
  {
    id: 'q-cross-sectional',
    stem: 'Thiết kế nghiên cứu nào phù hợp nhất để ước lượng tỷ lệ hiện mắc?',
    options: [
      { id: 'A', text: 'Nghiên cứu bệnh – chứng' },
      { id: 'B', text: 'Nghiên cứu thuần tập' },
      { id: 'C', text: 'Nghiên cứu cắt ngang' },
      { id: 'D', text: 'Thử nghiệm lâm sàng' },
    ],
    correctId: 'C',
    explanation:
      'Nghiên cứu cắt ngang đo tình trạng bệnh tại một thời điểm, nên ước lượng được tỷ lệ hiện mắc. Thuần tập theo dõi theo thời gian để đo tỷ lệ mới mắc.',
    source: { doc: GT_DT, page: 64 },
    topicId: 'dt-2',
    domain: 'Dịch tễ học',
    competency: '2.2.1',
    bloom: 'Hiểu',
    difficulty: 'Trung bình',
  },
  {
    id: 'q-prevalence-def',
    stem:
      'Chỉ số nào phản ánh tỷ lệ người đang mắc bệnh trong một quần thể tại một thời điểm xác định?',
    options: [
      {
        id: 'A',
        text: 'Tỷ lệ mới mắc',
        rationale: 'Chỉ đếm các ca mới xuất hiện trong một khoảng thời gian, không phải mọi người đang mắc bệnh.',
      },
      {
        id: 'B',
        text: 'Tỷ lệ hiện mắc',
        rationale: 'Số người đang mắc tại một thời điểm chia cho quần thể tại thời điểm đó.',
      },
      { id: 'C', text: 'Tỷ suất tử vong', rationale: 'Đo số ca tử vong, không phải số người đang mắc bệnh.' },
      { id: 'D', text: 'Tỷ lệ tấn công', rationale: 'Là tỷ lệ mới mắc trong một vụ dịch, tính trong thời gian ngắn.' },
    ],
    correctId: 'B',
    explanation: 'Số người đang mắc tại một thời điểm chia cho quần thể tại thời điểm đó.',
    source: {
      doc: GT_DT,
      page: 58,
      excerpt:
        'Các chỉ số đo lường bệnh trạng gồm tỷ lệ hiện mắc và tỷ lệ mới mắc. Tỷ lệ hiện mắc là số người đang mắc bệnh tại một thời điểm chia cho tổng số người trong quần thể tại thời điểm đó. Chỉ số này thường được ước lượng qua nghiên cứu cắt ngang.',
    },
    topicId: 'dt-3',
    domain: 'Dịch tễ học',
    competency: '2.3.1',
    bloom: 'Hiểu',
    difficulty: 'Trung bình',
  },
  {
    id: 'q-prevalence-calc',
    stem: 'Một xã có 2.000 dân; ngày 1/1 có 50 người đang mắc lao. Tỷ lệ hiện mắc là?',
    options: [
      { id: 'A', text: '2,5%' },
      { id: 'B', text: '5%' },
      { id: 'C', text: '0,25%' },
      { id: 'D', text: '25%' },
    ],
    correctId: 'A',
    explanation:
      '50 ÷ 2.000 = 2,5%. Tử số là mọi người đang mắc vào ngày 1/1; mẫu số là toàn bộ dân số xã tại thời điểm đó.',
    source: { doc: GT_DT, page: 58 },
    topicId: 'dt-3',
    domain: 'Dịch tễ học',
    competency: '2.3.1',
    bloom: 'Vận dụng',
    difficulty: 'Dễ',
  },
  {
    id: 'q-incidence-def',
    stem: 'Chỉ số nào có tử số là số ca mới xuất hiện trong một khoảng thời gian?',
    options: [
      { id: 'A', text: 'Tỷ lệ hiện mắc' },
      { id: 'B', text: 'Tỷ lệ mới mắc' },
      { id: 'C', text: 'Tỷ suất tử vong' },
      { id: 'D', text: 'Tỷ số chênh' },
    ],
    correctId: 'B',
    explanation: 'Tỷ lệ mới mắc chỉ tính các ca mới xuất hiện trong một khoảng thời gian.',
    source: {
      doc: GT_DT,
      page: 58,
      excerpt: 'Tỷ lệ mới mắc chỉ tính các ca mới xuất hiện trong một khoảng thời gian.',
    },
    topicId: 'dt-3',
    domain: 'Dịch tễ học',
    competency: '2.3.2',
    bloom: 'Nhớ',
    difficulty: 'Dễ',
    aiAssisted: true,
  },
  {
    id: 'q-hbv-birth',
    stem: 'Liều vắc xin viêm gan B sơ sinh được tiêm trong khoảng thời gian nào?',
    options: [
      { id: 'A', text: 'Trong vòng 24 giờ đầu sau sinh' },
      { id: 'B', text: 'Trong tuần đầu sau sinh' },
      { id: 'C', text: 'Khi trẻ đủ 1 tháng tuổi' },
      { id: 'D', text: 'Khi trẻ đủ 2 tháng tuổi' },
    ],
    correctId: 'A',
    explanation: 'Trẻ sơ sinh được tiêm liều vắc xin viêm gan B trong vòng 24 giờ đầu sau sinh.',
    source: { doc: 'Hướng dẫn thực hành tiêm chủng', page: 112 },
    topicId: 'tc-1',
    domain: 'Tiêm chủng',
    competency: '4.1.2',
    bloom: 'Nhớ',
    difficulty: 'Dễ',
  },
  {
    id: 'q-or',
    stem: 'Tỷ số chênh (OR) thường được dùng làm số đo kết hợp trong thiết kế nào?',
    options: [
      { id: 'A', text: 'Nghiên cứu bệnh – chứng' },
      { id: 'B', text: 'Nghiên cứu sinh thái' },
      { id: 'C', text: 'Mô tả loạt ca bệnh' },
      { id: 'D', text: 'Nghiên cứu cắt ngang lặp lại' },
    ],
    correctId: 'A',
    explanation: 'Trong nghiên cứu bệnh – chứng không tính được nguy cơ, nên dùng tỷ số chênh để ước lượng nguy cơ tương đối.',
    source: { doc: GT_DT, page: 71 },
    topicId: 'dt-2',
    domain: 'Dịch tễ học',
    competency: '2.2.3',
    bloom: 'Hiểu',
    difficulty: 'Trung bình',
  },
  {
    id: 'q-attack-rate',
    stem: 'Tỷ lệ tấn công thường được dùng trong tình huống nào?',
    options: [
      { id: 'A', text: 'Khi điều tra một vụ dịch ngắn ngày' },
      { id: 'B', text: 'Khi theo dõi bệnh mạn tính nhiều năm' },
      { id: 'C', text: 'Khi so sánh tử vong giữa các tỉnh' },
      { id: 'D', text: 'Khi ước lượng cỡ mẫu' },
    ],
    correctId: 'A',
    explanation: 'Tỷ lệ tấn công là tỷ lệ mới mắc tính trong thời gian ngắn của một vụ dịch.',
    source: { doc: GT_DT, page: 60 },
    topicId: 'dt-5',
    domain: 'Dịch tễ học',
    competency: '2.5.1',
    bloom: 'Hiểu',
    difficulty: 'Dễ',
  },
];

export const questionById = (id: string) => questions.find((q) => q.id === id)!;

// Bài đánh giá năng lực đầu vào: 21 câu thật sự, ở đây lấy vòng từ pool mẫu.
export const assessmentQuestions = questions;

export const decks: Deck[] = [
  {
    id: 'dich-te',
    name: 'Dịch tễ học cơ bản',
    newCount: 2,
    learning: 1,
    due: 5,
    children: [
      { id: 'dt-1', name: 'Chủ đề 1 · Khái niệm', newCount: 0, learning: 0, due: 2 },
      { id: 'dt-2', name: 'Chủ đề 2 · Thiết kế nghiên cứu', newCount: 0, learning: 1, due: 2 },
      { id: 'dt-3', name: 'Chủ đề 3 · Đo lường bệnh trạng', newCount: 2, learning: 0, due: 1 },
    ],
  },
  { id: 'tiem-chung', name: 'Tiêm chủng mở rộng', newCount: 0, learning: 1, due: 3 },
  { id: 'hard', name: 'Thẻ khó nhớ', newCount: 0, learning: 0, due: 2 },
];

export const flashcards: Flashcard[] = [
  {
    id: 'c1',
    front: 'Mẫu số của tỷ lệ hiện mắc là gì?',
    back: 'Toàn bộ quần thể tại thời điểm quan sát — gồm cả những người đang mắc bệnh.',
    source: { doc: GT_DT, page: 58 },
    deck: 'dich-te',
    topic: 'Dịch tễ học · Chủ đề 3',
    state: 'review',
    dueLabel: 'Quá hạn 1 ngày',
    dueToday: true,
    origin: 'Từ quiz học phần',
    reason: 'bạn bỏ sót ý “mẫu số khác nhau” ở câu tự luận ngày 08/10.',
  },
  {
    id: 'c2',
    front: 'Mẫu số của tỷ lệ mới mắc là gì?',
    back: 'Quần thể có nguy cơ trong khoảng thời gian theo dõi.',
    source: { doc: GT_DT, page: 58 },
    deck: 'dich-te',
    topic: 'Dịch tễ học · Chủ đề 3',
    state: 'new',
    dueLabel: 'Đến hạn hôm nay',
    dueToday: true,
    origin: 'Từ đề thi thử',
    reason: 'Gia sư tạo từ Đề thi thử số 4.',
  },
  {
    id: 'c3',
    front: 'Tỷ lệ hiện mắc = số người đang mắc ÷ …?',
    back: 'Tổng số người trong quần thể tại cùng thời điểm.',
    source: { doc: GT_DT, page: 58 },
    deck: 'dich-te',
    topic: 'Chủ đề 3',
    state: 'review',
    dueLabel: 'Sau 2 ngày',
    dueToday: false,
    origin: 'Từ quiz học phần',
  },
  {
    id: 'c4',
    front: 'Liều VGB sơ sinh: trong vòng […] giờ đầu sau sinh',
    back: '24 giờ.',
    source: { doc: 'Hướng dẫn thực hành tiêm chủng', page: 112 },
    deck: 'tiem-chung',
    topic: 'Tiêm chủng',
    state: 'learning',
    dueLabel: 'Đến hạn hôm nay',
    dueToday: true,
    origin: 'Từ bài đánh giá',
  },
  {
    id: 'c5',
    front: 'Phân biệt tỷ suất và tỷ lệ',
    back: 'Tỷ suất có yếu tố thời gian ở mẫu số (người-thời gian); tỷ lệ là phân số tại một thời điểm hoặc trong một giai đoạn.',
    source: { doc: GT_DT, page: 57 },
    deck: 'dich-te',
    topic: 'Chủ đề 2',
    state: 'review',
    dueLabel: 'Đến hạn hôm nay',
    dueToday: true,
    origin: 'Từ quiz học phần',
    lapses: 6,
  },
  {
    id: 'c6',
    front: 'Nghiên cứu cắt ngang ước lượng chỉ số nào?',
    back: 'Tỷ lệ hiện mắc.',
    source: { doc: GT_DT, page: 64 },
    deck: 'dich-te',
    topic: 'Chủ đề 2',
    state: 'review',
    dueLabel: 'Sau 6 ngày',
    dueToday: false,
    origin: 'Từ đề thi thử',
  },
  {
    id: 'c7',
    front: 'Tỷ lệ tấn công dùng trong tình huống nào?',
    back: 'Điều tra vụ dịch trong thời gian ngắn.',
    source: { doc: GT_DT, page: 60 },
    deck: 'dich-te',
    topic: 'Chủ đề 3',
    state: 'new',
    dueLabel: 'Mới',
    dueToday: false,
    origin: 'Từ quiz học phần',
  },
  {
    id: 'c8',
    front: 'Tỷ số chênh (OR) dùng trong thiết kế nào?',
    back: 'Nghiên cứu bệnh – chứng.',
    source: { doc: GT_DT, page: 71 },
    deck: 'dich-te',
    topic: 'Chủ đề 2',
    state: 'review',
    dueLabel: 'Tạm ẩn',
    dueToday: false,
    origin: 'Từ quiz học phần',
    suspended: true,
  },
];

export const exams: Exam[] = [
  { id: 'de-5', name: 'Đề thi thử số 5', questionCount: 40, minutes: 50, attemptsLeft: 2, isNew: true },
  {
    id: 'de-4',
    name: 'Đề thi thử số 4',
    questionCount: 40,
    minutes: 50,
    attemptsLeft: 1,
    lastResult: { date: '06/10', correct: 33 },
  },
];

export const placementTest = { questionCount: 21, minutes: 25 };

export const conversations: Conversation[] = [
  { id: 'conv-1', title: 'Liều vắc xin viêm gan B sơ sinh', when: 'Hôm nay' },
  { id: 'conv-2', title: 'Phân biệt tỷ lệ hiện mắc và mới mắc', when: 'Hôm qua' },
  { id: 'conv-3', title: 'Các bước điều tra một vụ dịch', when: '05/10' },
];

// ---------- Phân tích học tập (học viên) ----------
export const progressData = {
  coverage: { done: 28, total: 54 },
  coverageByModule: [
    { name: 'Dịch tễ học cơ bản', value: 3 / 8, label: '3/8 chủ đề' },
    { name: 'Thống kê y sinh', value: 2 / 5, label: '2/5 chủ đề' },
    { name: 'Tiêm chủng mở rộng', value: 1 / 6, label: '1/6 chủ đề' },
  ],
  priorities: [
    { name: 'Thống kê y sinh', detail: '6/12 câu đúng · yếu nhất: Cỡ mẫu' },
    { name: 'Dinh dưỡng', detail: '9/15 câu đúng · yếu nhất: Suy dinh dưỡng trẻ em' },
    { name: 'Sức khỏe môi trường', detail: '14/18 câu đúng · yếu nhất: Nước sạch và vệ sinh' },
  ],
  examScores: [
    { label: '19/09', value: 29 },
    { label: '28/09', value: 31 },
    { label: '06/10', value: 33 },
  ],
  domainMatrix: [
    { domain: 'Thống kê y sinh', cells: ['2/4', '2/4', '2/4'], total: '6/12', ratio: 0.5, sub: [['Cỡ mẫu', '1/4'], ['Kiểm định giả thuyết', '2/4'], ['Thống kê mô tả', '3/4']] },
    { domain: 'Dinh dưỡng', cells: ['3/5', '3/5', '3/5'], total: '9/15', ratio: 0.6 },
    { domain: 'Sức khỏe môi trường', cells: ['4/6', '5/6', '5/6'], total: '14/18', ratio: 0.78 },
    { domain: 'Dịch tễ học', cells: ['6/8', '6/8', '7/8'], total: '19/24', ratio: 0.79 },
    { domain: 'Bệnh truyền nhiễm', cells: ['5/7', '6/7', '6/7'], total: '17/21', ratio: 0.81 },
    { domain: 'Tiêm chủng', cells: ['4/5', '4/5', '5/5'], total: '13/15', ratio: 0.87 },
    { domain: 'Sức khỏe nghề nghiệp', cells: ['5/5', '5/5', '5/5'], total: '15/15', ratio: 1 },
  ],
  bloom: [
    { name: 'Nhớ', value: 36, total: 40 },
    { name: 'Hiểu', value: 38, total: 48 },
    { name: 'Vận dụng', value: 19, total: 32 },
  ],
  rhythm: {
    weekTime: '3 g 20 ph',
    lastWeek: '2 g 45 ph',
    activeDays: '5 / 6',
    // 8 tuần x 7 ngày, mức 0..4
    heatmap: [
      [0, 2, 1, 0, 1, 0, 0],
      [1, 1, 2, 0, 1, 0, 0],
      [1, 2, 0, 1, 0, 1, 0],
      [0, 1, 1, 0, 2, 3, 0],
      [0, 1, 0, 2, 1, 1, 0],
      [2, 1, 3, 0, 2, 1, 0],
      [1, 2, 3, 1, 0, 1, 0],
      [1, 1, 2, 1, 2, 3, 0],
    ],
    weeks: ['17/8', '24/8', '31/8', '7/9', '14/9', '21/9', '28/9', '5/10'],
    retention: 0.86,
    cardStates: { new: 18, learning: 24, mastered: 62 },
    retentionByModule: [
      { name: 'Dịch tễ học cơ bản', now: 0.93, later: 0.85 },
      { name: 'Tiêm chủng mở rộng', now: 0.88, later: 0.78 },
      { name: 'Thống kê y sinh', now: 0.74, later: 0.58 },
    ],
    dueNext7: [
      { label: 'Nay', value: 12 },
      { label: 'CN', value: 5 },
      { label: 'T2', value: 9 },
      { label: 'T3', value: 3 },
      { label: 'T4', value: 7 },
      { label: 'T5', value: 4 },
      { label: 'T6', value: 6 },
    ],
    activity: [
      { kind: 'Học phần', title: 'Dịch tễ học · Chủ đề 3', when: 'Thứ sáu 9/10 · 14 phút', result: 'Hoàn thành' },
      { kind: 'Luyện tập', title: 'Luyện điểm yếu: mẫu số', when: 'Thứ sáu 9/10 · 8 phút', result: '4/6' },
      { kind: 'Hỏi đáp', title: 'Liều vắc xin viêm gan B sơ sinh', when: 'Thứ năm 8/10', result: '' },
      { kind: 'Thẻ ôn', title: 'Ôn 23 thẻ', when: 'Thứ tư 7/10 · 11 phút', result: '20/23' },
      { kind: 'Thi thử', title: 'Đề thi thử số 4', when: 'Thứ ba 6/10 · 48 phút', result: '33/40' },
    ],
  },
};

// ---------- Chuyên gia kiểm duyệt ----------
export const reviewQueue: ReviewItem[] = [
  {
    id: 'DT-0123',
    question: questions[2],
    round: 1,
    tags: ['Mã năng lực 2.3.1', 'Vấn đề cốt lõi 12', 'Bloom: Hiểu', 'Độ khó: Trung bình'],
    provenance: 'Nháp: AI hỗ trợ theo ma trận đề · Hoàn thiện: BS. Phạm Quang Huy · Phiên bản 2 · Lọc sơ bộ: giữ lại',
  },
  {
    id: 'DT-0124',
    question: questions[4],
    round: 1,
    tags: ['Mã năng lực 2.3.2', 'Vấn đề cốt lõi 12', 'Bloom: Nhớ', 'Độ khó: Dễ'],
    provenance: 'Nháp: AI hỗ trợ theo ma trận đề · Phiên bản 1 · Lọc sơ bộ: giữ lại',
  },
  {
    id: 'DT-0125',
    question: questions[6],
    round: 1,
    tags: ['Mã năng lực 2.2.3', 'Vấn đề cốt lõi 7', 'Bloom: Hiểu', 'Độ khó: Trung bình'],
    provenance: 'Soạn: BS. Nguyễn Minh Anh · Phiên bản 1',
  },
  {
    id: 'TC-0041',
    question: questions[5],
    round: 2,
    tags: ['Mã năng lực 4.1.2', 'Vấn đề cốt lõi 9', 'Bloom: Nhớ', 'Độ khó: Dễ'],
    provenance: 'Soạn: BS. Trần Thu Trang · Đạt vòng 1 · Phiên bản 3',
  },
];

export const learnerReports = [
  { id: 'r1', code: 'DT-0098', text: 'Đáp án C và D gần như giống nhau.', when: 'Hôm nay', by: 'Học viên CSĐT B' },
  { id: 'r2', code: 'TC-0017', text: 'Trích dẫn trang 27 không khớp nội dung.', when: 'Hôm qua', by: 'Học viên CSĐT A' },
  { id: 'r3', code: 'TK-0052', text: 'Đề bài thiếu dữ kiện cỡ mẫu.', when: '08/10', by: 'Học viên CSĐT D' },
];

export const coverageMatrix = {
  blooms: ['Nhớ', 'Hiểu', 'Vận dụng'],
  rows: [
    { domain: 'Dịch tễ học', counts: [42, 51, 38], target: 120 },
    { domain: 'Thống kê y sinh', counts: [18, 22, 12], target: 90 },
    { domain: 'Tiêm chủng', counts: [35, 28, 14], target: 80 },
    { domain: 'Sức khỏe môi trường', counts: [24, 20, 11], target: 80 },
    { domain: 'Dinh dưỡng', counts: [22, 19, 9], target: 70 },
    { domain: 'Bệnh truyền nhiễm', counts: [40, 36, 21], target: 110 },
    { domain: 'Sức khỏe nghề nghiệp', counts: [16, 15, 8], target: 60 },
  ],
};

export const library = [
  { id: 'l1', name: 'Giáo trình Dịch tễ học', pages: 312, status: 'Còn hiệu lực', license: 'Trích đoạn giới hạn' },
  { id: 'l2', name: 'Hướng dẫn thực hành tiêm chủng', pages: 186, status: 'Còn hiệu lực', license: 'Toàn văn' },
  { id: 'l3', name: 'Lịch tiêm chủng thường xuyên', pages: 40, status: 'Còn hiệu lực', license: 'Toàn văn' },
  { id: 'l4', name: 'Giáo trình Thống kê y sinh', pages: 248, status: 'Chờ cập nhật bản 2026', license: 'Trích đoạn giới hạn' },
];

// ---------- Quản lý cấp Bộ ----------
export const ministry = {
  period: 'Tháng 9/2026',
  kpis: [
    { label: 'Học viên hoạt động trong tháng', value: '3.412', note: '+9% so với tháng 8 · 69% số tài khoản đã cấp' },
    { label: 'Tài khoản đã kích hoạt', value: '3.663', note: '74% của 4.950 tài khoản đã cấp' },
    { label: 'Câu luyện tập đã làm', value: '186.400', note: 'Trung bình 55 câu mỗi học viên hoạt động' },
    { label: 'Lượt thi thử', value: '5.870', note: 'Trung vị 27/40 câu đúng' },
    { label: 'Câu trả lời AI có trích dẫn', value: '97,2%', note: 'Mục tiêu ≥ 95% (NFR-07)' },
  ],
  weeklyActive: [820, 980, 1150, 1320, 1480, 1630, 1790, 1950, 2110, 2280, 2430, 2630],
  weeklyLabels: ['20/7', '27/7', '3/8', '10/8', '17/8', '24/8', '31/8', '7/9', '14/9', '21/9', '28/9', '5/10'],
  alerts: [
    { title: 'CSĐT E: mới 41% tài khoản được kích hoạt', detail: '357 / 872 tài khoản sau 7 tuần · các cơ sở khác 74–97%' },
    { title: 'Duyệt vòng 2 chậm: trung vị 9 ngày', detail: 'Mục tiêu 7 ngày · 142 câu đang chờ' },
    { title: '6 báo lỗi của học viên quá 14 ngày chưa xử lý', detail: '4 về câu hỏi Thống kê y sinh; 2 về câu trả lời AI' },
    { title: 'Khôi phục thử bản sao lưu đến hạn ngày 12/10', detail: 'Lần gần nhất 12/09 · định kỳ 30 ngày' },
  ],
  domainAccuracy: [
    { name: 'Thống kê y sinh', value: 0.53 },
    { name: 'Dinh dưỡng', value: 0.58 },
    { name: 'Sức khỏe môi trường', value: 0.64 },
    { name: 'Dịch tễ học', value: 0.69 },
    { name: 'Bệnh truyền nhiễm', value: 0.71 },
    { name: 'Tiêm chủng', value: 0.76 },
    { name: 'Sức khỏe nghề nghiệp', value: 0.8 },
  ],
  bank: { approved: 1240, reviewing: 386, draft: 612, rejected: 97 },
  bankStats: [
    ['Vấn đề cốt lõi có ≥ 10 câu đã duyệt', '48 / 54'],
    ['Duyệt vòng 1 (trung vị)', '4 ngày'],
    ['Duyệt vòng 2 (trung vị)', '9 ngày · mục tiêu 7'],
    ['Hai vòng cùng kết luận', '86%'],
    ['Báo lỗi từ học viên tháng 9', '41 · đã xử lý 35'],
  ],
  aiSafety: [
    ['Không khẳng định nào thiếu trích dẫn', '97,2%'],
    ['Từ chối vì thiếu nguồn', '3,1%'],
    ['Từ chối tư vấn ca bệnh cụ thể', '0,4%'],
    ['Bị báo kiểm tra trích dẫn sai', '1,2%'],
    ['Báo lỗi trên 1.000 câu trả lời', '1,8'],
  ],
  institutions: [
    { name: 'CSĐT A', region: 'Miền Bắc', accounts: 1250, activated: 1090, rate: 0.87, active: 812, exams: 1720, median: '28/40', delta: '+4 câu' },
    { name: 'CSĐT B', region: 'Miền Nam', accounts: 1180, activated: 960, rate: 0.81, active: 701, exams: 1480, median: '27/40', delta: '+3 câu' },
    { name: 'CSĐT C', region: 'Miền Bắc', accounts: 880, activated: 690, rate: 0.78, active: 498, exams: 1040, median: '27/40', delta: '+3 câu' },
    { name: 'CSĐT D', region: 'Miền Trung', accounts: 760, activated: 560, rate: 0.74, active: 402, exams: 860, median: '26/40', delta: '+2 câu' },
    { name: 'CSĐT E', region: 'Miền Nam', accounts: 872, activated: 357, rate: 0.41, active: 214, exams: 762, median: '25/40', delta: '+2 câu' },
  ],
  operations: [
    ['Thời gian hoạt động', '99,4% · Đạt ≥ 99%'],
    ['Độ trễ một lượt trả lời (P95)', '11,8 giây · Đạt ≤ 15 giây'],
    ['Sự cố trong tháng', '2 · đã khắc phục'],
    ['Sao lưu gần nhất', '02:00, 10/10 · khôi phục thử 12/10'],
    ['Đồng ý dùng dữ liệu cho nghiên cứu', '2.184 học viên · 64%'],
    ['Rút đồng ý / yêu cầu xoá dữ liệu', '14 / 3 · xử lý trung vị 2 ngày'],
  ],
  targets: [
    { name: 'Trang giáo trình đã số hoá', value: 1860, total: 2000 },
    { name: 'Đoạn học liệu đã siêu dữ liệu', value: 4720, total: 5000 },
    { name: 'Thuật ngữ đã được chuyên gia duyệt', value: 1420, total: 1500 },
    { name: 'Bản ghi bằng tri thức có câu trả lời', value: 1150, total: 1500 },
    { name: 'Vấn đề cốt lõi có ≥ 10 câu đã duyệt', value: 48, total: 54 },
  ],
  results: {
    kpis: [
      { label: 'Học viên có kết quả', value: '2.184', note: 'Đã đồng ý dùng dữ liệu cho nghiên cứu · 64% học viên hoạt động' },
      { label: 'Lượt thi thử được tính', value: '5.870', note: 'Trung bình 2,7 lượt mỗi học viên' },
      { label: 'Trung vị điểm thi thử', value: '27 / 40', note: 'Tháng 8: 26 / 40' },
      { label: 'Thay đổi từ đề đầu đến gần nhất', value: '+3 câu', note: 'Trung vị của học viên đã làm từ 2 đề trở lên' },
    ],
    distribution: [
      { label: '0–3', value: 12 }, { label: '4–7', value: 36 }, { label: '8–11', value: 96 },
      { label: '12–15', value: 240 }, { label: '16–19', value: 612 }, { label: '20–23', value: 1104 },
      { label: '24–27', value: 1496, highlight: true }, { label: '28–31', value: 1342 },
      { label: '32–35', value: 752 }, { label: '36–40', value: 180 },
    ],
    bloom: [
      { name: 'Nhớ', value: 0.78, detail: '62.300 câu trả lời' },
      { name: 'Hiểu', value: 0.66, detail: '51.800 câu trả lời' },
      { name: 'Vận dụng', value: 0.49, detail: '30.700 câu trả lời' },
    ],
    institutions: ['CSĐT A', 'CSĐT B', 'CSĐT C', 'CSĐT D', 'CSĐT E', 'Toàn quốc'],
    heat: [
      { domain: 'Thống kê y sinh', values: [56, 53, 50, 49, 45, 53] },
      { domain: 'Dinh dưỡng', values: [61, 60, 57, 55, 52, 58] },
      { domain: 'Sức khỏe môi trường', values: [67, 66, 63, 60, 58, 64] },
      { domain: 'Dịch tễ học', values: [73, 70, 68, 66, 62, 69] },
      { domain: 'Bệnh truyền nhiễm', values: [74, 72, 71, 69, 64, 71] },
      { domain: 'Tiêm chủng', values: [79, 77, 75, 74, 70, 76] },
      { domain: 'Sức khỏe nghề nghiệp', values: [83, 81, 79, 78, 74, 80] },
    ],
    weakest: [
      ['Cỡ mẫu và lực mẫu', 'Thống kê y sinh', 41, '3.920', '+2 điểm %'],
      ['Kiểm định giả thuyết', 'Thống kê y sinh', 47, '4.110', '+1 điểm %'],
      ['Đánh giá tình trạng dinh dưỡng', 'Dinh dưỡng', 51, '3.240', '−1 điểm %'],
      ['Đo lường bệnh trạng', 'Dịch tễ học', 53, '6.880', '+4 điểm %'],
      ['Quản lý chất thải y tế', 'Sức khỏe môi trường', 55, '2.150', '0 điểm %'],
      ['An toàn thực phẩm', 'Dinh dưỡng', 56, '2.870', '+3 điểm %'],
      ['Thiết kế nghiên cứu', 'Dịch tễ học', 57, '5.420', '+2 điểm %'],
      ['Ô nhiễm không khí', 'Sức khỏe môi trường', 58, '1.990', '−2 điểm %'],
      ['Bảo quản và vận chuyển vắc xin', 'Tiêm chủng', 60, '2.630', '+1 điểm %'],
      ['Điều tra vụ dịch', 'Dịch tễ học', 61, '4.010', '+3 điểm %'],
    ] as [string, string, number, string, string][],
  },
};
