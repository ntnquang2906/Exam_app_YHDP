import { Redirect } from 'expo-router';
import { useAppStore } from '../store/useAppStore';

export default function Index() {
  const { signedIn, role } = useAppStore();
  if (!signedIn) return <Redirect href="/login" />;
  if (role === 'expert') return <Redirect href="/expert" />;
  if (role === 'ministry') return <Redirect href="/admin" />;
  return <Redirect href="/home" />;
}
