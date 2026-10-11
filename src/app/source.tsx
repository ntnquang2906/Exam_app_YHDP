import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';
import { Screen, Small, TopBar } from '../components/ui';
import { questions } from '../data/mock';
import { colors, font, radius, space } from '../theme';

// Xem đoạn nguồn giáo trình được trích dẫn. Nội dung thật lấy từ thư viện học liệu.
export default function Source() {
  const { doc, page } = useLocalSearchParams<{ doc?: string; page?: string }>();
  const excerpt = questions.find((q) => q.source.excerpt && String(q.source.page) === page)?.source.excerpt;
  return (
    <Screen header={<TopBar left="close" title={doc ?? 'Nguồn'} subtitle={`Trang ${page ?? '—'}`} />}>
      <Text style={[font.label, { color: colors.primary }]}>ĐOẠN ĐƯỢC TRÍCH DẪN</Text>
      <View style={{ backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: space.lg, marginTop: space.sm }}>
        <Text style={font.serif}>{excerpt ?? '[Đoạn văn bản gốc từ giáo trình sẽ hiển thị ở đây khi học liệu được số hoá và nạp vào hệ thống.]'}</Text>
      </View>
      <Small style={{ marginTop: space.md }}>Trích đoạn giới hạn theo giấy phép.</Small>
    </Screen>
  );
}
