import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import type { TaskStats } from '@/hooks/use-tasks';
import { StyleSheet, View } from 'react-native';


const cards: { key: keyof TaskStats; label: string; helper: string }[] = [
  { key: 'total', label: 'Active tasks', helper: 'Everything you said you want to move on.' },
  { key: 'completed', label: 'Completed', helper: 'Things you actually finished.' },
  { key: 'averageImpact', label: 'Avg. impact', helper: 'Rough sense of how heavy your tasks feel.' },
];

export const StatsOverview = (stats: TaskStats) => {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.row}>
        <ThemedText type="title" style={styles.title}>
          Progress
        </ThemedText>
        <View style={styles.pill}>
          <ThemedText style={styles.pillText}>{stats.completionRate}% complete</ThemedText>
        </View>
      </View>
      <View style={styles.grid}>
        {cards.map((card) => (
          <ThemedView key={card.key} style={styles.card}>
            <ThemedText type="subtitle" style={styles.value}>
              {stats[card.key]}
            </ThemedText>
            <ThemedText style={styles.label}>{card.label}</ThemedText>
            <ThemedText style={styles.helper}>{card.helper}</ThemedText>
          </ThemedView>
        ))}
      </View>
      <View style={styles.progressTrack}>
        <ThemedView style={[styles.progressFill, { width: `${stats.completionRate}%` }]} />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 28,
    padding: 20,
    gap: 20,
    borderWidth: 1,
    borderColor: 'rgba(10, 126, 164, 0.12)',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(10, 126, 164, 0.12)',
  },
  pillText: {
    fontSize: 14,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    flexBasis: '48%',
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(10, 126, 164, 0.12)',
    gap: 6,
  },
  value: {
    fontSize: 28,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  helper: {
    fontSize: 12,
    color: Colors.light.icon,
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(10, 126, 164, 0.12)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.light.tint,
  },
});
