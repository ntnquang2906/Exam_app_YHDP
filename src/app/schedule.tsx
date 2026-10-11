import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Badge, Button, Card, IconButton, Label, ReleaseTag, Row, Screen, Small, TopBar } from '../components/ui';
import { learner } from '../data/mock';
import { colors, font, radius, space } from '../theme';

const DOW = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
// Tải ôn mẫu theo ngày: 0 không có, 1 ít thẻ, 2 nhiều thẻ
const LOAD: Record<number, number> = { 5: 1, 6: 1, 7: 1, 8: 1, 9: 1, 10: 2, 11: 1, 12: 2, 13: 1, 14: 2, 15: 1, 16: 1, 17: 1, 18: 1, 19: 1, 20: 1, 21: 2, 22: 1, 23: 1, 24: 1, 25: 1, 26: 1, 27: 1, 28: 1, 29: 1, 30: 1, 31: 1 };

export default function Schedule() {
  const [month, setMonth] = useState(9); // 0-based: tháng 10
  const year = 2026;
  const [day, setDay] = useState(10);
  const [planApplied, setPlanApplied] = useState(false);

  const first = new Date(year, month, 1);
  const offset = (first.getDay() + 6) % 7; // thứ Hai đầu tuần
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [...Array(offset).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  const today = month === 9 ? 10 : -1;

  return (
    <Screen header={<TopBar title="Lịch ôn tập" subtitle={`Còn ${learner.daysToExam} ngày đến kỳ thi · ${learner.examDate}`} right={<IconButton icon="sliders" label="Cài đặt ôn tập" onPress={() => router.push('/flashcards/settings')} />} />}>
      <Row style={{ justifyContent: 'flex-end', marginBottom: space.sm }}>
        <ReleaseTag release="R1.1" />
      </Row>
      <Card>
        <Row style={{ justifyContent: 'space-between' }}>
          <IconButton icon="chevron-left" label="Tháng trước" onPress={() => setMonth((m) => Math.max(0, m - 1))} />
          <Text style={font.h3}>
            Tháng {month + 1}, {year}
          </Text>
          <IconButton icon="chevron-right" label="Tháng sau" onPress={() => setMonth((m) => Math.min(11, m + 1))} />
        </Row>
        <View style={{ flexDirection: 'row', marginTop: space.sm }}>
          {DOW.map((d) => (
            <Text key={d} style={[font.tiny, { flex: 1, textAlign: 'center' }]}>
              {d}
            </Text>
          ))}
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: space.sm }}>
          {cells.map((d, i) => {
            const load = d && month === 9 ? LOAD[d] ?? 0 : d ? 1 : 0;
            const sel = d === day;
            const past = month === 9 && d !== null && d < today;
            return (
              <View key={i} style={{ width: `${100 / 7}%`, alignItems: 'center', paddingVertical: 4 }}>
                {d ? (
                  <Pressable
                    onPress={() => setDay(d)}
                    accessibilityLabel={`Ngày ${d}`}
                    style={{ width: 40, height: 44, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center', backgroundColor: sel ? colors.dark : 'transparent' }}
                  >
                    <Text style={{ fontWeight: '700', color: sel ? colors.white : past ? colors.faint : colors.text }}>{d}</Text>
                    {load > 0 && !past ? <View style={{ width: load === 2 ? 18 : 12, height: 3, borderRadius: 2, marginTop: 3, backgroundColor: sel ? colors.white : load === 2 ? colors.primary : colors.primaryMid }} /> : null}
                  </Pressable>
                ) : null}
              </View>
            );
          })}
        </View>
        <Row gap={space.lg} style={{ marginTop: space.sm, justifyContent: 'center' }}>
          <Legend color={colors.primaryMid} label="Ít thẻ" />
          <Legend color={colors.primary} label="Nhiều thẻ" />
          <Legend color={colors.orange} label="Thi thử" />
        </Row>
      </Card>

      <Label style={{ marginTop: space.lg, marginBottom: space.sm }}>{day === today ? `Hôm nay · ${day}/${month + 1}` : `Ngày ${day}/${month + 1}`}</Label>
      <Card>
        <Row>
          <View style={{ width: 40, height: 40, borderRadius: radius.sm, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontWeight: '800', color: colors.primaryDark }}>{LOAD[day] === 2 ? 12 : 5}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: '700' }}>Ôn thẻ đến hạn</Text>
            <Small>{LOAD[day] === 2 ? 12 : 5} thẻ · theo lịch ngắt quãng</Small>
          </View>
          <Button small title="Bắt đầu" onPress={() => router.push('/flashcards/review')} />
        </Row>
      </Card>

      {/* Đề xuất lịch học từ gia sư (R2) — trong bản thật xuất hiện trong khung Hỏi đáp */}
      <Row style={{ marginTop: space.xl, marginBottom: space.sm, justifyContent: 'space-between' }}>
        <Label>Lịch đề xuất từ gia sư</Label>
        <ReleaseTag release="R2" />
      </Row>
      <Card style={{ gap: space.md }}>
        <Small>Bạn nói: “Mình làm 6h–18h hằng ngày, chỉ rảnh 30 phút sau 8h tối.”</Small>
        <Text style={font.h3}>Mỗi tối 20:00 – 20:30</Text>
        <Small>Thứ hai đến chủ nhật · nhắc lúc 19:55</Small>
        <View style={{ flexDirection: 'row', height: 8, borderRadius: 4, overflow: 'hidden', gap: 2 }}>
          <View style={{ flex: 10, backgroundColor: colors.primary }} />
          <View style={{ flex: 15, backgroundColor: colors.primaryMid }} />
          <View style={{ flex: 5, backgroundColor: '#C8E6D3' }} />
        </View>
        <Row style={{ justifyContent: 'space-between' }}>
          <Text style={font.tiny}>10′ thẻ ôn</Text>
          <Text style={font.tiny}>15′ luyện điểm yếu</Text>
          <Text style={font.tiny}>5′ học tiếp</Text>
        </Row>
        <View style={{ backgroundColor: colors.warnSoft, borderRadius: radius.md, padding: space.md, gap: space.sm }}>
          <Text style={{ color: colors.warnText }}>Đề thi thử dài 50 phút, không vừa khung 30 phút. Bạn muốn:</Text>
          <Button small variant="secondary" title="Chủ nhật làm đề đầy đủ (cần 50 phút)" />
          <Button small variant="secondary" title="Đề rút gọn 20 câu, 25 phút" />
        </View>
        <Small>Đề xuất về thời gian học, không trích từ giáo trình.</Small>
        {planApplied ? (
          <Badge text="Đã áp dụng vào lịch" tone="green" />
        ) : (
          <Row>
            <Button title="Áp dụng" style={{ flex: 1 }} onPress={() => setPlanApplied(true)} />
            <Button variant="secondary" title="Chỉnh" onPress={() => router.push('/chat')} />
          </Row>
        )}
      </Card>
    </Screen>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <Row gap={4}>
      <View style={{ width: 12, height: 3, borderRadius: 2, backgroundColor: color }} />
      <Text style={font.tiny}>{label}</Text>
    </Row>
  );
}
