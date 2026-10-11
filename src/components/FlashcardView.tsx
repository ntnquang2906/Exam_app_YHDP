import { Feather } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import type { Flashcard } from '../data/types';
import { colors, font, radius, space } from '../theme';
import { Badge } from './ui';

export const RATINGS = [
  { rating: 1 as const, label: 'Quên', interval: '10 phút', short: '<1 phút', bg: colors.warnSoft, fg: colors.warnText },
  { rating: 2 as const, label: 'Khó', interval: '1 ngày', short: '6 phút', bg: colors.surface, fg: colors.text },
  { rating: 3 as const, label: 'Nhớ', interval: '3 ngày', short: '1 ngày', bg: colors.primarySoft, fg: colors.primaryDark },
  { rating: 4 as const, label: 'Dễ', interval: '7 ngày', short: '4 ngày', bg: colors.blueSoft, fg: colors.blue },
];

/** Mặt thẻ: chạm để lật. Khoảng ôn thật do thuật toán FSRS ở backend tính. */
export function FlashcardView({ card, flipped, onFlip }: { card: Flashcard; flipped: boolean; onFlip: () => void }) {
  return (
    <Pressable
      onPress={onFlip}
      accessibilityRole="button"
      accessibilityLabel={flipped ? 'Mặt sau thẻ' : 'Chạm để xem đáp án'}
      style={{ backgroundColor: colors.surface, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border, padding: space.xl, minHeight: 320, gap: space.md }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: space.sm }}>
        <View>
          <Text style={[font.label, { color: colors.primary }]}>THẺ ÔN</Text>
          <Text style={font.tiny}>{card.topic}</Text>
        </View>
        {card.dueLabel.startsWith('Quá hạn') ? <Badge text={card.dueLabel} tone="warn" /> : <Badge text={card.origin} />}
      </View>
      <Text style={{ fontSize: 22, fontWeight: '800', color: colors.text, lineHeight: 30 }}>{card.front}</Text>
      {flipped ? (
        <>
          <View style={{ height: 1, borderStyle: 'dashed', borderWidth: 0.5, borderColor: colors.border }} />
          <Text style={font.serif}>{card.back}</Text>
          <View style={{ alignSelf: 'flex-start', backgroundColor: colors.primarySoft, borderRadius: radius.sm, paddingHorizontal: 12, paddingVertical: 8 }}>
            <Text style={{ color: colors.primaryDark, fontSize: 13 }}>
              {card.source.doc}, tr. {card.source.page}
            </Text>
          </View>
          {card.reason ? (
            <View style={{ backgroundColor: colors.bg, borderRadius: radius.sm, padding: space.md, flexDirection: 'row', gap: space.sm }}>
              <Feather name="corner-down-right" size={14} color={colors.primary} style={{ marginTop: 2 }} />
              <Text style={[font.small, { flex: 1 }]}>
                <Text style={{ fontWeight: '700', color: colors.text }}>Vì sao có thẻ này: </Text>
                {card.reason}
              </Text>
            </View>
          ) : null}
        </>
      ) : (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
          <Text style={font.small}>Chạm để xem đáp án</Text>
        </View>
      )}
    </Pressable>
  );
}

export function RatingBar({ onRate, variant = 'session' }: { onRate: (r: 1 | 2 | 3 | 4) => void; variant?: 'session' | 'review' }) {
  return (
    <View style={{ flex: 1, gap: space.sm }}>
      {variant === 'session' ? <Text style={[font.tiny, { textAlign: 'center' }]}>Bạn nhớ đến đâu? Lần ôn tiếp theo được hẹn theo câu trả lời.</Text> : null}
      <View style={{ flexDirection: 'row', gap: space.sm }}>
        {RATINGS.map((r) => (
          <Pressable
            key={r.rating}
            onPress={() => onRate(r.rating)}
            accessibilityRole="button"
            accessibilityLabel={`${r.label}, ôn lại sau ${r.interval}`}
            style={{ flex: 1, minHeight: 56, borderRadius: radius.md, borderWidth: 1, borderColor: r.rating === 3 ? colors.primary : colors.border, backgroundColor: r.bg, alignItems: 'center', justifyContent: 'center' }}
          >
            {variant === 'review' ? <Text style={{ fontSize: 11, color: r.fg }}>{r.short}</Text> : null}
            <Text style={{ fontWeight: '800', color: r.fg }}>{variant === 'review' ? ['Học lại', 'Khó', 'Tốt', 'Dễ'][r.rating - 1] : r.label}</Text>
            {variant === 'session' ? <Text style={{ fontSize: 11, color: r.fg }}>{r.interval}</Text> : null}
          </Pressable>
        ))}
      </View>
    </View>
  );
}
