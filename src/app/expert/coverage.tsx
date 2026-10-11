import { Text, View } from 'react-native';
import { heatColor } from '../../components/charts';
import { ExpertShell } from '../../components/ExpertShell';
import { PageHeader, Table } from '../../components/Shell';
import { Card, ProgressBar, Row } from '../../components/ui';
import { coverageMatrix } from '../../data/mock';
import { font, space } from '../../theme';

// Ma trận bao phủ: số câu đã duyệt theo miền × mức nhận thức, so với chỉ tiêu
export default function Coverage() {
  const max = Math.max(...coverageMatrix.rows.flatMap((r) => r.counts));
  return (
    <ExpertShell>
      <PageHeader title="Ma trận bao phủ" subtitle="Số câu đã duyệt 2 vòng theo miền năng lực và mức nhận thức" />
      <Card>
        <Table
          headers={['Miền năng lực', ...coverageMatrix.blooms, 'Tổng / chỉ tiêu', 'Tiến độ']}
          widths={[190, 90, 90, 90, 130, 160]}
          rows={coverageMatrix.rows.map((r) => {
            const sum = r.counts.reduce((a, b) => a + b, 0);
            return [
              r.domain,
              ...r.counts.map((c, i) => (
                <View key={i} style={{ backgroundColor: heatColor(c / max), borderRadius: 4, paddingVertical: 6, alignItems: 'center' }}>
                  <Text style={{ fontSize: 13, fontWeight: '700' }}>{c}</Text>
                </View>
              )),
              `${sum} / ${r.target}`,
              <Row key="p">
                <ProgressBar value={sum / r.target} />
                <Text style={font.tiny}>{Math.round((sum / r.target) * 100)}%</Text>
              </Row>,
            ];
          })}
        />
      </Card>
      <Text style={[font.tiny, { marginTop: space.md }]}>Ô đậm hơn = nhiều câu hơn. Ưu tiên soạn bổ sung ở mức Vận dụng.</Text>
    </ExpertShell>
  );
}
