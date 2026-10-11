import { ReactNode } from 'react';
import { Shell } from './Shell';

export const ADMIN_SECTIONS = [
  { href: '/admin', label: 'Tổng quan' },
  { href: '/admin/access', label: 'Tiếp cận và sử dụng' },
  { href: '/admin/results', label: 'Kết quả học tập' },
  { href: '/admin/content', label: 'Nội dung và thẩm định' },
  { href: '/admin/ai-safety', label: 'An toàn câu trả lời AI' },
  { href: '/admin/operations', label: 'Vận hành và tuân thủ' },
  { href: '/admin/targets', label: 'Chỉ tiêu nhiệm vụ' },
  { href: '/admin/reports', label: 'Báo cáo và xuất dữ liệu' },
];

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <Shell
      title="Ôn thi năng lực Y học dự phòng"
      subtitle="Quản lý cấp Bộ · chỉ xem"
      user={{ name: 'Phạm Thị Lan', role: 'Quản lý cấp Bộ' }}
      nav={ADMIN_SECTIONS}
    >
      {children}
    </Shell>
  );
}
