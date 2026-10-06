import { StyleSheet, Text, View } from 'react-native';
import { Card } from '@/components/Card';
import { Colors, Spacing, Typography } from '@/constants/theme';

export function StatCard({ label, value, dark }: { label: string; value: string; dark?: boolean }) {
  return (
    <Card dark={dark}>
      <View style={styles.row}>
        <Text style={[Typography.caption, { color: dark ? Colors.background : Colors.muted }]}>{label}</Text>
      </View>
      <Text style={[Typography.display, { color: dark ? Colors.accent : Colors.primary, marginTop: Spacing.xs }]}>{value}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
