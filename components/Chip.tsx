import { Pressable, StyleSheet, Text } from 'react-native';
import { Colors, Radii, Typography } from '@/constants/theme';

export function Chip({ label, active, onPress }: { label: string; active?: boolean; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.base, active ? styles.active : styles.inactive]}>
      <Text style={[Typography.caption, { color: active ? Colors.background : Colors.primary }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { height: 40, paddingHorizontal: 16, borderRadius: Radii.pill, alignItems: 'center', justifyContent: 'center' },
  active: { backgroundColor: Colors.primary, borderWidth: 1, borderColor: Colors.primary },
  inactive: { backgroundColor: Colors.background, borderWidth: 1, borderColor: Colors.primary },
});
