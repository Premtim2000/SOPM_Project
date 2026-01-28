import { useCallback, useEffect, useMemo, useState } from 'react';
import { enablePromise, openDatabase } from 'react-native-sqlite-storage';

enablePromise(true);

export type Task = {
  id: number;
  title: string;
  impact: number;
  microTask: string | null;
  completed: boolean;
  priority: number;
};

export type TaskStats = {
  total: number;
  completed: number;
  completionRate: number;
  averageImpact: number;
  momentumScore: number;
};

type TaskRow = {
  id: number;
  title: string;
  impact: number;
  microTask: string | null;
  completed: boolean;
  priority: number | null;
};

const DB_NAME = 'sopm.db';
const TABLE_NAME = 'tasks';

const getDatabase = () => openDatabase({ name: DB_NAME, location: 'default' });

const ensureTable = async (db: any) => {
  await db.executeSql(
    `CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      impact INTEGER NOT NULL,
      microTask TEXT,
      completed INTEGER DEFAULT 0,
      priority INTEGER DEFAULT 1
    );`
  );
};

const parseTasks = (results: any[]): Task[] => {
  const rows: Task[] = [];
  results.forEach((result) => {
    for (let index = 0; index < result.rows.length; index += 1) {
      const row = result.rows.item(index) as any;
      rows.push({
        id: row.id,
        title: row.title,
        impact: row.impact,
        microTask: row.microTask ?? null,
        completed: row.completed === 1 || row.completed === true,
        priority: row.priority ?? 1,
      });
    }
  });
  return rows;
};

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isReady, setIsReady] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const db = await getDatabase();
      await ensureTable(db);
      const results = await db.executeSql(
        `SELECT id, title, impact, microTask, completed, priority FROM ${TABLE_NAME} ORDER BY id DESC`
      );
      setTasks(parseTasks(results));
    } catch (error) {
      console.error('Failed to load tasks', error);
    } finally {
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addTask = useCallback(
    async (payload: { title: string; impact: number; priority: number; microTask?: string | null }) => {
      const trimmedTitle = payload.title.trim();
      if (!trimmedTitle) {
        return;
      }

      try {
        const db = await getDatabase();
        await ensureTable(db);
        await db.executeSql(
          `INSERT INTO ${TABLE_NAME} (title, impact, microTask, completed, priority) VALUES (?, ?, ?, false, ?)`,
          [trimmedTitle, payload.impact, payload.microTask?.trim() || null, payload.priority]
        );
        await refresh();
      } catch (error) {
        console.error('Failed to add action', error);
      }
    },
    [refresh]
  );

  const toggleCompletion = useCallback(
    async (id: number, completed: boolean) => {
      try {
        const db = await getDatabase();
        await ensureTable(db);
        await db.executeSql(`UPDATE ${TABLE_NAME} SET completed = ? WHERE id = ?`, [completed, id]);
        await refresh();
      } catch (error) {
        console.error('Failed to update action', error);
      }
    },
    [refresh]
  );

  const deleteTask = useCallback(
    async (id: number) => {
      try {
        const db = await getDatabase();
        await ensureTable(db);
        await db.executeSql(`DELETE FROM ${TABLE_NAME} WHERE id = ?`, [id]);
        await refresh();
      } catch (error) {
        console.error('Failed to delete action', error);
      }
    },
    [refresh]
  );

  const stats: TaskStats = useMemo(() => {
    if (!tasks.length) {
      return {
        total: 0,
        completed: 0,
        completionRate: 0,
        averageImpact: 0,
        momentumScore: 0,
      };
    }

    const completed = tasks.filter((task) => task.completed).length;
    const totalImpact = tasks.reduce((sum, task) => sum + task.impact, 0);

    return {
      total: tasks.length,
      completed,
      completionRate: Math.round((completed / tasks.length) * 100),
      averageImpact: Number((totalImpact / tasks.length).toFixed(1)),
      momentumScore: Math.min(100, completed * 12 + totalImpact * 2),
    };
  }, [tasks]);

  return {
    tasks,
    stats,
    isReady,
    refresh,
    addTask,
    toggleCompletion,
    deleteTask,
  };
}
