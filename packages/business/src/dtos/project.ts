import type { ProjectStatus } from 'hayahub-domain';

export interface CreateProjectDTO {
  userId: string;
  name: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface UpdateProjectDTO {
  name?: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  status?: ProjectStatus;
}

export interface ProjectDTO {
  id: string;
  userId: string;
  name: string;
  description: string;
  status: ProjectStatus;
  startDate: Date | null;
  endDate: Date | null;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}
