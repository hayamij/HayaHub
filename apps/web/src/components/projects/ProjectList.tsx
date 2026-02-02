'use client';

import type { ProjectDTO, TaskDTO } from 'hayahub-business';
import { ProjectStatus } from 'hayahub-domain';
import { Edit2, Trash2, Calendar, ListTodo, Tag } from 'lucide-react';

interface ProjectListProps {
  projects: ProjectDTO[];
  tasks: TaskDTO[];
  onEdit: (project: ProjectDTO) => void;
  onDelete: (id: string) => void;
  onSelectProject: (project: ProjectDTO) => void;
}

const STATUS_LABELS: Record<ProjectStatus, string> = {
  [ProjectStatus.PLANNING]: 'Lên kế hoạch',
  [ProjectStatus.IN_PROGRESS]: 'Đang thực hiện',
  [ProjectStatus.COMPLETED]: 'Hoàn thành',
  [ProjectStatus.ARCHIVED]: 'Lưu trữ',
};

const STATUS_COLORS: Record<ProjectStatus, string> = {
  [ProjectStatus.PLANNING]: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  [ProjectStatus.IN_PROGRESS]: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  [ProjectStatus.COMPLETED]: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  [ProjectStatus.ARCHIVED]: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
};

export function ProjectList({ projects, tasks, onEdit, onDelete, onSelectProject }: ProjectListProps) {
  if (projects.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <ListTodo className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
        <p className="text-gray-500 dark:text-gray-400">Chưa có dự án nào</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
          Thêm dự án đầu tiên để bắt đầu quản lý công việc
        </p>
      </div>
    );
  }

  const getProjectTaskCount = (projectId: string) => {
    return tasks.filter((t) => t.projectId === projectId).length;
  };

  const getProjectCompletedTaskCount = (projectId: string) => {
    return tasks.filter((t) => t.projectId === projectId && t.completed).length;
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-gray-900">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Tên dự án
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Trạng thái
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Thời gian
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Tasks
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Tags
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {projects.map((project) => {
            const taskCount = getProjectTaskCount(project.id);
            const completedTaskCount = getProjectCompletedTaskCount(project.id);

            return (
              <tr
                key={project.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition cursor-pointer"
                onClick={() => onSelectProject(project)}
              >
                <td className="px-4 py-4">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">{project.name}</div>
                    {project.description && (
                      <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                        {project.description}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      STATUS_COLORS[project.status]
                    }`}
                  >
                    {STATUS_LABELS[project.status]}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">
                  {project.startDate && project.endDate ? (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {formatDate(project.startDate)} - {formatDate(project.endDate)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-gray-400 dark:text-gray-500">Chưa đặt thời gian</span>
                  )}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1 text-sm">
                    <ListTodo className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900 dark:text-white">
                      {completedTaskCount}/{taskCount}
                    </span>
                    {taskCount > 0 && (
                      <span className="text-gray-500 dark:text-gray-400">
                        ({Math.round((completedTaskCount / taskCount) * 100)}%)
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4">
                  {project.tags && project.tags.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {project.tags.slice(0, 2).map((tag, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                        >
                          <Tag className="w-3 h-3" />
                          {tag}
                        </span>
                      ))}
                      {project.tags.length > 2 && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          +{project.tags.length - 2}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400 dark:text-gray-500">-</span>
                  )}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(project);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition"
                      title="Chỉnh sửa"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(project.id);
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition"
                      title="Xóa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
