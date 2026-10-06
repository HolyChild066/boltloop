import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/Button';
import { Colors, Radii, Spacing, Typography } from '@/constants/theme';
import { formatLongDate } from '@/utils/date';

interface Props {
  visible: boolean;
  from: Date;
  to: Date;
  onApply: (from: Date, to: Date) => void;
  onClose: () => void;
}

export function DateRangeModal({ visible, from, to, onApply, onClose }: Props) {
  const [start, setStart] = useState(from);
  const [end, setEnd] = useState(to);
  const [editing, setEditing] = useState<'from' | 'to' | null>(null);

  function handleChange(which: 'from' | 'to') {
    return (event: DateTimePickerEvent, value?: Date) => {
      if (Platform.OS === 'android') setEditing(null);
      if (event.type !== 'set' || !value) return;
      if (which === 'from') setStart(value <= end ? value : end);
      else setEnd(value >= start ? value : start);
    };
  }

  function apply() {
    onApply(start, end);
    onClose();
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <Text style={[Typography.heading, { color: Colors.primary }]}>Custom range</Text>

          <Pressable onPress={() => setEditing('from')} style={styles.field}>
            <Text style={[Typography.caption, { color: Colors.muted }]}>From</Text>
            <Text style={[Typography.title, { color: Colors.primary }]}>{formatLongDate(start)}</Text>
          </Pressable>

          <Pressable onPress={() => setEditing('to')} style={styles.field}>
            <Text style={[Typography.caption, { color: Colors.muted }]}>To</Text>
            <Text style={[Typography.title, { color: Colors.primary }]}>{formatLongDate(end)}</Text>
          </Pressable>

          {editing ? (
            <View style={styles.picker}>
              <DateTimePicker
                value={editing === 'from' ? start : end}
                mode="date"
                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                maximumDate={new Date()}
                onChange={handleChange(editing)}
              />
            </View>
          ) : null}

          <View style={styles.actions}>
            <View style={styles.action}>
              <Button title="Cancel" onPress={onClose} />
            </View>
            <View style={styles.action}>
              <Button title="Apply" onPress={apply} />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(56, 97, 80, 0.4)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: Radii.lg,
    borderTopRightRadius: Radii.lg,
    padding: Spacing.xl,
    gap: Spacing.md,
  },
  field: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.xs,
  },
  picker: { backgroundColor: Colors.surface, borderRadius: Radii.md, overflow: 'hidden' },
  actions: { flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.sm },
  action: { flex: 1 },
});