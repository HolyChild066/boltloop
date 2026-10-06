import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Colors, Radii, Spacing } from '@/constants/theme';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  onSubmitEditing?: () => void;
  onFilterPress?: () => void;
  autoFocus?: boolean;
}

export function SearchBar({ value, onChangeText, placeholder, onSubmitEditing, onFilterPress, autoFocus }: Props) {
  return (
    <View style={styles.base}>
      <Ionicons name="search" size={20} color={Colors.muted} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.muted}
        style={styles.input}
        returnKeyType="search"
        onSubmitEditing={onSubmitEditing}
        autoFocus={autoFocus}
        autoCorrect={false}
        accessibilityLabel={placeholder}
      />
      {value.length > 0 ? (
        <Pressable accessibilityLabel="Clear search" hitSlop={8} onPress={() => onChangeText('')}>
          <Ionicons name="close-circle" size={20} color={Colors.muted} />
        </Pressable>
      ) : null}
      {onFilterPress ? (
        <Pressable accessibilityLabel="Filters" hitSlop={8} onPress={onFilterPress}>
          <Ionicons name="options-outline" size={20} color={Colors.primary} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.pill,
    height: 52,
    paddingHorizontal: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  input: { flex: 1, color: Colors.primary, fontSize: 14, paddingVertical: 0 },
});