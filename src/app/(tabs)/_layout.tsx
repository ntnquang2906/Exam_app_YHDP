import { Feather } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { colors } from '../../theme';

type IconName = React.ComponentProps<typeof Feather>['name'];

const tab = (title: string, icon: IconName) => ({
  title,
  tabBarIcon: ({ color, size }: { color: string; size: number }) => <Feather name={icon} size={size - 2} color={color} />,
});

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        sceneStyle: { backgroundColor: colors.bg },
      }}
    >
      <Tabs.Screen name="home" options={tab('Trang chủ', 'home')} />
      <Tabs.Screen name="chat" options={tab('Hỏi đáp', 'message-circle')} />
      <Tabs.Screen name="practice" options={tab('Luyện tập', 'edit-3')} />
      <Tabs.Screen name="exams" options={tab('Thi thử', 'clock')} />
      <Tabs.Screen name="progress" options={tab('Tiến độ', 'bar-chart-2')} />
    </Tabs>
  );
}
