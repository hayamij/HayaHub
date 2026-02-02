'use client';

import type { TaskDTO, ProjectDTO } from 'hayahub-business';
import { TaskPriority } from 'hayahub-domain';
import { Edit2, Trash2, Calendar, CheckCircle2, Circle, AlertCircle } from 'lucide-react';

interface TaskListProps {
  tasks: TaskDTO[];
  projects: ProjectDTO[];
  onEdit: (task: TaskDTO) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string, isCompleted: boolean) => void;
  selectedProjectId?: string;
}

const PRIORITY_LABELS: Record<TaskPriority, string> = {
  [TaskPriority.LOW]: 'Thấp',
  [TaskPriority.MEDIUM]: 'Trung bình',
  [TaskPriority.HIGH]: 'Cao',
  [TaskPriority.URGENT]: 'Khẩn cấp',
};

const PRIORITY_COLORS: Record<TaskPriority, string> = {
  [TaskPriority.LOW]: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  [TaskPriority.MEDIUM]: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  [TaskPriority.HIGH]: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
  [TaskPriority.URGENT]: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
};

export function TaskList({
  tasks,
  projects,
  onEdit,
  onDelete,
  onToggleComplete,
  selectedProjectId,
}: TaskListProps) {
  const filteredTasks = selectedProjectId
    ? tasks.filter((t) => t.projectId === selectedProjectId)
    : tasks;

  if (filteredTasks.length === 0) {
    return (
      <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <Circle className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
        <p className="text-gray-500 dark:text-gray-400">
          {selectedProjectId ? 'Dự án này chưa có task nào' : 'Chưa có task nào'}
        </p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
          Thêm task để bắt đầu công việc
        </p>
      </div>
    );
  }

  const getProjectName = (projectId: string | null) => {
    if (!projectId) return null;
    const project = projects.find((p) => p.id === projectId);
    return project?.name;
  };

  const formatDate = (date: Date | null) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const isOverdue = (dueDate: Date | null, completed: boolean) => {
    if (!dueDate || completed) return false;
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {filteredTasks.map((task) => {
          const projectName = getProjectName(task.projectId);
          const overdue = isOverdue(task.dueDate, task.completed);

          return (
            <div
              key={task.id}
              className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition ${
                task.completed ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => onToggleComplete(task.id, !task.completed)}
                  className="mt-1 flex-shrink-0"
                  title={task.completed ? 'Đánh dấu chưa hoàn thành' : 'Đánh dấu đã hoàn thành'}
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-400 hover:text-green-600 transition" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h3
                        className={`font-medium text-gray-900 dark:text-white ${
                          task.completed ? 'line-through' : ''
                        }`}
                      >
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                          {task.description}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-3 mt-2">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            PRIORITY_COLORS[task.priority]
                          }`}
                        >
                          {PRIORITY_LABELS[task.priority]}
                        </span>

                        {task.dueDate && (
                          <span
                            className={`inline-flex items-center gap-1 text-xs ${
                              overdue
                                ? 'text-red-600 dark:text-red-400 font-medium'
                                : 'text-gray-600 dark:text-gray-400'
                            }`}
                          >
                            <Calendar className="w-3.5 h-3.5" />
                            {formatDate(task.dueDate)}
                            {overdue && <AlertCircle className="w-3.5 h-3.5" />}
                          </span>
                        )}

                        {projectName && !selectedProjectId && (
                          <span className="text-xs px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">
                            {projectName}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => onEdit(task)}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition"
                        title="Chỉnh sửa"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(task.id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
