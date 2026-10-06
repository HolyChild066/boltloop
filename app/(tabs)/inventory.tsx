import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/Card';
import { Chip } from '@/components/Chip';
import { EmptyState } from '@/components/EmptyState';
import { SearchBar } from '@/components/SearchBar';
import { Colors, Radii, Spacing, Typography } from '@/constants/theme';
import { useFilteredProducts } from '@/hooks/useFilteredProducts';
import { useStore } from '@/store/StoreContext';
import { formatUSD } from '@/utils/format';

const CATS = [
  { label: 'Fasteners', icon: 'construct-outline' },
  { label: 'Tools', icon: 'hammer-outline' },
  { label: 'Electrical', icon: 'flash-outline' },
  { label: 'Plumbing', icon: 'water-outline' },
  { label: 'Paint', icon: 'color-fill-outline' },
  { label: 'Others', icon: 'ellipsis-horizontal' },
] as const;

export default function Inventory() {
  const { products, deleteProduct } = useStore();
  const params = useLocalSearchParams<{ q?: string }>();
  const query = typeof params.q === 'string' ? params.q : '';
  const [category, setCategory] = useState<string | null>(null);
  const [showCategories, setShowCategories] = useState(true);

  const shown = useFilteredProducts(query, category);
  const totalUnits = products.reduce((s, p) => s + p.stock, 0);
  const filtering = query.trim().length > 0 || category !== null;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.appbar}>
        <Text style={[Typography.heading, { color: Colors.primary, flex: 1 }]}>Inventory</Text>
        <Pressable
          accessibilityLabel="Add item"
          onPress={() => router.push('/inventory/add' as never)}
          style={styles.plus}>
          <Ionicons name="add" size={24} color={Colors.primary} />
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <SearchBar
          value={query}
          onChangeText={(text) => router.setParams({ q: text })}
          placeholder="Search products"
          onFilterPress={() => setShowCategories((prev) => !prev)}
        />
        {showCategories ? (
          <View>
            <View style={styles.rowBetween}>
              <Text style={[Typography.title, { color: Colors.primary }]}>Categories</Text>
              {category ? (
                <Pressable onPress={() => setCategory(null)}>
                  <Text style={[Typography.caption, { color: Colors.accent }]}>View all</Text>
                </Pressable>
              ) : null}
            </View>
            <View style={styles.catGrid}>
              {CATS.map((c) => {
                const active = category === c.label;
                return (
                  <Pressable
                    key={c.label}
                    accessibilityRole="button"
                    onPress={() => setCategory(active ? null : c.label)}
                    style={styles.cat}>
                    <View style={[styles.catIcon, active && styles.catIconActive]}>
                      <Ionicons name={c.icon as never} size={22} color={active ? Colors.background : Colors.primary} />
                    </View>
                    <Text style={[Typography.caption, { color: active ? Colors.accent : Colors.primary }]}>{c.label}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        ) : null}
        <View>
          <View style={styles.rowBetween}>
            <Text style={[Typography.title, { color: Colors.primary }]}>All products</Text>
            <Text style={[Typography.caption, { color: Colors.accent }]}>{shown.length} items</Text>
          </View>
          {shown.length === 0 ? (
            <Card>
              <EmptyState
                icon="search-outline"
                title="No matches"
                subtitle="Try a different name or category."
              />
            </Card>
          ) : (
            shown.map((p) => (
              <View key={p.id}>
                <Card>
                  <Pressable onPress={() => router.push(`/inventory/add?id=${p.id}` as never)}>
                    <Text style={[Typography.body, { color: Colors.primary }]}>{p.name}</Text>
                    <Text style={[Typography.caption, { color: Colors.muted }]}>
                      {p.category} · {p.variant}
                    </Text>
                    <Text style={[Typography.title, { color: Colors.accent }]}>{formatUSD(p.price)}</Text>
                    <Text style={[Typography.caption, { color: Colors.muted }]}>{p.stock} in stock</Text>
                  </Pressable>
                  <View style={styles.cardActions}>
                    <Chip label={p.stock <= 5 ? 'Low stock' : 'In Stock'} active={false} />
                    <Pressable
                      accessibilityLabel="Delete product"
                      onPress={() => {
                        Alert.alert('Delete Confirmation', `Remove ${p.name}?`, [
                          { text: 'Cancel', style: 'cancel' },
                          {
                            text: 'Delete',
                            style: 'destructive',
                            onPress: () => deleteProduct(p.id),
                          },
                        ]);
                      }}
                      style={styles.deleteBtn}>
                      <Ionicons name="trash-outline" size={20} color={Colors.danger} />
                    </Pressable>
                  </View>
                </Card>
              </View>
            ))
          )}
        </View>
        <View style={styles.stockBar}>
          <Ionicons name="checkmark-circle-outline" size={28} color={Colors.surface} />
          <View>
            <Text style={[Typography.title, { color: Colors.surface }]}>
              {filtering ? 'Filtered view' : 'Your shelves are ready'}
            </Text>
            <Text style={[Typography.caption, { color: Colors.background }]}>
              {shown.length} of {products.length} products · {totalUnits} units in stock
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  appbar: { height: 64, paddingHorizontal: Spacing.lg, flexDirection: 'row', alignItems: 'center', gap: Spacing.lg },
  plus: { width: 40, height: 40, borderRadius: Radii.pill, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center' },
  content: { padding: Spacing.lg, gap: Spacing.lg },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md, marginTop: Spacing.sm },
  cat: { width: '22%', alignItems: 'center', gap: Spacing.xs },
  catIcon: { width: 48, height: 48, borderRadius: Radii.pill, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center' },
  catIconActive: { backgroundColor: Colors.primary },
  cardActions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: Spacing.sm },
  deleteBtn: { width: 40, height: 40, borderRadius: Radii.pill, backgroundColor: '#FEE2E2', alignItems: 'center', justifyContent: 'center' },
  stockBar: { backgroundColor: Colors.primary, borderRadius: Radii.lg, padding: Spacing.lg, flexDirection: 'row', gap: Spacing.lg, alignItems: 'center' },
});