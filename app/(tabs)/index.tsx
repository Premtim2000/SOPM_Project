import { StatsOverview } from '@/components/stats-overview';
import { TaskCard } from '@/components/task-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useTasks } from '@/hooks/use-tasks';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  
  const { tasks, stats, toggleCompletion, deleteTask, isReady, refresh } = useTasks();

  const topPriorities = useMemo(
    () =>
      tasks
        .filter((task) => !task.completed)
        .sort((a, b) => b.priority - a.priority || b.impact - a.impact),
    [tasks]
  );

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ThemedView style={styles.hero}>
        <View style={{ flex: 1 }}>
          <ThemedText type="title">Task Tracker</ThemedText>
          <ThemedText style={styles.heroSubtitle}>
            A small list for the few things you actually want to get done.
          </ThemedText>
        </View>
      </ThemedView>

      <StatsOverview stats={stats} />

      <ThemedView style={styles.navCard}>
        <ThemedText type="subtitle">Need to Add a task?</ThemedText>
        <Pressable style={styles.navButton} onPress={() => router.push('/modal')}>
          <ThemedText style={styles.navTitle}>Open task modal</ThemedText>
          <ThemedText style={styles.navDescription}>
            Capture new tasks or use the guided suggestions inside the modal screen.
          </ThemedText>
        </Pressable>
      </ThemedView>

      <View style={styles.sectionHeader}>
        <ThemedText type="subtitle">Today's task stack</ThemedText>
      </View>

      {!isReady ? (
        <ActivityIndicator color={Colors.light.tint} />
      ) : tasks.length === 0 ? (
        <ThemedView style={styles.emptyState}>
          <ThemedText type="subtitle">No tasks yet</ThemedText>
          <ThemedText style={styles.helper}>
            Use the form above or pick a suggestion to seed your journey.
          </ThemedText>
        </ThemedView>
      ) : (
        tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onToggle={(completed) => toggleCompletion(task.id, completed)}
            onDelete={() => deleteTask(task.id)}
          />
        ))
      )}

      {topPriorities.length > 0 && (
        <ThemedView style={styles.focusCard}>
          <ThemedText type="subtitle">Top Priorities</ThemedText>
          {topPriorities.slice(0, 3).map((task) => (
            <View key={task.id} style={styles.focusRow}>
              <ThemedText style={styles.focusTitle}>{task.title}</ThemedText>
              <ThemedText style={styles.focusImpact}>Impact {task.impact}</ThemedText>
            </View>
          ))}
        </ThemedView>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 20,
  },
  hero: {
    flexDirection: 'row',
    gap: 12,
    padding: 10,
    borderRadius: 16,
    flex: 1,
    alignItems: 'center',
  },
  heroSubtitle: {
    fontSize: 15,
    marginTop: 8,
    lineHeight: 22,
  },
  heroBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(10, 126, 164, 0.25)',
  },
  heroBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  card: {
    borderRadius: 24,
    padding: 20,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(10, 126, 164, 0.12)',
  },
  navCard: {
    borderRadius: 20,
    padding: 18,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(10, 126, 164, 0.12)',
  },
  navButton: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(10, 126, 164, 0.18)',
    padding: 12,
    gap: 4,
  },
  navTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  navDescription: {
    fontSize: 13,
    color: Colors.light.icon,
  },
  helper: {
    fontSize: 14,
    color: Colors.light.icon,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  emptyState: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(10, 126, 164, 0.12)',
    gap: 8,
  },
  focusCard: {
    borderRadius: 20,
    padding: 18,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(10, 126, 164, 0.12)',
  },
  focusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  focusTitle: {
    flex: 1,
    marginRight: 8,
  },
  focusImpact: {
    fontWeight: '600',
  },
});
