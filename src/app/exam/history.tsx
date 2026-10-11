import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { LineChart } from '../../components/charts';
import { Card, ListRow, Screen, Small, TopBar } from '../../components/ui';
import { progressData } from '../../data/mock';
import { space } from '../../theme';

const HISTORY = [
  { id: 'de-4', name: 'Đề thi thử số 4', date: '06/10', score: 33 },
  { id: 'de-3', name: 'Đề thi thử số 3', date: '28/09', score: 31 },
  { id: 'de-2', name: 'Đề thi thử số 2', date: '19/09', score: 29 },
  { id: 'assessment', name: 'Bài đánh giá năng lực', date: '12/09', score: 14 },
];

export default function ExamHistory() {
  return (
    <Screen header={<TopBar title="Lịch sử làm bài" />}>
      <Card>
        <Small>Câu đúng mỗi đề</Small>
        <LineChart values={progressData.examScores.map((s) => s.value)} labels={progressData.examScores.map((s) => s.label)} maxValue={40} />
      </Card>
      <Card style={{ marginTop: space.md, paddingVertical: 0 }}>
        {HISTORY.map((h, i) => (
          <ListRow
            key={h.id}
            title={h.name}
            subtitle={`Làm ngày ${h.date}`}
            right={<Text style={{ fontWeight: '800' }}>{h.id === 'assessment' ? `${h.score}/21` : `${h.score}/40`}</Text>}
            onPress={h.id === 'assessment' ? undefined : () => router.push(`/exam/${h.id}/result`)}
            last={i === HISTORY.length - 1}
          />
        ))}
      </Card>
      <View style={{ height: space.lg }} />
    </Screen>
  );
}
