'use client';

import { useEffect, useState } from 'react';
import { Circle } from 'lucide-react';
import { container } from '@/infrastructure/di/Container';
import { useAuth } from '@/contexts/AuthContext';
import type { ProjectDTO, TaskDTO } from 'hayahub-business';
import { ProjectStatus } from 'hayahub-domain';

export default function ProjectsWidgetContent() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<TaskDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    activeProjects: 0,
    pendingTasks: 0,
    completedTasks: 0,
    completionRate: 0,
  });

  useEffect(() => {
    const loadData = async () => {
      if (!user?.id) return;

      setIsLoading(true);
      try {
        const getProjectsUseCase = container.getProjectsUseCase;
        const getTasksUseCase = container.getTasksUseCase;

        const [projectsResult, tasksResult] = await Promise.all([
          getProjectsUseCase.execute(user.id),
          getTasksUseCase.executeByUser(user.id),
        ]);

        if (projectsResult.success) {
          const allProjects = projectsResult.value;
          const activeProjects = allProjects.filter((p: ProjectDTO) => p.status === ProjectStatus.IN_PROGRESS);
          const completed = allProjects.filter((p: ProjectDTO) => p.status === ProjectStatus.COMPLETED).length;
          const total = allProjects.length;
          const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

          setStats((prev) => ({
            ...prev,
            activeProjects: activeProjects.length,
            completionRate,
          }));
        }

        if (tasksResult.success) {
          const allTasks = tasksResult.value;
          setTasks(allTasks);
          const pendingTasks = allTasks.filter((t: TaskDTO) => !t.completed);
          const completedTasks = allTasks.filter((t: TaskDTO) => t.completed);

          setStats((prev) => ({
            ...prev,
            pendingTasks: pendingTasks.length,
            completedTasks: completedTasks.length,
          }));
        }
      } catch (error) {
        console.error('Failed to load projects/tasks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user]);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-gray-400">Đang tải...</div>
      </div>
    );
  }

  const recentTasks = tasks
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  return (
    <div className="h-full flex flex-col">
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg">
          <div className="text-xs text-blue-600 dark:text-blue-400 mb-1">Dự án đang chạy</div>
          <div className="text-xl font-bold text-blue-700 dark:text-blue-300">{stats.activeProjects}</div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-lg">
          <div className="text-xs text-green-600 dark:text-green-400 mb-1">Hoàn thành</div>
          <div className="text-xl font-bold text-green-700 dark:text-green-300">{stats.completionRate}%</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded-lg">
          <div className="text-xs text-yellow-600 dark:text-yellow-400 mb-1">Đang làm</div>
          <div className="text-xl font-bold text-yellow-700 dark:text-yellow-300">{stats.pendingTasks}</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded-lg">
          <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Đã xong</div>
          <div className="text-xl font-bold text-gray-700 dark:text-gray-300">{stats.completedTasks}</div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Công việc gần đây</h4>
        {recentTasks.length === 0 ? (
          <div className="text-sm text-gray-400 dark:text-gray-500">Không có công việc nào</div>
        ) : (
          <div className="space-y-2">
            {recentTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700"
              >
                <Circle
                  className={`w-4 h-4 flex-shrink-0 ${
                    task.completed ? 'fill-green-500 text-green-500' : 'text-gray-400'
                  }`}
                />
                <span
                  className={`text-sm flex-1 min-w-0 truncate ${
                    task.completed ? 'line-through text-gray-400' : 'text-gray-900 dark:text-white'
                  }`}
                >
                  {task.title}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
