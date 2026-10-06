import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { Colors, Radii, Spacing, Typography } from '@/constants/theme';

export function EmptyState({ icon, title, subtitle }: { icon: string; title: string; subtitle: string }) {
  return (
    <View style={styles.base}>
      <View style={styles.badge}>
        <Ionicons name={icon as never} size={24} color={Colors.primary} />
      </View>
      <Text style={[Typography.title, { color: Colors.primary, textAlign: 'center' }]}>{title}</Text>
      <Text style={[Typography.caption, { color: Colors.muted, textAlign: 'center' }]}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: 'center', gap: Spacing.xs, padding: Spacing.lg },
  badge: {
    width: 40,
    height: 40,
    borderRadius: Radii.pill,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
