import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { ADMIN_SECTIONS, AdminShell } from '../../components/AdminShell';
import { AiSafety, Alerts, InstitutionTable, KeyValues, Operations, QuestionBank, Targets, WeeklyActive } from '../../components/adminBlocks';
import { Kpi, PageHeader } from '../../components/Shell';
import { Badge, Button, Card, Notice, Row, Small } from '../../components/ui';
import { ministry as M } from '../../data/mock';
import { colors, font, space } from '../../theme';

// Các trang chi tiết cấp Bộ dùng chung khối dữ liệu với trang Tổng quan.
export default function MinistrySection() {
  const { section } = useLocalSearchParams<{ section: string }>();
  const meta = ADMIN_SECTIONS.find((s) => s.href === `/admin/${section}`);
  const row = { flexDirection: 'row' as const, flexWrap: 'wrap' as const, gap: space.lg, marginBottom: space.lg };

  return (
    <AdminShell>
      <PageHeader title={meta?.label ?? 'Không tìm thấy trang'} badge="Dữ liệu mẫu" subtitle={`${M.period} · nhóm dưới 10 học viên được ẩn`} />
      {section === 'access' && (
        <>
          <View style={row}>
            {M.kpis.slice(0, 3).map((k) => (
              <Kpi key={k.label} {...k} />
            ))}
          </View>
          <View style={{ marginBottom: space.lg }}>
            <WeeklyActive />
          </View>
          <InstitutionTable />
        </>
      )}
      {section === 'content' && (
        <View style={row}>
          <View style={{ flexGrow: 1, flexBasis: 360 }}>
            <QuestionBank />
          </View>
          <View style={{ flexGrow: 1, flexBasis: 360 }}>
            <Alerts />
          </View>
        </View>
      )}
      {section === 'ai-safety' && (
        <View style={row}>
          <View style={{ flexGrow: 1, flexBasis: 360 }}>
            <AiSafety />
          </View>
          <Card style={{ flexGrow: 1, flexBasis: 360, gap: space.sm }}>
            <Text style={font.h3}>Nguyên tắc vận hành gia sư AI</Text>
            <KeyValues
              rows={[
                ['Mọi khẳng định phải có trích dẫn trang giáo trình', 'Bắt buộc'],
                ['Không đủ nguồn → từ chối trả lời', 'Bắt buộc'],
                ['Không tư vấn ca bệnh cụ thể', 'Bắt buộc'],
                ['Câu hỏi do AI tạo chưa duyệt không tính điểm', 'Bắt buộc'],
                ['Đánh giá độ chính xác bởi chuyên gia', 'Mỗi 4 tuần'],
              ]}
            />
          </Card>
        </View>
      )}
      {section === 'operations' && (
        <View style={row}>
          <View style={{ flexGrow: 1, flexBasis: 420 }}>
            <Operations />
          </View>
          <View style={{ flexGrow: 1, flexBasis: 300 }}>
            <Notice>Khôi phục thử bản sao lưu đến hạn ngày 12/10 · lần gần nhất 12/09 · định kỳ 30 ngày.</Notice>
          </View>
        </View>
      )}
      {section === 'targets' && <Targets />}
      {section === 'reports' && <Exports />}
      {!meta ? <Small>Trang này không tồn tại.</Small> : null}
    </AdminShell>
  );
}

function Exports() {
  const [queued, setQueued] = useState<string[]>([]);
  const items = [
    ['Báo cáo tháng 9/2026 (PDF)', 'Tổng quan, tiếp cận, kết quả, nội dung, an toàn AI, vận hành'],
    ['Số liệu theo cơ sở đào tạo (Excel)', 'Kích hoạt, hoạt động, thi thử, theo tháng'],
    ['Kết quả học tập theo miền (Excel)', 'Chỉ học viên đồng ý dùng dữ liệu · đã ẩn nhóm dưới 10'],
    ['Nhật ký kiểm duyệt câu hỏi (Excel)', 'Quyết định hai vòng, thời gian xử lý'],
  ];
  return (
    <View style={{ gap: space.md }}>
      {items.map(([name, desc]) => (
        <Card key={name}>
          <Row style={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <View style={{ flex: 1, minWidth: 220 }}>
              <Text style={font.h3}>{name}</Text>
              <Small>{desc}</Small>
            </View>
            {queued.includes(name) ? <Badge text="Đang tạo tệp…" tone="green" /> : <Button small title="Xuất" onPress={() => setQueued([...queued, name])} />}
          </Row>
        </Card>
      ))}
      <Text style={[font.tiny, { color: colors.faint }]}>Tệp sẽ do backend tạo và gửi đường tải về.</Text>
    </View>
  );
}
