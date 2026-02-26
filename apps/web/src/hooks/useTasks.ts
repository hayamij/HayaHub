'use client';

import { useState, useCallback, useEffect } from 'react';
import { container } from '@/infrastructure/di/Container';
import type { TaskDTO, CreateTaskDTO, UpdateTaskDTO } from 'hayahub-business';

interface UseTasksReturn {
  tasks: TaskDTO[];
  isLoading: boolean;
  error: Error | null;
  loadTasks: () => Promise<void>;
  loadTasksByProject: (projectId: string) => Promise<void>;
  createTask: (dto: CreateTaskDTO) => Promise<boolean>;
  updateTask: (id: string, dto: UpdateTaskDTO) => Promise<boolean>;
  deleteTask: (id: string) => Promise<boolean>;
}

/**
 * Custom Hook for Task Management
 */
export function useTasks(userId: string | undefined): UseTasksReturn {
  const [tasks, setTasks] = useState<TaskDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadTasks = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const getTasksUseCase = container.getTasksUseCase;
      const result = await getTasksUseCase.executeByUser(userId);

      if (result.isSuccess()) {
        setTasks(result.value);
      } else {
        setError(result.error);
        setTasks([]);
      }
    } catch (err) {
      setError(err as Error);
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const loadTasksByProject = useCallback(async (projectId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const getTasksUseCase = container.getTasksUseCase;
      const result = await getTasksUseCase.executeByProject(projectId);

      if (result.isSuccess()) {
        setTasks(result.value);
      } else {
        setError(result.error);
        setTasks([]);
      }
    } catch (err) {
      setError(err as Error);
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createTask = useCallback(
    async (dto: CreateTaskDTO): Promise<boolean> => {
      try {
        const createTaskUseCase = container.createTaskUseCase;
        const result = await createTaskUseCase.execute(dto);

        if (result.isSuccess()) {
          await loadTasks();
          return true;
        } else {
          setError(result.error);
          return false;
        }
      } catch (err) {
        setError(err as Error);
        return false;
      }
    },
    [loadTasks]
  );

  const updateTask = useCallback(
    async (id: string, dto: UpdateTaskDTO): Promise<boolean> => {
      try {
        const updateTaskUseCase = container.updateTaskUseCase;
        const result = await updateTaskUseCase.execute(id, dto);

        if (result.isSuccess()) {
          await loadTasks();
          return true;
        } else {
          setError(result.error);
          return false;
        }
      } catch (err) {
        setError(err as Error);
        return false;
      }
    },
    [loadTasks]
  );

  const deleteTask = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        const deleteTaskUseCase = container.deleteTaskUseCase;
        const result = await deleteTaskUseCase.execute(id);

        if (result.isSuccess()) {
          await loadTasks();
          return true;
        } else {
          setError(result.error);
          return false;
        }
      } catch (err) {
        setError(err as Error);
        return false;
      }
    },
    [loadTasks]
  );

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  return {
    tasks,
    isLoading,
    error,
    loadTasks,
    loadTasksByProject,
    createTask,
    updateTask,
    deleteTask,
  };
}
