import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { BarChart, ForgettingCurve, HBar, LineChart, heatColor } from '../../components/charts';
import { Badge, Button, Card, Chip, Label, ProgressBar, Row, Screen, Segmented, Small } from '../../components/ui';
import { learner, progressData as P } from '../../data/mock';
import { colors, font, radius, space } from '../../theme';

export default function Progress() {
  const [tab, setTab] = useState<'skill' | 'rhythm'>('skill');
  return (
    <Screen>
      <Row style={{ justifyContent: 'space-between' }}>
        <Text style={font.h1}>Tiến độ</Text>
        <Row gap={4}>
          <Feather name="calendar" size={14} color={colors.muted} />
          <Small>
            Còn <Text style={{ fontWeight: '700', color: colors.text }}>{learner.daysToExam} ngày</Text> đến kỳ thi
          </Small>
        </Row>
      </Row>
      <View style={{ marginTop: space.md }}>
        <Segmented
          value={tab}
          onChange={(v) => setTab(v as 'skill' | 'rhythm')}
          options={[
            { value: 'skill', label: 'Năng lực', hint: 'Bạn biết gì' },
            { value: 'rhythm', label: 'Nhịp học', hint: 'Bạn học thế nào' },
          ]}
        />
      </View>
      {tab === 'skill' ? <Skill /> : <Rhythm />}
    </Screen>
  );
}

function Skill() {
  const [range, setRange] = useState<'3' | 'all'>('3');
  const [openDomain, setOpenDomain] = useState<string | null>('Thống kê y sinh');
  return (
    <View style={{ gap: space.md, marginTop: space.md }}>
      <Row>
        <Small>Tính trên</Small>
        <Chip label="3 đề gần nhất" tone="dark" selected={range === '3'} onPress={() => setRange('3')} />
        <Chip label="Tất cả 4 đề" tone="dark" selected={range === 'all'} onPress={() => setRange('all')} />
      </Row>

      <Card>
        <Label>Độ phủ chương trình</Label>
        <Text style={{ marginTop: space.sm }}>
          <Text style={{ fontSize: 34, fontWeight: '800' }}>{P.coverage.done}</Text>
          <Text style={font.small}> / {P.coverage.total} vấn đề cốt lõi đã luyện</Text>
        </Text>
        <View style={{ marginVertical: space.md }}>
          <ProgressBar value={P.coverage.done / P.coverage.total} height={8} />
        </View>
        {P.coverageByModule.map((m) => (
          <Row key={m.name} style={{ paddingVertical: 6 }}>
            <Text style={{ flex: 1, fontSize: 14 }}>{m.name}</Text>
            <View style={{ width: 80 }}>
              <ProgressBar value={m.value} height={4} />
            </View>
            <Text style={[font.tiny, { width: 64, textAlign: 'right' }]}>{m.label}</Text>
          </Row>
        ))}
        <Pressable onPress={() => router.push('/practice')} style={{ marginTop: space.sm }}>
          <Text style={{ color: colors.primary, fontWeight: '700', fontSize: 13 }}>Xem tất cả 8 học phần</Text>
        </Pressable>
      </Card>

      <Card>
        <Row style={{ justifyContent: 'space-between' }}>
          <Label>Cần ưu tiên</Label>
          <Text style={font.tiny}>từ 3 đề gần nhất</Text>
        </Row>
        {P.priorities.map((p, i) => (
          <Row key={p.name} style={{ paddingVertical: space.md, borderBottomWidth: i < 2 ? 1 : 0, borderBottomColor: colors.border }}>
            <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: colors.warnSoft, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: colors.warnText, fontWeight: '700', fontSize: 12 }}>{i + 1}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: '700', fontSize: 15 }}>{p.name}</Text>
              <Small>{p.detail}</Small>
            </View>
            <Button small variant="soft" title="Luyện" onPress={() => router.push('/session?step=practice')} />
          </Row>
        ))}
      </Card>

      <Card>
        <Row style={{ justifyContent: 'space-between' }}>
          <Label>Điểm cả đề</Label>
          <Pressable onPress={() => router.push('/exam/history')}>
            <Text style={{ color: colors.primary, fontWeight: '700', fontSize: 13 }}>Lịch sử thi</Text>
          </Pressable>
        </Row>
        <Small style={{ marginTop: space.sm }}>Câu đúng mỗi đề: 29 → 31 → 33 / 40</Small>
        <LineChart values={P.examScores.map((s) => s.value)} labels={P.examScores.map((s) => s.label)} maxValue={40} />
      </Card>

      <Card>
        <Label>Câu đúng theo miền năng lực</Label>
        <Small style={{ marginTop: 4 }}>Mỗi đề chỉ có 4–8 câu cho một miền, nên hãy đọc cột Gộp. Chạm một miền để xem từng vấn đề cốt lõi.</Small>
        <Row style={{ marginTop: space.md }}>
          <Text style={[font.tiny, { flex: 1 }]}>Miền</Text>
          {['Đề 2', 'Đề 3', 'Đề 4', 'Gộp'].map((h) => (
            <Text key={h} style={[font.tiny, { width: 46, textAlign: 'center', fontWeight: h === 'Gộp' ? '700' : '400' }]}>
              {h}
            </Text>
          ))}
        </Row>
        {P.domainMatrix.map((d) => (
          <View key={d.domain}>
            <Pressable onPress={() => setOpenDomain(openDomain === d.domain ? null : d.domain)}>
              <Row style={{ paddingVertical: 6 }}>
                <Text style={{ flex: 1, fontSize: 13 }}>{d.domain}</Text>
                {d.cells.map((c, i) => (
                  <View key={i} style={{ width: 46, alignItems: 'center' }}>
                    <View style={{ backgroundColor: heatColor(d.ratio), borderRadius: 4, paddingVertical: 4, width: 42, alignItems: 'center' }}>
                      <Text style={{ fontSize: 11 }}>{c}</Text>
                    </View>
                  </View>
                ))}
                <View style={{ width: 46, alignItems: 'center' }}>
                  <View style={{ backgroundColor: heatColor(d.ratio), borderRadius: 4, paddingVertical: 4, width: 42, alignItems: 'center', borderWidth: 1.5, borderColor: colors.dark }}>
                    <Text style={{ fontSize: 11, fontWeight: '700' }}>{d.total}</Text>
                  </View>
                </View>
              </Row>
            </Pressable>
            {openDomain === d.domain && d.sub ? (
              <View style={{ backgroundColor: colors.bg, borderRadius: radius.sm, padding: space.md, marginBottom: space.sm, gap: 4 }}>
                {d.sub.map(([n, v]) => (
                  <Row key={n} style={{ justifyContent: 'space-between' }}>
                    <Small>{n}</Small>
                    <Text style={{ fontSize: 13, fontWeight: '700' }}>{v}</Text>
                  </Row>
                ))}
                <Row style={{ marginTop: space.sm }}>
                  <Button small variant="secondary" title="Xem câu sai" onPress={() => router.push('/exam/de-4/review')} style={{ flex: 1 }} />
                  <Button small title="Luyện miền này" onPress={() => router.push('/session?step=practice')} style={{ flex: 1 }} />
                </Row>
              </View>
            ) : null}
          </View>
        ))}
        <Row style={{ justifyContent: 'space-between', marginTop: space.sm }}>
          <Text style={font.tiny}>Ít đúng → Nhiều đúng</Text>
          <Text style={font.tiny}>ô = đúng / số câu</Text>
        </Row>
      </Card>

      <Card>
        <Label>Theo mức nhận thức</Label>
        <Small style={{ marginTop: 4, marginBottom: space.md }}>Câu càng đòi hỏi vận dụng, bạn càng hay sai.</Small>
        {P.bloom.map((b) => (
          <HBar key={b.name} label={b.name} value={b.value / b.total} right={`${b.value}/${b.total}`} />
        ))}
      </Card>
    </View>
  );
}

