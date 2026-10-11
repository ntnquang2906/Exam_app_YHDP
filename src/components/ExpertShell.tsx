import { ReactNode } from 'react';
import { learnerReports } from '../data/mock';
import { Shell } from './Shell';

export function ExpertShell({ children }: { children: ReactNode }) {
  return (
    <Shell
      title="Không gian duyệt"
      subtitle="Chuyên gia kiểm duyệt"
      user={{ name: 'BS. Phạm Quang Huy', role: 'Chuyên gia · Dịch tễ học' }}
      nav={[
        { href: '/expert', label: 'Hàng đợi duyệt', badge: '18' },
        { href: '/expert/reports', label: 'Báo lỗi từ học viên', badge: String(learnerReports.length) },
        { href: '/expert/coverage', label: 'Ma trận bao phủ' },
        { href: '/expert/library', label: 'Thư viện học liệu' },
      ]}
    >
      {children}
    </Shell>
  );
}
