import { StyleSheet, View } from 'react-native';
import type React from 'react';
import { Colors, Radii, Shadows, Spacing } from '@/constants/theme';

export function Card({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return <View style={[styles.base, dark && styles.dark]}>{children}</View>;
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.lg,
    padding: Spacing.lg,
    ...Shadows.card,
  },
  dark: { backgroundColor: Colors.primary },
});
