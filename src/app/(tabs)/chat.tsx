import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChatPanel } from '../../components/ChatPanel';
import { IconButton, Row, Small, useAsync, useIsWide } from '../../components/ui';
import { chatApi } from '../../services/api';
import { colors, font, radius, space } from '../../theme';

const SUGGESTIONS = [
  'Liều vắc xin viêm gan B sơ sinh tiêm khi nào?',
  'Phân biệt tỷ lệ hiện mắc và mới mắc',
  'Các bước điều tra một vụ dịch',
];

export default function Chat() {
  const wide = useIsWide();
  const conversations = useAsync(() => chatApi.conversations()) ?? [];
  const [active, setActive] = useState<string>('new');
  const [historyOpen, setHistoryOpen] = useState(false);
  const activeTitle = conversations.find((c) => c.id === active)?.title ?? 'Cuộc trò chuyện mới';

  const list = (
    <View style={{ gap: space.sm }}>
      <Pressable
        onPress={() => {
          setActive('new');
          setHistoryOpen(false);
        }}
        style={{ borderWidth: 1.5, borderColor: colors.primary, borderRadius: radius.md, padding: space.md, alignItems: 'center' }}
      >
        <Text style={{ color: colors.primary, fontWeight: '700' }}>Cuộc trò chuyện mới</Text>
      </Pressable>
      {conversations.map((c) => (
        <Pressable
          key={c.id}
          onPress={() => {
            setActive(c.id);
            setHistoryOpen(false);
          }}
          style={{ padding: space.md, borderRadius: radius.md, backgroundColor: active === c.id ? colors.surface : 'transparent', borderWidth: active === c.id ? 1 : 0, borderColor: colors.border }}
        >
          <Text style={{ fontSize: 14, color: colors.text }}>{c.title}</Text>
          <Text style={font.tiny}>{c.when}</Text>
        </Pressable>
      ))}
    </View>
  );

  if (wide) {
    // Bố cục desktop (R1.1): danh sách hội thoại · khung chat · nguồn trích dẫn
    return (
      <SafeAreaView style={{ flex: 1, flexDirection: 'row', backgroundColor: colors.bg }} edges={['top']}>
        <View style={{ width: 260, borderRightWidth: 1, borderRightColor: colors.border, padding: space.md }}>{list}</View>
        <View style={{ flex: 1, backgroundColor: colors.bg }}>
          <View style={{ padding: space.lg, borderBottomWidth: 1, borderBottomColor: colors.border, backgroundColor: colors.surface }}>
            <Text style={font.h3}>{activeTitle}</Text>
          </View>
          <ChatPanel key={active} conversationId={active} suggestions={SUGGESTIONS} />
        </View>
        <View style={{ width: 300, borderLeftWidth: 1, borderLeftColor: colors.border, backgroundColor: colors.surface, padding: space.lg, gap: space.md }}>
          <Text style={[font.label, { color: colors.primary }]}>NGUỒN TRÍCH DẪN</Text>
          <Small>Khi gia sư trả lời, bấm vào số trích dẫn để xem đoạn giáo trình gốc tại đây.</Small>
          <View style={{ backgroundColor: colors.bg, borderRadius: radius.md, padding: space.md, minHeight: 120, alignItems: 'center', justifyContent: 'center' }}>
            <Feather name="book-open" size={22} color={colors.faint} />
          </View>
          <Text style={font.tiny}>Trích đoạn giới hạn theo giấy phép.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
      <Row style={{ paddingHorizontal: space.lg, paddingVertical: space.sm, borderBottomWidth: 1, borderBottomColor: colors.border, backgroundColor: colors.surface, justifyContent: 'space-between' }}>
        <Text style={font.h3}>Hỏi đáp</Text>
        <Row gap={0}>
          <IconButton icon="menu" label="Lịch sử trò chuyện" onPress={() => setHistoryOpen(true)} />
          <IconButton icon="plus" label="Cuộc trò chuyện mới" onPress={() => setActive('new')} />
        </Row>
      </Row>
      <ChatPanel key={active} conversationId={active} suggestions={SUGGESTIONS} />
      <Modal visible={historyOpen} animationType="slide" transparent onRequestClose={() => setHistoryOpen(false)}>
        <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }} onPress={() => setHistoryOpen(false)} />
        <View style={{ backgroundColor: colors.bg, padding: space.lg, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, paddingBottom: 40 }}>
          <Text style={[font.h3, { marginBottom: space.md }]}>Lịch sử trò chuyện</Text>
          {list}
        </View>
      </Modal>
    </SafeAreaView>
  );
}
