import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { Badge, Button, Card, ListRow, Row, Screen, Small } from '../../components/ui';
import { placementTest } from '../../data/mock';
import { examApi } from '../../services/api';
import { useAsync } from '../../components/ui';
import { colors, font, radius, space } from '../../theme';

export default function Exams() {
  const exams = useAsync(() => examApi.list()) ?? [];
  return (
    <Screen>
      <Text style={font.h1}>Thi thử</Text>

      <View style={{ marginTop: space.lg, backgroundColor: colors.dark, borderRadius: radius.lg, padding: space.lg, gap: space.sm }}>
        <Text style={{ color: colors.white, fontWeight: '800', fontSize: 17 }}>Bài đánh giá năng lực</Text>
        <Text style={{ color: '#9FB1A7', fontSize: 12 }}>
          {placementTest.questionCount} câu · {placementTest.minutes} phút · phủ đều các miền
        </Text>
        <Text style={{ color: '#C9D6CF', fontSize: 13 }}>Kết quả sẽ cập nhật bộ thẻ và chủ đề cần ôn.</Text>
        <Button variant="light" title="Làm bài đánh giá" onPress={() => router.push('/assessment')} style={{ marginTop: space.sm }} />
      </View>

      <View style={{ gap: space.md, marginTop: space.md }}>
        {exams.map((e) => (
          <Card key={e.id} style={{ gap: space.sm }}>
            <Row style={{ justifyContent: 'space-between' }}>
              <Text style={{ fontWeight: '700', fontSize: 16 }}>{e.name}</Text>
              {e.isNew ? <Badge text="Mới" tone="green" /> : null}
            </Row>
            {e.lastResult ? (
              <Row style={{ justifyContent: 'space-between' }}>
                <Small>
                  Đã làm {e.lastResult.date} · {e.lastResult.correct}/{e.questionCount} câu đúng
                </Small>
                <Button small variant="secondary" title="Xem kết quả" onPress={() => router.push(`/exam/${e.id}/result`)} />
              </Row>
            ) : (
              <>
                <Small>
                  {e.questionCount} câu · {e.minutes} phút · còn {e.attemptsLeft} lượt
                </Small>
                <Button title="Bắt đầu làm bài" onPress={() => router.push(`/exam/${e.id}`)} />
              </>
            )}
          </Card>
        ))}
      </View>

      <Card style={{ marginTop: space.md, paddingVertical: 0 }}>
        <ListRow title="Lịch sử làm bài" onPress={() => router.push('/exam/history')} last />
      </Card>
    </Screen>
  );
}
