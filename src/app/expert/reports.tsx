import { router } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { ExpertShell } from '../../components/ExpertShell';
import { PageHeader } from '../../components/Shell';
import { Badge, Button, Card, Row, Small } from '../../components/ui';
import { learnerReports } from '../../data/mock';
import { colors, font, space } from '../../theme';

export default function Reports() {
  const [handled, setHandled] = useState<Record<string, boolean>>({});
  return (
    <ExpertShell>
      <PageHeader title="Báo lỗi từ học viên" subtitle="Báo lỗi được gom theo mã câu hỏi. Xử lý trong 14 ngày." />
      <View style={{ gap: space.md }}>
        {learnerReports.map((r) => (
          <Card key={r.id} style={{ gap: space.sm, opacity: handled[r.id] ? 0.55 : 1 }}>
            <Row style={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
              <Row>
                <Badge text={r.code} tone="dark" />
                <Small>
                  {r.by} · {r.when}
                </Small>
              </Row>
              {handled[r.id] ? <Badge text="Đã xử lý" tone="green" /> : null}
            </Row>
            <Text style={[font.body, { fontWeight: '600' }]}>{r.text}</Text>
            {!handled[r.id] ? (
              <Row>
                <Button small title="Mở câu để sửa" onPress={() => router.push('/expert')} />
                <Button small variant="secondary" title="Không phải lỗi" onPress={() => setHandled({ ...handled, [r.id]: true })} />
              </Row>
            ) : null}
          </Card>
        ))}
      </View>
      <Text style={[font.tiny, { marginTop: space.lg, color: colors.faint }]}>Dữ liệu mẫu.</Text>
    </ExpertShell>
  );
}
