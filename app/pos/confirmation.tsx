import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Colors, Radii, Spacing, Typography } from '@/constants/theme';
import { useStore } from '@/store/StoreContext';
import { formatUSD } from '@/utils/format';

export default function Confirmation() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { sales } = useStore();
  const sale = sales.find((s) => s.id === id);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.content}>
        <View style={styles.badge}>
          <Ionicons name="checkmark" size={40} color={Colors.surface} />
        </View>
        <Text style={[Typography.heading, { color: Colors.primary, textAlign: 'center' }]}>Payment confirmed</Text>
        <Card>
          <Text style={[Typography.body, { color: Colors.primary, textAlign: 'center' }]}>
            {sale ? `${formatUSD(sale.total)} · ${sale.method}` : 'Sale recorded'}
          </Text>
        </Card>
        <Button title="Back to POS" onPress={() => router.replace('/pos' as never)} />
        <Button title="View reports" onPress={() => router.replace('/reports' as never)} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  content: { flex: 1, padding: Spacing.lg, gap: Spacing.lg, justifyContent: 'center' },
  badge: { width: 80, height: 80, borderRadius: Radii.pill, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' },
});
