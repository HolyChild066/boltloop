import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppMenu } from '@/components/AppMenu';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { SearchBar } from '@/components/SearchBar';
import { Colors, Radii, Spacing, Typography } from '@/constants/theme';
import { useStore } from '@/store/StoreContext';
import { cartCount, formatUSD } from '@/utils/format';

const QUICK = [
  { label: 'New Sale', icon: 'basket-outline', route: '/pos' },
  { label: 'Add Item', icon: 'cube-outline', route: '/inventory/add' },
  { label: 'Restock', icon: 'refresh-outline', route: '/inventory' },
  { label: 'Scan', icon: 'scan-outline', route: '/pos' },
] as const;

export default function Dashboard() {
  const { revenue, orders, sales, products } = useStore();
  const lowStock = products.filter((p) => p.stock <= 5);
  const pending = sales.filter((s) => s.method === 'later');
  const dueTotal = pending.reduce((sum, s) => sum + s.total, 0);

  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState('');

  function submitSearch() {
    const q = query.trim();
    router.navigate((q ? `/inventory?q=${encodeURIComponent(q)}` : '/inventory') as never);
    setQuery('');
  }

  function showNotifications() {
    const lines = [
      lowStock.length === 0
        ? '• All items are in stock'
        : `• Low stock: ${lowStock.map((p) => p.name).join(', ')}`,
      dueTotal === 0 ? '• No pending payments' : `• ${formatUSD(dueTotal)} awaiting payment`,
    ];
    Alert.alert(
      'Notifications',
      lines.join('\n'),
      [{ text: 'View low stock', onPress: () => router.push('/inventory' as never) }, { text: 'OK' }],
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.appbar}>
        <Pressable accessibilityLabel="Open menu" onPress={() => setMenuOpen(true)}>
          <Ionicons name="menu" size={24} color={Colors.primary} />
        </Pressable>
        <View>
          <Text style={[Typography.caption, { color: Colors.primary }]}>SUPPLIERS APP</Text>
          <Text style={[Typography.heading, { color: Colors.primary }]}>My store</Text>
        </View>
        <Pressable accessibilityLabel="Notifications" onPress={showNotifications} style={styles.bell}>
          <Ionicons name="notifications-outline" size={22} color={Colors.primary} />
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <SearchBar
          value={query}
          onChangeText={setQuery}
          placeholder="Search products"
          onSubmitEditing={submitSearch}
          onFilterPress={() => router.navigate('/inventory' as never)}
        />
        <View style={styles.salesCard}>
          <View style={styles.rowBetween}>
            <Text style={[Typography.body, { color: Colors.background }]}>Today&apos;s Sales</Text>
            <Text style={[Typography.caption, { color: Colors.background }]}>Growth --</Text>
          </View>
          <Text style={[Typography.display, { color: Colors.accent }]}>{formatUSD(revenue)}</Text>
          <Text style={[Typography.caption, { color: Colors.background }]}>A fresh start for your business</Text>
        </View>
        <View style={styles.statsRow}>
          <Card>
            <Text style={[Typography.display, { color: Colors.primary }]}>{orders}</Text>
            <Text style={[Typography.caption, { color: Colors.primary }]}>Orders</Text>
          </Card>
          <Card>
            <Text style={[Typography.display, { color: Colors.primary }]}>{lowStock.length}</Text>
            <Text style={[Typography.caption, { color: Colors.primary }]}>Low Stock</Text>
          </Card>
          <Card>
            <Text style={[Typography.display, { color: Colors.primary }]}>{pending.length}</Text>
            <Text style={[Typography.caption, { color: Colors.primary }]}>Pending Payments</Text>
          </Card>
        </View>
        <View>
          <Text style={[Typography.title, { color: Colors.primary }]}>Quick Actions</Text>
          <View style={styles.quickRow}>
            {QUICK.map((q) => (
              <Pressable key={q.label} onPress={() => router.push(q.route as never)} style={styles.quick}>
                <View style={styles.quickIcon}>
                  <Ionicons name={q.icon as never} size={22} color={Colors.surface} />
                </View>
                <Text style={[Typography.caption, { color: Colors.primary }]}>{q.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>
        <View>
          <Text style={[Typography.title, { color: Colors.primary }]}>Recent Orders</Text>
          <Card>
            {sales.length === 0 ? (
              <>
                <EmptyState icon="bag-outline" title="No sales yet" subtitle="Your first sale starts right here." />
                <Button title="Start a sale" onPress={() => router.push('/pos' as never)} />
              </>
            ) : (
              <Text style={[Typography.body, { color: Colors.primary }]}>
                {orders} orders · {formatUSD(revenue)} · {cartCount(sales.flatMap((s) => s.lines))} units
              </Text>
            )}
          </Card>
        </View>
      </ScrollView>
      <AppMenu visible={menuOpen} onClose={() => setMenuOpen(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  appbar: {
    height: 64,
    paddingHorizontal: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
    backgroundColor: Colors.background,
  },
  bell: { marginLeft: 'auto', width: 40, height: 40, borderRadius: Radii.pill, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center' },
  content: { padding: Spacing.lg, gap: Spacing.lg },
  salesCard: { backgroundColor: Colors.primary, borderRadius: Radii.lg, padding: Spacing.lg, gap: Spacing.sm },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statsRow: { flexDirection: 'row', gap: Spacing.sm },
  quickRow: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm },
  quick: { flex: 1, alignItems: 'center', gap: Spacing.xs },
  quickIcon: { width: 48, height: 48, borderRadius: Radii.pill, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
});
