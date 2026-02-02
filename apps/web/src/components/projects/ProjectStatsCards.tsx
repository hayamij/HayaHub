'use client';

import { ProjectDTO, TaskDTO } from 'hayahub-business';
import { ProjectStatus } from 'hayahub-domain';
import { FolderOpen, CheckCircle2, ListTodo } from 'lucide-react';

interface ProjectStatsCardsProps {
  projects: ProjectDTO[];
  tasks: TaskDTO[];
}

export function ProjectStatsCards({ projects, tasks }: ProjectStatsCardsProps) {
  const activeProjects = projects.filter((p) => p.status === ProjectStatus.IN_PROGRESS);
  const completedProjects = projects.filter((p) => p.status === ProjectStatus.COMPLETED);
  
  const completedTasks = tasks.filter((t) => t.completed);
  const taskCompletionRate = tasks.length > 0 
    ? Math.round((completedTasks.length / tasks.length) * 100) 
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Total Projects Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Tổng dự án</h3>
          <FolderOpen className="w-5 h-5 text-blue-500" />
        </div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {projects.length}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
          {activeProjects.length} đang thực hiện
        </p>
      </div>

      {/* Completed Projects Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Đã hoàn thành</h3>
          <CheckCircle2 className="w-5 h-5 text-green-500" />
        </div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {completedProjects.length}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
          {projects.length > 0 
            ? Math.round((completedProjects.length / projects.length) * 100) 
            : 0}% tổng dự án
        </p>
      </div>

      {/* Task Completion Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Hoàn thành task</h3>
          <ListTodo className="w-5 h-5 text-purple-500" />
        </div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {taskCompletionRate}%
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
          {completedTasks.length}/{tasks.length} task hoàn thành
        </p>
      </div>
    </div>
  );
}
