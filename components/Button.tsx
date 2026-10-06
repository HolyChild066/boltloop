import { Pressable, StyleSheet, Text } from 'react-native';
import { Colors, Radii, Spacing, Typography } from '@/constants/theme';

export function Button({
  title,
  onPress,
  disabled,
}: {
  title: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={[styles.base, disabled && styles.disabled]}>
      <Text style={styles.label}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: Colors.accent,
    borderRadius: Radii.md,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
  },
  disabled: { opacity: 0.4 },
  label: { ...Typography.title, color: Colors.primary },
});
