import { router } from 'expo-router';
import { View } from 'react-native';
import { AdminShell } from '../../components/AdminShell';
import { AiSafety, Alerts, DomainAccuracy, InstitutionTable, Operations, QuestionBank, Targets, WeeklyActive } from '../../components/adminBlocks';
import { FilterBar, Kpi, PageHeader } from '../../components/Shell';
import { Button } from '../../components/ui';
import { ministry as M } from '../../data/mock';
import { space } from '../../theme';

// Tổng quan toàn quốc
export default function MinistryOverview() {
  const wideRow = { flexDirection: 'row' as const, flexWrap: 'wrap' as const, gap: space.lg, marginBottom: space.lg };
  return (
    <AdminShell>
      <PageHeader
        title="Tổng quan toàn quốc"
        badge="Dữ liệu mẫu"
        subtitle="Tháng 9/2026 · cập nhật 06:00 ngày 10/10/2026 · nhóm dưới 10 học viên được ẩn"
        actions={
          <>
            <Button small variant="secondary" title="Xuất Excel" onPress={() => router.push('/admin/reports')} />
            <Button small title="Báo cáo tháng (PDF)" onPress={() => router.push('/admin/reports')} />
          </>
        }
      />
      <FilterBar items={[['Kỳ', M.period], ['Cơ sở đào tạo', 'Tất cả'], ['Đối tượng', 'Tất cả'], ['Vùng', 'Toàn quốc'], ['Bản phát hành', 'R1']]} />
      <View style={wideRow}>
        {M.kpis.map((k) => (
          <Kpi key={k.label} {...k} />
        ))}
      </View>
      <View style={wideRow}>
        <View style={{ flexGrow: 2, flexBasis: 520 }}>
          <WeeklyActive />
        </View>
        <View style={{ flexGrow: 1, flexBasis: 280 }}>
          <Alerts />
        </View>
      </View>
      <View style={wideRow}>
        <View style={{ flexGrow: 1, flexBasis: 280 }}>
          <DomainAccuracy />
        </View>
        <View style={{ flexGrow: 1, flexBasis: 280 }}>
          <QuestionBank />
        </View>
        <View style={{ flexGrow: 1, flexBasis: 280 }}>
          <AiSafety />
        </View>
      </View>
      <View style={{ marginBottom: space.lg }}>
        <InstitutionTable />
      </View>
      <View style={wideRow}>
        <View style={{ flexGrow: 1, flexBasis: 340 }}>
          <Operations />
        </View>
        <View style={{ flexGrow: 1, flexBasis: 340 }}>
          <Targets />
        </View>
      </View>
    </AdminShell>
  );
}
