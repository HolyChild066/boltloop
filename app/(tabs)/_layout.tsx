import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Colors, Radii } from '@/constants/theme';

const ICONS: Record<string, { active: string; inactive: string }> = {
  index: { active: 'grid', inactive: 'grid-outline' },
  inventory: { active: 'cube', inactive: 'cube-outline' },
  pos: { active: 'basket', inactive: 'basket-outline' },
  payment: { active: 'wallet', inactive: 'wallet-outline' },
  reports: { active: 'bar-chart', inactive: 'bar-chart-outline' },
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: Colors.background,
        tabBarInactiveTintColor: Colors.background,
        tabBarStyle: styles.bar,
        tabBarIcon: ({ focused }) => {
          const icon = ICONS[route.name];
          return (
            <View style={[styles.chip, focused && styles.chipActive]}>
              <Ionicons
                name={(focused ? icon.active : icon.inactive) as never}
                size={22}
                color={focused ? Colors.primary : Colors.background}
                style={styles.glyph}
              />
            </View>
          );
        },
      })}>
      <Tabs.Screen name="index" options={{ title: 'Dashboard' }} />
      <Tabs.Screen name="inventory" options={{ title: 'Inventory' }} />
      <Tabs.Screen name="pos" options={{ title: 'POS' }} />
      <Tabs.Screen name="payment" options={{ title: 'Payment' }} />
      <Tabs.Screen name="reports" options={{ title: 'Reports' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: Colors.primary,
    height: 84,
    paddingTop: 12,
    paddingBottom: 8,
    paddingHorizontal: 8,
  },
  chip: {
    width: 56,
    height: 36,
    borderRadius: Radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipActive: { backgroundColor: Colors.accent },
  glyph: { textAlign: 'center', width: 24, lineHeight: 24 },
});