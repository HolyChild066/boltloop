import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors, Radii, Typography } from '@/constants/theme';

export function Stepper({ qty, onMinus, onPlus }: { qty: number; onMinus: () => void; onPlus: () => void }) {
  return (
    <View style={styles.base}>
      <Pressable accessibilityLabel="decrease" onPress={onMinus} style={styles.hit}>
        <Ionicons name="remove" size={20} color={Colors.primary} />
      </Pressable>
      <Text style={[Typography.body, { color: Colors.primary }]}>{qty}</Text>
      <Pressable accessibilityLabel="increase" onPress={onPlus} style={styles.add}>
        <Ionicons name="add" size={20} color={Colors.surface} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: Colors.background,
    borderRadius: Radii.pill,
    height: 40,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  hit: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  add: { width: 32, height: 32, borderRadius: Radii.pill, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
});
