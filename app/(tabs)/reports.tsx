import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/Card';
import { Chip } from '@/components/Chip';
import { DateRangeModal } from '@/components/DateRangeModal';
import { EmptyState } from '@/components/EmptyState';
import { StatCard } from '@/components/StatCard';
import { Colors, Radii, Spacing, Typography } from '@/constants/theme';
import { type DateRange, type RangeKey, resolveRange, useSalesInRange } from '@/hooks/useSalesInRange';
import { useStore } from '@/store/StoreContext';
import { formatShortDate } from '@/utils/date';
import { shareSalesCsv } from '@/utils/exportReport';
import { formatUSD } from '@/utils/format';

const RANGES: RangeKey[] = ['Today', '7D', '30D', 'Custom'];

export default function Reports() {
  const [range, setRange] = useState<RangeKey>('Today');
  const [custom, setCustom] = useState<DateRange>(() => {
    const now = new Date();
    const from = new Date(now);
    from.setDate(from.getDate() - 6);
    return { from, to: now };
  });
  const [pickerOpen, setPickerOpen] = useState(false);

  const { products } = useStore();
  const { sales, revenue, orders, units, top } = useSalesInRange(range, custom);
  const [exporting, setExporting] = useState(false);
  const profit = revenue * 0.3;

  const resolved = useMemo(() => resolveRange(range, custom), [range, custom]);

  const rangeLabel =
    range === 'Custom'
      ? `${formatShortDate(resolved.from)} – ${formatShortDate(resolved.to)}`
      : range;

  const axis = useMemo(() => {
    if (range === 'Today') return ['00:00', '12:00', '23:59'];
    const mid = new Date((resolved.from.getTime() + resolved.to.getTime()) / 2);
    return [formatShortDate(resolved.from), formatShortDate(mid), formatShortDate(resolved.to)];
  }, [range, resolved]);

  function pick(key: RangeKey) {
    if (key === 'Custom') {
      setPickerOpen(true);
      return;
    }
    setRange(key);
  }

  async function exportReport() {
    if (sales.length === 0) {
      Alert.alert('Nothing to export', 'There are no orders in the selected range.');
      return;
    }
    try {
      setExporting(true);
      await shareSalesCsv(sales, products);
    } catch (error) {
      Alert.alert('Export failed', error instanceof Error ? error.message : 'Could not share the report.');
    } finally {
      setExporting(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.appbar}>
        <Text style={[Typography.heading, { color: Colors.primary, flex: 1 }]}>Reports</Text>
        <Pressable
          accessibilityLabel="Export report"
          disabled={exporting}
          onPress={exportReport}
          style={[styles.iconBtn, exporting && styles.iconBtnBusy]}>
          <Ionicons name="download-outline" size={22} color={Colors.primary} />
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.chips}>
          {RANGES.map((r) => (
            <Chip key={r} label={r} active={range === r} onPress={() => pick(r)} />
          ))}
        </View>

        <View style={styles.kpiRow}>
          <View style={styles.flex}>
            <StatCard label="Revenue" value={formatUSD(revenue)} dark />
          </View>
          <View style={styles.flex}>
            <StatCard label="Orders" value={String(orders)} dark />
          </View>
        </View>
        <View style={styles.kpiRow}>
          <View style={styles.flex}>
            <StatCard label="Profit" value={formatUSD(profit)} />
          </View>
          <View style={styles.flex}>
            <StatCard label="Avg. order" value={formatUSD(orders === 0 ? 0 : revenue / orders)} />
          </View>
        </View>

        <Card>
          <View style={styles.rowBetween}>
            <Text style={[Typography.title, { color: Colors.primary }]}>Sales overview</Text>
            <Text style={[Typography.caption, { color: Colors.accent }]}>{rangeLabel}</Text>
          </View>
          {sales.length === 0 ? (
            <View style={styles.emptyChart}>
              <Text style={[Typography.title, { color: Colors.primary }]}>No sales data yet</Text>
              <Text style={[Typography.caption, { color: Colors.muted }]}>
                No orders were recorded in this range.
              </Text>
            </View>
          ) : (
            <Text style={[Typography.body, { color: Colors.primary }]}>
              {orders} {orders === 1 ? 'order' : 'orders'} · {units} units · {formatUSD(revenue)}
            </Text>
          )}
          <View style={styles.axis}>
            {axis.map((label) => (
              <Text key={label} style={[Typography.caption, { color: Colors.muted }]}>
                {label}
              </Text>
            ))}
          </View>
        </Card>

        <Text style={[Typography.title, { color: Colors.primary }]}>Top Products</Text>
        <Card>
          {top.length === 0 ? (
            <EmptyState
              icon="cube-outline"
              title="No top products yet"
              subtitle="Best sellers will appear after your first sale."
            />
          ) : (
            top.map((row, index) => (
              <View key={row.product?.id ?? index} style={[styles.rowBetween, styles.topRow]}>
                <Text style={[Typography.body, { color: Colors.primary, flex: 1 }]}>
                  {row.product?.name ?? 'Removed item'}
                </Text>
                <Text style={[Typography.caption, { color: Colors.muted }]}>{row.qty} sold</Text>
                <Text style={[Typography.title, { color: Colors.accent, width: 72, textAlign: 'right' }]}>
                  {formatUSD((row.product?.price ?? 0) * row.qty)}
                </Text>
              </View>
            ))
          )}
        </Card>
      </ScrollView>

      <DateRangeModal
        visible={pickerOpen}
        from={custom.from}
        to={custom.to}
        onApply={(from, to) => {
          setCustom({ from, to });
          setRange('Custom');
        }}
        onClose={() => setPickerOpen(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  appbar: { height: 64, paddingHorizontal: Spacing.lg, flexDirection: 'row', alignItems: 'center', gap: Spacing.lg },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: Radii.pill,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnBusy: { opacity: 0.4 },
  content: { padding: Spacing.lg, gap: Spacing.lg },
  chips: { flexDirection: 'row', gap: Spacing.sm },
  kpiRow: { flexDirection: 'row', gap: Spacing.sm },
  flex: { flex: 1 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  topRow: { paddingVertical: Spacing.sm },
  emptyChart: { height: 128, alignItems: 'center', justifyContent: 'center', gap: Spacing.xs },
  axis: { flexDirection: 'row', justifyContent: 'space-between', marginTop: Spacing.sm },
});