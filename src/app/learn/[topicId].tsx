import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { QuestionCard } from '../../components/QuestionCard';
import { Body, Button, Card, IconButton, Label, Row, Screen, SourceChip, TopBar } from '../../components/ui';
import { modules, topics } from '../../data/mock';
import { learningApi } from '../../services/api';
import { useAsync } from '../../components/ui';
import { colors, font, radius, space } from '../../theme';

// Nội dung bài học mẫu. Thực tế lấy từ học liệu đã số hoá theo chủ đề.
const LESSON = [
  {
    title: 'Tỷ lệ hiện mắc',
    body: 'Tỷ lệ hiện mắc cho biết bao nhiêu người đang mắc bệnh trong quần thể tại một thời điểm. Tử số gồm cả ca cũ lẫn ca mới; mẫu số là toàn bộ quần thể tại thời điểm đó.',
    formula: 'Hiện mắc = Số người đang mắc ÷ Tổng dân số tại thời điểm',
    page: 58,
  },
  {
    title: 'Tỷ lệ mới mắc',
    body: 'Tỷ lệ mới mắc chỉ đếm các ca mới xuất hiện trong khoảng thời gian theo dõi. Người đang mắc không còn nguy cơ mắc mới, nên được loại khỏi mẫu số.',
    formula: 'Mới mắc = Số ca mới ÷ Quần thể có nguy cơ',
    page: 59,
  },
];

export default function Learn() {
  const { topicId } = useLocalSearchParams<{ topicId: string }>();
  const topic = topics.find((t) => t.id === topicId) ?? topics[2];
  const mod = modules.find((m) => m.id === topic.moduleId)!;
  const quick = useAsync(() => learningApi.quickCheck());
  const parts = LESSON.length + 1;
  const [part, setPart] = useState(0);
  const [answered, setAnswered] = useState(false);
  const isQuiz = part === LESSON.length;

  const next = () => {
    if (part < parts - 1) {
      setPart(part + 1);
      setAnswered(false);
    } else {
      router.replace(`/topic/${topic.id}`);
    }
  };

  return (
    <Screen
      header={
        <TopBar left="close" title={mod.name} subtitle={`Chủ đề ${topic.index} · ${topic.name}`}>
          <Row gap={6} style={{ marginTop: space.sm }}>
            {Array.from({ length: parts + 2 }).map((_, i) => (
              <View key={i} style={{ flex: 1, height: 4, borderRadius: 4, backgroundColor: i <= part ? colors.primary : colors.border }} />
            ))}
          </Row>
        </TopBar>
      }
      footer={
        <>
          <IconButton icon="message-circle" label="Hỏi gia sư" bordered onPress={() => router.push({ pathname: '/tutor', params: { q: quick?.id ?? '' } })} />
          <Button style={{ flex: 1 }} title={part === parts - 1 ? 'Hoàn thành chủ đề' : 'Tiếp tục'} disabled={isQuiz && !answered} onPress={next} />
        </>
      }
    >
      {isQuiz ? (
        <>
          <Label style={{ color: colors.danger, marginBottom: space.sm }}>Kiểm tra nhanh</Label>
          {quick ? <QuestionCard key={quick.id} question={quick} grid onAnswered={() => setAnswered(true)} /> : null}
          <Row style={{ marginTop: space.lg }}>
            <Button small variant="secondary" title="Câu tự luận ngắn" onPress={() => router.push('/essay')} />
            <Button small variant="secondary" title="Câu hỏi có AI hỗ trợ" onPress={() => router.push('/ai-question')} />
          </Row>
        </>
      ) : (
        <View style={{ gap: space.md }}>
          <Text style={font.label}>BÀI {part + 1}/{LESSON.length}</Text>
          <Text style={font.h1}>{LESSON[part].title}</Text>
          <Body style={{ fontSize: 16, lineHeight: 25 }}>{LESSON[part].body}</Body>
          <Card style={{ backgroundColor: colors.primarySoft, borderColor: colors.primarySoft }}>
            <Text style={[font.serif, { fontWeight: '600' }]}>{LESSON[part].formula}</Text>
          </Card>
          <View style={{ backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: space.md, flexDirection: 'row', alignItems: 'center', gap: space.md }}>
            <Text style={[font.small, { flex: 1 }]}>Nguồn: Giáo trình Dịch tễ học</Text>
            <SourceChip page={LESSON[part].page} onPress={() => router.push({ pathname: '/source', params: { doc: 'Giáo trình Dịch tễ học', page: String(LESSON[part].page) } })} />
          </View>
        </View>
      )}
    </Screen>
  );
}
