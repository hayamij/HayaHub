'use client';

import { useRouter } from 'next/navigation';
import { FolderKanban, TrendingUp, Circle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useProjectsWidget } from '@/hooks/useProjectsWidget';

export default function ProjectsWidget() {
  const router = useRouter();
  const { user } = useAuth();
  const { tasks, stats, isLoading } = useProjectsWidget(user?.id);

  const recentTasks = tasks
    .filter((t) => !t.completed)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div
      onClick={() => router.push('/projects' as any)}
      className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg group-hover:scale-110 transition-transform">
            <FolderKanban className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Dự án
          </h3>
        </div>
        <TrendingUp className="w-4 h-4 text-gray-400 group-hover:text-purple-600 transition-colors" />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-32">
          <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Đang thực hiện</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.activeProjects}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Nhiệm vụ</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.pendingTasks}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Hoàn thành</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.completionRate}%</p>
            </div>
          </div>

          {/* Recent Tasks */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nhiệm vụ gần đây
            </p>
            {recentTasks.length > 0 ? (
              recentTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-start gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-800 group-hover:bg-purple-50 dark:group-hover:bg-purple-900/20 transition-colors"
                >
                  <Circle className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {task.title}
                    </p>
                    {task.dueDate && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Đến hạn: {new Date(task.dueDate).toLocaleDateString('vi-VN')}
                      </p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                Không có nhiệm vụ nào
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

