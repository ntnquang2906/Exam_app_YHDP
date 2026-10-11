import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { Button, Card, ListRow, Row, Screen, Small } from '../../components/ui';
import { learner, modules } from '../../data/mock';
import { useAppStore } from '../../store/useAppStore';
import { colors, font, radius, space } from '../../theme';

export default function Home() {
  const assessmentDone = useAppStore((s) => s.assessmentDone);
  const signOut = useAppStore((s) => s.signOut);
  const [q, setQ] = useState('');
  const hour = new Date().getHours();
  const greet = hour < 11 ? 'Chào buổi sáng,' : hour < 18 ? 'Chào buổi chiều,' : 'Chào buổi tối,';

  return (
    <Screen>
      <Row style={{ justifyContent: 'space-between' }}>
        <View>
          <Small>{greet}</Small>
          <Text style={font.h1}>{learner.name}</Text>
        </View>
        <Pressable
          onPress={() => {
            signOut();
            router.replace('/login');
          }}
          accessibilityLabel="Tài khoản · đăng xuất"
          style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' }}
        >
          <Text style={{ fontWeight: '700', color: colors.primaryDark }}>{learner.initials}</Text>
        </Pressable>
      </Row>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.sm, marginTop: space.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.pill, paddingHorizontal: space.lg }}>
        <Feather name="search" size={16} color={colors.faint} />
        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="Tìm học phần, chủ đề…"
          placeholderTextColor={colors.faint}
          accessibilityLabel="Tìm kiếm"
          onSubmitEditing={() => router.push('/practice')}
          style={{ flex: 1, minHeight: 46, fontSize: 15, color: colors.text }}
        />
      </View>

      {!assessmentDone ? (
        <Card style={{ marginTop: space.lg, backgroundColor: colors.warnSoft, borderColor: colors.warnSoft, gap: space.sm }}>
          <Text style={{ fontWeight: '700', color: colors.warnText }}>Chưa có lộ trình cá nhân</Text>
          <Small>Làm bài đánh giá năng lực 25 phút để gia sư xếp lộ trình theo trình độ của bạn.</Small>
          <Button small title="Làm bài đánh giá" onPress={() => router.push('/assessment')} style={{ alignSelf: 'flex-start' }} />
        </Card>
      ) : null}

      <Row style={{ marginTop: space.lg, alignItems: 'stretch' }} gap={space.md}>
        <Pressable onPress={() => router.push('/session')} style={{ flex: 1, backgroundColor: colors.primary, borderRadius: radius.lg, padding: space.lg, minHeight: 110 }}>
          <Text style={{ color: colors.white, fontSize: 18, fontWeight: '800' }}>Ôn nhanh 8 câu</Text>
          <Text style={{ color: '#D6EEDF', fontSize: 12, marginTop: 6 }}>3 câu mới từ lỗi sai của bạn</Text>
        </Pressable>
        <Pressable onPress={() => router.push('/exam/de-2-mini')} style={{ flex: 1, backgroundColor: colors.surface, borderRadius: radius.lg, padding: space.lg, borderWidth: 1, borderColor: colors.border }}>
          <Text style={{ color: colors.text, fontSize: 16, fontWeight: '700' }}>Đề thi thử số 2</Text>
          <Text style={[font.tiny, { marginTop: 6 }]}>40 câu · 50 phút</Text>
        </Pressable>
      </Row>

      <Card style={{ marginTop: space.md }}>
        <Row>
          <Feather name="star" size={16} color="#C89B3C" />
          <Text style={{ fontWeight: '700', fontSize: 15 }}>Đề xuất từ gia sư</Text>
        </Row>
        <ListRow icon="copy" title="Tạo 3 thẻ ôn từ câu bạn sai ở Đo lường bệnh trạng" right={<ActionText text="Xem thẻ" />} onPress={() => router.push('/flashcards')} />
        <ListRow icon="list" title="Thêm 1 ví dụ tính từng bước vào chủ đề 3" onPress={() => router.push('/learn/dt-3')} />
        <ListRow icon="target" title="Bổ sung 6 câu luyện mẫu số cho hôm nay" right={<ActionText text="Luyện" />} onPress={() => router.push('/session?step=practice')} last />
      </Card>

      <Text style={[font.label, { marginTop: space.xl, marginBottom: space.sm }]}>TIẾP TỤC</Text>
      <Card style={{ paddingVertical: 0 }}>
        <ListRow icon="book-open" title={modules[0].name} subtitle="Chủ đề 3/8 · có ví dụ mới cho bạn" progress={modules[0].progress} onPress={() => router.push('/learn/dt-3')} />
        <ListRow icon="message-circle" title="Liều vắc xin viêm gan B sơ sinh" subtitle="Hỏi đáp · hôm nay" onPress={() => router.push('/chat')} />
        <ListRow icon="book-open" title={modules[1].name} subtitle="Chủ đề 1/6" progress={modules[1].progress} onPress={() => router.push('/module/tiem-chung')} last />
      </Card>

      <Row style={{ marginTop: space.lg }}>
        <Button small variant="secondary" icon="calendar" title="Lịch ôn tập" onPress={() => router.push('/schedule')} style={{ flex: 1 }} />
        <Button small variant="secondary" icon="layers" title="Bộ thẻ" onPress={() => router.push('/flashcards')} style={{ flex: 1 }} />
      </Row>
    </Screen>
  );
}

function ActionText({ text }: { text: string }) {
  return <Text style={{ color: colors.primary, fontWeight: '700', fontSize: 13 }}>{text}</Text>;
}
