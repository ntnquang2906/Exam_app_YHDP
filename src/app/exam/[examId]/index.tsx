import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';
import { Button, Card, H1, Row, Screen, Small, TopBar } from '../../../components/ui';
import { colors, space } from '../../../theme';
import { getExam } from '../../../lib/exam';

// Quy định bài thi
export default function ExamRules() {
  const { examId } = useLocalSearchParams<{ examId: string }>();
  const exam = getExam(examId);
  return (
    <Screen
      header={<TopBar />}
      footer={
        <View style={{ flex: 1, gap: space.sm }}>
          <Small style={{ textAlign: 'center' }}>Còn {exam.attemptsLeft} lượt làm đề này</Small>
          <Button title="Bắt đầu" onPress={() => router.replace(`/exam/${exam.id}/take`)} />
        </View>
      }
    >
      <H1>{exam.name}</H1>
      <Row gap={space.md} style={{ marginTop: space.lg, alignItems: 'stretch' }}>
        <Card style={{ flex: 1 }}>
          <Text style={{ fontSize: 30, fontWeight: '800' }}>{exam.questionCount}</Text>
          <Small>câu hỏi</Small>
        </Card>
        <Card style={{ flex: 1 }}>
          <Text style={{ fontSize: 30, fontWeight: '800' }}>{exam.minutes}</Text>
          <Small>phút cho cả đề</Small>
        </Card>
      </Row>
      <View style={{ gap: space.md, marginTop: space.xl }}>
        {(
          [
            ['clock', 'Không tạm dừng được'],
            ['check', 'Tự lưu sau mỗi câu'],
            ['chevron-left', 'Quay lại câu trước được'],
            ['alert-triangle', 'Hết giờ sẽ tự nộp bài'],
          ] as const
        ).map(([icon, t]) => (
          <Row key={t} gap={space.md}>
            <Feather name={icon} size={18} color={colors.primary} />
            <Text style={{ fontSize: 15 }}>{t}</Text>
          </Row>
        ))}
      </View>
    </Screen>
  );
}
