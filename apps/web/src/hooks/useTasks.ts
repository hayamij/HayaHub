'use client';

import { useState, useCallback } from 'react';
import { container } from '@/infrastructure/di/Container';
import type { TaskDTO, CreateTaskDTO, UpdateTaskDTO } from 'hayahub-business';
import { useEntityCRUD } from './useEntityCRUD';

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
 * Uses generic useEntityCRUD with additional loadTasksByProject functionality
 */
export function useTasks(userId: string | undefined): UseTasksReturn {
  const [isLoadingByProject, setIsLoadingByProject] = useState(false);
  
  // Custom execute wrapper for GetTasksUseCase.executeByUser
  const getTasksWrapper = {
    execute: async (uid: string) => {
      const getTasksUseCase = container.getTasksUseCase;
      return await getTasksUseCase.executeByUser(uid);
    }
  };

  const {
    entities: tasks,
    isLoading,
    error,
    load: loadTasks,
    create: createTask,
    update: updateTask,
    deleteEntity: deleteTask,
  } = useEntityCRUD<TaskDTO, CreateTaskDTO, UpdateTaskDTO>({
    getUseCase: getTasksWrapper,
    createUseCase: container.createTaskUseCase,
    updateUseCase: container.updateTaskUseCase,
    deleteUseCase: container.deleteTaskUseCase,
    getParams: userId!,
  });

  // Additional method for loading tasks by project
  const loadTasksByProject = useCallback(async (projectId: string) => {
    setIsLoadingByProject(true);

    try {
      const getTasksUseCase = container.getTasksUseCase;
      const result = await getTasksUseCase.executeByProject(projectId);

      if (result.isSuccess()) {
        // This will be handled by parent component state
        // For now, we just validate the operation succeeded
      }
    } finally {
      setIsLoadingByProject(false);
    }
  }, []);

  return {
    tasks,
    isLoading: isLoading || isLoadingByProject,
    error,
    loadTasks,
    loadTasksByProject,
    createTask,
    updateTask,
    deleteTask,
  };
}
