import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { Button, H1, Screen, Small } from '../components/ui';
import { modules } from '../data/mock';
import { useAppStore } from '../store/useAppStore';
import { colors, font, radius, space } from '../theme';

// Bước cuối onboarding: chọn học phần muốn tập trung
export default function Onboarding() {
  const { selectedModules, toggleModule } = useAppStore();
  return (
    <Screen
      footer={
        <View style={{ flex: 1, gap: space.sm }}>
          <Small style={{ textAlign: 'center' }}>Đã chọn {selectedModules.length} học phần</Small>
          <Button
            title="Làm bài đánh giá năng lực"
            subtitle="bám sát nội dung ôn tập với nhu cầu"
            disabled={selectedModules.length === 0}
            onPress={() => router.push('/assessment')}
          />
          <Button title="Bỏ qua, vào học ngay" variant="secondary" onPress={() => router.replace('/home')} />
          <Small style={{ textAlign: 'center', fontSize: 11 }}>Bài đánh giá luôn có ở tab Thi thử.</Small>
        </View>
      }
    >
      <Text style={font.tiny}>Bước cuối</Text>
      <H1 style={{ marginTop: 4 }}>Bạn muốn tập trung ôn chủ đề nào?</H1>
      <Small style={{ marginTop: space.sm }}>Chủ đề có thể được cập nhật bất cứ lúc nào</Small>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space.sm, marginTop: space.lg }}>
        {modules.map((m) => {
          const on = selectedModules.includes(m.id);
          return (
            <Pressable
              key={m.id}
              onPress={() => toggleModule(m.id)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: on }}
              style={{
                flexBasis: '47%',
                flexGrow: 1,
                minHeight: 84,
                padding: space.md,
                borderRadius: radius.md,
                borderWidth: on ? 1.5 : 1,
                borderColor: on ? colors.primary : colors.border,
                backgroundColor: on ? colors.primarySoft : colors.surface,
                flexDirection: 'row',
                gap: space.sm,
              }}
            >
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: '700', color: colors.text, fontSize: 15 }}>{m.name}</Text>
                <Text style={[font.tiny, { marginTop: 4 }]}>{m.topicCount} chủ đề</Text>
              </View>
              <View style={{ width: 22, height: 22, borderRadius: 11, borderWidth: on ? 0 : 1.5, borderColor: colors.border, backgroundColor: on ? colors.primary : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
                {on ? <Feather name="check" size={14} color={colors.white} /> : null}
              </View>
            </Pressable>
          );
        })}
      </View>
    </Screen>
  );
}
