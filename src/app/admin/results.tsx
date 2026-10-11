import { Text, View } from 'react-native';
import { AdminShell } from '../../components/AdminShell';
import { BarChart, HBar, heatColor } from '../../components/charts';
import { FilterBar, Kpi, PageHeader, Table } from '../../components/Shell';
import { Button, Card, ProgressBar, ReleaseTag, Row, Small } from '../../components/ui';
import { ministry as M } from '../../data/mock';
import { colors, font, space } from '../../theme';

// Kết quả học tập (R2): chỉ học viên đồng ý dùng dữ liệu cho nghiên cứu
export default function MinistryResults() {
  const R = M.results;
  const row = { flexDirection: 'row' as const, flexWrap: 'wrap' as const, gap: space.lg, marginBottom: space.lg };
  return (
    <AdminShell>
      <PageHeader
        title="Kết quả học tập"
        badge="Dữ liệu mẫu"
        subtitle="Từ đề thi thử, chỉ học viên đồng ý dùng dữ liệu cho nghiên cứu · không có điểm dự đoán hay tỷ lệ đỗ"
        actions={
          <>
            <ReleaseTag release="R2" />
            <Button small variant="secondary" title="Xuất Excel" />
          </>
        }
      />
      <FilterBar items={[['Kỳ', M.period], ['Cơ sở đào tạo', 'Tất cả'], ['Đối tượng', 'Tất cả'], ['Vùng', 'Toàn quốc'], ['Nguồn', 'Đề thi thử']]} />
      <View style={row}>
        {R.kpis.map((k) => (
          <Kpi key={k.label} {...k} />
        ))}
      </View>

      <View style={row}>
        <Card style={{ flexGrow: 2, flexBasis: 520 }}>
          <Row style={{ justifyContent: 'space-between', marginBottom: space.md }}>
            <Text style={font.h3}>Phân bố điểm thi thử</Text>
            <Small>5.870 lượt · số câu đúng trên 40</Small>
          </Row>
          <BarChart data={R.distribution} height={180} />
          <Small style={{ marginTop: space.sm }}>
            Cột đậm chứa trung vị (27 câu, tháng 9: 26). Không vẽ ngưỡng đỗ vì kỳ thi thật chưa liên kết và không dự đoán kết quả.
          </Small>
        </Card>
        <Card style={{ flexGrow: 1, flexBasis: 280 }}>
          <Text style={[font.h3, { marginBottom: space.md }]}>Theo mức nhận thức</Text>
          {R.bloom.map((b) => (
            <View key={b.name}>
              <HBar label={b.name} value={b.value} right={`${Math.round(b.value * 100)}%`} />
              <Text style={[font.tiny, { marginTop: -8, marginBottom: 10 }]}>{b.detail}</Text>
            </View>
          ))}
          <Small>Câu vận dụng thấp hơn câu ghi nhớ 29 điểm % trên toàn quốc — gợi ý tăng bài tập tình huống trong đào tạo.</Small>
        </Card>
      </View>

      <Card style={{ marginBottom: space.lg }}>
        <Row style={{ justifyContent: 'space-between', marginBottom: space.sm, flexWrap: 'wrap' }}>
          <Text style={font.h3}>Tỷ lệ câu đúng theo miền và cơ sở đào tạo</Text>
          <Small>Sắp từ miền yếu nhất · mỗi ô có ít nhất 400 câu trả lời</Small>
        </Row>
        <Table
          headers={['Miền năng lực', ...R.institutions]}
          widths={[180, 100, 100, 100, 100, 100, 110]}
          rows={R.heat.map((h) => [
            h.domain,
            ...h.values.map((v, i) => {
              const national = i === h.values.length - 1;
              const flag = !national && v <= 55;
              return (
                <View key={i} style={{ backgroundColor: heatColor((v - 40) / 45), borderRadius: 4, paddingVertical: 6, alignItems: 'center', borderWidth: flag || national ? 1.5 : 0, borderColor: flag ? colors.orange : colors.dark }}>
                  <Text style={{ fontSize: 13, fontWeight: national ? '800' : '500' }}>{v}%</Text>
                </View>
              );
            }),
          ])}
        />
        <Small style={{ marginTop: space.sm }}>Viền cam: dưới 55%, cần xem lại nội dung đào tạo · CSĐT F ẩn (dưới 10 học viên).</Small>
      </Card>

      <Card>
        <Row style={{ justifyContent: 'space-between', marginBottom: space.sm, flexWrap: 'wrap' }}>
          <Text style={font.h3}>10 vấn đề cốt lõi yếu nhất toàn quốc</Text>
          <Small>Trên 54 vấn đề cốt lõi · tháng 9/2026</Small>
        </Row>
        <Table
          headers={['#', 'Vấn đề cốt lõi', 'Miền', 'Câu đúng', 'Lượt trả lời', 'So với tháng 8']}
          widths={[40, 240, 170, 170, 110, 120]}
          rows={R.weakest.map(([name, domain, pct, n, delta], i) => [
            String(i + 1),
            name,
            domain,
            <Row key="p">
              <View style={{ width: 90 }}>
                <ProgressBar value={pct / 100} color={pct < 50 ? colors.orange : colors.primary} />
              </View>
              <Text style={{ fontSize: 13 }}>{pct}%</Text>
            </Row>,
            n,
            delta,
          ])}
        />
        <Small style={{ marginTop: space.sm }}>Mỗi vấn đề cốt lõi có ngân hàng câu riêng; chênh lệch nhỏ hơn 3 điểm % có thể do ngẫu nhiên — không dùng để đánh giá từng học viên.</Small>
      </Card>
    </AdminShell>
  );
}
