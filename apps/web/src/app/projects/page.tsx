'use client';

import { useState, useCallback } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageLoader } from '@/components/layout/PageLoader';
import { useAuth } from '@/contexts/AuthContext';
import { useProjects } from '@/hooks/useProjects';
import { useTasks } from '@/hooks/useTasks';
import { ProjectStatsCards } from '@/components/projects/ProjectStatsCards';
import { ProjectModal } from '@/components/projects/ProjectModal';
import { TaskModal } from '@/components/projects/TaskModal';
import { ProjectList } from '@/components/projects/ProjectList';
import { TaskList } from '@/components/projects/TaskList';
import { Plus, FolderOpen, ListTodo } from 'lucide-react';
import type { ProjectDTO, CreateProjectDTO, UpdateProjectDTO, TaskDTO, CreateTaskDTO, UpdateTaskDTO } from 'hayahub-business';
import { Button } from '@/components/ui/Button';

type ViewMode = 'all' | 'project';

export default function ProjectsPage() {
  const { user } = useAuth();
  const {
    projects,
    isLoading: projectsLoading,
    error: projectsError,
    createProject,
    updateProject,
    deleteProject,
  } = useProjects(user?.id);

  const {
    tasks,
    isLoading: tasksLoading,
    error: tasksError,
    createTask,
    updateTask,
    deleteTask,
  } = useTasks(user?.id);

  const [viewMode, setViewMode] = useState<ViewMode>('all');
  const [selectedProject, setSelectedProject] = useState<ProjectDTO | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectDTO | null>(null);
  const [editingTask, setEditingTask] = useState<TaskDTO | null>(null);

  const handleAddProject = useCallback(() => {
    setEditingProject(null);
    setIsProjectModalOpen(true);
  }, []);

  const handleEditProject = useCallback((project: ProjectDTO) => {
    setEditingProject(project);
    setIsProjectModalOpen(true);
  }, []);

  const handleDeleteProject = useCallback(
    async (id: string) => {
      if (!confirm('Bạn có chắc chắn muốn xóa dự án này? Tất cả task trong dự án cũng sẽ bị xóa.')) return;
      await deleteProject(id);
      if (selectedProject?.id === id) {
        setSelectedProject(null);
        setViewMode('all');
      }
    },
    [deleteProject, selectedProject]
  );

  const handleSelectProject = useCallback((project: ProjectDTO) => {
    setSelectedProject(project);
    setViewMode('project');
  }, []);

  const handleBackToAll = useCallback(() => {
    setSelectedProject(null);
    setViewMode('all');
  }, []);

  const handleSaveProject = useCallback(
    async (data: CreateProjectDTO | UpdateProjectDTO): Promise<boolean> => {
      try {
        if (editingProject) {
          await updateProject(editingProject.id, data as UpdateProjectDTO);
        } else {
          await createProject(data as CreateProjectDTO);
        }
        setIsProjectModalOpen(false);
        setEditingProject(null);
        return true;
      } catch (error) {
        console.error('Failed to save project:', error);
        return false;
      }
    },
    [editingProject, createProject, updateProject]
  );

  const handleAddTask = useCallback(() => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  }, []);

  const handleEditTask = useCallback((task: TaskDTO) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  }, []);

  const handleDeleteTask = useCallback(
    async (id: string) => {
      if (!confirm('Bạn có chắc chắn muốn xóa task này?')) return;
      await deleteTask(id);
    },
    [deleteTask]
  );

  const handleToggleTaskComplete = useCallback(
    async (id: string, completed: boolean) => {
      await updateTask(id, { completed });
    },
    [updateTask]
  );

  const handleSaveTask = useCallback(
    async (data: CreateTaskDTO | UpdateTaskDTO): Promise<boolean> => {
      try {
        if (editingTask) {
          await updateTask(editingTask.id, data as UpdateTaskDTO);
        } else {
          await createTask(data as CreateTaskDTO);
        }
        setIsTaskModalOpen(false);
        setEditingTask(null);
        return true;
      } catch (error) {
        console.error('Failed to save task:', error);
        return false;
      }
    },
    [editingTask, createTask, updateTask]
  );

  const handleCloseProjectModal = useCallback(() => {
    setIsProjectModalOpen(false);
    setEditingProject(null);
  }, []);

  const handleCloseTaskModal = useCallback(() => {
    setIsTaskModalOpen(false);
    setEditingTask(null);
  }, []);

  const isLoading = projectsLoading || tasksLoading;

  if (isLoading) {
    return (
      <PageLoader>
        <DashboardLayout>
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500 dark:text-gray-400">Đang tải dữ liệu...</p>
            </div>
          </div>
        </DashboardLayout>
      </PageLoader>
    );
  }

  if (projectsError || tasksError) {
    return (
      <PageLoader>
        <DashboardLayout>
          <div className="flex items-center justify-center h-96">
            <div className="text-center text-red-600">
              <p>Lỗi tải dữ liệu: {(projectsError || tasksError)?.message}</p>
            </div>
          </div>
        </DashboardLayout>
      </PageLoader>
    );
  }

  return (
    <PageLoader>
      <DashboardLayout>
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {viewMode === 'all' ? 'Quản lý dự án' : selectedProject?.name}
              </h1>
              {viewMode === 'project' && selectedProject && (
                <button
                  onClick={handleBackToAll}
                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 mt-1"
                >
                  ← Quay lại tất cả dự án
                </button>
              )}
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleAddTask}
                variant="secondary"
              >
                <Plus className="w-5 h-5" />
                Thêm Task
              </Button>
              {viewMode === 'all' && (
                <Button
                  onClick={handleAddProject}
                  variant="primary"
                >
                  <Plus className="w-5 h-5" />
                  Thêm Dự án
                </Button>
              )}
            </div>
          </div>

          {/* Stats */}
          <ProjectStatsCards projects={projects} tasks={tasks} />

          {/* Projects View */}
          {viewMode === 'all' && (
            <>
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center gap-2 mb-4">
                  <FolderOpen className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Dự án</h2>
                </div>
                <ProjectList
                  projects={projects}
                  tasks={tasks}
                  onEdit={handleEditProject}
                  onDelete={handleDeleteProject}
                  onSelectProject={handleSelectProject}
                />
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center gap-2 mb-4">
                  <ListTodo className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Tất cả Tasks</h2>
                </div>
                <TaskList
                  tasks={tasks}
                  projects={projects}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                  onToggleComplete={handleToggleTaskComplete}
                />
              </div>
            </>
          )}

          {/* Project Detail View */}
          {viewMode === 'project' && selectedProject && (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ListTodo className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Tasks trong dự án</h2>
                </div>
                <button
                  onClick={() => handleEditProject(selectedProject)}
                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  Chỉnh sửa dự án
                </button>
              </div>
              <TaskList
                tasks={tasks}
                projects={projects}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
                onToggleComplete={handleToggleTaskComplete}
                selectedProjectId={selectedProject.id}
              />
            </div>
          )}

          {/* Modals */}
          {user && (
            <>
              <ProjectModal
                isOpen={isProjectModalOpen}
                onClose={handleCloseProjectModal}
                onSubmit={handleSaveProject}
                editingProject={editingProject}
                userId={user.id}
              />
              <TaskModal
                isOpen={isTaskModalOpen}
                onClose={handleCloseTaskModal}
                onSubmit={handleSaveTask}
                editingTask={editingTask}
                projects={projects}
                userId={user.id}
                defaultProjectId={viewMode === 'project' ? selectedProject?.id : undefined}
              />
            </>
          )}
        </div>
      </DashboardLayout>
    </PageLoader>
  );
}
