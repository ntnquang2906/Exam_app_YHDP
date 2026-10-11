import { router, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';
import { Badge, Button, Card, ProgressBar, Row, Screen, Small, TopBar } from '../../components/ui';
import { modules, topics } from '../../data/mock';
import { colors, font, space } from '../../theme';

export default function ModuleDetail() {
  const { moduleId } = useLocalSearchParams<{ moduleId: string }>();
  const mod = modules.find((m) => m.id === moduleId) ?? modules[0];
  const list = topics.filter((t) => t.moduleId === mod.id);
  const doneCount = Math.round(mod.progress * mod.topicCount);
  // Học phần chưa có danh sách chủ đề trong dữ liệu mẫu → sinh tên chung
  const rows = list.length
    ? list
    : Array.from({ length: mod.topicCount }, (_, i) => ({ id: `${mod.id}-${i + 1}`, moduleId: mod.id, index: i + 1, name: `Chủ đề ${i + 1}` }));

  return (
    <Screen header={<TopBar title={mod.name} subtitle={`${mod.topicCount} chủ đề`} />}>
      <Card style={{ gap: space.sm }}>
        <Row style={{ justifyContent: 'space-between' }}>
          <Text style={font.h3}>Tiến độ học phần</Text>
          <Text style={{ fontWeight: '700' }}>
            {doneCount}/{mod.topicCount}
          </Text>
        </Row>
        <ProgressBar value={mod.progress} height={8} />
        <Row style={{ marginTop: space.sm }}>
          <Button style={{ flex: 1 }} title={mod.progress > 0 ? 'Học tiếp' : 'Bắt đầu học'} onPress={() => router.push(`/learn/${rows[Math.min(doneCount, rows.length - 1)].id}`)} />
          <Button variant="secondary" title="Luyện đề học phần" onPress={() => router.push('/session?step=practice')} />
        </Row>
      </Card>

      <Text style={[font.label, { marginTop: space.xl, marginBottom: space.sm }]}>CHỦ ĐỀ</Text>
      <View style={{ gap: space.sm }}>
        {rows.map((t) => {
          const status = t.index <= doneCount ? 'done' : t.index === doneCount + 1 ? 'current' : 'todo';
          return (
            <Card key={t.id} onPress={() => router.push(status === 'todo' ? `/learn/${t.id}` : `/topic/${t.id}`)} style={{ padding: space.md }}>
              <Row>
                <View style={{ width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: status === 'done' ? colors.primary : status === 'current' ? colors.primarySoft : colors.surfaceMuted }}>
                  <Text style={{ fontWeight: '700', color: status === 'done' ? colors.white : colors.text }}>{t.index}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: '600', fontSize: 15 }}>{t.name}</Text>
                  <Small>{status === 'done' ? 'Đã học' : status === 'current' ? 'Đang học' : 'Chưa học'}</Small>
                </View>
                {status === 'current' ? <Badge text="Tiếp tục" tone="green" /> : null}
              </Row>
            </Card>
          );
        })}
      </View>
    </Screen>
  );
}
