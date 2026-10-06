import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Colors, Radii, Spacing, Typography } from '@/constants/theme';
import { useCartSummary } from '@/hooks/useCartSummary';
import { useStore } from '@/store/StoreContext';
import type { PaymentMethodId } from '@/types';
import { formatUSD } from '@/utils/format';

const METHODS: { id: PaymentMethodId; label: string; icon: string }[] = [
  { id: 'cash', label: 'Cash', icon: 'cash-outline' },
  { id: 'card', label: 'Card', icon: 'card-outline' },
  { id: 'qr', label: 'QR / e-wallet', icon: 'qr-code-outline' },
  { id: 'bank', label: 'Bank transfer', icon: 'business-outline' },
  { id: 'later', label: 'Pay later', icon: 'time-outline' },
];

export default function Checkout() {
  const { cart, checkout } = useStore();
  const [method, setMethod] = useState<PaymentMethodId>('cash');
  const { total } = useCartSummary();

  function pay() {
    const sale = checkout(method);
    if (sale) router.replace(`/pos/confirmation?id=${sale.id}` as never);
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.appbar}>
        <Pressable onPress={() => router.back()}>
          <Text style={[Typography.title, { color: Colors.primary }]}>‹ Back</Text>
        </Pressable>
        <Text style={[Typography.heading, { color: Colors.primary }]}>Checkout</Text>
      </View>
      <View style={styles.content}>
        <Card>
          <Text style={[Typography.title, { color: Colors.primary }]}>{formatUSD(total)}</Text>
          <Text style={[Typography.caption, { color: Colors.muted }]}>{cart.length} lines in cart</Text>
        </Card>
        {METHODS.map((m) => (
          <Pressable key={m.id} onPress={() => setMethod(m.id)} style={[styles.method, method === m.id && styles.selected]}>
            <Ionicons name={m.icon as never} size={22} color={Colors.primary} />
            <Text style={[Typography.body, { color: Colors.primary }]}>{m.label}</Text>
            {method === m.id ? <Ionicons name="checkmark-circle" size={22} color={Colors.primary} /> : null}
          </Pressable>
        ))}
        <Button title={`Collect ${formatUSD(total)}`} onPress={pay} disabled={cart.length === 0} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  appbar: { height: 64, paddingHorizontal: Spacing.lg, flexDirection: 'row', alignItems: 'center', gap: Spacing.lg },
  content: { padding: Spacing.lg, gap: Spacing.md },
  method: { backgroundColor: Colors.surface, borderRadius: Radii.lg, padding: Spacing.lg, flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  selected: { borderWidth: 2, borderColor: Colors.primary },
});
