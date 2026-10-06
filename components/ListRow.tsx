import { StyleSheet, Text, View } from 'react-native';
import { Colors, Radii, Spacing, Typography } from '@/constants/theme';

export function ListRow({ title, subtitle, right }: { title: string; subtitle?: string; right?: string }) {
  return (
    <View style={styles.base}>
      <View style={{ flex: 1 }}>
        <Text style={[Typography.body, { color: Colors.primary }]}>{title}</Text>
        {subtitle ? <Text style={[Typography.caption, { color: Colors.muted }]}>{subtitle}</Text> : null}
      </View>
      {right ? <Text style={[Typography.title, { color: Colors.accent }]}>{right}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.lg,
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
});
