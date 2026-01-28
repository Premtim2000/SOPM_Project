import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';

export type TaskSuggestion = {
  title: string;
  impact: number;
  priority: number;
  microTask: string;
};

type Todo = {
  todo: string;
  completed: boolean;
  userId: number;
  id: number;
  impact: number;
  priority: number;
};

export const useTaskSuggestions = (limit = 4) => {
  const [suggestions, setSuggestions] = useState<TaskSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSuggestions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const { data } = await axios.get<{ todos?: Todo[] }>(
        'https://dummyjson.com/c/fbdb-50c2-4e35-9960?limit=10'
      );
      const todos = data?.todos ?? [];
      const arr = [...todos];
      for (let i = arr.length - 1; i > 0; i -= 1) {
        const randomIndex = Math.floor(Math.random() * (i + 1));    
        [arr[i], arr[randomIndex]] = [arr[randomIndex], arr[i]];
      }
      const randomSuggestions = arr.slice(0, limit).map((item, index) => ({
        title: item.todo.trim(),
        impact: item.impact,
        priority: item.priority,
        microTask: item.todo.trim(),
      }));
      setSuggestions(randomSuggestions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchSuggestions();
  }, [fetchSuggestions]);

  return {
    suggestions,
    isLoading,
    error,
    refresh: fetchSuggestions,
  };
}
