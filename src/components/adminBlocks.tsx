// Các khối dùng lại giữa trang Tổng quan và các trang chi tiết cấp Bộ.
import { Feather } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { ministry as M } from '../data/mock';
import { colors, font, radius, space } from '../theme';
import { HBar, LineChart } from './charts';
import { Table } from './Shell';
import { Card, Label, ProgressBar, Row, Small } from './ui';

export function WeeklyActive() {
  return (
    <Card style={{ gap: space.sm }}>
      <Row style={{ justifyContent: 'space-between' }}>
        <Text style={font.h3}>Học viên hoạt động mỗi tuần</Text>
        <Small>12 tuần gần nhất · tất cả cơ sở</Small>
      </Row>
      <LineChart values={M.weeklyActive} labels={M.weeklyLabels} height={180} showPoints={false} />
      <Small>Tăng đều từ khi mở thêm cơ sở đào tạo (tuần 17/8).</Small>
      <Row gap={space.xl} style={{ marginTop: space.sm }}>
        {[
          ['Quay lại sau 1 tuần', '81%'],
          ['Quay lại sau 4 tuần', '62%'],
          ['Quay lại sau 8 tuần', '48%'],
        ].map(([k, v]) => (
          <View key={k}>
            <Text style={font.tiny}>{k}</Text>
            <Text style={{ fontSize: 18, fontWeight: '800' }}>{v}</Text>
          </View>
        ))}
      </Row>
    </Card>
  );
}

export function Alerts() {
  return (
    <Card style={{ gap: space.sm }}>
      <Text style={font.h3}>Cần chú ý</Text>
      {M.alerts.map((a, i) => (
        <Row key={a.title} style={{ alignItems: 'flex-start', paddingVertical: 6 }}>
          <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: i < 3 ? colors.warnSoft : colors.surfaceMuted, alignItems: 'center', justifyContent: 'center' }}>
            <Feather name={i < 3 ? 'alert-circle' : 'info'} size={12} color={i < 3 ? colors.warnText : colors.muted} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: '700', fontSize: 13 }}>{a.title}</Text>
            <Text style={font.tiny}>{a.detail}</Text>
          </View>
        </Row>
      ))}
    </Card>
  );
}

export function DomainAccuracy() {
  return (
    <Card>
      <Text style={[font.h3, { marginBottom: space.md }]}>Câu đúng theo miền</Text>
      {M.domainAccuracy.map((d) => (
        <HBar key={d.name} label={d.name} value={d.value} right={`${Math.round(d.value * 100)}%`} color={d.value < 0.6 ? colors.orange : colors.primary} />
      ))}
      <Small>Màu cam: dưới 60% câu đúng</Small>
    </Card>
  );
}

export function QuestionBank() {
  const b = M.bank;
  const total = b.approved + b.reviewing + b.draft + b.rejected;
  return (
    <Card style={{ gap: space.sm }}>
      <Text style={font.h3}>Ngân hàng câu hỏi</Text>
      <Text>
        <Text style={{ fontSize: 28, fontWeight: '800' }}>{b.approved.toLocaleString('vi-VN')}</Text>
        <Text style={font.small}> câu đã duyệt qua 2 vòng</Text>
      </Text>
      <View style={{ flexDirection: 'row', height: 10, borderRadius: 5, overflow: 'hidden' }}>
        <View style={{ flex: b.approved / total, backgroundColor: colors.primary }} />
        <View style={{ flex: b.reviewing / total, backgroundColor: colors.primaryMid }} />
        <View style={{ flex: b.draft / total, backgroundColor: '#D3EBDC' }} />
        <View style={{ flex: b.rejected / total, backgroundColor: colors.border }} />
      </View>
      <Text style={font.tiny}>
        Đã duyệt {b.approved} · Đang duyệt {b.reviewing} · Nháp {b.draft} · Loại {b.rejected}
      </Text>
      <KeyValues rows={M.bankStats} />
    </Card>
  );
}

export function AiSafety() {
  return (
    <Card style={{ gap: space.sm }}>
      <Text style={font.h3}>An toàn câu trả lời AI</Text>
      <Small>48.200 câu trả lời tháng 9 · mô hình và kho học liệu phiên bản 1.3</Small>
      <KeyValues rows={M.aiSafety} />
      <Small>Đánh giá chuyên gia mỗi 4 tuần (1.000 câu ngẫu nhiên): độ chính xác 96% (tháng 9).</Small>
    </Card>
  );
}

export function InstitutionTable() {
  return (
    <Card>
      <Row style={{ justifyContent: 'space-between', marginBottom: space.sm }}>
        <Text style={font.h3}>Theo cơ sở đào tạo</Text>
        <Small>Điểm là kết quả thi thử, không phải dự đoán</Small>
      </Row>
      <Table
        headers={['Cơ sở', 'Vùng', 'Tài khoản cấp', 'Đã kích hoạt', 'Hoạt động/tháng', 'Lượt thi thử', 'Trung vị điểm', 'Đề đầu → gần nhất']}
        widths={[90, 100, 110, 170, 120, 110, 110, 130]}
        rows={M.institutions.map((r) => [
          r.name,
          r.region,
          r.accounts.toLocaleString('vi-VN'),
          <Row key="a">
            <View style={{ width: 70 }}>
              <ProgressBar value={r.rate} color={r.rate < 0.5 ? colors.orange : colors.primary} />
            </View>
            <Text style={{ fontSize: 12, color: r.rate < 0.5 ? colors.danger : colors.text }}>
              {r.activated} · {Math.round(r.rate * 100)}%
            </Text>
          </Row>,
          String(r.active),
          r.exams.toLocaleString('vi-VN'),
          r.median,
          r.delta,
        ])}
      />
      <Small style={{ marginTop: space.sm }}>CSĐT F (Tây Nguyên, 8 học viên) được ẩn vì dưới 10 học viên; vẫn được tính trong số liệu toàn quốc.</Small>
    </Card>
  );
}

export function Operations() {
  return (
    <Card style={{ gap: space.sm }}>
      <Text style={font.h3}>Vận hành và tuân thủ</Text>
      <KeyValues rows={M.operations} />
    </Card>
  );
}

export function Targets() {
  return (
    <Card style={{ gap: space.sm }}>
      <Row style={{ justifyContent: 'space-between' }}>
        <Text style={font.h3}>Chỉ tiêu theo thuyết minh</Text>
        <Small>Mốc R1: 01/2027</Small>
      </Row>
      {M.targets.map((t) => (
        <HBar key={t.name} label={t.name} value={t.value / t.total} right={`${t.value.toLocaleString('vi-VN')} / ${t.total.toLocaleString('vi-VN')}`} />
      ))}
    </Card>
  );
}

export function KeyValues({ rows }: { rows: string[][] }) {
  return (
    <View>
      {rows.map(([k, v], i) => (
        <Row key={k} style={{ justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: i < rows.length - 1 ? 1 : 0, borderBottomColor: colors.border }}>
          <Text style={{ fontSize: 13, flex: 1, color: colors.muted }}>{k}</Text>
          <Text style={{ fontSize: 13, fontWeight: '700', textAlign: 'right' }}>{v}</Text>
        </Row>
      ))}
    </View>
  );
}

export function SampleBadge() {
  return (
    <View style={{ backgroundColor: colors.warnSoft, borderRadius: radius.pill, paddingHorizontal: 8, paddingVertical: 2 }}>
      <Label style={{ color: colors.warnText }}>Dữ liệu mẫu</Label>
    </View>
  );
}
