import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChatPanel } from '../components/ChatPanel';
import { TopBar } from '../components/ui';
import { questions } from '../data/mock';
import { colors, font, radius, space } from '../theme';

// Hỏi gia sư từ một câu quiz: gửi kèm ngữ cảnh câu hỏi + lựa chọn của người học
export default function Tutor() {
  const { q, chosen } = useLocalSearchParams<{ q?: string; chosen?: string }>();
  const baseId = q?.split('@')[0];
  const question = questions.find((x) => x.id === baseId) ?? questions[0];
  const chosenText = question.options.find((o) => o.id === chosen);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top', 'bottom']}>
      <TopBar title="Hỏi gia sư" right={<Text style={font.tiny}>Phiên hôm nay</Text>} />
      <ChatPanel
        conversationId={`quiz-${question.id}`}
        placeholder="Hỏi thêm về câu này…"
        emptyTitle="Gia sư đã đọc câu hỏi và lựa chọn của bạn"
        suggestions={['Sao mình sai câu này?', 'Giải thích từng bước giúp mình', 'Cho mình một ví dụ tương tự']}
        header={
          <View style={{ backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: space.md, flexDirection: 'row', gap: space.sm }}>
            <Feather name="target" size={16} color={colors.primary} style={{ marginTop: 2 }} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: '700', fontSize: 13 }}>Đang hỏi về: {question.domain} · Luyện điểm yếu</Text>
              <Text style={font.small} numberOfLines={2}>
                {question.stem}
                {chosenText ? ` · bạn chọn ${chosenText.id} (${chosenText.text})` : ''}
              </Text>
            </View>
          </View>
        }
      />
    </SafeAreaView>
  );
}
