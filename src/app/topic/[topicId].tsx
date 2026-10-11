import { router, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';
import { BarChart } from '../../components/charts';
import { Button, Card, IconButton, ListRow, ReleaseTag, Row, Screen, Small, Stat, TopBar } from '../../components/ui';
import { modules, topics } from '../../data/mock';
import { colors, font, space } from '../../theme';

// Tổng quan chủ đề (R1.1): thẻ ôn của chủ đề + dự báo đến hạn
export default function TopicOverview() {
  const { topicId } = useLocalSearchParams<{ topicId: string }>();
  const topic = topics.find((t) => t.id === topicId) ?? topics[2];
  const mod = modules.find((m) => m.id === topic.moduleId)!;
  return (
    <Screen
      header={<TopBar right={<IconButton icon="sliders" label="Cài đặt ôn tập" onPress={() => router.push('/flashcards/settings')} />} />}
    >
      <Row style={{ justifyContent: 'space-between' }}>
        <Small>{mod.name}</Small>
        <ReleaseTag release="R1.1" />
      </Row>
      <Text style={[font.h1, { marginTop: 4 }]}>
        Chủ đề {topic.index} · {topic.name}
      </Text>

      <Card style={{ marginTop: space.lg, gap: space.md }}>
        <Row>
          <Stat value={2} label="Mới" color={colors.blue} />
          <Stat value={0} label="Đang học" color={colors.orange} />
          <Stat value={1} label="Đến hạn" color={colors.primary} />
        </Row>
        <Button title="Bắt đầu ôn" onPress={() => router.push('/flashcards/review')} />
      </Card>

      <Row style={{ justifyContent: 'space-between', marginTop: space.lg }}>
        <Text style={font.h3}>Thẻ đến hạn 7 ngày tới</Text>
        <Small>Trước ngày thi</Small>
      </Row>
      <View style={{ marginTop: space.md }}>
        <BarChart
          data={[
            { label: 'Nay', value: 3, highlight: true },
            { label: 'CN', value: 1 },
            { label: 'T2', value: 2 },
            { label: 'T3', value: 0 },
            { label: 'T4', value: 1 },
            { label: 'T5', value: 1 },
            { label: 'T6', value: 2 },
          ]}
        />
      </View>

      <Row gap={space.md} style={{ marginTop: space.lg, alignItems: 'stretch' }}>
        <Card style={{ flex: 1 }}>
          <Text style={{ fontSize: 24, fontWeight: '800' }}>86%</Text>
          <Small>nhớ đúng, 30 ngày</Small>
        </Card>
        <Card style={{ flex: 1 }}>
          <Text style={{ fontSize: 24, fontWeight: '800' }}>24</Text>
          <Small>thẻ trong bộ</Small>
        </Card>
      </Row>

      <Card style={{ marginTop: space.md, paddingVertical: 0 }}>
        <ListRow title="Duyệt thẻ trong bộ" onPress={() => router.push('/flashcards/browse')} />
        <ListRow title="Ôn thêm thẻ quên gần đây" onPress={() => router.push('/flashcards/review')} />
        <ListRow title="Mở lại chủ đề trong học phần" onPress={() => router.push(`/learn/${topic.id}`)} last />
      </Card>
    </Screen>
  );
}
