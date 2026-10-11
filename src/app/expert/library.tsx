import { Feather } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { ExpertShell } from '../../components/ExpertShell';
import { PageHeader } from '../../components/Shell';
import { Badge, Button, Card, Row, Small } from '../../components/ui';
import { library } from '../../data/mock';
import { colors, font, radius, space } from '../../theme';

export default function Library() {
  return (
    <ExpertShell>
      <PageHeader title="Thư viện học liệu" subtitle="Giáo trình đã số hoá, dùng làm nguồn trích dẫn cho câu hỏi và gia sư AI" actions={<Button small icon="upload" title="Nạp tài liệu" />} />
      <View style={{ gap: space.md }}>
        {library.map((d) => (
          <Card key={d.id}>
            <Row gap={space.md}>
              <View style={{ width: 44, height: 44, borderRadius: radius.sm, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' }}>
                <Feather name="book" size={20} color={colors.primary} />
              </View>
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={font.h3}>{d.name}</Text>
                <Small>
                  {d.pages} trang · {d.license}
                </Small>
              </View>
              <Badge text={d.status} tone={d.status === 'Còn hiệu lực' ? 'green' : 'warn'} />
            </Row>
          </Card>
        ))}
      </View>
    </ExpertShell>
  );
}
