import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { ExpertShell } from '../../components/ExpertShell';
import { Badge, Button, Card, Notice, Row, Small, useAsync, useIsWide } from '../../components/ui';
import type { ReviewDecision } from '../../data/types';
import { reviewApi } from '../../services/api';
import { colors, font, radius, space } from '../../theme';

const DECISIONS: { value: ReviewDecision; label: string }[] = [
  { value: 'pass', label: 'Đạt' },
  { value: 'revise', label: 'Cần sửa' },
  { value: 'reject', label: 'Loại' },
];

// Bàn thẩm định: duyệt câu hỏi vòng 1 (nội dung chuyên môn) / vòng 2
export default function ReviewDesk() {
  const queue = useAsync(() => reviewApi.queue()) ?? [];
  const wide = useIsWide();
  const [idx, setIdx] = useState(0);
  const [decision, setDecision] = useState<ReviewDecision | null>(null);
  const [comment, setComment] = useState('');
  const [done, setDone] = useState<Record<string, ReviewDecision>>({});
  const [toast, setToast] = useState<string | null>(null);

  const item = queue[idx];
  if (!item) return <ExpertShell><Small>Đang tải hàng đợi…</Small></ExpertShell>;
  const q = item.question;
  const total = 18;
  const needComment = decision === 'revise' || decision === 'reject';
  const canSubmit = !!decision && (!needComment || comment.trim().length > 0);

  const go = (n: number) => {
    setIdx(Math.max(0, Math.min(queue.length - 1, n)));
    setDecision(null);
    setComment('');
  };
  const submit = async () => {
    if (!decision) return;
    await reviewApi.decide(item.id, decision, comment);
    setDone({ ...done, [item.id]: decision });
    setToast(`Đã gửi quyết định “${DECISIONS.find((d) => d.value === decision)!.label}” cho ${item.id}`);
    setTimeout(() => setToast(null), 2500);
    go(idx + 1);
  };

  return (
    <ExpertShell>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: space.md, marginBottom: space.lg }}>
        <View>
          <Small>Hàng đợi duyệt › Câu {item.id}</Small>
          <Text style={font.h2}>
            Duyệt câu hỏi · Vòng {item.round} — {item.round === 1 ? 'Nội dung chuyên môn' : 'Thẩm định chéo'}
          </Text>
        </View>
        <Row>
          <Small>
            Câu {idx + 4} / {total} trong hàng đợi
          </Small>
          <Button small variant="secondary" title="Câu trước" disabled={idx === 0} onPress={() => go(idx - 1)} />
          <Button small variant="secondary" title="Câu sau" disabled={idx === queue.length - 1} onPress={() => go(idx + 1)} />
        </Row>
      </View>

      {toast ? (
        <View style={{ marginBottom: space.md }}>
          <Notice tone="green" icon="check-circle">
            {toast}
          </Notice>
        </View>
      ) : null}

      <View style={{ flexDirection: wide ? 'row' : 'column', gap: space.lg, alignItems: 'flex-start' }}>
        <Card style={{ flex: wide ? 1.6 : undefined, width: wide ? undefined : '100%', gap: space.md }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
            {item.tags.map((t, i) => (
              <Badge key={t} text={t} tone={i === 0 ? 'green' : 'gray'} />
            ))}
            {q.aiAssisted || item.provenance.includes('AI') ? <Badge text="Bản nháp có AI hỗ trợ" tone="warn" /> : null}
            {done[item.id] ? <Badge text="Đã quyết định" tone="dark" /> : null}
          </View>
          <Text style={[font.h3, { fontSize: 18, lineHeight: 26 }]}>{q.stem}</Text>
          {q.options.map((o) => {
            const correct = o.id === q.correctId;
            return (
              <View key={o.id} style={{ borderWidth: correct ? 1.5 : 1, borderColor: correct ? colors.primary : colors.border, backgroundColor: correct ? colors.primarySoft : colors.surface, borderRadius: radius.md, padding: space.md, gap: 4 }}>
                <Row style={{ justifyContent: 'space-between' }}>
                  <Text style={{ fontWeight: '700', fontSize: 15 }}>
                    {o.id}. {o.text}
                  </Text>
                  {correct ? <Text style={{ color: colors.primaryDark, fontWeight: '700', fontSize: 12 }}>Đáp án đúng</Text> : null}
                </Row>
                <Text style={font.small}>
                  {correct ? 'Giải thích: ' : 'Lý giải phương án nhiễu: '}
                  {o.rationale ?? (correct ? q.explanation : '[Chưa có lý giải — cần bổ sung]')}
                </Text>
                {correct ? <Text style={font.small}>Liên kết nguồn: {q.source.doc}, tr. {q.source.page}</Text> : null}
              </View>
            );
          })}
          <View style={{ borderTopWidth: 1, borderTopColor: colors.border, paddingTop: space.md }}>
            <Text style={font.label}>NGUỒN GỐC CÂU HỎI</Text>
            <Small style={{ marginTop: 4 }}>{item.provenance}</Small>
          </View>
        </Card>

        <Card style={{ flex: wide ? 1 : undefined, width: wide ? undefined : '100%', gap: space.sm }}>
          <Text style={{ color: colors.primary, fontWeight: '700', fontSize: 12 }}>Đoạn nguồn được liên kết</Text>
          <Text style={font.h3}>{q.source.doc}</Text>
          <Small>Trang {q.source.page} · còn hiệu lực</Small>
          <View style={{ backgroundColor: colors.bg, borderRadius: radius.md, padding: space.md }}>
            <Text style={font.serif}>{q.source.excerpt ?? '[Đoạn giáo trình gốc sẽ hiển thị khi học liệu được nạp.]'}</Text>
          </View>
          <Pressable>
            <Text style={{ color: colors.primary, fontWeight: '700', fontSize: 13 }}>Mở trang {q.source.page} trong thư viện học liệu</Text>
          </Pressable>
        </Card>
      </View>

      <Card style={{ marginTop: space.lg }}>
        <View style={{ flexDirection: wide ? 'row' : 'column', gap: space.lg, alignItems: wide ? 'flex-end' : 'stretch' }}>
          <View style={{ gap: space.sm }}>
            <Text style={{ fontWeight: '700', fontSize: 13 }}>Quyết định vòng {item.round}</Text>
            <Row>
              {DECISIONS.map((d) => {
                const on = decision === d.value;
                return (
                  <Pressable
                    key={d.value}
                    onPress={() => setDecision(d.value)}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: on }}
                    style={{ flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: on ? 1.5 : 1, borderColor: on ? colors.primary : colors.border, backgroundColor: on ? colors.primarySoft : colors.surface, borderRadius: radius.sm, paddingHorizontal: 14, minHeight: 44 }}
                  >
                    <View style={{ width: 14, height: 14, borderRadius: 7, borderWidth: 1.5, borderColor: on ? colors.primary : colors.faint, alignItems: 'center', justifyContent: 'center' }}>
                      {on ? <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.primary }} /> : null}
                    </View>
                    <Text style={{ fontWeight: '600' }}>{d.label}</Text>
                  </Pressable>
                );
              })}
            </Row>
          </View>
          <View style={{ flex: 1, gap: space.sm }}>
            <Text style={{ fontWeight: '700', fontSize: 13 }}>Nhận xét {needComment ? '(bắt buộc)' : '(bắt buộc khi Cần sửa hoặc Loại)'}</Text>
            <TextInput
              value={comment}
              onChangeText={setComment}
              multiline
              placeholder="Lý do, đề xuất chỉnh sửa, hoặc ghi rõ phương án (A–D) cần sửa…"
              placeholderTextColor={colors.faint}
              accessibilityLabel="Nhận xét"
              style={{ minHeight: 64, borderWidth: 1, borderColor: needComment && !comment.trim() ? colors.danger : colors.border, borderRadius: radius.sm, padding: space.md, fontSize: 14, textAlignVertical: 'top' }}
            />
          </View>
          <Button title="Gửi quyết định" disabled={!canSubmit} onPress={submit} />
        </View>
      </Card>
    </ExpertShell>
  );
}
