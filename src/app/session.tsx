import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { Adapting } from '../components/Adapting';
import { FlashcardView, RatingBar } from '../components/FlashcardView';
import { QuestionCard } from '../components/QuestionCard';
import { Button, IconButton, Row, Screen, Small, StepBar, TopBar, useAsync } from '../components/ui';
import { cardsApi, learningApi } from '../services/api';
import { colors, font, space } from '../theme';

type Step = 'cards' | 'practice' | 'adapting' | 'learn';
const STEP_INDEX: Record<Step, number> = { cards: 0, practice: 1, adapting: 1, learn: 2 };

/**
 * Phiên học hôm nay gồm 3 bước: Thẻ ôn → Luyện điểm yếu → Học tiếp.
 * Giữa bước 2 và 3 có màn "Gia sư đang điều chỉnh".
 */
export default function Session() {
  const params = useLocalSearchParams<{ step?: Step }>();
  const [step, setStep] = useState<Step>(params.step ?? 'cards');
  const cards = useAsync(() => cardsApi.dueCards()) ?? [];
  const questions = useAsync(() => learningApi.weakPracticeQuestions()) ?? [];

  const [cardIdx, setCardIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [qIdx, setQIdx] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [correct, setCorrect] = useState(0);

  const close = () => (router.canGoBack() ? router.back() : router.replace('/home'));

  if (step === 'adapting') {
    return (
      <Adapting
        subtitle={`Dựa trên ${questions.length} câu luyện điểm yếu bạn vừa làm`}
        steps={[
          { label: 'Chấm bài', result: `${correct}/${questions.length} câu đúng` },
          { label: 'Cập nhật mức thành thạo', result: '2 năng lực' },
          { label: 'Tạo thẻ ôn từ câu sai', result: `+${questions.length - correct} thẻ` },
          { label: 'Sắp xếp lại phiên ngày mai', result: 'mẫu số lên đầu' },
        ]}
        primaryLabel="Bước 3: Học tiếp"
        onPrimary={() => setStep('learn')}
        secondaryLabel="Dừng ở đây, về trang chủ"
        onSecondary={() => router.replace('/home')}
      />
    );
  }

  if (step === 'learn') {
    // Bước 3 dùng chung màn học chủ đề
    return <LearnRedirect />;
  }

  const header = (title: string, counter: string) => (
    <TopBar left="close" onLeft={close} title={title} right={<Small>{counter}</Small>}>
      <StepBar steps={['Thẻ ôn', 'Luyện điểm yếu', 'Học tiếp']} current={STEP_INDEX[step]} />
    </TopBar>
  );

  if (step === 'cards') {
    const card = cards[cardIdx];
    return (
      <Screen
        header={header('Phiên hôm nay', `${Math.min(cardIdx + 1, cards.length)}/${cards.length} thẻ`)}
        footer={
          flipped ? (
            <RatingBar
              onRate={(r) => {
                if (card) cardsApi.grade(card.id, r);
                setFlipped(false);
                if (cardIdx + 1 >= cards.length) setStep('practice');
                else setCardIdx(cardIdx + 1);
              }}
            />
          ) : (
            <>
              <Button variant="secondary" title="Bỏ qua bước" onPress={() => setStep('practice')} />
              <Button style={{ flex: 1 }} title="Xem đáp án" onPress={() => setFlipped(true)} />
            </>
          )
        }
      >
        {card ? <FlashcardView card={card} flipped={flipped} onFlip={() => setFlipped(!flipped)} /> : <Small>Không có thẻ đến hạn.</Small>}
      </Screen>
    );
  }

  // step === 'practice'
  const q = questions[qIdx];
  const lastQ = qIdx === questions.length - 1;
  return (
    <Screen
      header={header('Phiên hôm nay', `Câu ${qIdx + 1}/${questions.length || 6}`)}
      footer={
        <>
          <IconButton icon="flag" label="Báo lỗi câu này" bordered onPress={() => router.push({ pathname: '/report', params: { q: q?.id } })} />
          <Button
            style={{ flex: 1 }}
            title={lastQ ? 'Hoàn thành luyện tập' : 'Câu tiếp'}
            disabled={!answered}
            onPress={() => {
              setAnswered(false);
              if (lastQ) setStep('adapting');
              else setQIdx(qIdx + 1);
            }}
          />
        </>
      }
    >
      <Row style={{ justifyContent: 'space-between', marginBottom: space.md }}>
        <Row gap={4}>
          {questions.map((_, i) => (
            <View key={i} style={{ width: i === qIdx ? 18 : 8, height: 8, borderRadius: 4, backgroundColor: i < qIdx ? colors.primary : i === qIdx ? colors.dark : colors.border }} />
          ))}
        </Row>
        {q ? <Text style={font.tiny}>Độ khó: {q.difficulty}</Text> : null}
      </Row>
      {q ? (
        <QuestionCard
          key={q.id}
          question={q}
          showWhy
          onAnswered={(ok) => {
            setAnswered(true);
            if (ok) setCorrect((c) => c + 1);
          }}
        />
      ) : null}
    </Screen>
  );
}

function LearnRedirect() {
  // Chuyển sang màn học tiếp chủ đề đang dở
  return <Redirect href="/learn/dt-3?fromSession=1" />;
}
