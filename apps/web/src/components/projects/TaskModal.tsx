'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { CreateTaskDTO, TaskDTO, UpdateTaskDTO, ProjectDTO } from 'hayahub-business';
import { TaskPriority } from 'hayahub-domain';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dto: CreateTaskDTO | UpdateTaskDTO) => Promise<boolean>;
  editingTask?: TaskDTO | null;
  projects: ProjectDTO[];
  userId: string;
  defaultProjectId?: string;
}

export function TaskModal({
  isOpen,
  onClose,
  onSubmit,
  editingTask,
  projects,
  userId,
  defaultProjectId,
}: TaskModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: TaskPriority.MEDIUM as TaskPriority,
    dueDate: '',
    projectId: defaultProjectId || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title,
        description: editingTask.description || '',
        priority: editingTask.priority,
        dueDate: editingTask.dueDate 
          ? new Date(editingTask.dueDate).toISOString().split('T')[0] 
          : '',
        projectId: editingTask.projectId || '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        priority: TaskPriority.MEDIUM,
        dueDate: '',
        projectId: defaultProjectId || '',
      });
    }
  }, [editingTask, isOpen, defaultProjectId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const dto = editingTask
        ? ({
            title: formData.title,
            description: formData.description || undefined,
            priority: formData.priority,
            dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
            projectId: formData.projectId || undefined,
          } as UpdateTaskDTO)
        : ({
            userId,
            title: formData.title,
            description: formData.description || undefined,
            priority: formData.priority,
            dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
            projectId: formData.projectId || undefined,
          } as CreateTaskDTO);

      const success = await onSubmit(dto);
      if (success) {
        onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const priorityColors = {
    [TaskPriority.LOW]: 'text-gray-600',
    [TaskPriority.MEDIUM]: 'text-blue-600',
    [TaskPriority.HIGH]: 'text-orange-600',
    [TaskPriority.URGENT]: 'text-red-600',
  };

  const priorityLabels = {
    [TaskPriority.LOW]: 'Thấp',
    [TaskPriority.MEDIUM]: 'Trung bình',
    [TaskPriority.HIGH]: 'Cao',
    [TaskPriority.URGENT]: 'Khẩn cấp',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {editingTask ? 'Chỉnh sửa task' : 'Thêm task mới'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tiêu đề <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
              placeholder="Hoàn thành thiết kế UI..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Mô tả
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              rows={3}
              placeholder="Chi tiết về task này..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Độ ưu tiên <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as TaskPriority })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
            >
              {Object.values(TaskPriority).map((priority) => (
                <option key={priority} value={priority} className={priorityColors[priority]}>
                  {priorityLabels[priority]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ngày hết hạn
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Dự án
            </label>
            <select
              value={formData.projectId}
              onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Không thuộc dự án nào</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
            >
              {editingTask ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
