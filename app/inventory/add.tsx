import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/Button';
import { Colors, Radii, Spacing, Typography } from '@/constants/theme';
import { useStore } from '@/store/StoreContext';
import type { Category } from '@/types';

export default function AddItem() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { products, addProduct, updateProduct } = useStore();
  const existing = products.find((p) => p.id === id);
  const [name, setName] = useState(existing?.name ?? '');
  const [category, setCategory] = useState<string>(existing?.category ?? 'Fasteners');
  const [variant, setVariant] = useState(existing?.variant ?? '');
  const [price, setPrice] = useState(existing ? String(existing.price) : '');
  const [stock, setStock] = useState(existing ? String(existing.stock) : '');

  function save() {
    const parsedPrice = Number(price);
    const parsedStock = Math.max(0, Math.floor(Number(stock)));
    if (!name.trim() || Number.isNaN(parsedPrice)) return;
    if (existing) {
      updateProduct(existing.id, { name: name.trim(), category: category as Category, variant, price: parsedPrice, stock: parsedStock });
    } else {
      addProduct({ name: name.trim(), category: category as Category, variant: variant || 'Each', price: parsedPrice, stock: parsedStock || 0 });
    }
    router.back();
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.appbar}>
        <Pressable onPress={() => router.back()}>
          <Text style={[Typography.title, { color: Colors.primary }]}>‹ Back</Text>
        </Pressable>
        <Text style={[Typography.heading, { color: Colors.primary }]}>{existing ? 'Edit item' : 'Add item'}</Text>
      </View>
      <View style={styles.form}>
        <Text style={[Typography.caption, { color: Colors.primary }]}>Name</Text>
        <TextInput value={name} onChangeText={setName} placeholder="Hex Bolt M8" style={styles.input} placeholderTextColor={Colors.muted} />
        <Text style={[Typography.caption, { color: Colors.primary }]}>Category</Text>
        <TextInput value={category} onChangeText={setCategory} style={styles.input} placeholderTextColor={Colors.muted} />
        <Text style={[Typography.caption, { color: Colors.primary }]}>Variant</Text>
        <TextInput value={variant} onChangeText={setVariant} placeholder="Box of 50" style={styles.input} placeholderTextColor={Colors.muted} />
        <Text style={[Typography.caption, { color: Colors.primary }]}>Price</Text>
        <TextInput value={price} onChangeText={setPrice} keyboardType="decimal-pad" placeholder="0.00" style={styles.input} placeholderTextColor={Colors.muted} />
        <Text style={[Typography.caption, { color: Colors.primary }]}>Stock</Text>
        <TextInput value={stock} onChangeText={setStock} keyboardType="number-pad" placeholder="0" style={styles.input} placeholderTextColor={Colors.muted} />
        <Button title={existing ? 'Save changes' : 'Add item'} onPress={save} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  appbar: { height: 64, paddingHorizontal: Spacing.lg, flexDirection: 'row', alignItems: 'center', gap: Spacing.lg },
  form: { padding: Spacing.lg, gap: Spacing.sm },
  input: { backgroundColor: Colors.surface, borderRadius: Radii.md, height: 52, paddingHorizontal: Spacing.lg, color: Colors.primary },
});