function Rhythm() {
  const R = P.rhythm;
  const days = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
  const total = R.cardStates.new + R.cardStates.learning + R.cardStates.mastered;
  return (
    <View style={{ gap: space.md, marginTop: space.md }}>
      <Row gap={space.md} style={{ alignItems: 'stretch' }}>
        <Card style={{ flex: 1 }}>
          <Small>Thời gian tuần này</Small>
          <Text style={{ fontSize: 24, fontWeight: '800', marginTop: 4 }}>{R.weekTime}</Text>
          <Text style={font.tiny}>Tuần trước: {R.lastWeek}</Text>
        </Card>
        <Card style={{ flex: 1 }}>
          <Small>Ngày có học</Small>
          <Text style={{ fontSize: 24, fontWeight: '800', marginTop: 4 }}>{R.activeDays}</Text>
          <Text style={font.tiny}>ngày đã qua của tuần</Text>
        </Card>
      </Row>

      <Card>
        <Label>8 tuần gần nhất</Label>
        <Small style={{ marginTop: 4 }}>Mỗi ô là một ngày, đậm hơn là học lâu hơn.</Small>
        <Row gap={4} style={{ marginTop: space.md }}>
          <Text style={[font.tiny, { width: 36 }]} />
          {days.map((d) => (
            <Text key={d} style={[font.tiny, { flex: 1, textAlign: 'center' }]}>
              {d}
            </Text>
          ))}
        </Row>
        {R.heatmap.map((week, wi) => (
          <Row key={wi} gap={4} style={{ marginTop: 4 }}>
            <Text style={[font.tiny, { width: 36 }]}>{R.weeks[wi]}</Text>
            {week.map((v, di) => (
              <View key={di} style={{ flex: 1, height: 22, borderRadius: 4, backgroundColor: heatColor(v / 4), borderWidth: wi === 7 && di === 5 ? 2 : 0, borderColor: colors.dark }} />
            ))}
          </Row>
        ))}
        <Text style={[font.tiny, { marginTop: space.sm }]}>Không học ░ → Trên 75 phút</Text>
      </Card>

      <View style={{ backgroundColor: colors.dark, borderRadius: radius.lg, padding: space.lg, gap: space.sm }}>
        <Text style={[font.label, { color: colors.primaryMid }]}>ĐƯỜNG GHI NHỚ</Text>
        <Text style={{ color: colors.white, fontSize: 18, fontWeight: '800' }}>12 thẻ vừa chạm ngưỡng nhớ — ôn bây giờ là đúng lúc</Text>
        <ForgettingCurve />
        <Text style={{ color: '#9FB1A7', fontSize: 12 }}>
          Mỗi lần ôn đúng lúc, độ nhớ quay về 100% và giảm chậm hơn — khoảng cách tới lần ôn sau dài ra.
        </Text>
      </View>

      <Card>
        <Row style={{ justifyContent: 'space-between' }}>
          <Label>Trí nhớ</Label>
          <Pressable onPress={() => router.push('/flashcards')}>
            <Text style={{ color: colors.primary, fontWeight: '700', fontSize: 13 }}>Bộ thẻ trong Luyện tập</Text>
          </Pressable>
        </Row>
        <Text style={{ fontSize: 34, fontWeight: '800', marginTop: space.sm }}>{Math.round(R.retention * 100)}%</Text>
        <Small>thẻ nhớ đúng khi ôn · 30 ngày · 214 lượt ôn</Small>
        <View style={{ flexDirection: 'row', height: 8, borderRadius: 8, overflow: 'hidden', marginTop: space.md }}>
          <View style={{ flex: R.cardStates.new / total, backgroundColor: '#D3EBDC' }} />
          <View style={{ flex: R.cardStates.learning / total, backgroundColor: colors.primaryMid }} />
          <View style={{ flex: R.cardStates.mastered / total, backgroundColor: colors.primary }} />
        </View>
        <Text style={[font.tiny, { marginTop: 6 }]}>
          Mới · {R.cardStates.new}   Đang học · {R.cardStates.learning}   Đã thuộc · {R.cardStates.mastered}
        </Text>

        <Text style={{ fontWeight: '700', marginTop: space.lg }}>Độ nhớ theo học phần</Text>
        <Small style={{ marginBottom: space.md }}>Hiện tại → sau 7 ngày nếu không ôn</Small>
        {R.retentionByModule.map((m) => (
          <HBar key={m.name} label={m.name} value={m.now} secondary={m.later} right={`${Math.round(m.now * 100)}% → ${Math.round(m.later * 100)}%`} />
        ))}
        <Row gap={space.md}>
          <Badge text="Còn nhớ sau 7 ngày" tone="green" />
          <Badge text="Sẽ quên nếu không ôn" tone="warn" />
        </Row>

        <Text style={{ fontWeight: '700', marginTop: space.lg, marginBottom: space.sm }}>Thẻ đến hạn 7 ngày tới</Text>
        <BarChart data={R.dueNext7.map((d, i) => ({ ...d, highlight: i === 0 }))} />
        <Row style={{ marginTop: space.md }}>
          <Button title="Ôn 12 thẻ hôm nay" onPress={() => router.push('/flashcards/review')} style={{ flex: 1 }} />
          <Button variant="secondary" title="9 thẻ khó" onPress={() => router.push('/flashcards/browse?filter=hard')} />
        </Row>
      </Card>

      <Card>
        <Row style={{ justifyContent: 'space-between' }}>
          <Label>Hoạt động tuần này</Label>
          <Text style={font.tiny}>5–10/10</Text>
        </Row>
        {R.activity.map((a, i) => (
          <Row key={i} style={{ paddingVertical: space.md, borderBottomWidth: i < R.activity.length - 1 ? 1 : 0, borderBottomColor: colors.border }}>
            <Badge text={a.kind} tone={a.kind === 'Thi thử' ? 'dark' : 'gray'} style={{ width: 76 }} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: '600' }}>{a.title}</Text>
              <Text style={font.tiny}>{a.when}</Text>
            </View>
            <Text style={{ fontSize: 13, fontWeight: '700' }}>{a.result}</Text>
          </Row>
        ))}
      </Card>
    </View>
  );
}
