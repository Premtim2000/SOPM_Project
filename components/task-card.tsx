import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import type { Task } from '@/hooks/use-tasks';

type Props = {
  task: Task;
  onToggle: (completed: boolean) => void;
  onDelete: () => void;
};

export function TaskCard({ task, onToggle, onDelete }: Props) {
  return (
    <ThemedView style={[styles.card, task.completed && styles.completedCard]}>
      <View style={styles.headerRow}>
        <View style={styles.titleGroup}>
          <ThemedText type="subtitle" style={styles.title}>
            {task.title}
          </ThemedText>
          <View style={styles.badge}>
            <ThemedText style={styles.badgeText}>Impact {task.impact}</ThemedText>
          </View>
          
          <View style={styles.badge}>
            <ThemedText style={styles.badgeText}>Priority {task.priority}</ThemedText>
          </View>
        </View>
        <View style={styles.actionRow}>
          <Pressable
            style={[styles.button, styles.doneButton, task.completed && styles.doneButtonActive]}
            onPress={() => onToggle(!task.completed)}>
            <ThemedText style={[styles.buttonText, styles.doneButtonText]}>
              {task.completed ? 'Undo' : 'Done'}
            </ThemedText>
          </Pressable>
          <Pressable style={[styles.button, styles.deleteButton]} onPress={onDelete}>
            <ThemedText style={[styles.buttonText, styles.deleteButtonText]}>Remove</ThemedText>
          </Pressable>
        </View>
      </View>

      {task.microTask ? (
        <ThemedText style={styles.microTask}>{task.microTask}</ThemedText>
      ) : (
        <ThemedText style={styles.microTask} lightColor={Colors.light.icon} darkColor={Colors.dark.icon}>
          No micro-tasks recorded yet.
        </ThemedText>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(10, 126, 164, 0.12)',
  },
  completedCard: {
    opacity: 0.7,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  titleGroup: {
    flex: 1,
    gap: 6,
  },
  title: {
    flexWrap: 'wrap',
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(10, 126, 164, 0.12)',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    borderRadius: 999,
    paddingHorizontal: 14,
    borderWidth: 1,
    justifyContent: "center",
    height: 50,
  },
  doneButton: {
    borderColor: 'rgba(52, 199, 89, 0.35)',
    backgroundColor: 'rgba(52, 199, 89, 0.08)',
  },
  doneButtonActive: {
    backgroundColor: 'rgba(52, 199, 89, 0.18)',
  },
  deleteButton: {
    borderColor: 'rgba(255, 99, 99, 0.35)',
    backgroundColor: 'transparent',
  },
  buttonText: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  doneButtonText: {
    color: '#1f7a34',
  },
  deleteButtonText: {
    color: '#b23131',
  },
  microTask: {
    fontSize: 15,
    lineHeight: 22,
  },
});
