import { Stack } from 'expo-router';
import { StoreProvider } from '@/store/StoreContext';

export default function RootLayout() {
  return (
    <StoreProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="inventory/add" options={{ presentation: 'modal', headerShown: false }} />
        <Stack.Screen name="pos/checkout" options={{ headerShown: false }} />
        <Stack.Screen name="pos/confirmation" options={{ headerShown: false }} />
      </Stack>
    </StoreProvider>
  );
}
