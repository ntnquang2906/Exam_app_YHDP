import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Row } from '../components/ui';
import { authApi } from '../services/api';
import { useAppStore } from '../store/useAppStore';
import { colors, font, radius, space } from '../theme';

export default function Login() {
  const [code, setCode] = useState('');
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const signIn = useAppStore((s) => s.signIn);

  const submit = async () => {
    setLoading(true);
    const res = await authApi.activate(code);
    setLoading(false);
    if (!res.ok) return setError(res.error);
    signIn('learner');
    router.replace('/onboarding');
  };

  const demo = (role: 'expert' | 'ministry') => {
    signIn(role);
    router.replace(role === 'expert' ? '/expert' : '/admin');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <SafeAreaView edges={['top']} style={{ backgroundColor: colors.ministry }}>
        <View style={{ maxWidth: 520, width: '100%', alignSelf: 'center', padding: space.xl, gap: space.lg, borderBottomWidth: 3, borderBottomColor: '#E2A33B' }}>
          <Row gap={space.md}>
            <View style={{ width: 52, height: 52, borderRadius: 26, borderWidth: 1, borderStyle: 'dashed', borderColor: '#F3C3C3', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: '#F3C3C3', fontSize: 9, textAlign: 'center' }}>Logo{'\n'}đơn vị</Text>
            </View>
            <View>
              <Text style={{ color: '#F7D774', fontWeight: '800', fontSize: 12 }}>BỘ Y TẾ</Text>
              <Text style={{ color: '#F3C3C3', fontSize: 11 }}>[Đơn vị chủ trì]</Text>
            </View>
          </Row>
          <View>
            <Text style={{ color: colors.white, fontSize: 24, fontWeight: '800' }}>Ôn thi năng lực hành nghề</Text>
            <Text style={{ color: '#F3C3C3', marginTop: 4 }}>Bác sĩ Y học dự phòng</Text>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View style={{ maxWidth: 520, width: '100%', alignSelf: 'center', padding: space.xl, gap: space.md, flex: 1 }}>
          <Text style={font.h2}>Đăng nhập</Text>
          <Text style={font.small}>Nhập mã kích hoạt do nhà trường cấp cho bạn.</Text>
          <Text style={[font.small, { color: colors.text, fontWeight: '700', marginTop: space.sm }]}>Mã kích hoạt</Text>
          <TextInput
            value={code}
            onChangeText={(t) => {
              setCode(t.toUpperCase());
              setError(undefined);
            }}
            placeholder="VD: YHDP-7K2M-Q9"
            placeholderTextColor={colors.faint}
            autoCapitalize="characters"
            accessibilityLabel="Mã kích hoạt"
            onSubmitEditing={submit}
            style={{ borderWidth: 1, borderColor: error ? colors.danger : colors.border, borderRadius: radius.md, paddingHorizontal: space.lg, minHeight: 50, fontSize: 16, color: colors.text, backgroundColor: colors.surface }}
          />
          {error ? <Text style={{ color: colors.danger, fontSize: 13 }}>{error}</Text> : null}
          <Button title="Đăng nhập" onPress={submit} loading={loading} disabled={!code.trim()} />
          <Text style={{ color: colors.primary, textAlign: 'center', fontSize: 13, marginTop: space.sm }}>
            Chưa có mã? Liên hệ phòng đào tạo của trường
          </Text>

          <View style={{ marginTop: space.xl, padding: space.md, borderRadius: radius.md, backgroundColor: colors.surfaceMuted, gap: space.sm }}>
            <Text style={font.label}>BẢN DEMO · VÀO THEO VAI TRÒ KHÁC</Text>
            <Row>
              <Button small variant="secondary" title="Chuyên gia kiểm duyệt" onPress={() => demo('expert')} style={{ flex: 1 }} />
              <Button small variant="secondary" title="Quản lý cấp Bộ" onPress={() => demo('ministry')} style={{ flex: 1 }} />
            </Row>
          </View>

          <View style={{ flex: 1 }} />
          <Text style={[font.tiny, { textAlign: 'center', lineHeight: 16 }]}>
            Ứng dụng hỗ trợ ôn thi, không thay thế tư vấn y khoa. Tiếp tục nghĩa là bạn đồng ý với{' '}
            <Text style={{ color: colors.primary, textDecorationLine: 'underline' }}>Điều khoản</Text> và{' '}
            <Text style={{ color: colors.primary, textDecorationLine: 'underline' }}>Chính sách quyền riêng tư</Text>.
          </Text>
          <Text style={[font.tiny, { textAlign: 'center' }]}>[Dòng ghi nhận đơn vị chủ quản và nguồn kinh phí]</Text>
        </View>
      </ScrollView>
    </View>
  );
}
