import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { Colors, Radii, Spacing, Typography } from '@/constants/theme';
import { useStore } from '@/store/StoreContext';
import { formatUSD } from '@/utils/format';

const METHODS = [
  { id: 'cash', label: 'Cash', icon: 'cash-outline' },
  { id: 'card', label: 'Card', icon: 'card-outline' },
  { id: 'qr', label: 'QR / e-wallet', icon: 'qr-code-outline' },
  { id: 'bank', label: 'Bank transfer', icon: 'business-outline' },
  { id: 'later', label: 'Pay later', icon: 'time-outline' },
] as const;

export default function Payment() {
  const { sales } = useStore();
  const unpaid = sales.filter((s) => s.method === 'later');
  const due = unpaid.reduce((sum, x) => sum + x.total, 0);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.appbar}>
        <Text style={[Typography.heading, { color: Colors.primary, flex: 1 }]}>Payment</Text>
        <View style={styles.iconBtn}>
          <Ionicons name="wallet-outline" size={22} color={Colors.primary} />
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.due}>
          <View style={styles.rowBetween}>
            <Text style={[Typography.body, { color: Colors.background }]}>Amount due</Text>
            <Ionicons name="wallet-outline" size={20} color={Colors.background} />
          </View>
          <Text style={[Typography.display, { color: Colors.accent }]}>{formatUSD(due)}</Text>
          <Text style={[Typography.caption, { color: Colors.background }]}>
            {unpaid.length === 0
              ? 'No outstanding payments'
              : `${unpaid.length} unpaid ${unpaid.length === 1 ? 'order' : 'orders'} on Pay later`}
          </Text>
        </View>
        <Text style={[Typography.title, { color: Colors.primary }]}>Payment methods</Text>
        <View style={styles.grid}>
          {METHODS.map((m) => (
            <Card key={m.id}>
              <View style={styles.methodIcon}>
                <Ionicons name={m.icon as never} size={22} color={Colors.primary} />
              </View>
              <Text style={[Typography.caption, { color: Colors.primary, textAlign: 'center' }]}>{m.label}</Text>
            </Card>
          ))}
        </View>
        <Text style={[Typography.caption, { color: Colors.muted }]}>Choose a method when you have a sale to collect.</Text>
        <Text style={[Typography.title, { color: Colors.primary }]}>Recent transactions</Text>
        <Card>
          {sales.length === 0 ? (
            <EmptyState icon="receipt-outline" title="No transactions yet" subtitle="Completed payments will appear here." />
          ) : (
            sales.map((s) => (
              <View key={s.id} style={styles.rowBetween}>
                <Text style={[Typography.body, { color: Colors.primary }]}>{new Date(s.createdAt).toLocaleString()}</Text>
                <Text style={[Typography.title, { color: Colors.accent }]}>{formatUSD(s.total)}</Text>
              </View>
            ))
          )}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  appbar: { height: 64, paddingHorizontal: Spacing.lg, flexDirection: 'row', alignItems: 'center', gap: Spacing.lg },
  iconBtn: { width: 40, height: 40, borderRadius: Radii.pill, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center' },
  content: { padding: Spacing.lg, gap: Spacing.lg },
  due: { backgroundColor: Colors.primary, borderRadius: Radii.lg, padding: Spacing.xl, gap: Spacing.sm },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md },
  methodIcon: { width: 48, height: 48, borderRadius: Radii.pill, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' },
});
