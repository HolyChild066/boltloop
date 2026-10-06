import { Ionicons } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Radii, Spacing, Typography } from '@/constants/theme';

const ITEMS = [
  { label: 'Dashboard', icon: 'grid-outline', route: '/' },
  { label: 'Inventory', icon: 'cube-outline', route: '/inventory' },
  { label: 'Point of sale', icon: 'basket-outline', route: '/pos' },
  { label: 'Payment', icon: 'wallet-outline', route: '/payment' },
  { label: 'Reports', icon: 'bar-chart-outline', route: '/reports' },
] as const;

export function AppMenu({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();

  function go(route: string) {
    onClose();
    router.navigate(route as never);
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={[styles.panel, { paddingTop: insets.top + Spacing.xxl }]}>
          <View style={styles.header}>
            <Text style={[Typography.caption, { color: Colors.accent }]}>SUPPLIERS APP</Text>
            <Text style={[Typography.display, { color: Colors.background }]}>BOLTLOOP</Text>
          </View>
          {ITEMS.map((item) => {
            const active = pathname === item.route;
            return (
              <Pressable
                key={item.route}
                accessibilityRole="button"
                onPress={() => go(item.route)}
                style={[styles.item, active && styles.itemActive]}>
                <Ionicons name={item.icon as never} size={22} color={active ? Colors.primary : Colors.background} />
                <Text style={[Typography.title, { color: active ? Colors.primary : Colors.background }]}>
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
          <View style={styles.divider} />
          <Pressable accessibilityRole="button" onPress={() => go('/inventory/add')} style={styles.item}>
            <Ionicons name="add-circle-outline" size={22} color={Colors.accent} />
            <Text style={[Typography.title, { color: Colors.accent }]}>Add item</Text>
          </Pressable>
        </View>
        <Pressable accessibilityLabel="Close menu" onPress={onClose} style={styles.dismiss} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, flexDirection: 'row', backgroundColor: 'rgba(56, 97, 80, 0.4)' },
  panel: {
    width: 280,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    gap: Spacing.xs,
  },
  dismiss: { flex: 1 },
  header: { marginBottom: Spacing.lg, gap: Spacing.xs },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    height: 52,
    paddingHorizontal: Spacing.md,
    borderRadius: Radii.md,
  },
  itemActive: { backgroundColor: Colors.accent },
  divider: { height: 1, backgroundColor: Colors.background, opacity: 0.2, marginVertical: Spacing.md },
});