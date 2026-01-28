import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import type { TaskSuggestion } from '@/hooks/use-task-suggestions';
import { useTaskSuggestions } from '@/hooks/use-task-suggestions';
import { useTasks } from '@/hooks/use-tasks';

const ModalScreen = () => {
  const router = useRouter();
  const { addTask } = useTasks();

  const [title, setTitle] = useState('');
  const [impact, setImpact] = useState(6);
  const [microTask, setMicroTask] = useState('');
  const [priority, setPriority] = useState(1);
  

  const handleSubmit = () => {
    if (!title.trim()) {
      return;
    }

    addTask({ title: title.trim(), impact, priority, microTask: microTask.trim() || null });
    setTitle('');
    setImpact(6);
    setMicroTask('');
    router.back();
  };

  const onSuggestionPress = (suggestion: TaskSuggestion) => {
    setTitle(suggestion.title);
    setImpact(suggestion.impact);
    setMicroTask(suggestion.microTask ?? '');
    setPriority(suggestion.priority);
  };

  const { suggestions, isLoading, error, refresh } = useTaskSuggestions();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ThemedView style={styles.sheet}>
        <ThemedText type="title">Add a task</ThemedText>

        <View style={styles.fieldGroup}>
          <ThemedText style={styles.label}>Task title</ThemedText>
          <TextInput
            placeholder="Ex: Cold shower + breath hold"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
          />
        </View>

        <View style={[styles.fieldGroup, styles.inlineGroup]}>
          <View style={{ flex: 1 }}>
            <ThemedText style={styles.label}>How big of a win? (1-10)</ThemedText>
            <TextInput
              placeholder="7"
              keyboardType="number-pad"
              value={impact.toString()}
              onChangeText={(text) => setImpact(Number(text))}
              style={styles.input}
            />
            <ThemedText style={styles.label}>Priority (1-10)</ThemedText>
            <TextInput
              placeholder="7"
              keyboardType="number-pad"
              value={priority.toString()}
              onChangeText={(text) => setPriority(Number(text))}
              style={styles.input}
            />
          </View>
          <View style={{ flex: 2 }}>
            <ThemedText style={styles.label}>Micro-tasks</ThemedText>
            <TextInput
              placeholder="What is the smallest version of this you can do?"
              value={microTask}
              onChangeText={setMicroTask}
              multiline
              style={[styles.input, { minHeight: 48 }]}
            />
          </View>
        </View>

        <Pressable style={styles.primaryButton} onPress={handleSubmit}>
          <ThemedText style={styles.primaryButtonText}>Save task</ThemedText>
        </Pressable>

        <View style={styles.chipRow}>
          {isLoading ? (
            <View style={styles.loaderRow}>
              <ActivityIndicator color={Colors.light.tint} />
              <ThemedText style={styles.loaderText}>Loading ideas…</ThemedText>
            </View>
          ) : error ? (
            <Pressable style={styles.retryPill} onPress={refresh}>
              <ThemedText style={styles.retryText}>Tap to retry ideas</ThemedText>
            </Pressable>
          ) : (
            suggestions.map((suggestion) => (
              <Pressable
                key={suggestion.title}
                style={styles.chip}
                onPress={() => onSuggestionPress(suggestion)}>
                <ThemedText style={styles.chipText}>{suggestion.title}</ThemedText>
              </Pressable>
            ))
          )}
        </View>
      </ThemedView>
    </ScrollView>
  );
};

export default ModalScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
  },
  sheet: {
    borderRadius: 24,
    padding: 20,
    gap: 16,
    borderWidth: 1,
    borderColor: 'rgba(10, 126, 164, 0.15)',
  },
  helper: {
    fontSize: 14,
    color: Colors.light.icon,
  },
  fieldGroup: {
    gap: 6,
  },
  inlineGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(10, 126, 164, 0.25)',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
  },
  primaryButton: {
    backgroundColor: Colors.light.tint,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  loaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loaderText: {
    fontSize: 13,
    color: Colors.light.icon,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(10, 126, 164, 0.25)',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  retryPill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255, 99, 71, 0.35)',
  },
  retryText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.light.tint,
  },
});
