import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Chip } from '@/components/Chip';
import { Stepper } from '@/components/Stepper';
import { Colors, Radii, Spacing, Typography } from '@/constants/theme';
import { useCartSummary } from '@/hooks/useCartSummary';
import { useStore } from '@/store/StoreContext';
import { formatUSD } from '@/utils/format';

export default function POS() {
  const { products, cart, setQty, addToCart } = useStore();
  const [filter, setFilter] = useState('All items');
  const { count: items, total } = useCartSummary();
  const shown = filter === 'All items' ? products : products.filter((p) => p.category === filter);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.appbar}>
        <Text style={[Typography.heading, { color: Colors.primary, flex: 1 }]}>Point of sale</Text>
        <Pressable accessibilityLabel="Sales history" onPress={() => router.push('/reports' as never)} style={styles.iconBtn}>
          <Ionicons name="time-outline" size={22} color={Colors.primary} />
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.chips}>
          {['All items', 'Fasteners', 'Tools', 'Others'].map((c) => (
            <Chip key={c} label={c} active={filter === c} onPress={() => setFilter(c)} />
          ))}
        </View>
        <View style={styles.rowBetween}>
          <Text style={[Typography.title, { color: Colors.primary }]}>Ready to sell</Text>
          <Text style={[Typography.caption, { color: Colors.accent }]}>{shown.length} items</Text>
        </View>
        {shown.map((p) => {
          const line = cart.find((l) => l.productId === p.id);
          const qty = line?.qty ?? 0;
          return (
            <Card key={p.id}>
              <View style={styles.thumb}>
                <Ionicons name="construct-outline" size={32} color={Colors.primary} />
              </View>
              <Text style={[Typography.body, { color: Colors.primary }]}>{p.name}</Text>
              <Text style={[Typography.caption, { color: Colors.muted }]}>
                {p.category} · {p.variant}
              </Text>
              <Text style={[Typography.title, { color: Colors.accent }]}>{formatUSD(p.price)}</Text>
              <Stepper qty={qty} onMinus={() => setQty(p.id, qty - 1)} onPlus={() => addToCart(p.id, 1)} />
            </Card>
          );
        })}
        <View style={styles.help}>
          <Ionicons name="basket-outline" size={28} color={Colors.surface} />
          <View>
            <Text style={[Typography.title, { color: Colors.surface }]}>Let&apos;s make your first sale</Text>
            <Text style={[Typography.body, { color: Colors.background }]}>Tap + on a product to add it to your cart.</Text>
          </View>
        </View>
        <Card>
          <View style={styles.cartRow}>
            <Ionicons name="cart-outline" size={24} color={Colors.primary} />
            <View style={{ flex: 1 }}>
              <Text style={[Typography.body, { color: Colors.primary }]}>{items === 0 ? 'Your cart is empty' : `${items} items`}</Text>
              <Text style={[Typography.caption, { color: Colors.muted }]}>
                {items} items · {formatUSD(total)}
              </Text>
            </View>
            <View style={{ width: 108 }}>
              <Button title="Charge" disabled={items === 0} onPress={() => router.push('/pos/checkout' as never)} />
            </View>
          </View>
        </Card>
        <Pressable onPress={() => router.push('/inventory' as never)}>
          <Text style={[Typography.caption, { color: Colors.muted, textAlign: 'center' }]}>Manage inventory →</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  appbar: { height: 64, paddingHorizontal: Spacing.lg, flexDirection: 'row', alignItems: 'center', gap: Spacing.lg },
  iconBtn: { width: 40, height: 40, borderRadius: Radii.pill, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center' },
  content: { padding: Spacing.lg, gap: Spacing.lg },
  chips: { flexDirection: 'row', gap: Spacing.sm },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  thumb: { height: 120, borderRadius: Radii.md, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center' },
  help: { backgroundColor: Colors.primary, borderRadius: Radii.lg, padding: Spacing.xl, flexDirection: 'row', gap: Spacing.lg, alignItems: 'center' },
  cartRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
});
