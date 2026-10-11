# Ôn thi năng lực hành nghề — Bác sĩ Y học dự phòng

Ứng dụng học viên (iOS, Android, Web) + không gian chuyên gia kiểm duyệt + dashboard cấp Bộ,
dựng từ bản thiết kế `YHDP_UI_UX_Mockup.pdf`. Một codebase **Expo (React Native) + TypeScript + Expo Router**.

> Giai đoạn hiện tại: **giao diện đầy đủ, chuyển trang và tương tác được, dùng dữ liệu mẫu**.
> Chưa có backend, chưa có logic AI; khung chat đã sẵn sàng để nối gia sư RAG.

## Chạy thử

Yêu cầu: Node.js 20+.

```bash
npm install
npx expo start          # quét QR bằng Expo Go trên điện thoại, hoặc bấm w để mở web
npm run web             # chỉ chạy web
npm run typecheck       # kiểm tra kiểu TypeScript
```

Lần đầu chạy nên kiểm tra phiên bản thư viện khớp SDK:

```bash
npx expo install --fix
npx expo-doctor
```

### Vào theo vai trò (bản demo)

- **Học viên**: nhập mã kích hoạt bất kỳ (≥ 4 ký tự), ví dụ `YHDP-7K2M-Q9`.
- **Chuyên gia kiểm duyệt / Quản lý cấp Bộ**: dùng hai nút ở cuối màn đăng nhập. Hai khu vực này thiết kế cho màn hình máy tính (web); trên điện thoại menu chuyển thành thanh cuộn ngang.

## Bản đồ màn hình

| Nhóm (theo PDF) | Route | Ghi chú |
|---|---|---|
| Đăng nhập | `/login` | Mã kích hoạt |
| Chọn học phần | `/onboarding` | |
| **Đánh giá năng lực → cá nhân hoá lộ trình** | `/assessment` | Giới thiệu → làm bài → gia sư xếp lộ trình → kết quả theo miền + lộ trình đề xuất |
| Trang chủ | `/home` (tab) | |
| Hỏi đáp | `/chat` (tab) | Màn hình rộng ≥ 900px tự chuyển bố cục 3 cột (R1.1) |
| Luyện tập | `/practice` (tab), `/module/[moduleId]` | |
| Thi thử | `/exams` (tab), `/exam/[examId]` → `take` → `result` → `review`, `/exam/history` | Đồng hồ đếm ngược, đánh dấu câu, danh sách câu, tự nộp khi hết giờ |
| Tiến độ | `/progress` (tab) | Hai tab Năng lực / Nhịp học |
| Phiên học hôm nay | `/session` | Thẻ ôn → Luyện điểm yếu → Gia sư điều chỉnh → Học tiếp |
| Học tiếp chủ đề | `/learn/[topicId]` | Bài học + kiểm tra nhanh |
| Tổng quan chủ đề (R1.1) | `/topic/[topicId]` | |
| Bộ thẻ, Ôn thẻ | `/flashcards`, `/flashcards/review` | |
| Duyệt thẻ, Cài đặt ôn tập (R1.1) | `/flashcards/browse`, `/flashcards/settings` | |
| Lịch ôn tập (R1.1) + Đề xuất lịch học (R2) | `/schedule` | |
| Hỏi gia sư từ câu quiz | `/tutor` | |
| Tự luận ngắn (R1.1) | `/essay` | |
| Câu hỏi có AI hỗ trợ (R2) | `/ai-question` | |
| Xem nguồn trích dẫn, Báo lỗi | `/source`, `/report` | Dạng modal |
| Bàn thẩm định | `/expert`, `/expert/reports`, `/expert/coverage`, `/expert/library` | |
| Tổng quan toàn quốc | `/admin` | |
| Kết quả học tập (R2) | `/admin/results` | |
| Các mục khác cấp Bộ | `/admin/[section]` | access, content, ai-safety, operations, targets, reports |

## Cấu trúc thư mục

```
src/
  app/            Route (mỗi file là một màn hình — Expo Router)
  components/     UI dùng chung: ui.tsx, charts.tsx, QuestionCard, ChatPanel, FlashcardView, Shell…
  data/
    types.ts      Mô hình dữ liệu miền — backend trả về đúng các kiểu này
    mock.ts       DỮ LIỆU MẪU — xoá khi nối backend
  services/api.ts Lớp truy cập dữ liệu (hiện trả mock). Chỗ duy nhất cần sửa để nối API thật
  store/          Trạng thái phía client (zustand)
  lib/            Tiện ích
  theme.ts        Màu, cỡ chữ, khoảng cách theo bản mock
```

## Nối backend — các điểm cần làm

Mọi hàm trong `src/services/api.ts` đã có chữ ký và comment `TODO backend` ghi endpoint gợi ý:

| Hàm | Việc backend làm |
|---|---|
| `authApi.activate` | Xác thực mã kích hoạt, trả token + hồ sơ học viên |
| `learningApi.weakPracticeQuestions` | Động cơ thích ứng chọn câu luyện điểm yếu (kèm `why`) |
| `learningApi.assessmentQuestions` | Bài đánh giá đầu vào (có thể thích ứng theo câu trước) |
| `cardsApi.grade` | Cập nhật lịch ôn theo FSRS |
| `examApi.*` | Đề thi, tự lưu từng câu, nộp bài, chấm |
| `chatApi.send` | Gia sư RAG: stream câu trả lời + danh sách trích dẫn (`SourceRef`) |
| `reviewApi.decide` | Ghi quyết định thẩm định 2 vòng |

Biến môi trường: `EXPO_PUBLIC_API_URL` (xem `.env.example`).

Hiện màn hình Tiến độ, dashboard Bộ đọc thẳng `data/mock.ts` cho gọn — khi có API, chuyển sang gọi qua `services/api.ts` tương tự các màn khác.

## Phát hành

- iOS/Android: dùng EAS (`npx eas-cli@latest build`, `eas submit`). Bundle id đặt sẵn `vn.edu.yhdp.app` trong `app.json` — đổi theo tài khoản developer của đơn vị chủ quản.
- Web: `npm run build:web` → thư mục `dist/` (static, chế độ SPA) — đặt sau Nginx, mọi đường dẫn trỏ về `index.html`.
- Trước khi nộp App Store: thêm chức năng **xoá tài khoản** trong app, chuẩn bị **mã kích hoạt demo** cho người duyệt của Apple, thay icon/splash trong `assets/`.
